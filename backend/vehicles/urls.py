from django.urls import path
from . import views

urlpatterns = [
    path('', views.vehicle_list, name='vehicle-list'),
    path('<int:id>/', views.vehicle_detail, name='vehicle-detail'),
]