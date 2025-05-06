from rest_framework import serializers

# from host.common_serializers import HomestayImageSerializer
from homestays.serializers import HomestayDetailSerializer
from .models import *

class HomestayAvailabilitySerializer(serializers.ModelSerializer):
    homestay = serializers.SerializerMethodField()
    class Meta:
        model = HomestayAvailability
        fields = '__all__'
    
    def get_homestay(self, obj):
        return obj.homestay.name
   
class BookingLineSerializer(serializers.ModelSerializer):
    class Meta:
        model = BookingLine
        fields = '__all__'
    
class BookingSerializer(serializers.ModelSerializer):
    host_name = serializers.CharField(source='homestay.host.name', read_only=True)
    host_phone = serializers.CharField(source='homestay.host.phone', read_only=True)
    # homestay_name = serializers.CharField(source='homestay.name', read_only=True)
    # homestay_images = serializers.SerializerMethodField()
    booking_lines = BookingLineSerializer(many=True, read_only=True)
    homestay = HomestayDetailSerializer(read_only=True)
    user = serializers.SerializerMethodField()
    # homestay = serializers.SerializerMethodField()

    class Meta:
        model = Booking
#         fields = [
#             'id', 'user', 'homestay', 'checkin_date', 'checkout_date', 
#             'guests', 'status', 'currency', 'subtotal', 'fee', 'total_amount', 'note'
#         ]
        fields = '__all__'
        read_only_fields = ['id', 'user', 'subtotal', 'fee', 'total_amount', 'status']
        
    def get_user(self, obj):
            return {
                "id": obj.user.id,
                "name": obj.user.name  
            }
    def get_homestay(self, obj):
        return {
            "id": obj.homestay.id,
            "name": obj.homestay.name 
        }
    # def get_homestay_images(self, obj):
    #     # return [image.image.url for image in obj.homestay.images.all()]
    #     first_image = obj.homestay.images.first()  # Lấy ảnh đầu tiên (nếu có)
    #     return first_image.image.url if first_image else None



# Cho phần thống kê doanh thu của admin

class RevenueByHomestaySerializer(serializers.Serializer):
    homestay_id = serializers.IntegerField(source='homestay__id')
    name = serializers.CharField(source='homestay__name')
    total_revenue = serializers.DecimalField(max_digits=10, decimal_places=2)

class RevenueByTypeSerializer(serializers.Serializer):
    type = serializers.CharField(source='homestay__type__name')
    total_revenue = serializers.DecimalField(max_digits=10, decimal_places=2)

class RevenueByDateSerializer(serializers.Serializer):
    checkout_date = serializers.DateField()
    total_revenue = serializers.DecimalField(max_digits=10, decimal_places=2)

class BookingStatusRatioSerializer(serializers.Serializer):
    status = serializers.CharField()
    count = serializers.IntegerField()

class BookingCountByHomestaySerializer(serializers.Serializer):
    homestay_id = serializers.IntegerField(source='homestay__id')
    name = serializers.CharField(source='homestay__name')
    count = serializers.IntegerField()