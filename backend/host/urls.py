from django.urls import path
from .views import HostHomestayListView, HomestayCreateView, HomestayDetailView

urlpatterns = [
    path('homestays/', HostHomestayListView.as_view(), name='host-homestay-list'),  # Chỉ lấy homestays của host
    path('homestays/create/', HomestayCreateView.as_view(), name='homestay-create'),  # Tạo homestay mới
    path('homestays/<int:pk>/', HomestayDetailView.as_view(), name='homestay-detail'),  # Chi tiết, cập nhật, xóa homestay
]
