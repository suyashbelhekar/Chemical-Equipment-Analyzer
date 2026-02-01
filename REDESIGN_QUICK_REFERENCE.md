# Chemical Equipment Visualizer - UI Redesign Quick Reference

## 🚀 Quick Start

### URLs
- **Frontend:** `http://localhost:5174` (or 5173)
- **Backend:** `http://127.0.0.1:8000/api`

### Start Services
```bash
# Terminal 1: Backend
cd backend && venv\Scripts\activate && python manage.py runserver

# Terminal 2: Frontend  
cd web-frontend && npm run dev
```

---

## 🎨 Color Palette at a Glance

```
PRIMARY BLUE    TEAL ACCENT    SUCCESS        WARNING        ERROR
#0f3366         #14b8a6        #22c55e        #fb923c        #ef4444
(Navy)          (Teal)         (Green)        (Amber)        (Red)
```

---

## 📋 Dashboard Features

### Header
- ⚗️ Logo + Title + Subtitle
- 🌙 Dark mode toggle

### Upload Zone
- 📤 Drag & drop enabled
- 📁 Browse files button
- ✅ File validation (CSV only)
- ⏳ Loading indicator

### KPI Cards (4)
- 📦 Total Equipment
- 💧 Avg Flowrate (L/min)
- ⚡ Avg Pressure (bar)
- 🌡️ Avg Temperature (°C)

### Charts (2)
- 📊 Bar Chart: Equipment distribution
- 📈 Line Chart: Average parameters

### Export
- 📥 Download PDF report
- 📥 Download CSV data

### Data Table
- Equipment details
- Sortable columns
- Sticky header
- Type badges

### Tabs
- 📊 Dashboard (main view)
- 📁 History (last 5 uploads)

---

## 🎯 Key Interactions

### Upload File
```
1. Drag CSV to zone OR Click "Browse Files"
2. See loading indicator
3. Wait for backend response
4. Dashboard populates with data
5. Success toast appears
6. Upload added to history
```

### Export Data
```
PDF:
1. Click "Download PDF Report"
2. Wait for generation
3. File downloads as: chemical-report-[timestamp].pdf

CSV:
1. Click "Download CSV"
2. File downloads as: processed-[filename].csv
```

### View History
```
1. Click "History" tab
2. See last 5 uploads
3. Each shows: filename + count + timestamp
```

### Toggle Dark Mode
```
1. Click 🌙 button in header
2. Theme instantly switches
3. All components re-themed
4. No page reload
```

---

## 📱 Responsive Breakpoints

| Device | Columns | Layout |
|--------|---------|---------|
| Desktop (1024px+) | 4 KPI, 2 charts | Full width |
| Tablet (768-1024px) | 2 KPI, 1 chart | Stacked |
| Mobile (<768px) | 1 column | Vertical stack |

---

## 🔧 Configuration

### API Endpoint
```typescript
const API_URL = 'http://127.0.0.1:8000/api'
```

### Upload Timeout
```typescript
timeout: 10000  // 10 seconds
```

### Toast Auto-Dismiss
```typescript
setTimeout(() => { /* dismiss */ }, 4000)  // 4 seconds
```

### History Tracking
```typescript
.slice(0, 5)  // Keep last 5 uploads
```

---

## 🎨 Component Classes

```css
/* Container */
.app-container          /* Main wrapper */
.header                 /* Top header */
.nav-tabs               /* Navigation tabs */
.main-content           /* Content area */

/* Upload */
.upload-section         /* Upload container */
.upload-zone            /* Drag-drop area */
.upload-zone.drag-over  /* Drag state */
.upload-zone.loading    /* Loading state */

/* KPI */
.kpi-grid               /* KPI container */
.kpi-card               /* Individual card */
.kpi-card:hover         /* Hover state */

/* Charts */
.charts-grid            /* Charts container */
.chart-card             /* Chart wrapper */
.chart-wrapper          /* Chart height container */

/* Tables */
.data-table             /* Table element */
.data-table thead       /* Header row */
.data-table tbody tr    /* Data rows */
.data-table tr.alt-row  /* Alternating rows */
.type-badge             /* Type label */

/* Notifications */
.toast-container        /* Toast wrapper */
.toast                  /* Individual toast */
.toast-success          /* Success style */
.toast-error            /* Error style */
.toast-info             /* Info style */

/* States */
.empty-state            /* Empty view */
.history-section        /* History view */
.light-mode             /* Light theme */
.dark-mode              /* Dark theme */
```

---

## 📊 Data Flow

```
User Action
    ↓
File Validation
    ↓
API Call (POST /api/upload/)
    ↓
Backend Processing
    ↓
JSON Response
    ↓
State Update (setData)
    ↓
Component Re-render
    ↓
Charts Update
    ↓
Success Toast
    ↓
History Added
```

---

## 🔍 Troubleshooting

