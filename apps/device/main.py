import time
from machine import Pin

# Try to import existing modules
try:
    from config.connect_to_wifi import connect_to_wifi
    from config.connect_to_bmp import connect_to_bmp
    HAS_CONFIG = True
except:
    HAS_CONFIG = False
    print("Note: Some config modules not found")

# Import our constants and sender
from constants import *
from utils.supabase_sender import send_to_supabase

def main():
    # Setup
    led = Pin(LED_PIN, Pin.OUT)
    led.on()
    
    print("\n" + "="*40)
    print("AirSight Starting...")
    print(f"Device: {DEVICE_ID}")
    print(f"Location: {DEVICE_LOCATION}")
    print("="*40)
    
    try:
        # Connect to WiFi and sensor if available
        if HAS_CONFIG:
            connect_to_wifi()
            bmp = connect_to_bmp()
            print("✅ Connected to WiFi and BMP280")
        else:
            print("⚠ Running in test mode (no sensor)")
            bmp = None
        
        print("\n📊 Starting readings...")
        print("-" * 30)
        
        while True:
            # Read sensor or use test data
            if bmp:
                temp = bmp.temperature
                press = bmp.pressure
            else:
                temp = 25.0
                press = 1013.0
            
            print(f"🌡️  {temp:.1f}°C | 🌀 {press:.1f} hPa")
            
            # Send to Supabase
            if SUPABASE_ENABLED:
                print("☁️  Sending to Supabase...", end=" ")
                if send_to_supabase(temp, press):
                    print("✓")
                else:
                    print("✗")
            
            # Blink LED
            led.off()
            time.sleep(0.1)
            led.on()
            
            # Wait for next reading
            time.sleep(PUBLISH_INTERVAL)
            
    except Exception as e:
        print(f"\n💥 Error: {e}")
    finally:
        led.off()
        print("\n🔚 Stopped")

if __name__ == "__main__":
    main()