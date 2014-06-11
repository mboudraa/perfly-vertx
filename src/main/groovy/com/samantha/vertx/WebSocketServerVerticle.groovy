package com.samantha.vertx

import org.vertx.groovy.platform.Verticle

class WebSocketServerVerticle extends Verticle {

    def server;

    def start() {
        println "Starting Server..."
        server = createWebSocketServer(container.config.host, container.config.port)
    }

    def createWebSocketServer(host, port) {
        def httpServer = vertx.createHttpServer()

        httpServer.websocketHandler { ws ->
            ws.dataHandler { buffer ->
                def message = buffer.getString(0, buffer.length)
                println message
            }
        }.listen(port, host)
    }

    def stop() {
        if (server) {
            println "Closing Server..."
            server.close { asyncResult ->
                println "Server closed"
            }
        }
    }


}