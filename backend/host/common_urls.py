from django.urls import path
from .common_views import (
    HomestayTypeListAPIView,
    ProvinceListAPIView,
    DistrictListAPIView,
    CommuneListAPIView,
    AmenityListAPIView
)

urlpatterns = [
    path('homestay-types/', HomestayTypeListAPIView.as_view(), name='homestay-types'),
    path('provinces/', ProvinceListAPIView.as_view(), name='provinces'),
    path('districts/', DistrictListAPIView.as_view(), name='districts'),
    path('communes/', CommuneListAPIView.as_view(), name='communes'),
    path('amenities/', AmenityListAPIView.as_view(), name='amenities'),
]
