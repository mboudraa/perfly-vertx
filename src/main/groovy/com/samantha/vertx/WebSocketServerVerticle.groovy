package com.samantha.vertx

import org.vertx.groovy.platform.Verticle

class WebSocketServerVerticle extends Verticle {

    def server;

    def start() {
        println "Starting Server..."
        server = createWebSocketServer(container.config.host, container.config.port) { asyncResult ->
            "Server started. Listening on: ${host}:${port}"
        }
    }

    def createWebSocketServer(host, port, closure) {
        def httpServer = vertx.createHttpServer()

        httpServer.websocketHandler { ws ->
            println "a websocked has connected"
            ws.dataHandler { buffer ->
                def message = buffer.getString(0, buffer.length)
                println message
            }
        }.listen(port, host, closure)
    }

    def stop() {
        println "Closing Server..."
        server.close { asyncResult ->
            println "Server closed"
        }
    }


}