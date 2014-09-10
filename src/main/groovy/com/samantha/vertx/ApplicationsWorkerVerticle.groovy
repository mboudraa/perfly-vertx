package com.samantha.vertx

import org.vertx.groovy.core.eventbus.Message
import org.vertx.groovy.platform.Verticle

import java.util.concurrent.ConcurrentHashMap

class ApplicationsWorkerVerticle extends Verticle {

    def logger
    ConcurrentHashMap applications = new ConcurrentHashMap()

    def start() {
        logger = container.logger
        vertx.eventBus
                .registerHandler("android.app.cache.add", this.&onAddApplicationToCache)
                .registerHandler("android.app.cache.clear", this.&onClearCache)
                .registerHandler("android.app.cache.get", this.&onGetApplicationFromCache)
                .registerHandler("device.disconnect", this.&onDeviceDisconnected)
                .registerHandler("android.app.cache.list", this.&onListApplicationFromCache)
    }


    def onAddApplicationToCache(Message message) {
        def deviceId = message.body().deviceId
        def application = message.body().data.application

        addApplicationToCache(deviceId, application)
    }

    def onClearCache(Message message) {
        def deviceId = message.body().deviceId
        clearCacheForDevice(deviceId)
    }

    def onGetApplicationFromCache(Message message) {
        def deviceId = message.body().deviceId
        def packageName = message.body().packageName

        def application = getApplicationFromCache(deviceId, packageName)
        message.reply(application)
    }

    def onListApplicationFromCache(Message message) {
        def deviceId = message.body().deviceId
        def applicationsForDevice = applications.get(deviceId)
        if (applicationsForDevice == null) {
            applicationsForDevice = [:]
        }
        message.reply([applications: new ArrayList(applicationsForDevice.values())])
    }

    def onDeviceDisconnected(Message message) {
        def device = message.body()
        clearCacheForDevice(device.id)
    }


    private def clearCacheForDevice(deviceId) {
        def applicationsForDevice = applications.get(deviceId)
        if (applicationsForDevice != null) {
            applicationsForDevice.clear()
        }
    }

    private def addApplicationToCache(deviceId, application) {
        def applicationsForDevice = applications.get(deviceId)
        if (applicationsForDevice == null) {
            applicationsForDevice = [:]
            applications.put(deviceId, applicationsForDevice)
        }
        applicationsForDevice.put(application.packageName, application)
    }

    private def getApplicationFromCache(deviceId, packageName) {

        def applicationsForDevice = applications.get(deviceId)
        def result = null
        if (applicationsForDevice) {
            result = applicationsForDevice.get(packageName)
        }

        result
    }
}
