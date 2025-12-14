import json

def send_to_supabase(temperature, pressure):
    try:
        from credentials.supabase import SUPABASE_URL, SUPABASE_KEY, SUPABASE_TABLE
        from constants import DEVICE_ID, DEVICE_LOCATION
        import urequests
        
        url = f"{SUPABASE_URL}/rest/v1/{SUPABASE_TABLE}"
        headers = {
            'apikey': SUPABASE_KEY,
            'Authorization': f'Bearer {SUPABASE_KEY}',
            'Content-Type': 'application/json'
        }
        data = {
            'device_id': DEVICE_ID,
            'temperature': str(temperature),
            'pressure': str(pressure),
            'location': DEVICE_LOCATION
        }
        
        response = urequests.post(url, headers=headers, data=json.dumps(data))
        success = response.status_code in [200, 201, 204]
        response.close()
        return success
    except Exception as e:
        print(f'Supabase Error: {e}')
        return False