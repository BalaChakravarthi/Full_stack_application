from rest_framework import serializers
from .models import Booking

class BookingSerializer(serializers.ModelSerializer):
    room_type = serializers.CharField(source="room.room_type", read_only=True)

    class Meta:
        model = Booking
        fields = "__all__"