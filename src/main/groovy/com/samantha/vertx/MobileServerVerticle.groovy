package com.samantha.vertx

import com.fasterxml.jackson.databind.ObjectMapper
import org.vertx.groovy.core.buffer.Buffer
import org.vertx.groovy.core.eventbus.Message
import org.vertx.groovy.core.net.NetSocket
import org.vertx.groovy.platform.Verticle

import static com.fasterxml.jackson.core.JsonParser.Feature

class MobileServerVerticle extends Verticle {

    private static final String EOC = "\\|\\|EOC\\|\\|"
    private static final ObjectMapper OBJECT_MAPPER = new ObjectMapper();
    static {
        OBJECT_MAPPER.configure(Feature.ALLOW_BACKSLASH_ESCAPING_ANY_CHARACTER, false)
        OBJECT_MAPPER.configure(Feature.ALLOW_UNQUOTED_FIELD_NAMES, true)
    }

    def connectionMap = [:]
    def deviceMap = [:]
    def sockets = []

    def server


    @Override
    def start() {

        println "Starting Mobile Server..."
        server = createSocketServer(container.config) { asyncResult, host, port ->
            if (asyncResult.succeeded) {
                println "Mobile Server started. Listening on ${host}:${port}"
            } else {
                println "Starting Mobile Server failed -> ${asyncResult.cause}"
            }
        }

        vertx.eventBus
                .registerHandler("vertx.apps.get", this.&handleListAppRequest)
                .registerHandler("vertx.app.start", this.&startApplication)
                .registerHandler("vertx.devices.get", this.&getDevices)
    }

    def handleListAppRequest(Message message) {
        println "listing applications"
        def socket = deviceMap.get(message.body().deviceId)
        socket?.write(OBJECT_MAPPER.writeValueAsString([address: "android.apps.get"]))
    }

    def startApplication(Message message) {
        println "starting  application $message.body()"
        def socket = deviceMap.get(message.body().deviceId)
        socket?.write(OBJECT_MAPPER.writeValueAsString([address: "android.monitoring.start", body: message.body()]))
    }

    def getDevices(Message message) {
        println "list devices"
        message.reply(new ArrayList(connectionMap.values()))
    }

    @Override
    def stop() {
        println "Closing Mobile Server..."
        sockets.each { socket ->
            socket?.close()
        }
        server?.close { asyncResult ->
            if (asyncResult.succeeded) {
                println "Mobile Server closed"
            } else {
                println "Closing Mobile Server failed -> ${asyncResult.cause}"
            }
        }
    }


    def createSocketServer(config, closure) {

        vertx.createNetServer().connectHandler { NetSocket socket ->
            sockets.add(socket)
            Buffer body = new Buffer(0)

            socket.dataHandler { Buffer buffer ->

                body << buffer
                String[] jsonMessages = body.getString(0, body.length).split(EOC)

                jsonMessages.eachWithIndex { messageJson, i ->
                    try {
                        def message = OBJECT_MAPPER.readValue(messageJson, Map.class)
                        if (message.address == "device.connect") {
                            connectionMap.put(socket, message.body)
                            deviceMap.put(message.body.imei, socket)
                            message.body.connected = true
                        }
                        vertx.eventBus.publish(message.address, message.body)
                        body = new Buffer(0)
                    } catch (Exception e) {

                        if (i > 0 && i == jsonMessages.length - 1) {
                            body << messageJson.bytes
                        }
                    }
                }
            }

            socket.endHandler {
                def device = connectionMap.get(socket)
                device.connected = false

                vertx.eventBus.publish("device.disconnect", device)
                sockets.remove(socket)
                connectionMap.remove(socket)
                deviceMap.remove(device.imei)

                println "client disconnected"
            }

        }
        .listen(config.port, config.host) { asyncResult ->
            closure.call(asyncResult, config.host, config.port)
        }



        vertx.createNetServer().connectHandler { sock ->

            sock.dataHandler { buffer ->
                sock << buffer
            }
        }.listen(config.port + 1, config.host)
    }


}