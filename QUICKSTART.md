# Quick Start Guide

## 🚀 Getting Started in 5 Minutes

### Prerequisites
- Python 3.9+
- Node.js 16+
- Git

### Step 1: Setup Backend (Django API)

```bash
# Navigate to backend folder
cd backend

# Create and activate virtual environment
python -m venv venv

# Windows
venv\Scripts\activate

# macOS/Linux
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run migrations
python manage.py migrate

# Start server
python manage.py runserver
```

✅ Backend running at: `http://127.0.0.1:8000`

### Step 2: Setup React Frontend

Open a new terminal:

```bash
# Navigate to frontend folder
cd web-frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

✅ Frontend running at: `http://localhost:5173`

### Step 3: Setup Desktop App (Optional)

Open a new terminal:

```bash
# Navigate to desktop app folder
cd desktop-app

# Install dependencies
pip install -r requirements.txt

# Run the application
python main.py
```

✅ Desktop app launched!

## 📊 Testing

All three should be running. Now:

1. **Open React Frontend**: `http://localhost:5173`
2. **Click "Upload CSV File"**
3. **Select** `sample_equipment_data.csv` from the root folder
4. **Watch the chart appear!**

Or use the PyQt5 desktop app:
1. Click "Upload CSV File" button
2. Select `sample_equipment_data.csv`
3. View results in the data panel and chart

## 🛠️ Common Commands

### Backend
```bash
# In backend folder with venv activated
python manage.py migrate          # Run migrations
python manage.py createsuperuser  # Create admin user
python manage.py runserver        # Start server
python manage.py shell            # Django shell
```

### Frontend
```bash
# In web-frontend folder
npm run dev     # Start dev server
npm run build   # Build for production
npm run preview # Preview production build
npm run lint    # Run linter
```

### Desktop App
```bash
# In desktop-app folder
python main.py  # Run application
```

## 📁 File Structure Quick Reference

| Path | Purpose |
|------|---------|
| `backend/chemical_api/settings.py` | Django configuration |
| `backend/equipment/models.py` | Database models |
| `backend/equipment/views.py` | API endpoints |
| `web-frontend/src/App.tsx` | React main component |
| `desktop-app/main.py` | PyQt5 application |
| `sample_equipment_data.csv` | Test data |

## 🐛 Troubleshooting

**Q: "Cannot connect to server" error in React/PyQt5**
- A: Make sure Django backend is running: `python manage.py runserver`

**Q: Port 8000 already in use**
- A: Run on different port: `python manage.py runserver 8001`

**Q: "ModuleNotFoundError" in backend**
- A: Activate virtual environment: `venv\Scripts\activate` (Windows)

**Q: npm install fails**
- A: Clear cache: `npm cache clean --force` and try again

**Q: PyQt5 installation fails on Windows**
- A: Install Visual C++ Build Tools or use: `pip install PyQt5-sip`

## 📚 Next Steps

1. ✅ Test with sample data
2. ✅ Try uploading your own CSV files
3. ✅ Explore the API at `http://127.0.0.1:8000/api/`
4. ✅ Add more features (authentication, PDF export, etc.)
5. ✅ Deploy to production (Docker, Heroku, AWS)

## 🌐 API Endpoints

```
POST   http://127.0.0.1:8000/api/upload/    - Upload CSV
GET    http://127.0.0.1:8000/api/datasets/  - List datasets
GET    http://127.0.0.1:8000/admin/         - Django admin
```

Test the API using cURL:
```bash
curl -X POST -F "file=@sample_equipment_data.csv" \
  http://127.0.0.1:8000/api/upload/
```

## 💡 Tips

- Use Django admin to view stored datasets: Go to `http://127.0.0.1:8000/admin/`
- React Hot Module Replacement (HMR) means changes appear instantly
- PyQt5 app stores data in memory (refresh to reset)
- Sample CSV has 20 equipment items of different types

---

**Ready? Start with Step 1 above!** 🎉
