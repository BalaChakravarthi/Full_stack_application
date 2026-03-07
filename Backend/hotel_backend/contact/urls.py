from django.urls import path

from .views import contact_message, test_email

urlpatterns = [
    path("", contact_message, name="contact-message"),
    path("test-email/", test_email, name="contact-test-email"),
]
