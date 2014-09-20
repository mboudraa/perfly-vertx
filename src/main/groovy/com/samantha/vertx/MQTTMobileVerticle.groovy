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

import com.fasterxml.jackson.core.JsonParser
import com.fasterxml.jackson.databind.ObjectMapper
import org.eclipse.paho.client.mqttv3.*
import org.eclipse.paho.client.mqttv3.persist.MemoryPersistence
import org.vertx.groovy.core.eventbus.Message
import org.vertx.groovy.platform.Verticle

class MQTTMobileVerticle extends Verticle implements MqttCallback {

    public static final int QOS_DELIVERY_ONCE_NO_CONFIRMATION = 0
    public static final int QOS_DELIVERY_AT_LEAST_ONCE_WITH_CONFIRMATION = 1
    public static final int QOS_DELIVERY_ONLY_ONCE_WITH_CONFIRMATION = 2
    public static final int DEFAULT_PORT = 1883
    static final String DEFAULT_HOST = "localhost";

    private static final int KEEP_ALIVE_INTERVAL = 5
    private static final String CHARSET = "UTF-8"
    private static final SUBSCRIBE_PREFIX = "samantha.vertx";

    private static final ObjectMapper OBJECT_MAPPER = new ObjectMapper();
    static {
        OBJECT_MAPPER.configure(JsonParser.Feature.ALLOW_BACKSLASH_ESCAPING_ANY_CHARACTER, false)
        OBJECT_MAPPER.configure(JsonParser.Feature.ALLOW_UNQUOTED_FIELD_NAMES, true)
    }

    private def clientId = UUID.randomUUID().toString().replace("-", "")

    MqttClient client
    MqttConnectOptions options
    def logger

    def start() {
        logger = container.logger

        container.deployWorkerVerticle("groovy:${DeviceWorkerVerticle.class.name}")
        container.deployWorkerVerticle("groovy:${ApplicationsWorkerVerticle.class.name}")

        configure container.config


        vertx.eventBus
                .registerHandler("vertx.apps.get", this.&handleListAppRequest)
                .registerHandler("vertx.monitoring.start", this.&startMonitoring)
                .registerHandler("vertx.monitoring.stop", this.&stopMonitoring)
                .registerHandler("mqtt.ip", this.&getMessageBrokerIp)

        logger.info('Start -> Done initialize MQTT handler')
    }

    def handleListAppRequest(Message message) {
        logger.debug "listing applications"
        def payload = OBJECT_MAPPER.writeValueAsBytes([body: null])
        def topic = "${message.body().deviceId}/android.apps.get"
        client.publish(topic, payload, QOS_DELIVERY_ONLY_ONCE_WITH_CONFIRMATION, false)
    }

    def getMessageBrokerIp(Message message) {
        def hostname = container.config.hostname
        def InetAddress inetAddress
        if (!hostname || hostname == "localhost" || hostname == "127.0.0.1") {
            inetAddress = Inet4Address.localHost
        } else {
            inetAddress = Inet4Address.getByName(hostname)
        }

        message.reply inetAddress.hostAddress
    }

    def startMonitoring(Message message) {
        logger.info "starting monitoring $message.body()"
        def payload = OBJECT_MAPPER.writeValueAsBytes(message.body())
        def topic = "${message.body().deviceId}/android.monitoring.start"
        client.publish(topic, payload, QOS_DELIVERY_ONLY_ONCE_WITH_CONFIRMATION, false)
    }

    def stopMonitoring(Message message) {
        logger.info "stopping monitoring $message.body()"
        def payload = OBJECT_MAPPER.writeValueAsBytes([body: null])
        def topic = "${message.body().deviceId}/android.monitoring.stop"
        client.publish(topic, payload, QOS_DELIVERY_ONLY_ONCE_WITH_CONFIRMATION, false)
    }

    def configure(config) {
        def hostname = config.host ? config.host: DEFAULT_HOST
        def port = config.port ? config.port : DEFAULT_PORT
        def persistence = new MemoryPersistence()


        client = new MqttClient("tcp://$hostname:$port", clientId, persistence)

        logger.info "Trying to connect to MQTT broker"
        client.setCallback(this)

        options = new MqttConnectOptions()
        options.setKeepAliveInterval(KEEP_ALIVE_INTERVAL)

        connectClient()


    }

    @Override
    void connectionLost(Throwable throwable) {
        if (throwable instanceof MqttException) {
            MqttException mqttException = (MqttException) throwable;
            switch (mqttException.reasonCode) {
                case MqttException.REASON_CODE_CONNECTION_LOST:
                case MqttException.REASON_CODE_CLIENT_DISCONNECTING:
                case MqttException.REASON_CODE_CONNECT_IN_PROGRESS:
                    logger.warn "MQTT connectionLost! $throwable"
                    break;
                default:
                    logger.warn "MQTT connectionLost! $throwable", throwable

            }
        } else {
            logger.warn "MQTT connectionLost! $throwable", throwable
        }

        def i = 0
        while (!client.isConnected()) {
            connectClient()
            i++
        }
    }

    @Override
    void messageArrived(String topic, MqttMessage mqttMessage) throws Exception {

        def message = OBJECT_MAPPER.readValue(mqttMessage.getPayload(), Map)
        def address = topic.substring(SUBSCRIBE_PREFIX.length() + 1)
        if (address.contains("device.connect")) {
            address = "device.connect"
        }

        if (address.contains("device.disconnect")) {
            address = "device.disconnect"
        }
        vertx.eventBus.publish(address, message)

        if (address.contains("android.apps.start")) {
            vertx.eventBus.publish("android.app.cache.clear", message)
        }

        if (address.contains("android.apps.progress")) {
            vertx.eventBus.publish("android.app.cache.add", message)
        }
    }

    @Override
    void deliveryComplete(IMqttDeliveryToken iMqttDeliveryToken) {

    }

    private void connectClient() {
        try {
            client.connect(options)
            logger.info "MQTT connected to $client.serverURI with clientId: $clientId options: $options"
            client.subscribe("$SUBSCRIBE_PREFIX/#", QOS_DELIVERY_ONLY_ONCE_WITH_CONFIRMATION)
        } catch (MqttException e) {
            logger.error "Cannot connect to $client.serverURI with clientId: $clientId, options:$options", e
        }
    }
}
