package com.samantha.vertx

import org.vertx.groovy.core.AsyncResult
import org.vertx.groovy.core.net.NetServer
import org.vertx.groovy.platform.Verticle

class TcpServerVerticle extends Verticle {

    NetServer server;

    def start() {
        server = createTcpServer(container.config.host, container.config.port)
    }

    def createTcpServer(host, port) {
        println "Starting Server..."
        vertx.createNetServer().connectHandler { sock ->
            sock.dataHandler { buffer ->
                def message = buffer.getString(0, buffer.length)
                println message
            }
        }.listen(port, host) {AsyncResult asyncResult ->
            println "Server started. Listening on: ${host}:${port}"
        }
    }

    def stop() {
        println "Closing Server..."
        server.close { AsyncResult asyncResult ->
            println "Server closed"
        }
    }


}