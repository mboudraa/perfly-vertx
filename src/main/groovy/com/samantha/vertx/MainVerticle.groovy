package com.samantha.vertx

import org.vertx.groovy.platform.Verticle

class MainVerticle extends Verticle {

    def start() {
        container.with {
            deployVerticle("groovy:${WebServerVerticle.class.name}", config.webServerConfig)
            deployVerticle("groovy:${MobileServerVerticle.class.name}", config.mobileServerConfig)
        }
    }
}
