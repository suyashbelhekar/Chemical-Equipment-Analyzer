# Testing Guide

## Full End-to-End Testing

### Prerequisites
- All three services running (see QUICKSTART.md)
- sample_equipment_data.csv available in root folder

---

## Test 1: Backend API (Direct HTTP)

### Test Upload Endpoint

Open PowerShell and run:

```bash
# Test with curl (if available)
curl -X POST -F "file=@sample_equipment_data.csv" `
  http://127.0.0.1:8000/api/upload/
```

Or use Python:
```bash
python -c "
import requests
files = {'file': open('sample_equipment_data.csv', 'rb')}
r = requests.post('http://127.0.0.1:8000/api/upload/', files=files)
print(r.json())
"
```

**Expected Response:**
```json
{
  "total_items": 20,
  "avg_flowrate": 200.45,
  "avg_pressure": 3.2,
  "avg_temperature": 55.8,
  "type_distribution": {...}
}
```

### Test Datasets Endpoint

```bash
curl http://127.0.0.1:8000/api/datasets/
```

**Expected Response:**
```json
[
  {
    "id": 1,
    "uploaded_at": "2026-01-31T20:15:30.123456Z",
    "total_items": 20,
    "avg_flowrate": 200.45,
    "avg_pressure": 3.2,
    "avg_temperature": 55.8
  }
]
```

### Test Django Admin

1. Open `http://127.0.0.1:8000/admin/`
2. Create superuser if needed:
   ```bash
   python manage.py createsuperuser
   ```
3. Login with credentials
4. Navigate to "Equipment" > "Datasets"
5. Verify datasets are stored

---

## Test 2: React Frontend

### Test File Upload

1. Navigate to `http://localhost:5173`
2. Click "Upload CSV File" input
3. Select `sample_equipment_data.csv`
4. Observe:
   - ✅ File name appears in input
   - ✅ Statistics display in cards (total items, averages)
   - ✅ Bar chart appears with equipment types
   - ✅ No errors in browser console (F12)

### Test Error Handling

1. Try uploading invalid file (non-CSV):
   - ✅ Should show error message
   
2. Try uploading CSV with wrong columns:
   - ✅ Should show specific error from backend

3. With backend down:
   - ✅ Should show connection error

### Browser DevTools Check

1. Open F12 (Developer Tools)
2. Go to Network tab
3. Upload CSV
4. Verify:
   - POST request to `http://127.0.0.1:8000/api/upload/`
   - Status: 201 Created
   - Response contains data
   - No CORS errors

---

## Test 3: PyQt5 Desktop App

### Test File Upload

1. Run `python main.py`
2. Click "Upload CSV File" button
3. Browse to `sample_equipment_data.csv`
4. Select and open
5. Observe:
   - ✅ Status changes to "Uploading file..."
   - ✅ Progress bar appears
   - ✅ Data summary displays with equipment types
   - ✅ Bar chart renders with proper labels
   - ✅ Status changes to "File uploaded successfully!"

### Test Chart

1. Verify bar chart:
   - ✅ All equipment types displayed
   - ✅ Correct heights for each bar
   - ✅ Value labels on top of bars
   - ✅ X-axis rotated for readability
   - ✅ Proper colors and styling

### Test Error Handling

1. Close Django backend
2. Try uploading:
   - ✅ Should show connection error message
   - ✅ Dialog box appears with specific error
   - ✅ App doesn't crash

---

## Test 4: Multiple Uploads

### Test Data Persistence

1. Upload via React: `sample_equipment_data.csv`
2. Check backend datasets: `GET /api/datasets/`
3. Should have 1 dataset

4. Upload via PyQt5: `sample_equipment_data.csv`
5. Check backend datasets again
6. Should have 2 datasets

7. Upload 3 more times (total 5)
8. Check backend - should still have 5

9. Upload 6th time
10. Check backend - should have 5 (oldest deleted)

### Verify in Django Admin

1. Go to `http://127.0.0.1:8000/admin/`
2. Check "Datasets" count
3. Verify `uploaded_at` times are recent
4. Click one to see data

---

## Test 5: Sample Data Validation

Expected values for `sample_equipment_data.csv`:

