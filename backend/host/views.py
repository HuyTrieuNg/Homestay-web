from django.shortcuts import render

from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework import status
from homestays.models import Homestay
from homestays.serializers import HomestaySerializer

# Lấy danh sách homestay của chính host đó
class HostHomestayListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        homestays = Homestay.objects.filter(host=request.user)  # Lọc homestays của host
        serializer = HomestaySerializer(homestays, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

# Tạo homestay mới (host phải đăng nhập)
class HomestayCreateView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = HomestaySerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(host=request.user)  # Gán host chính là user đang đăng nhập
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# Lấy, cập nhật, xóa homestay (chỉ host sở hữu mới làm được)
class HomestayDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def get_object(self, pk, user):
        try:
            return Homestay.objects.get(pk=pk, host=user)  # Chỉ lấy homestay của chính host đó
        except Homestay.DoesNotExist:
            return None

    def get(self, request, pk):
        homestay = self.get_object(pk, request.user)
        if homestay:
            serializer = HomestaySerializer(homestay)
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response({"error": "Homestay not found or unauthorized"}, status=status.HTTP_404_NOT_FOUND)

    def put(self, request, pk):
        homestay = self.get_object(pk, request.user)
        if not homestay:
            return Response({"error": "Homestay not found or unauthorized"}, status=status.HTTP_404_NOT_FOUND)
        
        serializer = HomestaySerializer(homestay, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        homestay = self.get_object(pk, request.user)
        if not homestay:
            return Response({"error": "Homestay not found or unauthorized"}, status=status.HTTP_404_NOT_FOUND)
        
        homestay.delete()
        return Response({"message": "Homestay deleted successfully"}, status=status.HTTP_204_NO_CONTENT)
