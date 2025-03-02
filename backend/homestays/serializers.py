from rest_framework import serializers
from .models import Homestay, PropertyType, Amenity

class HomestaySerializer(serializers.ModelSerializer):
    images = serializers.SerializerMethodField()

    class Meta:
        model = Homestay
        fields = ["id", "name", "base_price", "address", "images"]

    def get_images(self, obj):
        return [img.image.url for img in obj.images.all()]

        
class PropertitypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = PropertyType
        fields = '__all__'
        
class AmenitySerializer(serializers.ModelSerializer):
    class Meta:
        model = Amenity
        fields = '__all__'