from rest_framework import serializers
from .models import *
             
class ProvinceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Province
        fields = '__all__'

class DistrictSerializer(serializers.ModelSerializer):
    class Meta:
        model = District
        fields = '__all__'

class CommuneSerializer(serializers.ModelSerializer):
    class Meta:
        model = Commune
        fields = '__all__'
        
class AmenitySerializer(serializers.ModelSerializer):
    class Meta:
        model = Amenity
        fields = '__all__'
        
class PropertyTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = PropertyType
        fields = '__all__'

class HomestaySerializer(serializers.ModelSerializer):
    images = serializers.SerializerMethodField()
    amenities = AmenitySerializer(many=True)
    rating = serializers.FloatField(read_only=True)
    review_count = serializers.IntegerField(read_only=True)

    class Meta:
        model = Homestay
        fields = '__all__'

    def get_images(self, obj):
        print("Hàm get_images được gọi!")
        request = self.context.get("request")
        if request:
            return [request.build_absolute_uri(img.image.url) for img in obj.images.all()]
        return [img.image.url for img in obj.images.all()]
    
class HomestayDetailSerializer(serializers.ModelSerializer):
    images = serializers.SerializerMethodField()
    amenities = AmenitySerializer(many=True)
    type = PropertyTypeSerializer()
    commune = CommuneSerializer()
    district = DistrictSerializer()
    province = ProvinceSerializer()
    rating = serializers.FloatField(read_only=True)
    review_count = serializers.IntegerField(read_only=True)

    class Meta:
        model = Homestay
        fields = '__all__'

    def get_images(self, obj):
        print("Hàm get_images được gọi!")
        request = self.context.get("request")
        if request:
            return [request.build_absolute_uri(img.image.url) for img in obj.images.all()]
        return [img.image.url for img in obj.images.all()]
    
class HomestayListSerializer(serializers.ModelSerializer):
    images = serializers.SerializerMethodField()
    property_type = PropertyTypeSerializer()
    commune = CommuneSerializer()
    district = DistrictSerializer()
    province = ProvinceSerializer()
    rating = serializers.FloatField(read_only=True)
    review_count = serializers.IntegerField(read_only=True)

    class Meta:
        model = Homestay
        fields = ["id", "name", "base_price", "address", "images", 
                  "type", "commune", "district", "province", 
                  "rating", "review_count"]

    def get_images(self, obj):
        request = self.context.get("request")
        if request:
            return [request.build_absolute_uri(img.image.url) for img in obj.images.all()]
        return [img.image.url for img in obj.images.all()]
      
class PropertitypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = PropertyType
        fields = '__all__'