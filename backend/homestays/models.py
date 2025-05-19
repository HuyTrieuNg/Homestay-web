from django.db import models
from users.models import User
from cloudinary.models import CloudinaryField


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
    district = models.ForeignKey(District, on_delete=models.CASCADE, related_name="communes")

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
    # host_id = models.IntegerField()
    host = models.ForeignKey(User, on_delete=models.CASCADE, related_name="homestays", default=1)
    name = models.CharField(max_length=255)
    description = models.TextField()
    type = models.ForeignKey(PropertyType, on_delete=models.SET_NULL, null=True, related_name="homestays")
    base_price = models.DecimalField(max_digits=10, decimal_places=2)
    address = models.CharField(max_length=255)
    longitude = models.FloatField()
    latitude = models.FloatField()
    max_guests = models.IntegerField()
    
    commune = models.ForeignKey(Commune, on_delete=models.SET_NULL, null=True)
    # district = models.ForeignKey(District, on_delete=models.SET_NULL, null=True, related_name="homestays")
    # province = models.ForeignKey(Province, on_delete=models.SET_NULL, null=True, related_name="homestays")
    amenities = models.ManyToManyField(Amenity, blank=True, related_name="homestays")

    def __str__(self):
        return self.name
      
    @property
    def district(self):
        return self.commune.district

    @property
    def province(self):
        return self.commune.district.province

class HomestayImage(models.Model):
    homestay = models.ForeignKey(Homestay, on_delete=models.CASCADE, related_name="images")
    # image = models.ImageField(upload_to="homestays/images")
    image = CloudinaryField('image') 
    def __str__(self):
        return f"Image for {self.homestay.name}"