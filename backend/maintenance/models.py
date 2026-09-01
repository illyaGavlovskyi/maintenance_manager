from django.db import models
from vehicles.models import Vehicle

# Create your models here.
class MaintenanceRecord(models.Model):
    vehicle = models.ForeignKey(
        Vehicle,
        on_delete=models.CASCADE
    )
    service_type = models.CharField(max_length=100)
    date = models.DateField()
    mileage = models.PositiveIntegerField()
    cost = cost = models.DecimalField(max_digits=10, decimal_places=2)
    notes = models.TextField(blank=True)