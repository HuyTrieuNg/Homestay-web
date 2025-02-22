from django.db import models

class Province(models.Model):
    name = models.CharField(max_length=255)

    def __str__(self):
        return self.name

class City(models.Model):
    name = models.CharField(max_length=255)
    province = models.ForeignKey(Province, on_delete=models.CASCADE)

    def __str__(self):
        return self.name

class District(models.Model):
    name = models.CharField(max_length=255)
    city = models.ForeignKey(City, on_delete=models.CASCADE)

    def __str__(self):
        return self.name

class Ward(models.Model):
    name = models.CharField(max_length=255)
    district = models.ForeignKey(District, on_delete=models.CASCADE)

    def __str__(self):
        return self.name

class Homestay(models.Model):
    host_id = models.IntegerField()
    name = models.CharField(max_length=255)
    description = models.TextField()
    type = models.CharField(max_length=50)
    images = models.ImageField()
    base_price = models.DecimalField(max_digits=10, decimal_places=2)
    address = models.CharField(max_length=255)
    longitude = models.FloatField()
    latitude = models.FloatField()
    geometry = models.TextField(null=True, blank=True)
    ward = models.ForeignKey(Ward, on_delete=models.SET_NULL, null=True)
    district = models.ForeignKey(District, on_delete=models.SET_NULL, null=True)
    city = models.ForeignKey(City, on_delete=models.SET_NULL, null=True)
    province = models.ForeignKey(Province, on_delete=models.SET_NULL, null=True)
    max_guests = models.IntegerField()

    def __str__(self):
        return self.name

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

class HomestayAvailability(models.Model):
    homestay = models.ForeignKey(Homestay, on_delete=models.CASCADE)
    date = models.DateField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.CharField(max_length=50)
    booking_id = models.IntegerField(null=True, blank=True)  # Thay thế bằng ForeignKey nếu có model Booking

    def __str__(self):
        return f"{self.homestay.name} - {self.date}"