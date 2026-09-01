from django.urls import path
from . import views

urlpatterns = [
    path('', views.maintenance_list, name='maintenance-list'),
    path('<int:id>/', views.maintenance_detail, name='maintenance-detail'),
]