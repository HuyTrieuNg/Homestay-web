from django.urls import path
from .views import *

urlpatterns = [
    path('<int:pk>/availability', BookingAvailabilityView.as_view(), name='get_available_bookings'),
    path('<int:pk>/unavailable-dates', UnavailableDatesView.as_view(), name='get_available_bookings'),
    path('<int:pk>/prices', PricesView.as_view(), name='get_available_bookings'),
    # path('', BookingListView.as_view(), name='get_bookings'),
    # path('<int:pk>', BookingDetailView.as_view(), name='get_booking_detail'),
    # path('create', BookingCreateView.as_view(), name='create_booking'),
    # path('update/<int:pk>', BookingUpdateView.as_view(), name='update_booking'),
    # path('delete/<int:pk>', BookingDeleteView.as_view(), name='delete_booking'),
    # path('homestay/<int:pk>', BookingHomestayView.as_view(), name='get_homestay_bookings'),
    path('mybookings', UserBookingView.as_view(), name='get_user_bookings'),
    path('bookinghistory/<int:pk>', BookingDetailView.as_view(), name='get_booking_detail'),
]
