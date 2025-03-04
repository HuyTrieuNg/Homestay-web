from django.db import models
from users.models import User
class Province(models.Model):
    name = models.CharField(max_length=255)

    def __str__(self):
        return self.name



class District(models.Model):
    name = models.CharField(max_length=255)
    province = models.ForeignKey(Province, on_delete=models.CASCADE, default=1)

    def __str__(self):
        return self.name


class Commune(models.Model):
    name = models.CharField(max_length=255)
    district = models.ForeignKey(District, on_delete=models.CASCADE, default=1)

    def __str__(self):
        return self.name


class Homestay(models.Model):
    HOMESTAY_TYPES = [
        ("villa", "Villa"),
        ("apartment", "Căn hộ"),
        ("hotel", "Khách sạn"),
        ("resort", "Resort"),
        ("homestay", "Homestay"),
    ]
    # host_id = models.IntegerField()
    host = models.ForeignKey(User, on_delete=models.CASCADE, related_name="homestays", default=1)  # Liên kết với User
    name = models.CharField(max_length=255)
    description = models.TextField()
    # type = models.CharField(max_length=50)
    type = models.CharField(max_length=50, choices=HOMESTAY_TYPES, default="homestay")
    base_price = models.DecimalField(max_digits=10, decimal_places=2)
    address = models.CharField(max_length=255)
    longitude = models.FloatField()
    latitude = models.FloatField()
    commune = models.ForeignKey(Commune, on_delete=models.SET_NULL, null=True)
    max_guests = models.IntegerField()

    def __str__(self):
        return self.name
    
    @property
    def district(self):
        return self.commune.district

    @property
    def province(self):
        return self.commune.district.province

class Amenity(models.Model):
    name = models.CharField(max_length=255)
    icon = models.CharField(max_length=255)

    def __str__(self):
        return self.name

class HomestayAmenity(models.Model):
    homestay = models.ForeignKey(Homestay, on_delete=models.CASCADE)
    amenity = models.ForeignKey(Amenity, on_delete=models.CASCADE)

    class Meta:
        unique_together = ('homestay', 'amenity')

class HomestayImage(models.Model):
    homestay = models.ForeignKey(Homestay, on_delete=models.CASCADE, related_name="images")
    image = models.ImageField(upload_to="homestays/images")

    def __str__(self):
        return f"Image for {self.homestay.name}"

class HomestayAvailability(models.Model):
    homestay = models.ForeignKey(Homestay, on_delete=models.CASCADE)
    date = models.DateField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.CharField(max_length=50)
    booking_id = models.IntegerField(null=True, blank=True)  # Thay thế bằng ForeignKey nếu có model Booking

    def __str__(self):
        return f"{self.homestay.name} - {self.date}"