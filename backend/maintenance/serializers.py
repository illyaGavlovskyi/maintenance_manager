from rest_framework import serializers
from .models import MaintenanceRecord

class MaintenanceRecordSerializer(serializers.ModelSerializer):
    class Meta:
        model = MaintenanceRecord
        fields = '__all__'