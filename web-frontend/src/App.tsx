import { useState, useEffect } from 'react'
import axios from 'axios'
import { Bar, Line } from 'react-chartjs-2'
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend, Filler } from 'chart.js'
import { DocumentArrowDownIcon, ArrowUpTrayIcon, XMarkIcon, CheckCircleIcon, ExclamationTriangleIcon, ArrowLeftOnRectangleIcon } from '@heroicons/react/24/outline'
import './App.css'
import Auth from './Auth'
import './Auth.css'

ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend, Filler)

interface EquipmentData {
  id?: number
  equipment_name?: string
  type?: string
  flowrate?: number
  pressure?: number
  temperature?: number
  [key: string]: any
}

interface SummaryData {
  total_items: number
  avg_flowrate: number
  avg_pressure: number
  avg_temperature: number
  type_distribution: Record<string, number>
  data?: EquipmentData[]
  filename?: string
  timestamp?: string
}

interface UploadHistory {
  id: number
  filename: string
  timestamp: string
  total_items: number
}

type ToastType = 'success' | 'error' | 'info'

interface Toast {
  id: string
  message: string
  type: ToastType
}

const API_URL = 'http://127.0.0.1:8000/api'

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [userEmail, setUserEmail] = useState('')
  
  const [data, setData] = useState<SummaryData | null>(null)
  const [loading, setLoading] = useState(false)
  const [toasts, setToasts] = useState<Toast[]>([])
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [uploadHistory, setUploadHistory] = useState<UploadHistory[]>([])
  const [activeTab, setActiveTab] = useState<'dashboard' | 'history'>('dashboard')
  const [dragOver, setDragOver] = useState(false)

  // Check if user is already authenticated
  useEffect(() => {
    const authData = localStorage.getItem('chemicalAuth')
    if (authData) {
      try {
        const { email } = JSON.parse(authData)
        setUserEmail(email)
        setIsAuthenticated(true)
      } catch (err) {
        console.error('Auth parse error:', err)
        localStorage.removeItem('chemicalAuth')
      }
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('chemicalAuth')
    setIsAuthenticated(false)
    setUserEmail('')
    setData(null)
    setUploadHistory([])
    showToast('Logged out successfully', 'success')
  }

  // Show auth page if not authenticated
  if (!isAuthenticated) {
    return <Auth onAuthenticate={(email) => {
      setUserEmail(email)
      setIsAuthenticated(true)
    }} />
  }

  const showToast = (message: string, type: ToastType = 'info') => {
    const id = Date.now().toString()
    setToasts(prev => [...prev, { id, message, type }])
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id))
    }, 4000)
  }

  const uploadFile = async (file: File) => {
    if (!file.name.endsWith('.csv')) {
      showToast('Please upload a CSV file', 'error')
      return
    }

    setLoading(true)

    const formData = new FormData()
    formData.append('file', file)

    try {
      const res = await axios.post(`${API_URL}/upload/`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        timeout: 10000
      })
      
      const newData = {
        ...res.data,
        filename: file.name,
        timestamp: new Date().toLocaleString()
      }
      
      setData(newData)
      showToast(`Successfully uploaded ${file.name}`, 'success')
      
      setUploadHistory(prev => [{
        id: Date.now(),
        filename: file.name,
        timestamp: new Date().toLocaleString(),
        total_items: res.data.total_items
      }, ...prev].slice(0, 5))
      
    } catch (err: any) {
      if (err.response) {
        showToast(`Server error: ${err.response.status}`, 'error')
      } else if (err.request) {
        showToast('Backend not responding. Make sure Django is running at http://127.0.0.1:8000', 'error')
      } else {
        showToast(err.message || 'Failed to upload file', 'error')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) uploadFile(file)
    e.target.value = ''
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setDragOver(true)
  }

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setDragOver(false)
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files?.[0]
    if (file) uploadFile(file)
  }

  const downloadPDF = async () => {
    if (!data) return
    try {
      showToast('Generating PDF report with charts...', 'info')
      const jsPDF = (await import('jspdf')).jsPDF
      const html2canvas = (await import('html2canvas')).default
      
      const pdf = new jsPDF('p', 'mm', 'a4')
      const pageWidth = pdf.internal.pageSize.getWidth()
      const pageHeight = pdf.internal.pageSize.getHeight()
      let yPosition = 15
      
      // Title
      pdf.setFontSize(20)
      pdf.setTextColor(15, 51, 102)
      pdf.text('Chemical Equipment Analysis Report', 10, yPosition)
      yPosition += 12
      
      // Metadata
      pdf.setFontSize(10)
      pdf.setTextColor(100, 100, 100)
      pdf.text(`Generated: ${new Date().toLocaleString()}`, 10, yPosition)
      yPosition += 6
      pdf.text(`File: ${data.filename || 'Unknown'}`, 10, yPosition)
      yPosition += 6
      pdf.text(`Total Equipment: ${data.total_items}`, 10, yPosition)
      yPosition += 10
      
      // Summary Section
      pdf.setFontSize(12)
      pdf.setTextColor(30, 90, 150)
      pdf.text('Summary Metrics', 10, yPosition)
      yPosition += 8
      
      pdf.setFontSize(9)
      pdf.setTextColor(0, 0, 0)
      pdf.text(`Average Flowrate: ${data.avg_flowrate.toFixed(2)} L/min`, 12, yPosition)
      yPosition += 5
      pdf.text(`Average Pressure: ${data.avg_pressure.toFixed(2)} bar`, 12, yPosition)
      yPosition += 5
      pdf.text(`Average Temperature: ${data.avg_temperature.toFixed(2)} °C`, 12, yPosition)
      yPosition += 12
      
      // Capture and add charts
      const chartElements = document.querySelectorAll('.chart-card .chart-wrapper canvas')
      if (chartElements.length > 0) {
        pdf.setFontSize(12)
        pdf.setTextColor(30, 90, 150)
        pdf.text('Analysis Charts', 10, yPosition)
        yPosition += 8
        
        // Add each chart
        for (let i = 0; i < Math.min(chartElements.length, 2); i++) {
          const canvas = chartElements[i] as HTMLCanvasElement
          const imgData = canvas.toDataURL('image/png')
          
          // Check if we need a new page
          if (yPosition > pageHeight - 110) {
            pdf.addPage()
            yPosition = 15
          }
          
          // Add chart image
          const chartWidth = (pageWidth - 20) / 2 - 5
          pdf.addImage(imgData, 'PNG', i === 0 ? 10 : 10 + chartWidth + 5, yPosition, chartWidth, 60)
          
          if (i === 1) {
            yPosition += 65
          }
        }
      }
      
      // Equipment Distribution Table on new page if needed
      yPosition += 15
      if (yPosition > pageHeight - 80) {
        pdf.addPage()
        yPosition = 15
      }
      
      pdf.setFontSize(12)
      pdf.setTextColor(30, 90, 150)
      pdf.text('Equipment Distribution', 10, yPosition)
      yPosition += 8
      
      pdf.setFontSize(9)
      pdf.setTextColor(0, 0, 0)
      Object.entries(data.type_distribution).forEach(([type, count]) => {
        if (yPosition > pageHeight - 20) {
          pdf.addPage()
          yPosition = 15
        }
        pdf.text(`${type}: ${count} units`, 12, yPosition)
        yPosition += 5
      })
      
      // Footer
      pdf.setFontSize(8)
      pdf.setTextColor(150, 150, 150)
      pdf.text('Chemical Equipment Visualizer v2.0 | Professional Analytics Dashboard', 10, pageHeight - 8)
      
      pdf.save(`chemical-report-${Date.now()}.pdf`)
      showToast('PDF downloaded successfully with charts!', 'success')
    } catch (err) {
      console.error('PDF Error:', err)
      showToast('Failed to generate PDF', 'error')
    }
  }

  const downloadCSV = () => {
    if (!data?.data || data.data.length === 0) {
      showToast('No data available to download', 'error')
      return
    }
    try {
      const csv = convertToCSV(data.data)
      if (!csv) {
        showToast('Failed to convert data to CSV', 'error')
        return
      }
      
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
      const link = document.createElement('a')
      const url = URL.createObjectURL(blob)
      
      link.setAttribute('href', url)
      link.setAttribute('download', `processed-${(data.filename || 'equipment').replace('.csv', '')}-${Date.now()}.csv`)
      link.style.visibility = 'hidden'
      
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      
      URL.revokeObjectURL(url)
      showToast('CSV downloaded successfully!', 'success')
    } catch (err) {
      console.error('CSV Error:', err)
      showToast('Failed to download CSV', 'error')
    }
  }

  const convertToCSV = (data: EquipmentData[]) => {
    if (data.length === 0) return ''
    const headers = Object.keys(data[0])
    const rows = data.map(item => headers.map(h => `"${item[h] ?? ''}"`).join(','))
    return [headers.join(','), ...rows].join('\n')
  }

  const chartColors = {
    primary: 'rgba(15, 51, 102, 1)',
    primaryLight: 'rgba(15, 51, 102, 0.6)',
    accent: 'rgba(20, 184, 166, 0.8)',
    accentLight: 'rgba(20, 184, 166, 0.3)',
    warning: 'rgba(251, 146, 60, 0.8)',
    success: 'rgba(34, 197, 94, 0.8)',
  }

  const chartData = data ? {
    labels: Object.keys(data.type_distribution),
    datasets: [{
      label: 'Equipment Count',
      data: Object.values(data.type_distribution),
      backgroundColor: chartColors.primaryLight,
      borderColor: chartColors.primary,
      borderWidth: 2,
      borderRadius: 8,
      hoverBackgroundColor: chartColors.primary,
    }]
  } : null

  const parametersData = data ? {
    labels: ['Flowrate', 'Pressure', 'Temperature'],
    datasets: [{
      label: 'Average Values',
      data: [data.avg_flowrate, data.avg_pressure, data.avg_temperature],
      borderColor: chartColors.accent,
      backgroundColor: chartColors.accentLight,
      borderWidth: 3,
      fill: true,
      pointBackgroundColor: chartColors.accent,
      pointBorderColor: '#fff',
      pointBorderWidth: 2,
      pointRadius: 6,
      tension: 0.4,
    }]
  } : null

  const bgClass = isDarkMode ? 'dark-mode' : 'light-mode'

  return (
    <div className={`app-container ${bgClass}`}>
      <header className="header">
        <div className="header-content">
          <div className="header-left">
            <div className="logo-container">
              <div className="logo-icon">⚗️</div>
              <div>
                <h1 className="app-title">Chemical Equipment Visualizer</h1>
                <p className="app-subtitle">Industrial Analytics Dashboard</p>
              </div>
            </div>
          </div>
          <div className="header-right">
            <div className="user-info">
              <span className="user-email">{userEmail}</span>
            </div>
            <button 
              className="theme-toggle"
              onClick={() => setIsDarkMode(!isDarkMode)}
              title="Toggle dark mode"
            >
              {isDarkMode ? '☀️' : '🌙'}
            </button>
            <button 
              className="logout-button"
              onClick={handleLogout}
              title="Logout"
            >
              <ArrowLeftOnRectangleIcon />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </header>

      <div className="nav-tabs">
        <button 
          className={`nav-tab ${activeTab === 'dashboard' ? 'active' : ''}`}
          onClick={() => setActiveTab('dashboard')}
        >
          📊 Dashboard
        </button>
        <button 
          className={`nav-tab ${activeTab === 'history' ? 'active' : ''}`}
          onClick={() => setActiveTab('history')}
        >
          📁 History ({uploadHistory.length})
        </button>
      </div>

      <main className="main-content">
        {activeTab === 'dashboard' ? (
          <>
            <div className="upload-section">
              <div
                className={`upload-zone ${dragOver ? 'drag-over' : ''} ${loading ? 'loading' : ''}`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <ArrowUpTrayIcon className="upload-icon" />
                <h3 className="upload-title">Upload CSV File</h3>
                <p className="upload-subtitle">Drag and drop your CSV file here or click to browse</p>
                <input
                  type="file"
                  accept=".csv"
                  onChange={handleFileInputChange}
                  disabled={loading}
                  className="file-input"
                  id="file-input"
                />
                <label htmlFor="file-input" className="upload-button">
                  Browse Files
                </label>
                {loading && <p className="loading-text">⏳ Uploading and analyzing...</p>}
              </div>
            </div>

            {data && (
              <>
                <div className="kpi-grid">
                  <div className="kpi-card kpi-total">
                    <div className="kpi-icon">📦</div>
                    <div className="kpi-content">
                      <p className="kpi-label">Total Equipment</p>
                      <p className="kpi-value">{data.total_items}</p>
                    </div>
                  </div>

                  <div className="kpi-card kpi-flowrate">
                    <div className="kpi-icon">💧</div>
                    <div className="kpi-content">
                      <p className="kpi-label">Avg Flowrate</p>
                      <p className="kpi-value">{data.avg_flowrate.toFixed(2)}</p>
                      <p className="kpi-unit">L/min</p>
                    </div>
                  </div>

                  <div className="kpi-card kpi-pressure">
                    <div className="kpi-icon">⚡</div>
                    <div className="kpi-content">
                      <p className="kpi-label">Avg Pressure</p>
                      <p className="kpi-value">{data.avg_pressure.toFixed(2)}</p>
                      <p className="kpi-unit">bar</p>
                    </div>
                  </div>

                  <div className="kpi-card kpi-temperature">
                    <div className="kpi-icon">🌡️</div>
                    <div className="kpi-content">
                      <p className="kpi-label">Avg Temperature</p>
                      <p className="kpi-value">{data.avg_temperature.toFixed(2)}</p>
                      <p className="kpi-unit">°C</p>
                    </div>
                  </div>
                </div>

                <div className="charts-grid">
                  {chartData && (
                    <div className="chart-container chart-card">
                      <h3 className="chart-title">Equipment Distribution</h3>
                      <div className="chart-wrapper">
                        <Bar
                          data={chartData}
                          options={{
                            responsive: true,
                            maintainAspectRatio: false,
                            plugins: {
                              legend: {
                                display: true,
                                labels: {
                                  color: isDarkMode ? '#e5e7eb' : '#374151',
                                  font: { size: 12, weight: 'bold' }
                                }
                              },
                              tooltip: {
                                backgroundColor: 'rgba(0,0,0,0.8)',
                                padding: 12,
                                titleFont: { size: 14, weight: 'bold' },
                                bodyFont: { size: 13 }
                              }
                            },
                            scales: {
                              y: {
                                grid: {
                                  color: isDarkMode ? 'rgba(75,85,99,0.2)' : 'rgba(0,0,0,0.1)',
                                },
                                ticks: {
                                  color: isDarkMode ? '#e5e7eb' : '#374151'
                                }
                              },
                              x: {
                                grid: { display: false },
                                ticks: {
                                  color: isDarkMode ? '#e5e7eb' : '#374151'
                                }
                              }
                            }
                          }}
                        />
                      </div>
                    </div>
                  )}

                  {parametersData && (
                    <div className="chart-container chart-card">
                      <h3 className="chart-title">Average Parameters</h3>
                      <div className="chart-wrapper">
                        <Line
                          data={parametersData}
                          options={{
                            responsive: true,
                            maintainAspectRatio: false,
                            plugins: {
                              legend: {
                                display: true,
                                labels: {
                                  color: isDarkMode ? '#e5e7eb' : '#374151',
                                  font: { size: 12, weight: 'bold' }
                                }
                              },
                              tooltip: {
                                backgroundColor: 'rgba(0,0,0,0.8)',
                                padding: 12,
                                titleFont: { size: 14, weight: 'bold' },
                                bodyFont: { size: 13 }
                              }
                            },
                            scales: {
                              y: {
                                grid: {
                                  color: isDarkMode ? 'rgba(75,85,99,0.2)' : 'rgba(0,0,0,0.1)',
                                },
                                ticks: {
                                  color: isDarkMode ? '#e5e7eb' : '#374151'
                                }
                              },
                              x: {
                                grid: {
                                  color: isDarkMode ? 'rgba(75,85,99,0.2)' : 'rgba(0,0,0,0.1)',
                                },
                                ticks: {
                                  color: isDarkMode ? '#e5e7eb' : '#374151'
                                }
                              }
                            }
                          }}
                        />
                      </div>
                    </div>
                  )}
                </div>

                <div className="export-section">
                  <h3 className="section-title">📥 Export Data</h3>
                  <div className="export-buttons">
                    <button onClick={downloadPDF} className="export-btn export-pdf">
                      <DocumentArrowDownIcon className="btn-icon" />
                      Download PDF Report
                    </button>
                    <button onClick={downloadCSV} className="export-btn export-csv">
                      <DocumentArrowDownIcon className="btn-icon" />
                      Download CSV
                    </button>
                  </div>
                </div>

                {data.data && data.data.length > 0 && (
                  <div className="data-table-section">
                    <h3 className="section-title">📋 Equipment Details</h3>
                    <div className="table-wrapper">
                      <table className="data-table">
                        <thead>
                          <tr>
                            <th>Equipment Name</th>
                            <th>Type</th>
                            <th>Flowrate (L/min)</th>
                            <th>Pressure (bar)</th>
                            <th>Temperature (°C)</th>
                          </tr>
                        </thead>
                        <tbody>
                          {data.data.map((item, idx) => (
                            <tr key={idx} className={idx % 2 === 0 ? '' : 'alt-row'}>
                              <td>{item.equipment_name || '-'}</td>
                              <td><span className="type-badge">{item.type || '-'}</span></td>
                              <td>{typeof item.flowrate === 'number' ? item.flowrate.toFixed(2) : '-'}</td>
                              <td>{typeof item.pressure === 'number' ? item.pressure.toFixed(2) : '-'}</td>
                              <td>{typeof item.temperature === 'number' ? item.temperature.toFixed(2) : '-'}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </>
            )}

            {!data && !loading && (
              <div className="empty-state">
                <div className="empty-icon">📁</div>
                <h2 className="empty-title">No Data Yet</h2>
                <p className="empty-subtitle">Upload a CSV file to get started with your chemical equipment analysis</p>
              </div>
            )}
          </>
        ) : (
          <div className="history-section">
            <h2 className="section-title">Upload History</h2>
            {uploadHistory.length > 0 ? (
              <div className="history-grid">
                {uploadHistory.map((item) => (
                  <div key={item.id} className="history-card">
                    <div className="history-icon">📄</div>
                    <div className="history-content">
                      <h4 className="history-filename">{item.filename}</h4>
                      <p className="history-meta">{item.total_items} equipment items</p>
                      <p className="history-time">{item.timestamp}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <div className="empty-icon">📁</div>
                <h2 className="empty-title">No History</h2>
                <p className="empty-subtitle">Your upload history will appear here</p>
              </div>
            )}
          </div>
        )}
      </main>

      <div className="toast-container">
        {toasts.map(toast => (
          <div key={toast.id} className={`toast toast-${toast.type}`}>
            <div className="toast-content">
              {toast.type === 'success' && <CheckCircleIcon className="toast-icon" />}
              {toast.type === 'error' && <ExclamationTriangleIcon className="toast-icon" />}
              <span>{toast.message}</span>
            </div>
            <button
              className="toast-close"
              onClick={() => setToasts(prev => prev.filter(t => t.id !== toast.id))}
            >
              <XMarkIcon className="close-icon" />
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

export default App

