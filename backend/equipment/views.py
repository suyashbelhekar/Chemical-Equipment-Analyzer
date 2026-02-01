import pandas as pd
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import Dataset

@api_view(['POST'])
def upload_csv(request):
    """
    Handle CSV file upload and return statistical analysis
    """
    if 'file' not in request.FILES:
        return Response({'error': 'No file provided'}, status=status.HTTP_400_BAD_REQUEST)
    
    file = request.FILES['file']
    
    try:
        df = pd.read_csv(file)
        
        # Validate required columns
        required_columns = ['Type', 'Flowrate', 'Pressure', 'Temperature']
        if not all(col in df.columns for col in required_columns):
            return Response(
                {'error': 'CSV must contain: Type, Flowrate, Pressure, Temperature columns'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Calculate statistics
        summary = {
            'total_items': len(df),
            'avg_flowrate': float(df['Flowrate'].mean()),
            'avg_pressure': float(df['Pressure'].mean()),
            'avg_temperature': float(df['Temperature'].mean()),
            'type_distribution': df['Type'].value_counts().to_dict()
        }
        
        # Save to database
        Dataset.objects.create(
            total_items=summary['total_items'],
            avg_flowrate=summary['avg_flowrate'],
            avg_pressure=summary['avg_pressure'],
            avg_temperature=summary['avg_temperature']
        )
        
        # Keep only last 5 datasets
        if Dataset.objects.count() > 5:
            oldest = Dataset.objects.order_by('uploaded_at').first()
            oldest.delete()
        
        return Response(summary, status=status.HTTP_201_CREATED)
    
    except pd.errors.ParserError:
        return Response({'error': 'Invalid CSV file'}, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
def dataset_list(request):
    """
    Get list of all uploaded datasets
    """
    datasets = Dataset.objects.all()
    data = [{
        'id': d.id,
        'uploaded_at': d.uploaded_at,
        'total_items': d.total_items,
        'avg_flowrate': d.avg_flowrate,
        'avg_pressure': d.avg_pressure,
        'avg_temperature': d.avg_temperature
    } for d in datasets]
    return Response(data, status=status.HTTP_200_OK)

