from rest_framework import serializers
from .models import *

class HomestayAvailabilitySerializer(serializers.ModelSerializer):
    homestay = serializers.SerializerMethodField()
    class Meta:
        model = HomestayAvailability
        fields = '__all__'
    
    def get_homestay(self, obj):
        return obj.homestay.name