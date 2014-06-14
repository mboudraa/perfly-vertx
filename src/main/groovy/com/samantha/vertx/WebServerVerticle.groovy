package com.samantha.vertx

import org.vertx.groovy.core.http.HttpServer
import org.vertx.groovy.core.http.HttpServerRequest
import org.vertx.groovy.core.http.RouteMatcher
import org.vertx.groovy.platform.Verticle
import org.vertx.java.core.Future

class WebServerVerticle extends Verticle {

    static final int DEFAULT_PORT = 80;
    static final String DEFAULT_ADDRESS = "0.0.0.0";
    static final String DEFAULT_WEB_ROOT = "web";
    static final String DEFAULT_INDEX_PAGE = "index.html"
    static final String DEFAULT_AUTH_ADDRESS = "vertx.basicauthmanager.authorise"
    static final long DEFAULT_AUTH_TIMEOUT = 5 * 60 * 1000


    private HttpServer server

    @Override
    def start(Future<Void> startedResult) {

        println "Starting Web Server..."
        server = createHttpServer(container.config) { asyncResult, host, port ->
            if (asyncResult.succeeded) {
                println "Web Server started. Listening on ${host}:${port}"
                startedResult.setResult(null)
            } else {
                println "Starting Web Server failed -> ${asyncResult.cause()}"
                startedResult.setFailure(asyncResult.cause())
            }
        }
    }

    @Override
    def stop() {
        println "Closing Web Server..."
        server?.close { asyncResult ->
            if (asyncResult.succeeded) {
                println "Web Server closed"
            } else {
                println "Closing Web Server failed -> ${asyncResult.cause()}"
            }
        }
    }

    def createHttpServer(config) {
        createHttpServer(config, null)
    }

    def createHttpServer(config, Closure closure) {

        HttpServer server = vertx.createHttpServer()

        if (config.ssl) {
            server.setSSL(true)
                    .setKeyStorePassword(config.get("key_store_password", "password"))
                    .setKeyStorePath(config.get("key_store_path", "server-keystore.jks"))
        }

        server.requestHandler(routeMatcher(config).asClosure())

        vertx.createSockJSServer(server).bridge(
                config.get("sjs_config", [prefix: "/eventbus"]),
                config.get("inbound_permitted", [[:]]),
                config.get("outbound_permitted", [[:]]),
                config.get("auth_timeout", DEFAULT_AUTH_TIMEOUT),
                config.get("auth_address", DEFAULT_AUTH_ADDRESS))

        def port = config.get("port", DEFAULT_PORT)
        def host = config.get("host", DEFAULT_ADDRESS)
        server.listen(port, host) { asyncResult ->
            closure?.call(asyncResult, host, port)
        }
    }

    private def routeMatcher(config) {
        RouteMatcher matcher = new RouteMatcher()

        matcher.get("/") { HttpServerRequest req ->
            req.response.sendFile("${config.get("web_root", DEFAULT_WEB_ROOT)}/${config.get("index_page", DEFAULT_INDEX_PAGE)}")
        }

    }

}
