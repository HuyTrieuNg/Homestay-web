from django.urls import path
from .views import HomestayListView

urlpatterns = [
    path('', HomestayListView.as_view(), name='get_homestays')
]
