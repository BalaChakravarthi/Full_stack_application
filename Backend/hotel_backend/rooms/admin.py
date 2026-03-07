from django import forms
from django.contrib import admin
from django.db.utils import OperationalError, ProgrammingError

from .models import Room


class RoomAdminForm(forms.ModelForm):
    # Use a plain file input to avoid storage URL resolution issues in admin.
    image = forms.ImageField(required=False, widget=forms.FileInput)

    class Meta:
        model = Room
        fields = "__all__"


@admin.register(Room)
class RoomAdmin(admin.ModelAdmin):
    form = RoomAdminForm
    list_display = ("room_number", "room_type", "price", "availability")

    def get_queryset(self, request):
        try:
            return super().get_queryset(request)
        except (OperationalError, ProgrammingError):
            return Room.objects.none()
