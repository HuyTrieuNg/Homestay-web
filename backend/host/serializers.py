from rest_framework import serializers
from homestays.models import Homestay, Amenity, HomestayImage
from users.models import User
from booking.models import Booking
from .common_serializers import AmenitySerializer


class HomestaySerializer(serializers.ModelSerializer):
    images = serializers.SerializerMethodField()    
    
    uploaded_images = serializers.ListField(
        child=serializers.ImageField(),  
        write_only=True, required=False
    )
    deleted_images = serializers.ListField(
        child=serializers.IntegerField(),  
        write_only=True, required=False
    )
    amenities = serializers.PrimaryKeyRelatedField(
        many=True, queryset=Amenity.objects.all()
    )

    class Meta:
        model = Homestay
        fields = "__all__"

    def get_images(self, obj):
        request = self.context.get("request")
        return [
            {
                "id": img.id,
                "image": request.build_absolute_uri(img.image.url) if request else img.image.url
            }
            for img in obj.images.all()
        ]
    
    def create(self, validated_data):
        uploaded_images = validated_data.pop("uploaded_images", [])
        amenities = validated_data.pop("amenities", [])
        
        # Get the user from request context
        request = self.context.get("request")
        homestay = Homestay.objects.create(host=request.user, **validated_data)
        
        # Add images
        for image in uploaded_images:
            HomestayImage.objects.create(homestay=homestay, image=image)
            
        # Set amenities
        homestay.amenities.set(amenities)
        
        return homestay
    
    def update(self, instance, validated_data):
        uploaded_images = validated_data.pop("uploaded_images", [])
        deleted_images = validated_data.pop("deleted_images", [])
        amenities = validated_data.pop("amenities", None)
        
        # Update homestay fields
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        
        # Delete images if specified
        if deleted_images:
            HomestayImage.objects.filter(homestay=instance, id__in=deleted_images).delete()
            
        # Add new images
        for image in uploaded_images:
            HomestayImage.objects.create(homestay=instance, image=image)
            
        # Update amenities if provided
        if amenities is not None:
            instance.amenities.set(amenities)
            
        return instance


#serializer riêng để tăng tốc độ load trang quản lý booking

class UserLiteSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [ 'name']

# Serializer nhẹ cho Homestay
class HomestayLiteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Homestay
        fields = [ 'name']

# Serializer nhẹ cho BookingList
class BookingListSerializer(serializers.ModelSerializer):
    user = UserLiteSerializer(read_only=True)
    homestay = HomestayLiteSerializer(read_only=True)
    
    class Meta:
        model = Booking
        fields = '__all__' # Hoặc chỉ định các trường bạn muốn