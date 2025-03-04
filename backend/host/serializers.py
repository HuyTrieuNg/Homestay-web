from rest_framework import serializers
from homestays.models import Homestay, Amenity, HomestayAmenity
from .common_serializers import AmenitySerializer


class HomestaySerializer(serializers.ModelSerializer):
    # Lấy host tự động từ người dùng đang đăng nhập
    host = serializers.HiddenField(default=serializers.CurrentUserDefault())
    # Nhận danh sách ID của Amenity (chỉ dùng khi tạo/cập nhật)
    amenities = serializers.PrimaryKeyRelatedField(
        queryset=Amenity.objects.all(), many=True, write_only=True, required=False
    )
    # Trả về thông tin chi tiết của Amenity (read-only)
    amenity_details = serializers.SerializerMethodField(read_only=True)
    # Tính district và province từ commune (read-only)
    district = serializers.SerializerMethodField(read_only=True)
    province = serializers.SerializerMethodField(read_only=True)
    
    class Meta:
        model = Homestay
        fields = [
            "id",
            "host",
            "name",
            "description",
            "type",
            "images",
            "base_price",
            "address",
            "longitude",
            "latitude",
            "commune",     # Chọn xã (dropdown)
            "max_guests",
            "amenities",         # Nhận danh sách ID amenity khi tạo/cập nhật
            "amenity_details",   # Trả về chi tiết amenity đã chọn
            "district",          # Tính từ commune
            "province",          # Tính từ commune
        ]
        read_only_fields = ["id", "host", "amenity_details", "district", "province"]

    def get_amenity_details(self, obj):
        # Lấy các tiện ích thông qua quan hệ HomestayAmenity
        amenities = [ha.amenity for ha in obj.homestayamenity_set.all()]
        return AmenitySerializer(amenities, many=True).data

    def get_district(self, obj):
        # Lấy tên huyện từ commune (nếu có)
        return obj.commune.district.name if obj.commune and obj.commune.district else None

    def get_province(self, obj):
        # Lấy tên tỉnh từ commune (nếu có)
        return obj.commune.district.province.name if obj.commune and obj.commune.district and obj.commune.district.province else None

    def create(self, validated_data):
        amenities = validated_data.pop("amenities", [])
        homestay = Homestay.objects.create(**validated_data)
        for amenity in amenities:
            HomestayAmenity.objects.create(homestay=homestay, amenity=amenity)
        return homestay

    def update(self, instance, validated_data):
        amenities = validated_data.pop("amenities", None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        if amenities is not None:
            # Xóa các mối quan hệ cũ và tạo lại theo danh sách mới
            instance.homestayamenity_set.all().delete()
            for amenity in amenities:
                HomestayAmenity.objects.create(homestay=instance, amenity=amenity)
        return instance
