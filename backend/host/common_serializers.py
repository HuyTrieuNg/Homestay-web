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
    district_id = serializers.IntegerField(source="district.id", read_only=True)
    province_id = serializers.IntegerField(source="district.province.id", read_only=True)

    class Meta:
        model = Commune
        fields = ["id", "name", "district_id", "province_id"]  # THÊM district_id, province_id


class AmenitySerializer(serializers.ModelSerializer):
    class Meta:
        model = Amenity
        fields = ['id', 'name']

# class HomestayImageSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = HomestayImage
#         fields = ['id', 'image']