from rest_framework import serializers
from homestays.models import Homestay, Amenity, HomestayImage
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



# from rest_framework import serializers
# from homestays.models import Homestay, HomestayImage, Amenity

# class AmenitySerializer(serializers.ModelSerializer):
#     """Serializer cho tiện ích (amenity)"""
#     class Meta:
#         model = Amenity
#         fields = ["id", "name"]

# class HomestayImageSerializer(serializers.ModelSerializer):
#     """Serializer cho ảnh homestay"""
#     class Meta:
#         model = HomestayImage
#         fields = ["id", "image"]

# class HomestaySerializer(serializers.ModelSerializer):
#     """Serializer chính cho Homestay"""
#     images = HomestayImageSerializer(many=True, read_only=True)
#     amenities = AmenitySerializer(many=True, read_only=True)

#     class Meta:
#         model = Homestay
#         fields = "__all__"
