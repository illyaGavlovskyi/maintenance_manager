from django.db import models
from django.contrib.auth.models import User

# Create your models here.
class Vehicle(models.Model):
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE
    )
    make = models.CharField(max_length=100)
    model = models.CharField(max_length=100)
    year = models.PositiveIntegerField()

    def __str__(self):
        return f"{self.make} {self.model} {self.year}"