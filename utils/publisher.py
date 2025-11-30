def publish(mqtt_client, topic, value):
    mqtt_client.publish(topic, value)
    print("[INFO][PUB] Published {} to {} topic".format(value, topic))
