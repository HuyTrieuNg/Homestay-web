import json
from rest_framework import generics, permissions
from homestays.models import Homestay, HomestayImage
from .serializers import HomestaySerializer
from .permissions import IsHost


class HomestayRetrieveUpdateDestroyAPIView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = HomestaySerializer
    permission_classes = [IsHost]

    def get_queryset(self):
        return Homestay.objects.filter(host=self.request.user)

    def perform_update(self, serializer):
        homestay = serializer.save()

        #Xóa ảnh cũ nếu có danh sách deleted_images gửi lên
        deleted_images = self.request.data.get("deleted_images", "[]")  # Mặc định là chuỗi JSON rỗng

        try:
            deleted_images = json.loads(deleted_images)  # Chuyển đổi chuỗi JSON thành list Python
        except json.JSONDecodeError:
            deleted_images = []
        #nếu danh sách hợp lệ thì xóa
        if isinstance(deleted_images, list):
            HomestayImage.objects.filter(id__in=deleted_images, homestay=homestay).delete()
            
        uploaded_images = self.request.FILES.getlist("uploaded_images")
        for image in uploaded_images:
            HomestayImage.objects.create(homestay=homestay, image=image)


    # def get_serializer(self, *args, **kwargs):
    #     """🔹 Truyền context vào serializer"""
    #     kwargs["context"] = {"request": self.request}
    #     return super().get_serializer(*args, **kwargs)

class HomestayListCreateAPIView(generics.ListCreateAPIView):
    serializer_class = HomestaySerializer
    permission_classes = [permissions.IsAuthenticated, IsHost]  
    def get_queryset(self):
        return Homestay.objects.filter(host=self.request.user)

    def perform_create(self, serializer):
        serializer.save()