### Frontend Not Loading
```
✓ Check URL: http://localhost:5174
✓ Check backend running: http://127.0.0.1:8000
✓ Check npm dev running
✓ Clear browser cache (Ctrl+Shift+Delete)
```

### Upload Fails
```
✓ Ensure it's a .csv file
✓ Check backend is running
✓ Check CORS enabled on backend
✓ Check file is not corrupted
✓ Check firewall not blocking
```

### Charts Not Showing
```
✓ Ensure data was uploaded successfully
✓ Check browser console for errors (F12)
✓ Check backend returned correct format
✓ Check Chart.js is loaded
```

### Dark Mode Not Working
```
✓ Click moon icon 🌙 in header
✓ Check CSS variables are defined
✓ Clear browser cache
✓ Reload page
```

### History Not Showing
```
✓ Upload at least one file
✓ Click "History" tab
✓ Check recent uploads exist
✓ Max 5 items stored (oldest removed)
```

---

## 📁 File Structure

```
web-frontend/
├── src/
│   ├── App.tsx          # Main component
│   ├── App.css          # Professional styles
│   ├── main.tsx
│   ├── index.css
│   └── vite-env.d.ts
├── package.json         # Dependencies
├── vite.config.ts       # Build config
├── tsconfig.json        # TypeScript
└── dist/                # Production build
```

---

## 🎨 CSS Custom Properties

```css
/* Colors */
--primary-dark: #0f3366
--primary-main: #1e5a96
--accent-main: #14b8a6
--success: #22c55e
--error: #ef4444

/* Spacing */
--shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1)
--shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1)

/* Transitions */
--transition-fast: 150ms cubic-bezier(0.4, 0, 0.2, 1)
--transition-base: 200ms cubic-bezier(0.4, 0, 0.2, 1)

/* Theme-specific */
--bg-primary: varies by theme
--text-primary: varies by theme
```

---

## 📈 Performance Tips

1. **Lazy Load PDF Library** - Only loads on download
2. **Responsive Charts** - Automatically resize
3. **CSS Variables** - Theme switching is instant
4. **Optimized Images** - No unnecessary assets
5. **Production Build** - Tree-shaking reduces size

---

## ♿ Accessibility Features

- ✅ Semantic HTML
- ✅ ARIA labels on interactive elements
- ✅ Keyboard navigation support
- ✅ Focus indicators (outline)
- ✅ Color contrast compliance
- ✅ Screen reader friendly
- ✅ Reduced motion preferences
- ✅ Form validation feedback

---

## 🧪 Testing Checklist

- [ ] Upload CSV file successfully
- [ ] See KPI cards populate
- [ ] Charts render with data
- [ ] Dark mode toggles
- [ ] Export PDF works
- [ ] Export CSV works
- [ ] History tab shows uploads
- [ ] Toast notifications appear
- [ ] Mobile layout responsive
- [ ] Hover effects smooth
- [ ] Loading indicator visible
- [ ] Empty state displays
- [ ] Error handling works

---

## 🚀 Production Build

```bash
cd web-frontend
npm run build        # Creates dist/
npm run preview      # Preview production
```

**Output:** 
- HTML file
- CSS bundles
- JS bundles (code-split)
- All assets optimized

---

## 📚 Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| React | 19.2.0 | UI framework |
| TypeScript | 5.9 | Type safety |
| Chart.js | 4.5.1 | Charting |
| Axios | 1.13.4 | HTTP requests |
| jsPDF | 2.5.1 | PDF generation |
| html2canvas | 1.4.1 | Screenshot to canvas |
| Heroicons | 2.0.18 | Icons |
| Vite | 7.2 | Build tool |

---

## 🔗 Related Documentation

- `REDESIGN_DOCUMENTATION.md` - Detailed design system
- `REDESIGN_BEFORE_AFTER.md` - Comparison guide
- `README.md` - General project info
- `ARCHITECTURE.md` - System design

---

## 💬 Support

**Quick Help:**
1. Check browser console (F12) for errors
2. Verify backend is running
3. Check network tab for API calls
4. Review component state in React DevTools
5. Check file format (CSV extension)

**Common Fixes:**
- Reload page (Ctrl+R)
- Clear cache (Ctrl+Shift+Delete)
- Restart frontend (npm run dev)
- Restart backend (python manage.py runserver)

---

## ✨ Highlights

- 🎨 Professional color palette
- 📱 Fully responsive design
- 🌙 Dark mode support
- 📊 Interactive charts
- 📥 Export to PDF/CSV
- 📁 Upload history tracking
- ⌨️ Keyboard accessible
- 🚀 Fast and optimized
- 💾 No data loss
- 🔄 Same backend API

---

**Version:** 2.0.0  
**Last Updated:** February 1, 2026  
**Status:** Production Ready ✅

For more details, see full documentation files.
