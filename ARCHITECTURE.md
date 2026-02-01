# Architecture Overview

## System Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                    SAMPLE DATA                              │
│            (sample_equipment_data.csv)                       │
│  20 equipment records with type, flowrate, pressure, temp   │
└─────────────────────────┬───────────────────────────────────┘
                          │
                          ├─→ Uploaded to
                          │
        ┌─────────────────┼──────────────────┐
        │                 │                  │
    ┌───▼────┐       ┌───▼──────┐      ┌──▼─────┐
    │ React  │       │   Django │      │ PyQt5  │
    │ Web    │       │   REST   │      │Desktop │
    │ UI     │       │   API    │      │  App   │
    └───┬────┘       └───┬──────┘      └──┬─────┘
        │                │                 │
        └────────────────┼─────────────────┘
                         │
                    POST /api/upload/
                    GET /api/datasets/
                         │
            ┌────────────▼────────────┐
            │    Django Backend       │
            │  - Parse CSV (Pandas)   │
            │  - Calculate stats      │
            │  - Store in DB          │
            │  - Return JSON          │
            └────────────┬────────────┘
                         │
            ┌────────────▼────────────┐
            │   SQLite Database       │
            │  (Dataset records)      │
            └─────────────────────────┘
```

## Data Flow

### 1. CSV Upload Flow

```
Client uploads CSV
       │
       ▼
POST /api/upload/
       │
       ▼
Django receives file
       │
       ▼
Pandas reads CSV
       │
       ▼
Calculate:
  • total_items
  • avg_flowrate
  • avg_pressure
  • avg_temperature
  • type_distribution
       │
       ▼
Save to Database
       │
       ▼
Return JSON
       │
       ▼
Client displays:
  • Stats cards
  • Bar chart
```

## Component Responsibilities

### Backend (Django REST Framework)
- ✅ File validation (CSV format check)
- ✅ Data parsing (Pandas)
- ✅ Statistical analysis
- ✅ Database persistence
- ✅ JSON API responses
- ✅ CORS support
- ✅ Error handling

### React Frontend
- ✅ User interface (file input, charts)
- ✅ API communication (axios)
- ✅ Real-time visualization (Chart.js)
- ✅ Data display (cards, stats)
- ✅ Error handling & feedback
- ✅ Loading states

### PyQt5 Desktop App
- ✅ Native desktop interface
- ✅ File browser integration
- ✅ API communication (requests)
- ✅ Matplotlib visualization
- ✅ Multi-threaded uploads
- ✅ Data summary display

## API Specification

### Endpoint: POST /api/upload/

**Request:**
```
Content-Type: multipart/form-data
Body: file=<binary_csv_file>
```

**Response (200/201):**
```json
{
  "total_items": 20,
  "avg_flowrate": 200.45,
  "avg_pressure": 3.2,
  "avg_temperature": 55.8,
  "type_distribution": {
    "Centrifugal": 3,
    "Gear": 2,
    "Rotary": 3,
    "Reciprocating": 1,
    "Steam": 1,
    "Gas": 1,
    "Shell-Tube": 1,
    "Plate-Frame": 1,
    "Spiral": 1,
    "Batch": 1,
    "CSTR": 1,
    "PFR": 1,
    "Cyclone": 1,
    "Centrifuge": 1,
    "Bag": 1,
    "Cartridge": 1,
    "Globe": 1,
    "Ball": 1
  }
}
```

**Error Response (400):**
```json
{
  "error": "CSV must contain: Type, Flowrate, Pressure, Temperature columns"
}
```

### Endpoint: GET /api/datasets/

**Response (200):**
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

## Database Schema

### Dataset Model

```sql
CREATE TABLE equipment_dataset (
    id INTEGER PRIMARY KEY,
    uploaded_at DATETIME NOT NULL,
    total_items INTEGER NOT NULL,
    avg_flowrate FLOAT NOT NULL,
    avg_pressure FLOAT NOT NULL,
    avg_temperature FLOAT NOT NULL
);
```

**Constraints:**
- Keeps last 5 uploads
- Auto-deletes oldest when 6th added
- Ordered by uploaded_at descending

## Communication Protocols

### Web (React → Django)
- Protocol: **HTTP/HTTPS**
- Method: **REST API**
- Format: **JSON**
- Auth: **CORS enabled**
- Port: **8000 (backend), 5173 (frontend)**

### Desktop (PyQt5 → Django)
- Protocol: **HTTP/HTTPS**
- Method: **REST API**
- Format: **JSON**
- Auth: **Direct API access**
- Port: **8000 (backend)**

## Technology Stack Breakdown

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Frontend Web** | React 19 | UI Framework |
| **Frontend Web** | TypeScript | Type safety |
| **Frontend Web** | Vite 7 | Build tool |
| **Frontend Web** | Chart.js | Charts |
| **Frontend Web** | Axios | HTTP client |
| **Frontend Desktop** | PyQt5 | Desktop framework |
| **Frontend Desktop** | Matplotlib | Visualization |
| **Frontend Desktop** | Requests | HTTP client |
| **Backend** | Django 5.2 | Web framework |
| **Backend** | DRF 3.16 | REST API |
| **Backend** | Pandas 2.3 | Data analysis |
| **Backend** | Django CORS | Cross-origin |
| **Database** | SQLite | Data persistence |

## Deployment Architecture

### Local Development
```
Your Machine
├── Backend (localhost:8000)
├── Frontend (localhost:5173)
└── Desktop App (runs locally)
```

### Production (Example)
```
Cloud (AWS/Heroku)
├── Django API (Docker)
├── PostgreSQL (RDS)
└── React Frontend (S3 + CloudFront)

