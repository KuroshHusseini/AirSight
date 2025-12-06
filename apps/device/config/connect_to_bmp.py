from machine import Pin, I2C
from bmp280 import BMP280


def connect_to_bmp():
    # define I2C connection and BMP
    print("[INFO] Setting up I2C for BMP280...")
    i2c = I2C(0, sda=Pin(0), scl=Pin(1), freq=100000)
    print("[INFO] Scanning I2C bus...")
    devices = i2c.scan()

    if len(devices) == 0:
        print("[ERROR] No I2C devices found!")
        print("[INFO] Troubleshooting tips:")
        print("  - Check BMP280 wiring (SDA=GPIO0, SCL=GPIO1)")
        print("  - Verify power supply to BMP280")
        print("  - Check pull-up resistors on I2C lines")
        raise RuntimeError("BMP280 not detected on I2C bus")
    else:
        print("[INFO] I2C devices found:", [hex(device) for device in devices])
        bmp280_addresses = [0x76, 0x77]
        if not any(addr in devices for addr in bmp280_addresses):
            print(
                "[WARNING] No known BMP280 address found. Found addresses:",
                [hex(addr) for addr in devices],
            )

    try:
        bmp = BMP280(i2c)
        print("[INFO] BMP280 initialized successfully!")
        return bmp
    except Exception as e:
        print(f"[ERROR] Failed to initialize BMP280: {e}")
        raise
