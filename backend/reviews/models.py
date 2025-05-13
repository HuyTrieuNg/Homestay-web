from django.db import models
from booking.models import Booking
from users.models import User
from homestays.models import Homestay
from django.core.validators import MinValueValidator, MaxValueValidator

# Create your models here.
class Review(models.Model):
    # user = models.ForeignKey(User, on_delete=models.CASCADE)
    # homestay = models.ForeignKey(Homestay, on_delete=models.CASCADE, related_name='reviews')
    # booking = models.OneToOneField(Booking, on_delete=models.CASCADE)  # mỗi booking chỉ đánh giá 1 lần
    # rating = models.IntegerField()  # 1 đến 5 sao
    # comment = models.TextField(blank=True, null=True)
    # created_at = models.DateTimeField(auto_now_add=True)

    # def __str__(self):
    #     return f"{self.user.username} - {self.rating} - {self.homestay.name}"
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='reviews')
    homestay = models.ForeignKey(Homestay, on_delete=models.CASCADE, related_name='reviews')
    booking = models.OneToOneField(Booking, on_delete=models.CASCADE)
    overall_rating = models.IntegerField(
        validators=[MinValueValidator(1), MaxValueValidator(5)]
    )
    cleanliness_rating = models.IntegerField(
        validators=[MinValueValidator(1), MaxValueValidator(5)]
    )
    accuracy_rating = models.IntegerField(
        validators=[MinValueValidator(1), MaxValueValidator(5)]
    )
    checkin_rating = models.IntegerField(
        validators=[MinValueValidator(1), MaxValueValidator(5)]
    )
    communication_rating = models.IntegerField(
        validators=[MinValueValidator(1), MaxValueValidator(5)]
    )
    location_rating = models.IntegerField(
        validators=[MinValueValidator(1), MaxValueValidator(5)]
    )
    value_rating = models.IntegerField(
        validators=[MinValueValidator(1), MaxValueValidator(5)]
    )
    
    comment = models.TextField(blank=True, null=True)
    host_response = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.user.username} - {self.overall_rating} - {self.homestay.name}"