Desktop App (On-premises)
└── Connects to cloud API
```

## Security Considerations

✅ **CORS Configuration** - Allows frontend to call backend  
✅ **Input Validation** - CSV format and columns checked  
✅ **File Type Validation** - Only CSV accepted  
✅ **Error Handling** - No sensitive data in errors  
⚠️ **Production Notes:**
  - Set `DEBUG = False` in Django
  - Use `CORS_ALLOWED_ORIGINS` instead of `CORS_ALLOW_ALL_ORIGINS`
  - Implement authentication (JWT, OAuth2)
  - Use HTTPS/SSL
  - Add rate limiting
  - Validate file size limits

## Performance Characteristics

| Operation | Time | Bottleneck |
|-----------|------|-----------|
| CSV Parse (20 rows) | ~100ms | Pandas |
| Chart Render | ~200ms | Chart.js |
| API Round-trip | ~100ms | Network |
| DB Save | ~50ms | SQLite |
| **Total** | ~450ms | Network/DB |

## Scalability Path

```
Current (Single machine)
    ↓
Add authentication
    ↓
Move DB to PostgreSQL
    ↓
Containerize with Docker
    ↓
Deploy to Kubernetes
    ↓
Add message queue (Celery)
    ↓
Add caching (Redis)
    ↓
Add CDN for frontend
    ↓
Multi-region deployment
```

## Testing Strategy

### Backend Testing
```bash
# Unit tests for views
python manage.py test

# API testing with curl
curl -X POST -F "file=@test.csv" http://localhost:8000/api/upload/
```

### Frontend Testing
```bash
# Component tests (Vitest/Playwright)
npm test

# Manual testing
npm run dev
```

### Integration Testing
1. Start backend
2. Start frontend
3. Upload CSV through UI
4. Verify chart appears
5. Check database with admin panel

## Maintenance & Monitoring

### Monitoring Points
- API response times
- Database query performance
- File upload success rate
- Error rates by endpoint
- Chart rendering performance

### Logging
- Django: `logging` module
- Frontend: Browser console
- Desktop: Print statements

### Backup Strategy
- Export datasets to CSV
- Regular SQLite backups
- Version control for code

---

This architecture provides a flexible, scalable foundation for the Chemical Equipment Visualizer while demonstrating professional full-stack development patterns.
