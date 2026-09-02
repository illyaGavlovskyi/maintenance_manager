from .models import MaintenanceRecord
from .serializers import MaintenanceRecordSerializer

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def maintenance_list(request):

    if request.method == 'GET':
        records = MaintenanceRecord.objects.filter(
            vehicle__user = request.user
        )
        serializer = MaintenanceRecordSerializer(records , many=True)

        return Response({
            "maintenance_records": serializer.data
        })

    if request.method == 'POST':
            serializer = MaintenanceRecordSerializer(
                data=request.data,
                context={'request': request}
            )
            if serializer.is_valid():
                serializer.save()
                return Response(
                    serializer.data,
                    status = 201
                )
    
            return Response(
                serializer.errors,
                status = 400
            )

@api_view(['GET', 'PUT', 'DELETE'])
@permission_classes([IsAuthenticated])
def maintenance_detail(request, id):
    try:
        record = MaintenanceRecord.objects.get(
            id=id,
            vehicle__user=request.user)
    except MaintenanceRecord.DoesNotExist:
        return Response(
            {"error": "Records not found"},
            status=404
        )
    if request.method == 'PUT':
        serializer = MaintenanceRecordSerializer(
            record,
            data=request.data,
            context={'request': request}
        )
        if serializer.is_valid():
            serializer.save()
            return Response(
                serializer.data,
                status = 200
            )
        return Response(
            serializer.errors,
            status=400
        )
    if request.method == 'DELETE':
        record.delete()
        return Response(status=204)
    
    serializer = MaintenanceRecordSerializer(record)
    return Response(serializer.data)