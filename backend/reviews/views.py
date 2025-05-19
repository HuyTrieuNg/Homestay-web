from datetime import datetime, timedelta
from django.utils import timezone
from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from homestays.models import Homestay
from booking.models import Booking
from reviews.serializers import ReviewSerializer
from reviews.models import Review
from rest_framework.permissions import IsAuthenticated

# Create your views here.
class ReviewListCreateView(APIView):
    # permission_classes = [IsAuthenticated]
    # def get(self, request, homestay_id, format=None):
    #     reviews = Review.objects.filter(homestay_id=homestay_id)
    #     serializer = ReviewSerializer(reviews, many=True,  context={'request': request})
    #     return Response(serializer.data)

    # def post(self, request, homestay_id, format=None):
    #     # Check if user has a booking with this homestay and it's completed (optional logic)
    #     try:
    #         booking = Booking.objects.get(user=request.user, homestay_id=homestay_id)
    #     except Booking.DoesNotExist:
    #         return Response({"detail": "You haven't booked this homestay."}, status=status.HTTP_400_BAD_REQUEST)

    #     # Check if already reviewed
    #     if Review.objects.filter(booking=booking).exists():
    #         return Response({"detail": "You already reviewed this booking."}, status=status.HTTP_400_BAD_REQUEST)

    #     data = request.data.copy()
    #     data["user"] = request.user.id
    #     data["homestay"] = homestay_id
    #     data["booking"] = booking.id

    #     serializer = ReviewSerializer(data=data)
    #     if serializer.is_valid():
    #         serializer.save()
    #         return Response(serializer.data, status=status.HTTP_201_CREATED)
    #     return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    def get(self, request, homestay_id, format=None):
        booking_id = request.query_params.get('booking')
        if booking_id:
            reviews = Review.objects.filter(homestay_id=homestay_id, booking_id=booking_id, user=request.user)
        else:
            reviews = Review.objects.filter(homestay_id=homestay_id)

        serializer = ReviewSerializer(reviews, many=True, context={'request': request})
        return Response(serializer.data)

    def post(self, request, homestay_id, format=None):
        print("Request user:", request.user)  # Debug: Verify authenticated user
        print("Request data:", request.data)  # Debug: Verify input data
        try:
            homestay = Homestay.objects.get(id=homestay_id)
        except Homestay.DoesNotExist:
            return Response({"error": "Homestay không tồn tại."}, status=status.HTTP_404_NOT_FOUND)

        # Lấy dữ liệu từ request
        # print(request.data)
        data = request.data.copy()
        data['homestay'] = homestay.id
        # data['user'] = request.user.id
        print(request.data)
        # Đảm bảo booking tồn tại và thuộc về user
        booking_id = data.get('booking')
        try:
            booking = Booking.objects.get(id=booking_id, user=request.user, homestay=homestay)
        except Booking.DoesNotExist:
            return Response({"error": "Booking không hợp lệ."}, status=status.HTTP_400_BAD_REQUEST)

        # Kiểm tra trạng thái booking
        if booking.status != 'confirmed':
            return Response({"error": "Chỉ có thể đánh giá các booking đã được xác nhận."}, status=status.HTTP_400_BAD_REQUEST)

        # Kiểm tra ngày checkout
        current_date = timezone.now().date()
        checkout_date = booking.checkout_date
        if current_date < checkout_date:
            return Response({"error": "Chưa thể đánh giá vì chưa đến ngày checkout."}, status=status.HTTP_400_BAD_REQUEST)

        # Kiểm tra thời hạn 14 ngày sau checkout
        review_deadline = checkout_date + timedelta(days=14)
        if current_date > review_deadline:
            return Response({"error": "Thời hạn đánh giá đã hết (14 ngày sau checkout)."}, status=status.HTTP_400_BAD_REQUEST)

        # Kiểm tra đã review chưa (vì mỗi booking chỉ được review 1 lần)
        if hasattr(booking, 'review'):
            return Response({"error": "Bạn đã đánh giá homestay này rồi."}, status=status.HTTP_400_BAD_REQUEST)
        print("Data being sent to serializer:", data)  # Debug
        serializer = ReviewSerializer(data=data, context={'request': request})
        if serializer.is_valid():
            serializer.save(user=request.user.id)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        print("Serializer errors:", serializer.errors)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)