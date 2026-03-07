from rest_framework import serializers
from .models import Room


class RoomSerializer(serializers.ModelSerializer):
    class Meta:
        model = Room
        fields = '__all__'

    def to_representation(self, instance):
        data = super().to_representation(instance)
        if instance.image:
            try:
                data["image"] = instance.image.url
            except Exception:
                data["image"] = str(instance.image)
        return data
