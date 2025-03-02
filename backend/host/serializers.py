from rest_framework import serializers
from homestays.models import Homestay, HomestayAmenity, Amenity

from homestays.models import HomestayAvailability
class AmenitySerializer(serializers.ModelSerializer):
    class Meta:
        model = Amenity
        fields = ['id', 'name', 'icon']

class HomestaySerializer(serializers.ModelSerializer):
    # Nhận danh sách các Amenity id để thêm cho homestay
    amenities = serializers.ListField(
        child=serializers.IntegerField(), write_only=True, required=False
    )
    # Trả về thông tin chi tiết các Amenity đã được gắn cho homestay
    amenity_details = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Homestay
        fields = [
            'id',
            'host',
            'name',
            'description',
            'type',
            'images',
            'base_price',
            'address',
            'longitude',
            'latitude',
            'geometry',
            'ward',
            'district',
            'city',
            'province',
            'max_guests',
            'amenities',         # Dữ liệu gửi vào (chỉ ghi)
            'amenity_details',   # Dữ liệu trả về (chỉ đọc)
        ]
        read_only_fields = ['id', 'host', 'amenity_details']

    def get_amenity_details(self, obj):
        # Lấy danh sách Amenity thông qua HomestayAmenity
        amenities = [ha.amenity for ha in obj.homestayamenity_set.all()]
        return AmenitySerializer(amenities, many=True).data

    def create(self, validated_data):
        # Lấy danh sách amenity id (nếu có)
        amenity_ids = validated_data.pop('amenities', [])
        # Gán host từ request (được gán trong view)
        homestay = Homestay.objects.create(**validated_data)
        for amenity_id in amenity_ids:
            HomestayAmenity.objects.create(homestay=homestay, amenity_id=amenity_id)
        return homestay

    def update(self, instance, validated_data):
        # Cho phép cập nhật các trường của homestay và danh sách amenity
        amenity_ids = validated_data.pop('amenities', None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        if amenity_ids is not None:
            # Xóa các amenity hiện có và thêm lại theo danh sách mới
            instance.homestayamenity_set.all().delete()
            for amenity_id in amenity_ids:
                HomestayAmenity.objects.create(homestay=instance, amenity_id=amenity_id)
        return instance




class HomestayAvailabilitySerializer(serializers.ModelSerializer):
    class Meta:
        model = HomestayAvailability
        fields = '__all__'
        read_only_fields = ['homestay']  # Chúng ta gán homestay từ view
