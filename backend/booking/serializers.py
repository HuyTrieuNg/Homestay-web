from rest_framework import serializers
from .models import *

class HomestayAvailabilitySerializer(serializers.ModelSerializer):
    homestay = serializers.SerializerMethodField()
    class Meta:
        model = HomestayAvailability
        fields = '__all__'
    
    def get_homestay(self, obj):
        return obj.homestay.name
    
from rest_framework import serializers
from .models import Booking

class BookingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Booking
        fields = [
            'id', 'user', 'homestay', 'checkin_date', 'checkout_date', 
            'guests', 'status', 'currency', 'subtotal', 'fee', 'total_amount', 'note'
        ]
        read_only_fields = ['id', 'user', 'subtotal', 'fee', 'total_amount', 'status']
