from rest_framework import serializers
from .models import *

class HomestayAvailabilitySerializer(serializers.ModelSerializer):
    homestay = serializers.SerializerMethodField()
    class Meta:
        model = HomestayAvailability
        fields = '__all__'
    
    def get_homestay(self, obj):
        return obj.homestay.name
    

class BookingSerializer(serializers.ModelSerializer):
    user = serializers.SerializerMethodField()
    homestay = serializers.SerializerMethodField()
    class Meta:
        model = Booking
        fields = [
            'id', 'user', 'homestay', 'checkin_date', 'checkout_date', 
            'guests', 'status', 'currency', 'subtotal', 'fee', 'total_amount', 'note'
        ]
    def get_user(self, obj):
        return {
            "id": obj.user.id,
            "name": obj.user.name  # Truy cập trực tiếp từ model User
        }

    def get_homestay(self, obj):
        return {
            "id": obj.homestay.id,
            "name": obj.homestay.name  # Truy cập trực tiếp từ model Homestay
        }

class BookingLineSerializer(serializers.ModelSerializer):
    class Meta:
        model = BookingLine
        fields = '__all__'