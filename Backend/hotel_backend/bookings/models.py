from django.db import models
from django.conf import settings
from rooms.models import Room
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.core.mail import EmailMultiAlternatives
from django.conf import settings


class Booking(models.Model):

    STATUS_CHOICES = (
        ('pending', 'Pending'),
        ('approved', 'Approved'),
        ('rejected', 'Rejected'),
        ('paid', 'Paid'),  
    )

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    room = models.ForeignKey(Room, on_delete=models.CASCADE)

    check_in = models.DateField()
    check_out = models.DateField()

    total_price = models.DecimalField(max_digits=10, decimal_places=2)

    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='pending')

    rating = models.IntegerField(null=True, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} - {self.user.email} - {self.room.room_type}"


# ==============================
# 📧 BOOKING STATUS EMAIL SIGNAL
# ==============================

@receiver(post_save, sender=Booking)
def send_status_email(sender, instance, created, **kwargs):

    if created:
        return  # Don't send email on booking creation

    if not instance.user.email:
        return

    # 🎯 Status Based Subject & Message
    if instance.status == "approved":
        subject = "🎉 Your Booking Has Been Approved!"
        status_message = "Great news! Your booking has been approved."
        color = "#22c55e"

    elif instance.status == "rejected":
        subject = "❌ Booking Rejected"
        status_message = "Unfortunately, your booking was rejected."
        color = "#ef4444"

    elif instance.status == "paid":
        subject = "💰 Payment Received"
        status_message = "We have received your payment. Awaiting approval."
        color = "#3b82f6"

    else:
        subject = "Booking Status Updated"
        status_message = f"Your booking status is now {instance.status.upper()}."
        color = "#facc15"

    # 🔹 Get Room Number Safely
    room_number = getattr(instance.room, "room_number", "Not Assigned")

    # 📧 Plain Text Version
    text_content = f"""
Hello {instance.user.username},

{status_message}

Room Type: {instance.room.room_type}
Room Number: {room_number}
Check-in: {instance.check_in}
Check-out: {instance.check_out}
Total Amount: ₹ {instance.total_price}

Thank you for choosing LuxStay!
"""

    # 💎 HTML Version
    html_content = f"""
    <div style="font-family: Arial; padding: 20px;">
        <h2 style="color: {color};">LuxStay Booking Update</h2>
        <p>Hello <strong>{instance.user.username}</strong>,</p>

        <p>{status_message}</p>

        <hr>

        <h3>Booking Details:</h3>
        <ul>
            <li><strong>Room Type:</strong> {instance.room.room_type}</li>
            <li><strong>Room Number:</strong> {room_number}</li>
            <li><strong>Check-in:</strong> {instance.check_in}</li>
            <li><strong>Check-out:</strong> {instance.check_out}</li>
            <li><strong>Total Amount:</strong> ₹ {instance.total_price}</li>
        </ul>

        <p style="margin-top:20px;">
            Thank you for choosing <strong>LuxStay</strong>.
            We look forward to hosting you!
        </p>

        <hr>
        <p style="font-size:12px;color:gray;">
            This is an automated email. Please do not reply.
        </p>
    </div>
    """

    email = EmailMultiAlternatives(
        subject,
        text_content,
        settings.EMAIL_HOST_USER,
        [instance.user.email],
    )

    email.attach_alternative(html_content, "text/html")
    email.send(fail_silently=False)