# Small helper to make sure we pass bytes to MQTT client
def bytes_converter(s):
    return s if isinstance(s, bytes) else str(s).encode()
