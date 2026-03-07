from django.contrib.auth import update_session_auth_hash
from rest_framework import generics
from rest_framework.decorators import api_view, parser_classes, permission_classes
from rest_framework.parsers import FormParser, MultiPartParser
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework_simplejwt.views import TokenObtainPairView

from .models import User
from .serializers import CustomTokenSerializer, RegisterSerializer, UserProfileSerializer


@api_view(["POST"])
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


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def profile_view(request):
    serializer = UserProfileSerializer(request.user, context={"request": request})
    return Response(serializer.data)


@api_view(["PUT"])
@permission_classes([IsAuthenticated])
@parser_classes([MultiPartParser, FormParser])
def update_profile(request):
    serializer = UserProfileSerializer(
        request.user,
        data=request.data,
        partial=True,
        context={"request": request},
    )
    serializer.is_valid(raise_exception=True)
    serializer.save()
    return Response(serializer.data)


class CustomTokenView(TokenObtainPairView):
    serializer_class = CustomTokenSerializer


class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer


