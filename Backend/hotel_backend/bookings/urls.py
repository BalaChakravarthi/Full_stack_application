from django.urls import path
from .views import (
    create_booking,
    user_bookings,
    admin_all_bookings,
    update_booking_status,
    add_rating,
    admin_analytics,
    booking_calendar,
    mark_as_paid,
)

urlpatterns = [
    # 🔹 User
    path("create/", create_booking, name="create-booking"),
    path("my/", user_bookings, name="user-bookings"),
    path("rate/<int:booking_id>/", add_rating, name="add-rating"),
    path("paid/<int:booking_id>/", mark_as_paid, name="mark-as-paid"),

    # 🔹 Admin
    path("all/", admin_all_bookings, name="admin-all-bookings"),
    path("update/<int:booking_id>/", update_booking_status, name="update-booking-status"),
    path("analytics/", admin_analytics, name="admin-analytics"),
    path("calendar/", booking_calendar, name="booking-calendar"),
]