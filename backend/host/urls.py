from django.urls import path
from .views import *

urlpatterns = [
    path('homestays/', HomestayListCreateView.as_view(), name='homestay-list-create'),
    path('homestays/<int:pk>/', HomestayDetailView.as_view(), name='homestay-detail'),
    path('homestays/<int:homestay_id>/availability/', AvailabilityListCreateView.as_view(), name='availability-list-create'),
    path('homestays/<int:homestay_id>/availability/<int:pk>/', AvailabilityDetailView.as_view(), name='availability-detail'),
]
