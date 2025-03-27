from django.urls import path
from .views import *
urlpatterns = [
    path('homestays/', HomestayListCreateAPIView.as_view(), name='homestay-list-create'),
    path('homestays/<int:pk>/', HomestayRetrieveUpdateDestroyAPIView.as_view(), name='homestay-detail'),
    path('bookings/', HostBookingListView.as_view(), name='bookings'),
    path('bookings/<int:booking_id>/', BookingProcessing.as_view(), name='booking-processing'),
    path('bookings/<int:booking_id>/lines/', BookingLineListView.as_view(), name='booking-lines'), 
]