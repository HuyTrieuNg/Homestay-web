from django.urls import path
from .views import HomestayListView, PropertyTypeListView, AmenitiesListView, HomestayDetailView

urlpatterns = [
    path('', HomestayListView.as_view(), name='get_homestays'),
    path('<int:pk>', HomestayDetailView.as_view(), name='get_homestay_detail'),
    path('property-types', PropertyTypeListView.as_view(), name='get_property_types'),
    path('amenities', AmenitiesListView.as_view(), name='get_amenities'),
]
