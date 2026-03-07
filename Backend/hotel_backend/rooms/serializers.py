from rest_framework import serializers
from urllib.parse import urlparse
from .models import Room


class RoomSerializer(serializers.ModelSerializer):
    class Meta:
        model = Room
        fields = '__all__'

    def to_representation(self, instance):
        data = super().to_representation(instance)
        if instance.image:
            try:
                image_url = instance.image.url
            except Exception:
                image_url = str(instance.image)

            request = self.context.get("request")
            parsed = urlparse(image_url)
            if request and not (parsed.scheme and parsed.netloc):
                image_url = request.build_absolute_uri(image_url)

            data["image"] = image_url
        return data


