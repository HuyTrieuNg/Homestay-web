from django.urls import path
from .views import *
urlpatterns = [
    # path('homestays/', HomestayListCreateAPIView.as_view(), name='homestay-list-create'),
    # path('homestays/<int:pk>/', HomestayRetrieveUpdateDestroyAPIView.as_view(), name='homestay-detail'),

    path("homestays/", HomestayListView.as_view(), name="homestay-list"),  # GET list, POST create
    path("homestays/<int:pk>/", HomestayDetailView.as_view(), name="homestay-detail"),  # GET, PATCH, DELETE

    path('bookings/', HostBookingListView.as_view(), name='bookings'),
    path('bookings/<int:booking_id>/', HostBookingView.as_view(), name='booking-detail'),
    path('bookings/<int:booking_id>/process/', BookingProcessing.as_view(), name='booking-processing'),
    path('bookings/<int:booking_id>/lines/', BookingLineListView.as_view(), name='booking-lines'),

    path('availability/<int:pk>/', HomestayAvailabilityViews.as_view(), name='availability'),   
]