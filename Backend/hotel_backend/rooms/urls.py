from django.urls import path
from .views import RoomListView, RoomCreateView, RoomDetailView

urlpatterns = [
    # User
    path('', RoomListView.as_view(), name='room-list'),

    # Admin
    path('create/', RoomCreateView.as_view(), name='room-create'),
    path('<int:pk>/', RoomDetailView.as_view(), name='room-detail'),
]