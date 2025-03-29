from datetime import timedelta
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import generics
from rest_framework import status
from .permissions import IsHost
from homestays.models import Homestay, HomestayImage
from .serializers import HomestaySerializer
from booking.serializers import BookingSerializer, HomestayAvailabilitySerializer, BookingLineSerializer
from booking.models import Booking, HomestayAvailability
from django.shortcuts import get_object_or_404

class HomestayRetrieveUpdateDestroyAPIView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = HomestaySerializer
    permission_classes = [IsHost]

    def get_queryset(self):
        return Homestay.objects.filter(host=self.request.user)
    

class HomestayListCreateAPIView(generics.ListCreateAPIView):
    serializer_class = HomestaySerializer
    permission_classes = [IsHost]
    
    def get_queryset(self):
        return Homestay.objects.filter(host=self.request.user)
    
class HostBookingListView(APIView):
    permission_classes = [IsHost]
    
    def get(self, request):
        type_view = request.query_params.get('type')
        if type_view in ['pending', 'confirmed', 'cancelled', 'rejected']:
            bookings = Booking.objects.filter(homestay__host=request.user, status=type_view)
        else:
            bookings = Booking.objects.filter(homestay__host=request.user)
        serializer = BookingSerializer(bookings, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

class HostBookingView(APIView):
    permission_classes = [IsHost]

    def get(self, request, booking_id):
        booking = get_object_or_404(Booking, id=booking_id, homestay__host=request.user)
        serializer = BookingSerializer(booking) 
        return Response(serializer.data, status=status.HTTP_200_OK)


class BookingProcessing(APIView):
    permission_classes = [IsHost]
    
    def post(self, request, booking_id):
        try:
            booking = Booking.objects.get(id=booking_id, homestay__host=request.user)
            #chỉ cập nhật khi đang ở pending
            if booking.status != 'pending':
                return Response({"message": "Booking cannot be updated"}, status=status.HTTP_400_BAD_REQUEST)
            new_status = request.data.get('action')
            # chỉ cho phép xác nhận hoặc từ chối
            if new_status not in ['confirmed', 'rejected']:
                return Response({"message": "Invalid action"}, status=status.HTTP_400_BAD_REQUEST)
            # Nếu là xác nhận thì set các ngày đã chọn thành booked
            if new_status == 'confirmed':

                availabilities = HomestayAvailability.objects.filter(
                    homestay=booking.homestay,
                    date__range=[booking.checkin_date, booking.checkout_date]
                )
                # lấy các ngày có sẵn trong database
                existing_dates = set(availabilities.values_list('date', flat=True))
                # Cập nhật các ngày đã có sẵn
                availabilities.update(status="booked", booking=booking)

                
                # Duyệt qua các ngày chưa có sẵn thì tạo mới
                current_date = booking.checkin_date
                while current_date <= booking.checkout_date:
                    if current_date not in existing_dates:
                        HomestayAvailability.objects.create(
                            homestay=booking.homestay,
                            date=current_date,
                            price= booking.homestay.base_price,
                            status="booked",
                            booking=booking
                        )
                    current_date += timedelta(days=1)
                

            # cập nhật trạng thái booking
            booking.status = new_status
            booking.save()
            return Response({"message": "Booking updated"}, status=status.HTTP_200_OK)
        except Booking.DoesNotExist:
            return Response({"message": "Booking not found"}, status=status.HTTP_404_NOT_FOUND)

class BookingLineListView(APIView):
    permission_classes = [IsHost]
    
    def get(self, request, booking_id):
        try:
            booking = Booking.objects.get(id=booking_id, homestay__host=request.user)
            serializer = BookingLineSerializer(booking.booking_lines.all(), many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Booking.DoesNotExist:
            return Response({"message": "Booking not found"}, status=status.HTTP_404_NOT_FOUND)

class HomestayAvailabilityViews(APIView):
    permission_classes = [IsHost]
    
    def get(self, request, pk):
        homestay = get_object_or_404(Homestay, pk=pk, host=request.user)  # Kiểm tra chủ sở hữu
        availabilities = HomestayAvailability.objects.filter(homestay=homestay)
        serializer = HomestayAvailabilitySerializer(availabilities, many=True)
        return Response(serializer.data)

    def patch(self, request, pk):
        homestay = get_object_or_404(Homestay, pk=pk, host=request.user)  # Kiểm tra chủ sở hữu
        date = request.data.get("date")
        new_price = request.data.get("price")
        new_status = request.data.get("status")

        if not date:
            return Response({"error": "Date is required"}, status=status.HTTP_400_BAD_REQUEST)

        # Tìm hoặc tạo availability
        availability, created = HomestayAvailability.objects.get_or_create(
            homestay=homestay,
            date=date,
            defaults={
                "price": new_price if new_price is not None else homestay.base_price,
                "status": new_status if new_status in ["available", "blocked"] else "available"
            }
        )

        # Nếu không phải tạo mới, thì cập nhật giá và trạng thái
        if not created:
            if new_price is not None:
                availability.price = new_price
            if new_status is not None:
                if new_status not in ["available", "booked", "blocked"]:
                    return Response({"error": "Invalid status value"}, status=status.HTTP_400_BAD_REQUEST)
                availability.status = new_status
            availability.save()

        serializer = HomestayAvailabilitySerializer(availability)
        return Response(serializer.data, status=status.HTTP_200_OK)
