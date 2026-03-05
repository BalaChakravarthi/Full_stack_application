from rest_framework import generics, permissions
from rest_framework.parsers import MultiPartParser, FormParser
from .models import Room
from .serializers import RoomSerializer

# 🟢 User View - List Rooms
class RoomListView(generics.ListAPIView):
    queryset = Room.objects.filter(availability=True)
    serializer_class = RoomSerializer

    def get_queryset(self):
        queryset = super().get_queryset()
        min_price = self.request.query_params.get('min_price')
        max_price = self.request.query_params.get('max_price')

        if min_price:
            queryset = queryset.filter(price__gte=min_price)
        if max_price:
            queryset = queryset.filter(price__lte=max_price)

        return queryset

from rest_framework import generics, permissions
from rest_framework.exceptions import PermissionDenied
from .models import Room
from .serializers import RoomSerializer

class RoomCreateView(generics.CreateAPIView):
    queryset = Room.objects.all()
    serializer_class = RoomSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        if self.request.user.role != 'admin':
            raise PermissionDenied("Only admin can add rooms")
        serializer.save()

class RoomDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Room.objects.all()
    serializer_class = RoomSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_update(self, serializer):
        if self.request.user.role != 'admin':
            raise PermissionDenied("Only admin can update rooms")
        serializer.save()

    def perform_destroy(self, instance):
        if self.request.user.role != 'admin':
            raise PermissionDenied("Only admin can delete rooms")
        instance.delete()