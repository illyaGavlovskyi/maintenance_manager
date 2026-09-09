import pytest
from django.contrib.auth.models import User
from rest_framework.test import APIClient

from vehicles.models import Vehicle

@pytest.mark.django_db
def test_create_vehicle_api():
    user = User.objects.create_user(
        username='testuser',
        password='testpassword'
    )

    client = APIClient()
    client.force_authenticate(user=user)

    response = client.post(
        '/vehicles/',
        {
            'make': 'Honda',
            'model': 'Civic',
            'year': 2022
        },
        format='json'
    )

    assert response.status_code == 201

    assert Vehicle.objects.count() == 1

    vehicle = Vehicle.objects.first()

    assert vehicle.make == 'Honda'
    assert vehicle.model == 'Civic'
    assert vehicle.year == 2022
    assert vehicle.user == user

@pytest.mark.django_db
def test_user_only_sees_their_own_vehicles():
    user1 = User.objects.create_user(
        username='user1',
        password='testpassword'
    )

    user2 = User.objects.create_user(
        username='user2',
        password='testpassword'
    )

    Vehicle.objects.create(
        user=user1,
        make='Toyota',
        model='Camry',
        year=2022
    )

    Vehicle.objects.create(
        user=user2,
        make='Honda',
        model='Civic',
        year=2023
    )

    client = APIClient()
    client.force_authenticate(user=user1)

    response = client.get('/vehicles/')

    assert response.status_code == 200
    assert len(response.data['vehicles']) == 1
    assert response.data['vehicles'][0]['make'] == 'Toyota'

@pytest.mark.django_db
def test_unauthenticated_user_cannot_view_vehicles():
    client = APIClient()

    response = client.get('/vehicles/')

    assert response.status_code in [401, 403]