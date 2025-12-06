from lib.umqtt.robust import MQTTClient
from utils.bytes_converter import bytes_converter
from credentials.mqtt import (
    MQTT_BROKER,
    MQTT_PORT,
    MQTT_USER,
    MQTT_PASSWORD,
    MQTT_CLIENT_ID,
)


# ---------- MQTT SETUP ----------
def connect_to_mqtt():
    print("Connecting to MQTT broker...")
    # Keepalive: broker closes idle connections after this if no traffic
    client = MQTTClient(
        client_id=bytes_converter(MQTT_CLIENT_ID),
        server=MQTT_BROKER,  # str is OK, lib converts
        port=MQTT_PORT,
        user=bytes_converter(MQTT_USER),
        password=bytes_converter(MQTT_PASSWORD),
        keepalive=7200,
        ssl=True,  # Enable SSL/TLS for HiveMQ Cloud
        ssl_params={"server_hostname": MQTT_BROKER},
    )
    # Optional last will message
    client.set_last_will(b"pico/status", b"offline", retain=True, qos=0)
    # Actually connect to the broker
    client.connect()
    print("MQTT connected")
    return client
