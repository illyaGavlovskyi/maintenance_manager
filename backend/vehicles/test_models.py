import pytest
from django.contrib.auth.models import User

from vehicles.models import Vehicle

@pytest.mark.django_db
def test_vehicle_creation():
    user = User.objects.create_user(
        username='testuser',
        password='testpassword'
    )

    vehicle = Vehicle.objects.create(
        user = user,
        make = "Toyota", 
        model = "Camry", 
        year = 2022
    )

    assert vehicle.make == "Toyota"
    assert vehicle.model == "Camry"
    assert vehicle.year == 2022
    assert vehicle.user == user 