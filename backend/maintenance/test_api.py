import pytest
from django.contrib.auth.models import User
from rest_framework.test import APIClient

from vehicles.models import Vehicle
from .models import MaintenanceRecord

@pytest.mark.django_db
def test_create_maintenance_record():
    user = User.objects.create_user(
        username='testuser',
        password='testpassword'
    )

    vehicle = Vehicle.objects.create(
        user=user,
        make='Toyota',
        model='Camry',
        year=2022
    )

    client = APIClient()
    client.force_authenticate(user=user)

    response = client.post(
        '/maintenance/',
        {
            'vehicle': vehicle.id,
            'service_type': 'Oil Change',
            'date': '2026-09-01',
            'mileage': 30000,
            'cost': '79.99',
            'notes': 'Synthetic oil'
        },
        format='json'
    )

    assert response.status_code == 201
    assert MaintenanceRecord.objects.count() == 1

@pytest.mark.django_db
def test_user_cannot_add_maintenance_to_another_users_vehicle():
    user1 = User.objects.create_user(
        username='user1',
        password='testpassword'
    )

    user2 = User.objects.create_user(
        username='user2',
        password='testpassword'
    )

    vehicle = Vehicle.objects.create(
        user=user2,
        make='Honda',
        model='Civic',
        year=2023
    )

    client = APIClient()
    client.force_authenticate(user=user1)

    response = client.post(
        '/maintenance/',
        {
            'vehicle': vehicle.id,
            'service_type': 'Oil Change',
            'date': '2026-09-01',
            'mileage': 25000,
            'cost': '69.99',
            'notes': 'Attempted unauthorized record'
        },
        format='json'
    )

    assert response.status_code == 400
    assert MaintenanceRecord.objects.count() == 0

@pytest.mark.django_db
def test_user_only_sees_their_own_maintenance_records():
    user1 = User.objects.create_user(
        username='user1',
        password='testpassword'
    )

    user2 = User.objects.create_user(
        username='user2',
        password='testpassword'
    )

    vehicle1 = Vehicle.objects.create(
        user=user1,
        make='Toyota',
        model='Camry',
        year=2022
    )

    vehicle2 = Vehicle.objects.create(
        user=user2,
        make='Honda',
        model='Civic',
        year=2023
    )

    MaintenanceRecord.objects.create(
        vehicle=vehicle1,
        service_type='Oil Change',
        date='2026-09-01',
        mileage=30000,
        cost='79.99'
    )

    MaintenanceRecord.objects.create(
        vehicle=vehicle2,
        service_type='Tire Rotation',
        date='2026-09-02',
        mileage=20000,
        cost='49.99'
    )

    client = APIClient()
    client.force_authenticate(user=user1)

    response = client.get('/maintenance/')

    assert response.status_code == 200
    assert len(response.data['maintenance_records']) == 1
    assert response.data['maintenance_records'][0]['service_type'] == 'Oil Change'

@pytest.mark.django_db
def test_delete_own_vehicle():
    user = User.objects.create_user(
        username='testuser',
        password='testpassword'
    )

    vehicle = Vehicle.objects.create(
        user=user,
        make='Toyota',
        model='Camry',
        year=2022
    )

    client = APIClient()
    client.force_authenticate(user=user)

    response = client.delete(
        f'/vehicles/{vehicle.id}/'
    )

    assert response.status_code == 204
    assert Vehicle.objects.count() == 0

@pytest.mark.django_db
def test_update_own_vehicle():
    user = User.objects.create_user(
        username='testuser',
        password='testpassword'
    )

    vehicle = Vehicle.objects.create(
        user=user,
        make='Toyota',
        model='Camry',
        year=2022
    )

    client = APIClient()
    client.force_authenticate(user=user)

    response = client.put(
        f'/vehicles/{vehicle.id}/',
        {
            'make': 'Toyota',
            'model': 'Corolla',
            'year': 2024
        },
        format='json'
    )

    assert response.status_code == 200

    vehicle.refresh_from_db()

    assert vehicle.model == 'Corolla'
    assert vehicle.year == 2024

@pytest.mark.django_db
def test_user_cannot_update_another_users_vehicle():
    user1 = User.objects.create_user(
        username='user1',
        password='testpassword'
    )

    user2 = User.objects.create_user(
        username='user2',
        password='testpassword'
    )

    vehicle = Vehicle.objects.create(
        user=user2,
        make='Honda',
        model='Civic',
        year=2023
    )

    client = APIClient()
    client.force_authenticate(user=user1)

    response = client.put(
        f'/vehicles/{vehicle.id}/',
        {
            'make': 'Honda',
            'model': 'Accord',
            'year': 2024
        },
        format='json'
    )

    assert response.status_code == 404

    vehicle.refresh_from_db()

    assert vehicle.model == 'Civic'
    assert vehicle.year == 2023