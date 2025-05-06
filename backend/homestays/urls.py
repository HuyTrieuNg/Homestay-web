from django.urls import path
from .views import *

urlpatterns = [
    path('', HomestayListView.as_view(), name='get_homestays'),
    path('<int:pk>', HomestayDetailView.as_view(), name='get_homestay_detail'),
    path('property-types', PropertyTypeListView.as_view(), name='get_property_types'),
    path('amenities', AmenitiesListView.as_view(), name='get_amenities'),
    path('communes', CommunesListView.as_view(), name='get_communes'),
    path('districts', DistrictsListView.as_view(), name='get_districts'),
    path('provinces', ProvincesListView.as_view(), name='get_provinces'),
    path('<int:pk>/maxGuests', MaxGuestView.as_view(), name='get_max_guests'),
    path('statistics/', HomestayStatisticsView.as_view(), name='homestay-statistics'),
]
