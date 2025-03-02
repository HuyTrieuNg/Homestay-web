from django.db import models

class Province(models.Model):
    name = models.CharField(max_length=255)

    def __str__(self):
        return self.name

class City(models.Model):
    name = models.CharField(max_length=255)
    province = models.ForeignKey(Province, on_delete=models.CASCADE, related_name="cities")

    def __str__(self):
        return self.name

class District(models.Model):
    name = models.CharField(max_length=255)
    city = models.ForeignKey(City, on_delete=models.CASCADE, related_name="districts")

    def __str__(self):
        return self.name

class Ward(models.Model):
    name = models.CharField(max_length=255)
    district = models.ForeignKey(District, on_delete=models.CASCADE, related_name="wards")

    def __str__(self):
        return self.name
    
class PropertyType(models.Model):
    name = models.CharField(max_length=50, unique=True)

    def __str__(self):
        return self.name

class Amenity(models.Model):
    CATEGORY_CHOICES = [
        ('essentials', 'Essentials'),
        ('features', 'Features'),
        ('location', 'Location'),
        ('safety', 'Safety'),
    ]
    
    name = models.CharField(max_length=100, unique=True)
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES, default="essentials")

    def __str__(self):
        return self.name

class Homestay(models.Model):
    host_id = models.IntegerField()
    name = models.CharField(max_length=255)
    description = models.TextField()
    base_price = models.DecimalField(max_digits=10, decimal_places=2)
    address = models.CharField(max_length=255)
    longitude = models.FloatField()
    latitude = models.FloatField()
    geometry = models.TextField(null=True, blank=True)
    max_guests = models.IntegerField()
    
    type = models.ForeignKey(PropertyType, on_delete=models.SET_NULL, null=True, related_name="homestays")
    ward = models.ForeignKey(Ward, on_delete=models.SET_NULL, null=True, related_name="homestays")
    district = models.ForeignKey(District, on_delete=models.SET_NULL, null=True, related_name="homestays")
    city = models.ForeignKey(City, on_delete=models.SET_NULL, null=True, related_name="homestays")
    province = models.ForeignKey(Province, on_delete=models.SET_NULL, null=True, related_name="homestays")
    amenities = models.ManyToManyField(Amenity, blank=True, related_name="homestays")

    def __str__(self):
        return self.name
    
class HomestayImage(models.Model):
    homestay = models.ForeignKey(Homestay, on_delete=models.CASCADE, related_name="images")
    image = models.ImageField(upload_to="homestays/")

    def __str__(self):
        return f"Image for {self.homestay.name}"

class HomestayAvailability(models.Model):
    STATUS_CHOICES = [
        ('available', 'Available'),
        ('booked', 'Booked'),
        ('unavailable', 'Unavailable'),
    ]
    
    homestay = models.ForeignKey(Homestay, on_delete=models.CASCADE)
    date = models.DateField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.CharField(max_length=50, choices=STATUS_CHOICES, default="available")
    booking_id = models.IntegerField(null=True, blank=True)  # Thay thế bằng ForeignKey nếu có model Booking

    def __str__(self):
        return f"{self.homestay.name} - {self.date}"