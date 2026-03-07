from datetime import datetime

from django.db.models import Avg, Sum
from django.shortcuts import get_object_or_404
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from rooms.models import Room

from .models import Booking
from .serializers import BookingSerializer


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def add_rating(request, booking_id):
    booking = get_object_or_404(Booking, id=booking_id, user=request.user)

    if booking.status != "approved":
        return Response({"error": "You can only rate approved bookings"}, status=400)

    rating = request.data.get("rating")
    if not rating or int(rating) < 1 or int(rating) > 5:
        return Response({"error": "Rating must be between 1 and 5"}, status=400)

    booking.rating = rating
    booking.save(update_fields=["rating"])

    return Response({"message": "Rating submitted"})


@api_view(["POST"])
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

    conflict = Booking.objects.filter(
        room=room,
        status="approved",
        check_in__lt=check_out_date,
        check_out__gt=check_in_date,
    ).exists()
    if conflict:
        return Response({"error": "Room already booked"}, status=400)

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
        status="pending",
    )

    upi_id = "8790118190@mbkns"
    merchant_name = "SmartHotel"
    upi_link = f"upi://pay?pa={upi_id}&pn={merchant_name}&am={total_price}&cu=INR"

    return Response({"booking_id": booking.id, "amount": total_price, "upi_link": upi_link})


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def user_bookings(request):
    bookings = Booking.objects.filter(user=request.user).order_by("-created_at")
    serializer = BookingSerializer(bookings, many=True)
    return Response(serializer.data)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def admin_all_bookings(request):
    if request.user.role != "admin":
        return Response({"error": "Access denied"}, status=403)

    bookings = Booking.objects.all().order_by("-created_at")
    serializer = BookingSerializer(bookings, many=True)
    return Response(serializer.data)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def admin_analytics(request):
    if request.user.role != "admin":
        return Response({"error": "Access denied"}, status=403)

    total_bookings = Booking.objects.count()
    total_rooms = Room.objects.count()
    pending = Booking.objects.filter(status="pending").count()
    approved = Booking.objects.filter(status="approved").count()
    rejected = Booking.objects.filter(status="rejected").count()

    revenue = Booking.objects.filter(status="approved").aggregate(total=Sum("total_price"))["total"] or 0
    avg_rating = Booking.objects.aggregate(avg=Avg("rating"))["avg"] or 0

    return Response(
        {
            "total_bookings": total_bookings,
            "total_rooms": total_rooms,
            "pending": pending,
            "approved": approved,
            "rejected": rejected,
            "revenue": revenue,
            "avg_rating": round(avg_rating, 2),
        }
    )


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def booking_calendar(request):
    if request.user.role != "admin":
        return Response({"error": "Access denied"}, status=403)

    bookings = Booking.objects.all()
    events = []

    for booking in bookings:
        color = "#facc15"
        if booking.status == "approved":
            color = "#22c55e"
        elif booking.status == "rejected":
            color = "#ef4444"

        events.append(
            {
                "id": booking.id,
                "title": f"{booking.room.room_type} - {booking.user.username}",
                "start": booking.check_in,
                "end": booking.check_out,
                "color": color,
            }
        )

    return Response(events)


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def mark_booking_paid(request, booking_id):
    booking = get_object_or_404(Booking, id=booking_id)

    # Allow only booking owner or admin to mark paid.
    if request.user.role != "admin" and booking.user_id != request.user.id:
        return Response({"error": "Access denied"}, status=status.HTTP_403_FORBIDDEN)

    if booking.status == "paid":
        return Response(
            {
                "success": True,
                "message": "Booking already marked as paid",
                "booking_id": booking.id,
                "status": booking.status,
            },
            status=status.HTTP_200_OK,
        )

    booking.status = "paid"
    booking.save(update_fields=["status"])

    return Response(
        {
            "success": True,
            "message": "Payment marked as paid",
            "booking_id": booking.id,
            "status": booking.status,
        },
        status=status.HTTP_200_OK,
    )


# Backward-compatible alias if any code imports the old name.
mark_as_paid = mark_booking_paid


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def update_booking_status(request, booking_id):
    if not (request.user.is_staff or request.user.role == "admin"):
        return Response({"error": "Access denied"}, status=403)

    booking = get_object_or_404(Booking, id=booking_id)
    new_status = request.data.get("status")

    valid_statuses = {choice[0] for choice in Booking.STATUS_CHOICES}
    if new_status not in valid_statuses:
        return Response({"error": f"Invalid status. Use one of: {', '.join(sorted(valid_statuses))}"}, status=400)

    booking.status = new_status
    booking.save(update_fields=["status"])

    return Response({"message": "Status updated successfully", "booking_id": booking.id, "status": booking.status})


