from django.urls import path
from . import views

urlpatterns = [
    path('', views.vehcle_list, name='vehicle-list'),
]