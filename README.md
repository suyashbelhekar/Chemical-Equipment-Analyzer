# Hybrid Chemical Equipment Parameter Visualizer

A complete solution demonstrating a **hybrid architecture** with:
- **Django + DRF** REST API backend
- **React + Chart.js** web frontend
- **PyQt5 + Matplotlib** desktop application
- All three clients connected to the same API

## Project Structure

```
chemical-visualizer/
├── backend/                    # Django REST API
│   ├── venv/                  # Virtual environment
│   ├── chemical_api/          # Django project
│   │   ├── settings.py        # Configuration
│   │   ├── urls.py            # Main URL routing
│   │   └── ...
│   ├── equipment/             # Django app
│   │   ├── models.py          # Dataset model
│   │   ├── views.py           # API views
│   │   ├── urls.py            # App URLs
│   │   └── ...
│   └── manage.py              # Django CLI
│
├── web-frontend/              # React Vite app
│   ├── src/
│   │   ├── App.tsx            # Main component
│   │   ├── App.css            # Styling
│   │   └── ...
│   ├── package.json           # Dependencies
│   └── vite.config.ts         # Vite config
│
├── desktop-app/               # PyQt5 desktop app
│   ├── main.py                # Application entry point
│   └── requirements.txt       # Python dependencies
│
└── sample_equipment_data.csv  # Test data file
```

## Features

### Backend API (`/api/`)
- **POST `/api/upload/`** - Upload and analyze CSV files
  - Returns: total items, averages (flowrate, pressure, temperature), equipment type distribution
  - Stores dataset history (keeps last 5 uploads)
  
- **GET `/api/datasets/`** - List all stored datasets

### Frontend Components

#### React Web UI
- 📁 File upload interface
- 📊 Real-time Bar chart visualization
- 📈 Statistics dashboard (total items, averages)
- 🎨 Responsive grid layout
- 🔄 Error handling with user feedback

#### PyQt5 Desktop App
- 🖥️ Native Qt interface
- 📁 File browser for CSV selection
- 📊 Matplotlib bar charts with value labels
- 📊 Data summary panel
- ⚡ Multi-threaded uploads (non-blocking UI)
- 🔗 Direct API communication

## Setup Instructions

### 1. Backend Setup

```bash
cd backend
python -m venv venv

# Windows
venv\Scripts\activate

# macOS/Linux
source venv/bin/activate

pip install -r requirements.txt
```

Create `backend/requirements.txt`:
```
django==5.2.10
djangorestframework==3.16.1
django-cors-headers==4.9.0
pandas==2.3.3
reportlab==4.4.9
```

Then run migrations:
```bash
python manage.py migrate
python manage.py runserver
```

The API will be available at `http://127.0.0.1:8000`

### 2. React Frontend Setup

```bash
cd web-frontend
npm install
npm run dev
```

Access at `http://localhost:5173`

### 3. PyQt5 Desktop App Setup

```bash
cd desktop-app
pip install -r requirements.txt
python main.py
```

## API Endpoints

### Upload CSV
```
POST /api/upload/
Content-Type: multipart/form-data

Body: file=<csv_file>

Response:
{
  "total_items": 20,
  "avg_flowrate": 200.45,
  "avg_pressure": 3.2,
  "avg_temperature": 55.8,
  "type_distribution": {
    "Centrifugal": 3,
    "Gear": 2,
    "Rotary": 3,
    ...
  }
}
```

### Get Datasets
```
GET /api/datasets/

Response:
[
  {
    "id": 1,
    "uploaded_at": "2026-01-31T20:15:30Z",
    "total_items": 20,
    "avg_flowrate": 200.45,
    "avg_pressure": 3.2,
    "avg_temperature": 55.8
  },
  ...
]
```

## Testing the Application

1. **Start Backend**: `python manage.py runserver` (in backend folder with venv activated)
2. **Start React Frontend**: `npm run dev` (in web-frontend folder)
3. **Run Desktop App**: `python main.py` (in desktop-app folder)

All three should be running simultaneously.

4. **Test with Sample Data**:
   - Use the provided `sample_equipment_data.csv`
   - Upload through React UI or PyQt5 app
   - View results in both interfaces

## Sample CSV Format

```
Equipment,Type,Flowrate,Pressure,Temperature
Pump-001,Centrifugal,150.5,2.5,45.2
Compressor-001,Rotary,250.1,5.2,65.3
Turbine-001,Steam,350.2,10.5,85.1
```

Required columns: `Type`, `Flowrate`, `Pressure`, `Temperature`

## Key Technologies

| Component | Technology |
|-----------|-----------|
| Backend | Django 5.2, Django REST Framework 3.16 |
| Web Frontend | React 19, Vite 7, Chart.js 4, Axios |
| Desktop | PyQt5, Matplotlib, Requests |
| Data Processing | Pandas |
| Database | SQLite (default Django) |

## Architecture Benefits

✅ **Unified API** - Single backend serves multiple clients  
✅ **Multiple UIs** - Web and desktop options for different use cases  
✅ **Data Persistence** - Database stores analysis history  
✅ **Real-time Visualization** - Instant chart rendering  
✅ **CORS Enabled** - Cross-origin requests supported  
✅ **Error Handling** - Robust validation and user feedback  
✅ **Scalable** - Easy to add more features or clients  

## Future Enhancements

- 🔐 Authentication & Authorization (JWT tokens)
- 💾 Export reports to PDF/Excel
- 📱 Mobile app (React Native)
- 🌐 Deployment (Docker, AWS, Heroku)
- 📊 Advanced analytics and ML models
- 🔄 Real-time WebSocket updates
- 🎨 Dark mode support

## Troubleshooting

### "Cannot connect to server"
- Ensure Django backend is running: `python manage.py runserver`
- Check if port 8000 is free

### CORS errors
- Backend has `CORS_ALLOW_ALL_ORIGINS = True` in settings
- Check Django is configured correctly

### Chart not displaying
- Ensure Chart.js is installed: `npm install chart.js react-chartjs-2`
- Check browser console for errors

### PyQt5 install issues
- On Windows: May require Visual C++ Build Tools
- Use `pip install --upgrade PyQt5`

## License

MIT License - Feel free to use and modify

## Author

Created as a demonstration of hybrid architecture patterns combining Django, React, and PyQt5.
