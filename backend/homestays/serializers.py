from rest_framework import serializers
from .models import Homestay

class HomestaySerializer(serializers.ModelSerializer):
    class Meta:
        model = Homestay
        fields = '__all__'