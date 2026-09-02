from rest_framework import serializers
from .models import MaintenanceRecord

class MaintenanceRecordSerializer(serializers.ModelSerializer):
    class Meta:
        model = MaintenanceRecord
        fields = '__all__'

    def validate_vehicle(self, vehicle):
        request = self.context.get('request')

        if vehicle.user != request.user:
            raise serializers.ValidationError("You do not have permission to add a maintenance record for this vehicle.")

        return vehicle