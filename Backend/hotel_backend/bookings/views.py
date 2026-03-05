from datetime import datetime

from django.shortcuts import get_object_or_404
from django.conf import settings
from django.core.mail import send_mail
from django.db.models import Sum, Avg

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status

from .models import Booking
from .serializers import BookingSerializer
from rooms.models import Room


# ======================================================
# ⭐ ADD RATING (USER ONLY)
# ======================================================

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def add_rating(request, booking_id):

    booking = get_object_or_404(Booking, id=booking_id, user=request.user)

    if booking.status != "approved":
        return Response(
            {"error": "You can only rate approved bookings"},
            status=400
        )

    rating = request.data.get("rating")

    if not rating or int(rating) < 1 or int(rating) > 5:
        return Response(
            {"error": "Rating must be between 1 and 5"},
            status=400
        )

    booking.rating = rating
    booking.save()

    return Response({"message": "Rating submitted"})


# ======================================================
# 🏨 CREATE BOOKING
# ======================================================

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_booking(request):

    room_id = request.data.get("room_id")
    check_in = request.data.get("check_in")
    check_out = request.data.get("check_out")

    if not room_id or not check_in or not check_out:
        return Response({"error": "Missing fields"}, status=400)

    room = get_object_or_404(Room, id=room_id)

    check_in_date = datetime.strptime(check_in, "%Y-%m-%d").date()
    check_out_date = datetime.strptime(check_out, "%Y-%m-%d").date()

    # Conflict check (only approved bookings block)
    conflict = Booking.objects.filter(
        room=room,
        status='approved',
        check_in__lt=check_out_date,
        check_out__gt=check_in_date
    ).exists()

    if conflict:
        return Response(
            {"error": "Room already booked"},
            status=400
        )

    days = (check_out_date - check_in_date).days
    if days <= 0:
        return Response({"error": "Invalid date selection"}, status=400)

    total_price = days * room.price

    booking = Booking.objects.create(
        user=request.user,
        room=room,
        check_in=check_in_date,
        check_out=check_out_date,
        total_price=total_price,
        status="pending"
    )

    # Static UPI Link
    upi_id = "8790118190@mbkns"
    merchant_name = "SmartHotel"
    upi_link = f"upi://pay?pa={upi_id}&pn={merchant_name}&am={total_price}&cu=INR"

    return Response({
        "booking_id": booking.id,
        "amount": total_price,
        "upi_link": upi_link
    })


# ======================================================
# 📋 USER BOOKINGS
# ======================================================

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def user_bookings(request):

    bookings = Booking.objects.filter(user=request.user).order_by("-created_at")
    serializer = BookingSerializer(bookings, many=True)
    return Response(serializer.data)


# ======================================================
# 👑 ADMIN: GET ALL BOOKINGS
# ======================================================

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def admin_all_bookings(request):

    if request.user.role != "admin":
        return Response({"error": "Access denied"}, status=403)

    bookings = Booking.objects.all().order_by("-created_at")
    serializer = BookingSerializer(bookings, many=True)
    return Response(serializer.data)


# ======================================================
# 📊 ADMIN ANALYTICS
# ======================================================

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def admin_analytics(request):

    if request.user.role != "admin":
        return Response({"error": "Access denied"}, status=403)

    total_bookings = Booking.objects.count()
    total_rooms = Room.objects.count()
    pending = Booking.objects.filter(status='pending').count()
    approved = Booking.objects.filter(status='approved').count()
    rejected = Booking.objects.filter(status='rejected').count()

    revenue = Booking.objects.filter(status='approved').aggregate(
        total=Sum('total_price')
    )['total'] or 0

    avg_rating = Booking.objects.aggregate(
        avg=Avg('rating')
    )['avg'] or 0

    return Response({
        "total_bookings": total_bookings,
        "total_rooms": total_rooms,
        "pending": pending,
        "approved": approved,
        "rejected": rejected,
        "revenue": revenue,
        "avg_rating": round(avg_rating, 2)
    })


# ======================================================
# 📅 ADMIN CALENDAR VIEW
# ======================================================

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def booking_calendar(request):

    if request.user.role != "admin":
        return Response({"error": "Access denied"}, status=403)

    bookings = Booking.objects.all()

    events = []

    for booking in bookings:
        color = "#facc15"  # pending

        if booking.status == "approved":
            color = "#22c55e"
        elif booking.status == "rejected":
            color = "#ef4444"

        events.append({
            "id": booking.id,
            "title": f"{booking.room.room_type} - {booking.user.username}",
            "start": booking.check_in,
            "end": booking.check_out,
            "color": color
        })

    return Response(events)


# ======================================================
# 💰 USER MARK AS PAID
# ======================================================

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def mark_as_paid(request, booking_id):

    booking = get_object_or_404(Booking, id=booking_id, user=request.user)

    booking.status = "paid"
    booking.save()

    return Response({"message": "Marked as paid"})

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def update_booking_status(request, booking_id):

    if not request.user.is_staff:
        return Response({"error": "Access denied"}, status=403)

    booking = get_object_or_404(Booking, id=booking_id)

    new_status = request.data.get("status")

    if not new_status:
        return Response({"error": "Status is required"}, status=400)

    booking.status = new_status
    booking.save()  # ✅ This triggers signal automatically

    return Response({"message": "Status updated successfully"})