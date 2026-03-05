from django.urls import path
from .views import CustomTokenView
from .views import RegisterView,profile_view,update_profile,change_password
from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),

    # 🔥 Use Custom Login View
    path('login/', CustomTokenView.as_view(), name='token_obtain_pair'),

    path('refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path("profile/", profile_view),
    path("profile/update/", update_profile),
    path("change-password/", change_password),
]