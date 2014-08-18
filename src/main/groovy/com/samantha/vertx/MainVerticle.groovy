package com.samantha.vertx

import org.vertx.groovy.platform.Verticle

class MainVerticle extends Verticle {

    def start() {
        container.with {
            deployVerticle("groovy:${MQTTMobileVerticle.class.name}", config.mqttConfig)
            deployVerticle("groovy:${WebServerVerticle.class.name}", config.webServerConfig)

        }
    }
}
