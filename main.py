import time
from config.connect_to_wifi import connect_to_wifi
from config.connect_to_bmp import connect_to_bmp
from config.connec_to_mqtt import connect_to_mqtt
from utils.publisher import publisher

# connect to wifi
connect_to_wifi()

# connect to BMP280 sensor
bmp = connect_to_bmp()

# connect to MQTT broker
client = connect_to_mqtt()


while True:
    # publish as MQTT payload
    publisher(client, "tumi_picow/temperature", str(bmp.temperature))
    publisher(client, "tumi_picow/pressure", str(bmp.pressure))

    # every 5s
    time.sleep_ms(5000)
