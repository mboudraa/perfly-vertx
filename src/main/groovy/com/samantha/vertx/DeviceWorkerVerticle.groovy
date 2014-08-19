package com.samantha.vertx

import org.vertx.groovy.core.eventbus.Message
import org.vertx.groovy.platform.Verticle

import java.util.concurrent.ConcurrentHashMap

class DeviceWorkerVerticle extends Verticle {

    def logger
    ConcurrentHashMap devices = new ConcurrentHashMap()

    def start() {
        logger = container.logger

        vertx.eventBus
                .registerHandler("device.connect", this.&onDeviceConnected)
                .registerHandler("device.disconnect", this.&onDeviceDisconnected)
                .registerHandler("vertx.devices.get", this.&getDevices)
    }


    def onDeviceConnected(Message message) {
        def device = message.body()

        println "new device connected -> $device"
        logger.debug "new device connected -> $device"

        devices.put(device.id, device)

    }

    def onDeviceDisconnected(Message message) {
        def device = message.body()

        println "device disconnected -> $device"
        logger.debug "device disconnected -> $device"
        devices.remove(device.id)
    }

    def getDevices(Message message) {
        def devices = devices.values()

        logger.debug "list devices -> $devices"
        message.reply(new ArrayList(devices))
    }
}
