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

class DeviceWorkerVerticle extends Verticle {

    def logger
    ConcurrentHashMap devices = new ConcurrentHashMap()

    def start() {
        logger = container.logger

        vertx.eventBus
                .registerHandler("device.connect", this.&onDeviceConnected)
                .registerHandler("device.disconnect", this.&onDeviceDisconnected)
                .registerHandler("vertx.devices.get", this.&getDevices)
                .registerHandler("vertx.device.get", this.&getDevice)
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

    def getDevice(Message message) {
        def deviceId = message.body()
        message.reply(devices.get(deviceId))
    }
}
