from django.db import models
from users.models import User
from homestays.models import Homestay
from decimal import Decimal

class Booking(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    homestay = models.ForeignKey(Homestay, on_delete=models.CASCADE)
    checkin_date = models.DateField()
    checkout_date = models.DateField()
    guests = models.IntegerField()
    status = models.CharField(max_length=20, choices=[('pending', 'Pending'), ('confirmed', 'Confirmed'), ('cancelled', 'Cancelled')])
    currency = models.CharField(max_length=10)
    subtotal = models.DecimalField(max_digits=10, decimal_places=2)
    fee = models.DecimalField(max_digits=10, decimal_places=2)
    total_amount = models.DecimalField(max_digits=10, decimal_places=2)
    note = models.TextField(blank=True, null=True)

    def __str__(self):
        return f"Booking {self.id} - {self.user.username}"
      
    def calculate_booking_price(homestay, checkin_date, checkout_date):
        num_nights = (checkout_date - checkin_date).days
        subtotal = num_nights * homestay.base_price
        fee = (subtotal * Decimal("0.1")).quantize(Decimal("0.01"))
        total_amount = subtotal + fee
        return subtotal, fee, total_amount

class BookingLine(models.Model):
    booking = models.ForeignKey(Booking, on_delete=models.CASCADE, related_name='booking_lines')
    type = models.CharField(max_length=50)
    single_amount = models.DecimalField(max_digits=10, decimal_places=2)
    quantity = models.IntegerField()
    sub_amount = models.DecimalField(max_digits=10, decimal_places=2)

    def __str__(self):
        return f"Line {self.id} - Booking {self.booking.id}"

class HomestayAvailability(models.Model):
    homestay = models.ForeignKey(Homestay, on_delete=models.CASCADE)
    date = models.DateField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.CharField(max_length=20, choices=[('available', 'Available'), ('booked', 'Booked')])
    booking = models.ForeignKey(Booking, on_delete=models.SET_NULL, null=True, blank=True)

    def __str__(self):
        return f"Availability {self.date} - {self.homestay.name}"
