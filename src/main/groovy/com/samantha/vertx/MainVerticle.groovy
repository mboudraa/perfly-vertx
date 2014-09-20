package com.samantha.vertx

import org.vertx.groovy.platform.Verticle

class MainVerticle extends Verticle {

    def start() {

        container.with {
            deployVerticle("groovy:${MQTTMobileVerticle.class.name}", config && config.mqtt ? config.mqtt : [:])
            deployVerticle("groovy:${WebServerVerticle.class.name}", config && config.web ? config.web : [:])

        }
    }
}
