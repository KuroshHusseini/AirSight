from umqtt.simple import MQTTClient
from credentials.mqtt import (
    MQTT_BROKER,
    MQTT_PORT,
    MQTT_USER,
    MQTT_PASSWORD,
    MQTT_CLIENT_ID,
)
from config.configure_ssl import context
from utils.bytes_converter import bytes_converter


# mqtt client connect
def connect_to_mqtt():
    client = MQTTClient(
        client_id=bytes_converter(MQTT_CLIENT_ID),
        server=MQTT_BROKER,  # str is OK, lib converts
        port=MQTT_PORT,
        user=bytes_converter(MQTT_USER),
        password=bytes_converter(MQTT_PASSWORD),
        keepalive=7200,
        ssl=context,
    )

    client.connect()
    return client
