from django.conf import settings
from django.core.mail import send_mail
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAdminUser, AllowAny
from rest_framework.response import Response

from .serializers import ContactSerializer


def _contact_admin_recipients():
    raw = getattr(settings, "CONTACT_ADMIN_EMAILS", "")
    if raw:
        recipients = [email.strip() for email in raw.split(",") if email.strip()]
        if recipients:
            return recipients
    return [settings.DEFAULT_FROM_EMAIL]


@api_view(["POST"])
@permission_classes([AllowAny])
def contact_message(request):
    serializer = ContactSerializer(data=request.data)
    if not serializer.is_valid():
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    contact = serializer.save()

    subject = f"New Contact Message from {contact.name}"
    body = (
        f"Name: {contact.name}\n"
        f"Email: {contact.email}\n\n"
        f"Message:\n{contact.message}"
    )

    try:
        send_mail(
            subject,
            body,
            settings.DEFAULT_FROM_EMAIL,
            _contact_admin_recipients(),
            fail_silently=True,
        )
    except Exception as exc:
        print("Contact email failed:", exc)

    return Response({"message": "Message sent successfully"}, status=status.HTTP_200_OK)


@api_view(["GET"])
@permission_classes([IsAdminUser])
def test_email(request):
    try:
        send_mail(
            "Test Email",
            "This is a test email from LuxStay.",
            settings.DEFAULT_FROM_EMAIL,
            _contact_admin_recipients(),
            fail_silently=False,
        )
        return Response({"message": "Email sent"}, status=status.HTTP_200_OK)
    except Exception as exc:
        return Response({"error": f"Email failed: {exc}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