```
Total Items: 20

Equipment Type Counts:
- Centrifugal: 2
- Gear: 1
- Rotary: 2
- Reciprocating: 1
- Steam: 1
- Gas: 1
- Shell-Tube: 1
- Plate-Frame: 1
- Spiral: 1
- Batch: 1
- CSTR: 1
- PFR: 1
- Cyclone: 1
- Centrifuge: 1
- Bag: 1
- Cartridge: 1
- Globe: 1
- Ball: 1

Averages (approximate):
- Flowrate: ~200.45
- Pressure: ~3.20
- Temperature: ~55.80
```

Verify these match in:
- React UI cards
- PyQt5 data panel
- API response
- Django admin

---

## Test 6: Cross-Client Testing

### Scenario: Upload in React, View in PyQt5

1. ✅ Upload via React UI
2. ✅ Open PyQt5 app (same backend)
3. ✅ Upload same file
4. ✅ Check API: Should have 2 datasets
5. ✅ Both clients see same data

### Scenario: Upload in PyQt5, View in React

1. ✅ Upload via PyQt5
2. ✅ Refresh React UI
3. ✅ Make new upload in React
4. ✅ Check in PyQt5
5. ✅ Verify synchronization

---

## Troubleshooting Tests

### Test: Backend Connection

```bash
# From any terminal
curl http://127.0.0.1:8000/api/datasets/

# Should return JSON array, not connection error
```

### Test: CORS

```javascript
// In browser console
fetch('http://127.0.0.1:8000/api/datasets/')
  .then(r => r.json())
  .then(d => console.log(d))
  .catch(e => console.error(e))

// Should work, not show CORS error
```

### Test: Django Models

```bash
# In Django shell
python manage.py shell

>>> from equipment.models import Dataset
>>> Dataset.objects.all().count()
# Should show number of uploads
>>> Dataset.objects.all().values()
# Should show data
```

### Test: Pandas CSV Reading

```bash
# Test CSV parsing
python -c "
import pandas as pd
df = pd.read_csv('sample_equipment_data.csv')
print(f'Rows: {len(df)}')
print(f'Columns: {list(df.columns)}')
print(df.head())
"
```

---

## Performance Tests

### Test 1: Upload Response Time

1. Record start time
2. Upload `sample_equipment_data.csv`
3. Record response time
4. **Expected:** < 1 second

### Test 2: Chart Render Time

1. React: Upload and measure chart appearance time
2. **Expected:** < 500ms

### Test 3: Multiple Concurrent Uploads

1. Open React and PyQt5 simultaneously
2. Upload in both at same time
3. Both should complete without errors
4. Backend should show 2 new datasets

---

## Test Checklist

**Backend**
- [ ] API responds to POST /api/upload/
- [ ] API responds to GET /api/datasets/
- [ ] Database saves data correctly
- [ ] Old datasets deleted (after 5)
- [ ] Django admin works
- [ ] CORS enabled

**React Frontend**
- [ ] File upload works
- [ ] Chart displays correctly
- [ ] Statistics cards show data
- [ ] Error messages display
- [ ] No console errors
- [ ] Responsive layout

**PyQt5 Desktop**
- [ ] File dialog opens
- [ ] CSV upload works
- [ ] Chart displays correctly
- [ ] Data summary shows
- [ ] Error dialogs work
- [ ] Multi-threading (non-blocking)

**Integration**
- [ ] All clients use same backend
- [ ] Data persists across uploads
- [ ] Error handling works
- [ ] Response times acceptable
- [ ] No CORS issues
- [ ] No database conflicts

---

## Logging & Debugging

### Enable Django Debug Logging

In `backend/chemical_api/settings.py`:
```python
LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'handlers': {
        'console': {
            'class': 'logging.StreamHandler',
        },
    },
    'root': {
        'handlers': ['console'],
        'level': 'DEBUG',
    },
}
```

### React Console Logging

In `web-frontend/src/App.tsx`, add:
```typescript
console.log('Data:', data);
console.log('Error:', error);
```

### PyQt5 Debugging

Uncomment print statements in `desktop-app/main.py`:
```python
print(f"Response: {res.json()}")
```

---

**All tests passing? Congratulations! Your Hybrid Chemical Visualizer is fully functional!** 🎉
