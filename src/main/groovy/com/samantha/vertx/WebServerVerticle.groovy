package com.samantha.vertx

import org.vertx.groovy.core.eventbus.Message
import org.vertx.groovy.core.http.HttpServer
import org.vertx.groovy.core.http.HttpServerRequest
import org.vertx.groovy.core.http.RouteMatcher
import org.vertx.groovy.platform.Verticle
import org.vertx.java.core.impl.VertxInternal
import org.vertx.java.core.json.impl.Json
import org.vertx.java.core.file.impl.PathAdjuster


class WebServerVerticle extends Verticle {

    static final int DEFAULT_PORT = 8080;
    static final String DEFAULT_ADDRESS = "localhost";
    static final String DEFAULT_WEB_ROOT = "public";
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
            } else {
                println "Closing Web Server failed -> ${asyncResult.cause}"
            }
        }
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
        def webRoot = config.get("webRoot", DEFAULT_WEB_ROOT)
        if (!webRoot.startsWith("/")) {
            webRoot = findOnDisk(webRoot)
        }

        matcher.get("/") { HttpServerRequest req ->
            req.response.sendFile("${webRoot}/${config.get("index_page", DEFAULT_INDEX_PAGE)}")
        }

        matcher.getWithRegEx("^\\/(images|partials|scripts|styles|fonts)\\/.*") { HttpServerRequest req ->
            req.response.sendFile("${webRoot}/${req.path.substring(1)}")
        }

        matcher.noMatch { req ->
            req.response.sendFile("${webRoot}/${config.get("error_page", DEFAULT_ERROR_PAGE)}")
        }

        matcher.get("/config") { HttpServerRequest req ->
            vertx.eventBus.send("mqtt.ip", null) { Message message ->
                req.response.end(Json.encode(["ip": message.body()]))
            }
        }

        matcher.get("/devices") { HttpServerRequest req ->
            vertx.eventBus.send("vertx.devices.get", null) { Message message ->
                req.response.end(Json.encode(message.body()))
            }
        }

        matcher.get("/devices/:deviceId") { HttpServerRequest req ->
            vertx.eventBus.send("vertx.device.get", req.params.get("deviceId")) { Message message ->
                req.response.end(Json.encode(["device": message.body()]))
            }
        }

        matcher.get("/devices/:deviceId/apps") { HttpServerRequest req ->
            def deviceId = req.params.get("deviceId")
            vertx.eventBus.send("android.app.cache.list", [deviceId: deviceId]) { Message message ->
                def response = message.body().applications
                if (!response.isEmpty()) {
                    req.response.end(Json.encode(response))
                } else {
                    req.response.with {
                        statusCode = 404
                        statusMessage = "No apps found in cache for this device"
                        end()
                    }
                    vertx.eventBus.publish("vertx.apps.get", [
                            deviceId    : deviceId,
                            forceRefresh: false
                    ]);

                }
            }
        }

        matcher.get("/devices/:deviceId/apps/:packageName") { HttpServerRequest req ->
            vertx.eventBus.send("android.app.cache.get", [deviceId: req.params.get("deviceId"), packageName: req.params.get("packageName")]) { Message message ->
                req.response.end(Json.encode(["application": message.body()]))
            }
        }
    }


    private def findOnDisk(String resourceRelativePath) {
        VertxInternal core = vertx.toJavaVertx() as VertxInternal
        String pathToDisk = PathAdjuster.adjust(core, resourceRelativePath)
        pathToDisk
    }

}
