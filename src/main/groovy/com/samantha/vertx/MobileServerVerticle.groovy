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
        socket?.write(OBJECT_MAPPER.writeValueAsString([address: "android.apps.get"]))
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
                String[] jsonMessages = body.getString(0, body.length).split(EOC)

                jsonMessages.eachWithIndex { messageJson, i ->
                    try {
                        def message = OBJECT_MAPPER.readValue(messageJson, Map.class)
                        vertx.eventBus.send(message.address, OBJECT_MAPPER.writeValueAsString(message.body.object))
                        body = new Buffer(0)
                    } catch (Exception e) {

                        if (i > 0 && i == jsonMessages.length - 1) {
                            body << messageJson.bytes
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