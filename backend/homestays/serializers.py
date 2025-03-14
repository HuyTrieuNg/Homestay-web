from rest_framework import serializers
from .models import Homestay, PropertyType, Amenity

class AmenitySerializer(serializers.ModelSerializer):
    class Meta:
        model = Amenity
        fields = '__all__'

        
class HomestaySerializer(serializers.ModelSerializer):
    images = serializers.SerializerMethodField()
    amenities = AmenitySerializer(many=True)

    class Meta:
        model = Homestay
        fields = "__all__"

    def get_images(self, obj):
        request = self.context.get("request")
        if request:
            return [request.build_absolute_uri(img.image.url) for img in obj.images.all()]
        return [img.image.url for img in obj.images.all()]
    
class HomestayListSerializer(serializers.ModelSerializer):
    images = serializers.SerializerMethodField()

    class Meta:
        model = Homestay
        fields = ["id", "name", "base_price", "address", "images"]

    def get_images(self, obj):
        request = self.context.get("request")
        if request:
            return [request.build_absolute_uri(img.image.url) for img in obj.images.all()]
        return [img.image.url for img in obj.images.all()]
      
class PropertitypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = PropertyType
        fields = '__all__'
             


