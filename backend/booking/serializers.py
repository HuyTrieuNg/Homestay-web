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
        fields = '__all__'
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

class BookingLineSerializer(serializers.ModelSerializer):
    class Meta:
        model = BookingLine
        fields = '__all__'