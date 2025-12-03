MQTT_CLIENT_ID = "pico01"  # any ID you like
MQTT_BROKER = "0742c7739ea44ba1971212a9a55f96e8.s1.eu.hivemq.cloud"  # e.g. "xxxxx.s1.eu.hivemq.cloud"
MQTT_PORT = 8883  # 8883 for HiveMQ Cloud with TLS
MQTT_USER = "Kuroshhu"  # MQTT Username
MQTT_PASSWORD = "Kuroshhu021#"  # MQTT PASSWORD

MQTT_TOPIC_TEMP = b"pico/temp"  # matches your Node-RED topic
MQTT_TOPIC_PRESS = b"pico/pressure"  # optional, Topic name for pressure
MQTT_CONTROL = b"picow/control"  # Topic name for LED ON/OFF from Node-RED
