import time
from machine import Pin
from config.connect_to_wifi import connect_to_wifi
from config.connect_to_bmp import connect_to_bmp
from config.connect_to_mqtt import connect_to_mqtt
from utils.publisher import publisher
from constants import MQTT_TOPIC_TEMP, MQTT_TOPIC_PRESS, LED_PIN, PUBLISH_INTERVAL


def main():
    led = Pin(LED_PIN, Pin.OUT)
    led.on()

    try:
        connect_to_wifi()
        bmp = connect_to_bmp()
        client = connect_to_mqtt()

        while True:
            try:
                publisher(client, MQTT_TOPIC_TEMP, str(bmp.temperature))
                publisher(client, MQTT_TOPIC_PRESS, str(bmp.pressure))
            except Exception as e:
                print(f"Error publishing: {e}")

            time.sleep(PUBLISH_INTERVAL)
    except Exception as e:
        print(f"Fatal error: {e}")
    finally:
        led.off()


if __name__ == "__main__":
    main()
