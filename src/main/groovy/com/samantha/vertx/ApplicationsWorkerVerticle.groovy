/*
 * Copyright (c) 2014 Mounir Boudraa
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

package com.samantha.vertx

import org.vertx.groovy.core.eventbus.Message
import org.vertx.groovy.platform.Verticle

import java.util.concurrent.ConcurrentHashMap

class ApplicationsWorkerVerticle extends Verticle {

    def logger
    ConcurrentHashMap applications = new ConcurrentHashMap()
    ConcurrentHashMap timers = new ConcurrentHashMap()

    def start() {
        logger = container.logger
        vertx.eventBus
                .registerHandler("android.app.cache.add", this.&onAddApplicationToCache)
                .registerHandler("android.app.cache.clear", this.&onClearCache)
                .registerHandler("android.app.cache.get", this.&onGetApplicationFromCache)
                .registerHandler("android.app.cache.list", this.&onListApplicationFromCache)
                .registerHandler("device.disconnect", this.&onDeviceDisconnected)
                .registerHandler("device.connect", this.&onDeviceConnected)
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
        def deviceId = message.body().id

        long timerId = vertx.setTimer(5 * 60 * 1000) { timerId ->
            def device = message.body()
            clearCacheForDevice(deviceId)
            timers.remove(deviceId)
        }
        timers.put(deviceId, timerId)
    }

    def onDeviceConnected(Message message) {
        def deviceId = message.body().id
        def timerId = timers.get(deviceId)
        if (timerId) {
            vertx.cancelTimer(timerId)
            timers.remove(deviceId)
        }
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
