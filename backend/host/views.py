from django.shortcuts import render

from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework import status
from homestays.models import Homestay, HomestayAvailability
from rest_framework import generics
from .serializers import *

from .permissions import IsHost
class HomestayListCreateView(APIView):
    permission_classes = [IsAuthenticated, IsHost]

    def get(self, request):
        # Lấy danh sách homestay của host đang đăng nhập
        homestays = Homestay.objects.filter(host=request.user)
        serializer = HomestaySerializer(homestays, many=True)
        return Response(serializer.data)

    def post(self, request):
        # Khi tạo mới, gán host là user đang đăng nhập
        serializer = HomestaySerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(host=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class HomestayDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def get_object(self, pk, user):
        try:
            # Chỉ cho phép host của homestay truy cập
            return Homestay.objects.get(pk=pk, host=user)
        except Homestay.DoesNotExist:
            return None

    def get(self, request, pk):
        homestay = self.get_object(pk, request.user)
        if not homestay:
            return Response({"error": "Homestay not found"}, status=status.HTTP_404_NOT_FOUND)
        serializer = HomestaySerializer(homestay)
        return Response(serializer.data)

    def put(self, request, pk):
        homestay = self.get_object(pk, request.user)
        if not homestay:
            return Response({"error": "Homestay not found"}, status=status.HTTP_404_NOT_FOUND)
        serializer = HomestaySerializer(homestay, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()  # Trong update, nếu có amenities, chúng ta xử lý như ở serializer.update()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        homestay = self.get_object(pk, request.user)
        if not homestay:
            return Response({"error": "Homestay not found"}, status=status.HTTP_404_NOT_FOUND)
        homestay.delete()
        return Response({"message": "Deleted successfully"}, status=status.HTTP_204_NO_CONTENT)



class AvailabilityListCreateView(generics.ListCreateAPIView):
    serializer_class = HomestayAvailabilitySerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # Lấy homestay_id từ URL (ví dụ: /api/homestays/{homestay_id}/availability/)
        homestay_id = self.kwargs.get('homestay_id')
        # Kiểm tra homestay thuộc về host đang đăng nhập
        return HomestayAvailability.objects.filter(
            homestay__id=homestay_id,
            homestay__host=self.request.user
        )

    def perform_create(self, serializer):
        homestay_id = self.kwargs.get('homestay_id')
        # Lấy homestay của host
        homestay = Homestay.objects.get(id=homestay_id, host=self.request.user)
        serializer.save(homestay=homestay)

class AvailabilityDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = HomestayAvailabilitySerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        homestay_id = self.kwargs.get('homestay_id')
        return HomestayAvailability.objects.filter(
            homestay__id=homestay_id,
            homestay__host=self.request.user
        )