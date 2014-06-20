package com.samantha.vertx

import groovy.json.JsonOutput
import groovy.json.JsonSlurper
import org.vertx.groovy.core.buffer.Buffer
import org.vertx.groovy.core.eventbus.Message
import org.vertx.groovy.core.net.NetSocket
import org.vertx.groovy.platform.Verticle

class MobileServerVerticle extends Verticle {

    def server
    NetSocket socket
    JsonSlurper jsonSlurper = new JsonSlurper()

    @Override
    def start() {

        println "Starting Mobile Server..."
        server = createWebSocketServer(container.config) { asyncResult, host, port ->
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
        server?.close { asyncResult ->
            if (asyncResult.succeeded) {
                println "Mobile Server closed"
            } else {
                println "Closing Mobile Server failed -> ${asyncResult.cause}"
            }
        }
    }


    def createWebSocketServer(config, closure) {

        vertx.createNetServer().connectHandler { NetSocket socket ->
            this.socket = socket


            Buffer body = new Buffer(0)
            socket.dataHandler { Buffer buffer ->
                body << buffer
//                socket.pause()
                try {
                    String message = body.getString(0, body.length)
                    jsonSlurper.parseText(message)
                    println message
                    body = new Buffer(0)
                } catch (Exception e) {

                } finally {
//                    socket.resume()
                }
            }

        }
        .listen(config.port, config.host) { asyncResult ->
            closure.call(asyncResult, config.host, config.port)
        }
    }


}