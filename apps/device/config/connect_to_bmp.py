from machine import Pin, I2C
from bmp280 import BMP280


def connect_to_bmp():
    # define I2C connection and BMP
    print("[INFO] Setting up I2C for BMP280...")
    i2c = I2C(0, sda=Pin(0), scl=Pin(1), freq=400000)
    print("[INFO] Scanning I2C bus...")
    devices = i2c.scan()

    if len(devices) == 0:
        print("[ERROR] No I2C devices found!")
    else:
        print("[INFO] I2C devices found:", [hex(device) for device in devices])

    bmp = BMP280(i2c)
    return bmp
