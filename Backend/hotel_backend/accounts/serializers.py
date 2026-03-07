from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

from .models import User


class RegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username", "email", "password", "role"]
        extra_kwargs = {"password": {"write_only": True}}

    def create(self, validated_data):
        return User.objects.create_user(**validated_data)


class UserProfileSerializer(serializers.ModelSerializer):
    profile_image = serializers.ImageField(required=False, allow_null=True)

    class Meta:
        model = User
        fields = ["id", "username", "email", "role", "profile_image"]
        read_only_fields = ["id", "role"]

    def to_representation(self, instance):
        data = super().to_representation(instance)
        request = self.context.get("request")
        image_url = data.get("profile_image")

        if image_url and request and not str(image_url).startswith(("http://", "https://")):
            data["profile_image"] = request.build_absolute_uri(image_url)

        return data


class CustomTokenSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token["role"] = user.role
        return token

    def validate(self, attrs):
        data = super().validate(attrs)

        profile_image_url = None
        if self.user.profile_image:
            try:
                profile_image_url = self.user.profile_image.url
            except Exception:
                profile_image_url = str(self.user.profile_image)

        data["user"] = {
            "id": self.user.id,
            "username": self.user.username,
            "role": self.user.role,
            "profile_image": profile_image_url,
        }

        return data


