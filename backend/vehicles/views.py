from .models import Vehicle
from .serializers import VehicleSerializer

from rest_framework.decorators import api_view
from rest_framework.response import Response

from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import permission_classes

@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def vehicle_list(request):

    if request.method == 'GET':
        vehicles = Vehicle.objects.filter(user=request.user)
        serializer = VehicleSerializer(vehicles, many=True)

        return Response({
            "vehicles": serializer.data
        })

    if request.method == 'POST':
        serializer = VehicleSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user=request.user)
            return Response(
                serializer.data,
                status = 201)

        return Response(
            serializer.errors,
            status = 400
        )

@api_view(['GET', 'PUT', 'DELETE'])
@permission_classes([IsAuthenticated])
def vehicle_detail(request, id):
    try:
        vehicle = Vehicle.objects.get(
            id=id,
            user = request.user
        )
    except Vehicle.DoesNotExist:
        return Response(
            {"error": "Vehicle not found"},
            status=404
        )
    if request.method == 'PUT':
        serializer = VehicleSerializer(
            vehicle,
            data=request.data
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
        vehicle.delete()
        return Response(
            {"message": "Vehicle deleted"},
            status=204
        )
    
    serializer = VehicleSerializer(vehicle)
    return Response(serializer.data)