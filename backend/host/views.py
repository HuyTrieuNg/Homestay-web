from rest_framework import generics, permissions
from homestays.models import Homestay, HomestayImage
from .serializers import HomestaySerializer
class HomestayListCreateAPIView(generics.ListCreateAPIView):
    serializer_class = HomestaySerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Homestay.objects.filter(host=self.request.user)

    def perform_create(self, serializer):
        homestay = serializer.save(host=self.request.user)
        # Xử lý upload nhiều ảnh: Lấy danh sách file từ key "images"
        images = self.request.FILES.getlist("images")
        for image in images:
            HomestayImage.objects.create(homestay=homestay, image=image)

class HomestayRetrieveUpdateDestroyAPIView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = HomestaySerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Homestay.objects.filter(host=self.request.user)

# class AvailabilityListCreateView(generics.ListCreateAPIView):
#     serializer_class = HomestayAvailabilitySerializer
#     permission_classes = [IsAuthenticated]

#     def get_queryset(self):
#         # Lấy homestay_id từ URL (ví dụ: /api/homestays/{homestay_id}/availability/)
#         homestay_id = self.kwargs.get('homestay_id')
#         # Kiểm tra homestay thuộc về host đang đăng nhập
#         return HomestayAvailability.objects.filter(
#             homestay__id=homestay_id,
#             homestay__host=self.request.user
#         )

#     def perform_create(self, serializer):
#         homestay_id = self.kwargs.get('homestay_id')
#         # Lấy homestay của host
#         homestay = Homestay.objects.get(id=homestay_id, host=self.request.user)
#         serializer.save(homestay=homestay)

# class AvailabilityDetailView(generics.RetrieveUpdateDestroyAPIView):
#     serializer_class = HomestayAvailabilitySerializer
#     permission_classes = [IsAuthenticated]

#     def get_queryset(self):
#         homestay_id = self.kwargs.get('homestay_id')
#         return HomestayAvailability.objects.filter(
#             homestay__id=homestay_id,
#             homestay__host=self.request.user
#         )