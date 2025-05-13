from os import read
from rest_framework import serializers
from .models import *

class ReviewSerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField(read_only=True)
    # avatar = serializers.SerializerMethodField()
    avatar_url = serializers.SerializerMethodField()

    class Meta:
        model = Review
        fields = '__all__'
        read_only_fields = ['user', 'created_at']

    # def get_avatar(self, obj):
    #     if obj.user.profile.avatar:
    #         return obj.user.profile.avatar.url
    #     return None
    
    def get_avatar_url(self, obj):
        request = self.context.get('request')
        print("Hàm get_avatar2 được gọi!")
        if obj.user.profile.avatar:
            print("co")
            print(request.build_absolute_uri(obj.user.profile.avatar.url))
            return request.build_absolute_uri(obj.user.profile.avatar.url)
        return request.build_absolute_uri('/media/avatars/default.png')


    # def to_representation(self, instance):
    #     representation = super().to_representation(instance)
    #     representation['user'] = {
    #         'id': instance.user.id,
    #         'username': instance.user.username,
    #         'name': instance.user.name,
    #         'avatar': instance.user.profile.avatar.url if instance.user.profile.avatar else None
    #     }
    #     return representation
    def create(self, validated_data):
        print("Validated data:", validated_data)  # Debug
        # Extract user_id from validated_data and set user
        user_id = validated_data.pop('user', None)
        if user_id:
            validated_data['user'] = User.objects.get(id=user_id)
        else:
            raise serializers.ValidationError({"user": "User ID is required."})
        return Review.objects.create(**validated_data)