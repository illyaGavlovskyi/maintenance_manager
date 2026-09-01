from .models import Vehicle
from .serializers import VehicleSerializer

from rest_framework.decorators import api_view
from rest_framework.response import Response

@api_view(['GET', 'POST'])
def vehicle_list(request):

    if request.method == 'GET':
        vehicles = Vehicle.objects.all()
        serializer = VehicleSerializer(vehicles, many=True)

        return Response({
            "vehicles": serializer.data
        })

    if request.method == 'POST':
        serializer = VehicleSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(
                serializer.data,
                status = 201)

        return Response(
            serializer.errors,
            status = 400
        )

@api_view(['GET', 'PUT', 'DELETE'])
def vehicle_detail(request, id):
    try:
        vehicle = Vehicle.objects.get(id=id)
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