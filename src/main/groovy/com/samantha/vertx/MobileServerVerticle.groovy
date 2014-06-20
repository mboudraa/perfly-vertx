package com.samantha.vertx

import com.fasterxml.jackson.databind.ObjectMapper
import org.vertx.groovy.core.buffer.Buffer
import org.vertx.groovy.core.eventbus.Message
import org.vertx.groovy.core.net.NetSocket
import org.vertx.groovy.platform.Verticle

class MobileServerVerticle extends Verticle {

    private static final String EOC = "\\|\\|EOC\\|\\|"
    private static final ObjectMapper OBJECT_MAPPER = new ObjectMapper();

    def server
    NetSocket socket


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

        vertx.eventBus.registerHandler("android.apps.get", this.&getApps)
    }

    def getApps(Message busMessage) {
        socket?.write(JsonOutput.toJson([address: "android.apps.get"]))
    }

    @Override
    def stop() {
        println "Closing Mobile Server..."
        socket?.close()
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

            this.socket = socket
            Buffer body = new Buffer(0)

            socket.dataHandler { Buffer buffer ->

                body << buffer
                String[] messages = body.getString(0, body.length).split(EOC)

                messages.eachWithIndex { message, i ->
                    try {
                        def object = OBJECT_MAPPER.readValue(message, Map.class)
                        vertx.eventBus.send(object.address, OBJECT_MAPPER.writeValueAsString(object.body.object))
                        body = new Buffer(0)
                    } catch (Exception e) {

                        if (i > 0 && i == messages.length - 1) {
                            body << message.bytes
                        }
                    }
                }
            }

        }
        .listen(config.port, config.host) { asyncResult ->
            closure.call(asyncResult, config.host, config.port)
        }
    }


}