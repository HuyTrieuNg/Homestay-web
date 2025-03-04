from django.urls import path
from .views import get_data
from .views import LoginView

urlpatterns = [
    path("api/data/", get_data),
    path('login/', LoginView.as_view(), name='login'),
]
