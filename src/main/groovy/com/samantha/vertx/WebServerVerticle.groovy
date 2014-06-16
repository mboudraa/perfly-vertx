package com.samantha.vertx

import org.vertx.groovy.core.buffer.Buffer
import org.vertx.groovy.core.eventbus.Message
import org.vertx.groovy.core.http.HttpServer
import org.vertx.groovy.core.http.HttpServerRequest
import org.vertx.groovy.core.http.RouteMatcher
import org.vertx.groovy.platform.Verticle

class WebServerVerticle extends Verticle {

    static final int DEFAULT_PORT = 80;
    static final String DEFAULT_ADDRESS = "0.0.0.0";
    static final String DEFAULT_WEB_ROOT = "web";
    static final String DEFAULT_INDEX_PAGE = "index.html"
    static final String DEFAULT_ERROR_PAGE = "404.html"
    static final String DEFAULT_AUTH_ADDRESS = "vertx.basicauthmanager.authorise"
    static final long DEFAULT_AUTH_TIMEOUT = 5 * 60 * 1000

    private HttpServer server

    @Override
    def start() {

        println "Starting Web Server..."
        server = createHttpServer(container.config) { asyncResult, host, port ->
            if (asyncResult.succeeded) {
                println "Web Server started. Listening on ${host}:${port}"
                vertx.eventBus.registerHandler("android", this.&handleMessage)
            } else {
                println "Starting Web Server failed -> ${asyncResult.cause}"
            }
        }
    }

    @Override
    def stop() {
        println "Closing Web Server..."
        server?.close { asyncResult ->
            if (asyncResult.succeeded) {
                println "Web Server closed"
                vertx.eventBus.unregisterHandler("android", this.&handleMessage)
            } else {
                println "Closing Web Server failed -> ${asyncResult.cause}"
            }
        }
    }

    def handleMessage(Message message) {
        vertx.eventBus.send("android.monitoring", message.body())
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
        def webRoot = config.get("web_root", DEFAULT_WEB_ROOT)

        matcher.get("/") { HttpServerRequest req ->
            req.response.sendFile("${webRoot}/${config.get("index_page", DEFAULT_INDEX_PAGE)}")
        }

        matcher.getWithRegEx("^\\/(bower_components|libs|images|partials|scripts|styles)\\/.*") { req ->
            req.response.sendFile("${webRoot}/${req.path.substring(1)}")
        }

        matcher.post("/api/app") { HttpServerRequest req ->
            req.response.setStatusCode(200).end()
            req.bodyHandler { Buffer buffer ->
                vertx.eventBus.send("android.application", buffer.getString(0, buffer.length))
            }
        }

        matcher.noMatch { req ->
            req.response.sendFile("${webRoot}/${config.get("error_page", DEFAULT_ERROR_PAGE)}")
        }
    }

}
