import sys
import requests
from PyQt5.QtWidgets import (
    QApplication, QWidget, QVBoxLayout, QPushButton, QFileDialog,
    QLabel, QTextEdit, QMessageBox, QProgressBar, QHBoxLayout
)
from PyQt5.QtCore import Qt, QThread, pyqtSignal
from PyQt5.QtGui import QFont
import json

API_BASE_URL = 'http://127.0.0.1:8000/api'

class UploadThread(QThread):
    progress_signal = pyqtSignal(str)
    data_signal = pyqtSignal(dict)
    error_signal = pyqtSignal(str)
    finished_signal = pyqtSignal()

    def __init__(self, file_path):
        super().__init__()
        self.file_path = file_path

    def run(self):
        try:
            self.progress_signal.emit("Uploading file...")
            with open(self.file_path, 'rb') as f:
                files = {'file': f}
                res = requests.post(
                    f'{API_BASE_URL}/upload/',
                    files=files,
                    timeout=30
                )
            
            if res.status_code in [200, 201]:
                data = res.json()
                self.data_signal.emit(data)
                self.progress_signal.emit("File uploaded successfully!")
            else:
                self.error_signal.emit(f"Server error: {res.status_code}")
        
        except requests.exceptions.ConnectionError:
            self.error_signal.emit("Cannot connect to server. Make sure Django is running at http://127.0.0.1:8000")
        except Exception as e:
            self.error_signal.emit(f"Error: {str(e)}")
        finally:
            self.finished_signal.emit()

class ChemicalVisualizerApp(QWidget):
    def __init__(self):
        super().__init__()
        self.data = None
        self.upload_thread = None
        self.init_ui()

    def init_ui(self):
        self.setWindowTitle('Chemical Equipment Visualizer - Desktop')
        self.setGeometry(100, 100, 800, 600)
        self.setStyleSheet("background-color: #f5f5f5;")
        
        layout = QVBoxLayout()
        
        # Title
        title = QLabel('Chemical Equipment Parameter Visualizer')
        title_font = QFont()
        title_font.setPointSize(14)
        title_font.setBold(True)
        title.setFont(title_font)
        layout.addWidget(title)
        
        # Upload button
        upload_btn = QPushButton('📁 Upload CSV File')
        upload_btn.clicked.connect(self.upload_file)
        upload_btn.setStyleSheet("""
            QPushButton {
                padding: 12px;
                font-size: 12px;
                background-color: #4CAF50;
                color: white;
                border: none;
                border-radius: 5px;
                font-weight: bold;
            }
            QPushButton:hover {
                background-color: #45a049;
            }
        """)
        upload_btn.setFixedHeight(40)
        layout.addWidget(upload_btn)
        
        # Progress bar
        self.progress_bar = QProgressBar()
        self.progress_bar.setVisible(False)
        self.progress_bar.setStyleSheet("""
            QProgressBar {
                border: 2px solid grey;
                border-radius: 5px;
                text-align: center;
            }
            QProgressBar::chunk {
                background-color: #4CAF50;
            }
        """)
        layout.addWidget(self.progress_bar)
        
        # Status label
        self.status_label = QLabel('Ready')
        self.status_label.setStyleSheet("color: #666; margin: 10px 0; font-weight: bold;")
        layout.addWidget(self.status_label)
        
        # Info text
        self.info_text = QTextEdit()
        self.info_text.setReadOnly(True)
        self.info_text.setStyleSheet("""
            QTextEdit {
                border: 1px solid #ddd;
                border-radius: 5px;
                padding: 10px;
                background-color: white;
                font-family: Consolas, Monospace;
            }
        """)
        layout.addWidget(QLabel("📊 Data Summary:"))
        layout.addWidget(self.info_text)
        
        self.setLayout(layout)

    def upload_file(self):
        file_path, _ = QFileDialog.getOpenFileName(
            self,
            'Open CSV File',
            'd:\\Chemical-Visualizer',
            'CSV Files (*.csv);;All Files (*)'
        )
        
        if file_path:
            self.progress_bar.setVisible(True)
            self.progress_bar.setValue(0)
            self.upload_thread = UploadThread(file_path)
            self.upload_thread.progress_signal.connect(self.update_status)
            self.upload_thread.data_signal.connect(self.display_data)
            self.upload_thread.error_signal.connect(self.show_error)
            self.upload_thread.finished_signal.connect(self.on_upload_finished)
            self.upload_thread.start()

    def update_status(self, message):
        self.status_label.setText(message)
        self.status_label.setStyleSheet("color: #4CAF50; margin: 10px 0; font-weight: bold;")
        self.progress_bar.setValue(50)

    def display_data(self, data):
        self.data = data
        
        # Display summary info
        info = f"""📈 ANALYSIS RESULTS
{'─' * 50}

Total Items: {data['total_items']}
Average Flowrate: {data['avg_flowrate']:.2f}
Average Pressure: {data['avg_pressure']:.2f}
Average Temperature: {data['avg_temperature']:.2f}

{'─' * 50}
EQUIPMENT DISTRIBUTION:
"""
        # Sort by count descending
        sorted_types = sorted(data['type_distribution'].items(), key=lambda x: x[1], reverse=True)
        for eq_type, count in sorted_types:
            bar = '█' * count
            info += f"\n{eq_type:.<20} {count:>3} {bar}"
        
        self.info_text.setText(info)

    def show_error(self, error_message):
        self.status_label.setText("Error during upload")
        self.status_label.setStyleSheet("color: red; margin: 10px 0; font-weight: bold;")
        self.info_text.setText(f"❌ Error: {error_message}")
        QMessageBox.critical(self, "Upload Failed", error_message)

    def on_upload_finished(self):
        self.progress_bar.setVisible(False)
        if self.data:
            self.progress_bar.setValue(100)


def main():
    app = QApplication(sys.argv)
    window = ChemicalVisualizerApp()
    window.show()
    sys.exit(app.exec_())


if __name__ == '__main__':
    main()

