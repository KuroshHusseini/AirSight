import time
import network  # type: ignore
from credentials.network import SSID, PWD


wlan = network.WLAN(network.STA_IF)
wlan.active(True)
wlan.connect(SSID, PWD)


def connect_to_wifi():
    print("[INFO] CONNECTING TO WIFI...")
    connection_timeout = 10  # seconds

    while connection_timeout > 0:
        if wlan.status() == 3:  # connected
            break
        connection_timeout -= 1
        print(
            "[INFO] Waiting for Wi-Fi connection... {connection_timeout}s".format(
                connection_timeout=connection_timeout
            )
        )
        time.sleep(1)

    # check if connection successful
    if wlan.status() != 3:
        raise RuntimeError("[ERROR] Failed to establish a network connection")
    else:
        print("[INFO] CONNECTED!")
        network_info = wlan.ifconfig()
        print("[INFO] IP address:", network_info[0])
