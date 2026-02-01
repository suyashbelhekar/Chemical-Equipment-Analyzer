from django.urls import path
from .views import upload_csv, dataset_list

urlpatterns = [
    path('upload/', upload_csv, name='upload-csv'),
    path('datasets/', dataset_list, name='dataset-list'),
]
