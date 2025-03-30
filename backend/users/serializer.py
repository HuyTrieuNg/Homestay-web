from users.models import Profile, User
from django.contrib.auth.password_validation import validate_password
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework import serializers
from rest_framework.validators import UniqueValidator
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
import logging
logger = logging.getLogger(__name__)

class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = ['avatar', 'work', 'about', 'interests', 'status']

class UserSerializer(serializers.ModelSerializer):
    username = serializers.CharField(read_only=True)
    avatar_url = serializers.SerializerMethodField()
    work = serializers.CharField(source="profile.work", required=False, allow_blank=True)
    about = serializers.CharField(source="profile.about", required=False, allow_blank=True)
    interests = serializers.CharField(source="profile.interests", required=False, allow_blank=True)
    avatar = serializers.ImageField(required=False)

    class Meta:
        model = User
        fields = ('id', 'username', 'name', 'phone', 'avatar', 'avatar_url', 'work', 'about', 'interests')

    def get_avatar_url(self, obj):
        request = self.context.get('request')
        print("Hàm get_avatar được gọi!")
        if hasattr(obj, "profile") and obj.profile.avatar:
            print("co")
            print(request.build_absolute_uri(obj.profile.avatar.url))
            return request.build_absolute_uri(obj.profile.avatar.url)
        return request.build_absolute_uri('/media/avatars/default.png')

    def update(self, instance, validated_data):
        print(f"Dữ liệu nhận được: {validated_data}")
        print(">>> request.data nhận được: ", self.context['request'].data)
        print(">>> validated_data nhận được: ", validated_data)
        avatar = validated_data.pop('avatar', None)
        profile_data = validated_data.pop('profile', {})
        # Cập nhật User
        instance.name = validated_data.get('name', instance.name)
        instance.phone = validated_data.get('phone', instance.phone)
        instance.save()

        profile = instance.profile
        if avatar:
            profile.avatar = avatar
            print(f"Lưu avatar vào: {profile.avatar}")
        # profile.avatar = profile_data.get('avatar', profile.avatar)
        profile.work = profile_data.get('work', profile.work)
        profile.about = profile_data.get('about', profile.about)
        profile.interests = profile_data.get('interests', profile.interests)
        profile.save()


        return instance
    
    

class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        
        # These are claims, you can add custom claims
        token['name'] = user.name
        token['phone'] = user.phone
        token['type'] = user.type
        token['avatar'] = str(user.profile.avatar)
        token['work'] = user.profile.work
        token['about'] = user.profile.about
        token['interests'] = user.profile.interests
        token['status'] = user.profile.status
        # ...
        return token


class RegisterSerializer(serializers.ModelSerializer):
    phone = serializers.CharField(
        required=True,
        validators=[UniqueValidator(queryset=User.objects.all())]  # Đảm bảo số điện thoại không trùng
    )
    
    password = serializers.CharField(
        write_only=True, required=True, validators=[validate_password])
    password2 = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = User
        fields = ('phone', 'username', 'password', 'password2')

    def validate(self, attrs):
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError(
                {"password": "Password fields didn't match."})

        return attrs

    def create(self, validated_data):
        user = User.objects.create(
            username=validated_data['username'],
            # email=validated_data['email']
            phone=validated_data['phone']

        )

        user.set_password(validated_data['password'])
        user.save()

        # Profile.objects.create(user=user)
        return user
    
