import time
from config.connect_to_wifi import connect_to_wifi
from config.connect_to_bmp import connect_to_bmp
from config.connect_to_mqtt import connect_to_mqtt
from utils.publisher import publisher
from constants import MQTT_TOPIC_TEMP, MQTT_TOPIC_PRESS

# connect to wifi
connect_to_wifi()

# connect to BMP280 sensor
bmp = connect_to_bmp()

# connect to MQTT broker
client = connect_to_mqtt()


while True:
    # publish as MQTT payload
    publisher(client, MQTT_TOPIC_TEMP, str(bmp.temperature))
    publisher(client, MQTT_TOPIC_PRESS, str(bmp.pressure))

    # every 10s
    time.sleep(10)
