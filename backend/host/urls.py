from django.urls import path
from .views import *


urlpatterns = [
    path('homestays/', HomestayListCreateAPIView.as_view(), name='homestay-list-create'),
    path('homestays/<int:pk>/', HomestayRetrieveUpdateDestroyAPIView.as_view(), name='homestay-detail'),
]