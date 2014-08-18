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
    public static final int PORT_DEFAULT = 1883

    private static final int KEEP_ALIVE_INTERVAL = 5
    private static final String CHARSET = "UTF-8"
    private static final SUBSCRIBE_PREFIX = "samantha.vertx";

    private static final ObjectMapper OBJECT_MAPPER = new ObjectMapper();
    static {
        OBJECT_MAPPER.configure(JsonParser.Feature.ALLOW_BACKSLASH_ESCAPING_ANY_CHARACTER, false)
        OBJECT_MAPPER.configure(JsonParser.Feature.ALLOW_UNQUOTED_FIELD_NAMES, true)
    }

    MqttClient client
    MqttConnectOptions options
    def logger
    boolean started;

    def start() {
        logger = container.logger

        started = true
        configure(container.config)

        vertx.eventBus
                .registerHandler("vertx.apps.get", this.&handleListAppRequest)
                .registerHandler("vertx.monitoring.start", this.&startMonitoring)
                .registerHandler("vertx.monitoring.stop", this.&stopMonitoring)
//                .registerHandler("vertx.devices.get", this.&getDevices)
        logger.info('Start -> Done initialize MQTT handler')
    }

    def handleListAppRequest(Message message) {
        logger.debug "listing applications"
        def payload = OBJECT_MAPPER.writeValueAsBytes([body: null])
        def topic = "${message.body().deviceId}/android.apps.get"
        client.publish(topic, payload, QOS_DELIVERY_ONLY_ONCE_WITH_CONFIRMATION, false)
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
        def hostname = config.hostname
        def port = config.port ? config.port : DEFAULT_PORT
        def persistence = new MemoryPersistence()
        def clientId = UUID.randomUUID().toString()

        client = new MqttClient("tcp://$hostname:$port", clientId, persistence)

        logger.info "Trying to connect to MQTT broker"
        client.setCallback(this)

        options = new MqttConnectOptions()
        options.setKeepAliveInterval(KEEP_ALIVE_INTERVAL)

        try {
            client.connect(options)
            logger.info "MQTT connected to $client.serverURI with clientId: $clientId options: $options"
            client.subscribe("$SUBSCRIBE_PREFIX/#", QOS_DELIVERY_ONLY_ONCE_WITH_CONFIRMATION)
        } catch (MqttException e) {
            logger.error "Cannot connect to $client.serverURI with clientId: $clientId, options:$options", e
        }


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
        while (started && !client.isConnected()) {
            try {
                client?.connect(options)
                sleep 1000
            } catch (Exception e) {
                logger.error "${i} - cannot reconnect", e
            }
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
        vertx.eventBus.publish(address, message)
    }

    @Override
    void deliveryComplete(IMqttDeliveryToken iMqttDeliveryToken) {

    }
}
