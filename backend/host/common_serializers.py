from rest_framework import serializers
from homestays.models import Province, District, Commune, Amenity, HomestayImage

class ProvinceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Province
        fields = ['id', 'name']

class DistrictSerializer(serializers.ModelSerializer):
    class Meta:
        model = District
        fields = ['id', 'name']

class CommuneSerializer(serializers.ModelSerializer):
    class Meta:
        model = Commune
        fields = ['id', 'name']

class AmenitySerializer(serializers.ModelSerializer):
    class Meta:
        model = Amenity
        fields = ['id', 'name', 'icon']

class HomestayImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = HomestayImage
        fields = ['id', 'image']