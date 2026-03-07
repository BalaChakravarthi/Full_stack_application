from django.contrib import admin
from django.db.utils import OperationalError, ProgrammingError

from .models import Contact


@admin.register(Contact)
class ContactAdmin(admin.ModelAdmin):
    list_display = ("name", "email", "created_at")
    search_fields = ("name", "email", "message")
    readonly_fields = ("created_at",)

    def get_queryset(self, request):
        try:
            return super().get_queryset(request)
        except (OperationalError, ProgrammingError):
            return Contact.objects.none()
