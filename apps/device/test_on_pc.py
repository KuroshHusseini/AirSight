# test_pc.py - Run this FIRST on your PC
print("🧪 TESTING ON PC - SIMULATING PICO")
print("="*60)

# Mock MicroPython modules
import sys
import types

# Create mock machine module
sys.modules['machine'] = types.ModuleType('machine')
sys.modules['machine'].Pin = type('Pin', (), {
    'OUT': 'out',
    'IN': 'in',
    '__init__': lambda self, pin, mode: setattr(self, 'state', False),
    'on': lambda self: setattr(self, 'state', True),
    'off': lambda self: setattr(self, 'state', False),
})

sys.modules['machine'].unique_id = lambda: b'test-device-id'

# Mock ubinascii
sys.modules['ubinascii'] = types.ModuleType('ubinascii')
sys.modules['ubinascii'].hexlify = lambda x: b'746573742d6465766963652d6964'

print("✅ Mocked MicroPython modules")

# Test 1: Check all files exist
print("\n📁 FILE CHECK:")
print("-"*30)

import os
files = [
    "main.py",
    "constants/device.py",
    "constants/__init__.py",
    "credentials/network.py",
    "credentials/supabase.py",
    "utils/supabase_sender.py",
]

all_files_ok = True
for file in files:
    if os.path.exists(file):
        print(f"✅ {file}")
    else:
        print(f"❌ {file} - MISSING")
        all_files_ok = False

if not all_files_ok:
    print("\n⚠ Create missing files before continuing!")
    sys.exit(1)

print("\n✅ All files present")

# Test 2: Check constants
print("\n⚙️ CONSTANTS CHECK:")
print("-"*30)

try:
    # Mock the constants import chain
    sys.modules['constants.network'] = types.ModuleType('constants.network')
    sys.modules['constants.network'].SSID = "test-ssid"
    sys.modules['constants.network'].PWD = "test-pwd"
    
    from constants.device import *
    print(f"✅ PUBLISH_INTERVAL: {PUBLISH_INTERVAL}")
    print(f"✅ LED_PIN: {LED_PIN}")
    print(f"✅ DEVICE_ID: {DEVICE_ID}")
    print(f"✅ DEVICE_LOCATION: {DEVICE_LOCATION}")
    print(f"✅ SUPABASE_ENABLED: {SUPABASE_ENABLED}")
except Exception as e:
    print(f"❌ Error: {e}")

# Test 3: Check Supabase credentials
print("\n🔐 SUPABASE CREDENTIALS CHECK:")
print("-"*30)

try:
    from credentials.supabase import SUPABASE_URL, SUPABASE_KEY, SUPABASE_TABLE
    print(f"✅ URL: {SUPABASE_URL}")
    print(f"✅ Table: {SUPABASE_TABLE}")
    
    # Check if credentials are real
    if "YOUR-PROJECT" in SUPABASE_URL or "YOUR-KEY" in SUPABASE_KEY:
        print("⚠ WARNING: You need to update credentials/supabase.py!")
        print("   Get your credentials from: https://app.supabase.com")
        print("   → Project Settings → API")
    else:
        print(f"✅ Key: {SUPABASE_KEY[:20]}...")
        
except Exception as e:
    print(f"❌ Error: {e}")

print("\n" + "="*60)
print("READY FOR SIMULATION TEST?")
input("Press Enter to continue to Step 2...")