from rest_framework import generics
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework_simplejwt.views import TokenObtainPairView
from django.contrib.auth import update_session_auth_hash

from .serializers import RegisterSerializer, CustomTokenSerializer
from .models import User


# ===============================
# 🔐 Change Password
# ===============================
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def change_password(request):
    user = request.user
    old_password = request.data.get("old_password")
    new_password = request.data.get("new_password")

    if not old_password or not new_password:
        return Response({"error": "Both password fields are required"}, status=400)

    if not user.check_password(old_password):
        return Response({"error": "Old password incorrect"}, status=400)

    user.set_password(new_password)
    user.save()

    update_session_auth_hash(request, user)

    return Response({"message": "Password updated successfully"})


# ===============================
# 👤 Get Profile
# ===============================
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def profile_view(request):
    user = request.user

    return Response({
        "username": user.username,
        "email": user.email,
        "role": user.role,
        "profile_image": user.profile_image.url if user.profile_image else None
    })

from rest_framework.decorators import parser_classes

@api_view(['PUT'])
@permission_classes([IsAuthenticated])
@parser_classes([MultiPartParser, FormParser])
def update_profile(request):
    user = request.user

    user.username = request.data.get("username", user.username)
    user.email = request.data.get("email", user.email)

    if request.FILES.get("profile_image"):
        user.profile_image = request.FILES.get("profile_image")

    user.save()

    return Response({
        "username": user.username,
        "email": user.email,
        "profile_image": user.profile_image.url if user.profile_image else None
    })


# ===============================
# 🔑 JWT Login
# ===============================
class CustomTokenView(TokenObtainPairView):
    serializer_class = CustomTokenSerializer


# ===============================
# 📝 Register
# ===============================
class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer