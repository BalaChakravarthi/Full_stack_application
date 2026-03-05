from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from .models import User


# ==========================
# 🔹 Register Serializer
# ==========================
class RegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'password', 'role']
        extra_kwargs = {
            'password': {'write_only': True}
        }

    def create(self, validated_data):
        return User.objects.create_user(**validated_data)


# ==========================
# 🔹 Custom JWT Serializer
# ==========================
class CustomTokenSerializer(TokenObtainPairSerializer):

    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        # Add extra fields inside JWT
        token['role'] = user.role

        return token

    def validate(self, attrs):
        data = super().validate(attrs)

        # Add user data in response
        data['user'] = {
            "id": self.user.id,
            "username": self.user.username,
            "role": self.user.role,
            "profile_image": self.user.profile_image.url if self.user.profile_image else None
        }

        return data