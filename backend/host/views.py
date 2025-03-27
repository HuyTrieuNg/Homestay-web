from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import generics
from rest_framework import status
from .permissions import IsHost
from homestays.models import Homestay, HomestayImage
from .serializers import HomestaySerializer
from booking.serializers import BookingSerializer, HomestayAvailabilitySerializer, BookingLineSerializer
from booking.models import Booking, HomestayAvailability

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
        type = request.query_params.get('type')
        if type in ['pending', 'confirmed', 'cancelled', 'rejected']:
            bookings = Booking.objects.filter(homestay__host=request.user, status=type)
        else:
            bookings = Booking.objects.filter(homestay__host=request.user)
        serializer = BookingSerializer(bookings, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

class BookingProcessing(APIView):
    permission_classes = [IsHost]
    
    def post(self, request, booking_id):
        try:
            booking = Booking.objects.get(id=booking_id, homestay__host=request.user)
            if booking.status == 'pending':
                new_status = request.data.get('action')
                if new_status in ['confirmed', 'rejected']:
                    booking.status = new_status
                    booking.save()
                    return Response({"message": "Booking updated"}, status=status.HTTP_200_OK)
                else:
                    return Response({"message": "Invalid action"}, status=status.HTTP_400_BAD_REQUEST)
        except Booking.DoesNotExist:
            return Response({"message": "Booking not found"}, status=status.HTTP_404_NOT_FOUND)

class BookingLineListView(APIView):
    permission_classes = [IsHost]
    
    def get(self, request, booking_id):
        try:
            booking = Booking.objects.get(id=booking_id, homestay__host=request.user)
            serializer = BookingLineSerializer(booking.booking_lines, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Booking.DoesNotExist:
            return Response({"message": "Booking not found"}, status=status.HTTP_404_NOT_FOUND)
