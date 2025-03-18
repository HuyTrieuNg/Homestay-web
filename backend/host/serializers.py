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
    def remove_images(self, homestay, image_ids):
        HomestayImage.objects.filter(homestay=homestay, id__in=image_ids).delete()

    amenities = serializers.PrimaryKeyRelatedField(
        many=True, queryset=Amenity.objects.all()
    ) #chỉ lấy id

    class Meta:
        model = Homestay
        fields = "__all__"

    def get_images(self, obj):
        request = self.context.get("request")
        if request:
            return [request.build_absolute_uri(img.image.url) for img in obj.images.all()]
        return [img.image.url for img in obj.images.all()]
    
    def add_images(self, homestay, images):
        for image in images:
            HomestayImage.objects.create(homestay=homestay, image=image)
    
    def create(self, validated_data):
        request = self.context.get("request")
        if not request or not request.user.is_authenticated:
            raise serializers.ValidationError("Người dùng chưa đăng nhập!")
        
        uploaded_images = validated_data.pop("uploaded_images", [])
        amenities = validated_data.pop("amenities", [])  

        homestay = Homestay.objects.create(host = request.user, **validated_data )

        self.add_images(homestay, uploaded_images)
        homestay.amenities.set(amenities)
        
        return homestay
    
    def update(self, instance, validated_data):
        uploaded_images = validated_data.pop("uploaded_images", [])  
        deleted_images = validated_data.pop("deleted_images", [])  
        amenities = validated_data.pop("amenities", [])  
        #update thông tin trước
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        #xóa ảnh
        if deleted_images:
            self.remove_images(instance, deleted_images)
        #thêm ảnh mới
        if uploaded_images:
            self.add_images(instance, uploaded_images)
        #cập nhật lại amentities
        instance.amenities.set(amenities)
        return instance

        #delete dùng mặc định

    

