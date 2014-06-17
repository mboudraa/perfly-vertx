package com.samantha.vertx

import org.vertx.groovy.core.http.WebSocket
import org.vertx.groovy.platform.Verticle

class MobileServerVerticle extends Verticle {

    def server;

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
        def httpServer = vertx.createHttpServer()
        httpServer.websocketHandler {WebSocket ws ->
            ws.dataHandler { buffer ->
                vertx.eventBus.send("android", buffer.getString(0, buffer.length))
            }
        }.listen(config.port, config.host) { asyncResult ->
            closure.call(asyncResult, config.host, config.port)
        }
    }

}