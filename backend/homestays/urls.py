from django.urls import path
from .views import HomestayListView, PropertyTypeListView, AmenitiesListView

urlpatterns = [
    path('', HomestayListView.as_view(), name='get_homestays'),
    path('property-types', PropertyTypeListView.as_view(), name='get_property_types'),
    path('amenities', AmenitiesListView.as_view(), name='get_amenities'),
]
