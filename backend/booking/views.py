from rest_framework.views import APIView
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from django.shortcuts import get_object_or_404

from homestays.models import Homestay
from booking.models import HomestayAvailability
from .serializers import HomestayAvailabilitySerializer

class BookingAvailabilityView(APIView):
    permission_classes = [AllowAny]
    
    def get(self, request, pk):
        homestay = Homestay.objects.get(pk=pk)
        availabilities = HomestayAvailability.objects.filter(homestay=homestay)
        serializer = HomestayAvailabilitySerializer(availabilities, many=True)
        return Response(serializer.data)

class UnavailableDatesView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, pk):
        homestay = get_object_or_404(Homestay, pk=pk)

        booked_dates = HomestayAvailability.objects.filter(
            homestay=homestay, status='booked'
        ).values_list('date', flat=True)

        return Response({"unavailable_dates": list(booked_dates)})
    
class PricesView(APIView):
    permission_classes = [AllowAny]
    
    def get(self, request, pk):
        homestay = Homestay.objects.get(pk=pk)
        availabilities = HomestayAvailability.objects.filter(homestay=homestay)
        
        available_dates = []
        price_map = {}

        for availability in availabilities:
            date_str = availability.date.strftime("%Y-%m-%d")
            available_dates.append(date_str)
            price_map[date_str] = availability.price
        
        return Response({
            "price_map": price_map
        })