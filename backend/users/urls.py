from django.urls import path
from users import views
# from .views import LoginView
from rest_framework_simplejwt.views import (
    TokenRefreshView,
)

urlpatterns = [
    path('token/', views.MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    # path('token/', MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('register/', views.RegisterView.as_view(), name='auth_register'),
    path('test/', views.testEndPoint, name='test'),
    path('', views.getRoutes),
    # path('login/', LoginView.as_view(), name='login'),
    path('profile/', views.UserProfileView.as_view(), name='user-profile'),
    path('profile/avatar', views.UserAvatarView.as_view(), name='user-avatar'),
    path('statistics/', views.UserStatisticsView.as_view(), name='user-statistics'),
    path('users/', views.UserListView.as_view(), name='user-list'),
    path('users/<int:pk>/promote/', views.PromoteToHostView.as_view(), name='promote-to-host'),
    path('users/<int:pk>/demote/', views.DemoteToGuestView.as_view(), name='demote-to-guest'),
    path('users/<int:pk>/ban/', views.BanUserView.as_view(), name='ban-user'),
    path('users/<int:pk>/unban/', views.UnbanUserView.as_view(), name='unban-user'),
]