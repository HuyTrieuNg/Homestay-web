from rest_framework.views import APIView
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework import status
from datetime import datetime
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import generics
from django.shortcuts import get_object_or_404

from homestays.models import Homestay
from booking.models import *
from .serializers import *

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
  
class UserBookingView(APIView):
    # permission_classes = [IsAuthenticated]

    def get(self, request):
        bookings = Booking.objects.filter(user=request.user).order_by('-checkin_date')
        serializer = BookingSerializer(bookings, many=True, context={"request": request})
        return Response(serializer.data)

class BookingDetailView(generics.RetrieveAPIView):
    queryset = Booking.objects.all()
    serializer_class = BookingSerializer
    # permission_classes = [IsAuthenticated]

class CreateBookingView(APIView):
    permission_classes = [IsAuthenticated]
    
    def post(self, request, homestay_id):
        homestay = get_object_or_404(Homestay, id=homestay_id)
        user = request.user
        
        checkin_date = request.data.get('checkin_date')
        checkout_date = request.data.get('checkout_date')
        adults = request.data.get('adults', 1)
        children = request.data.get('children', 0)
        currency = request.data.get('currency', 'USD')
        note = request.data.get('note', '')
        
        try:
            checkin_date = datetime.strptime(checkin_date, "%Y-%m-%d").date()
            checkout_date = datetime.strptime(checkout_date, "%Y-%m-%d").date()
        except ValueError:
            return Response({'error': 'Invalid date format. Use YYYY-MM-DD.'}, status=status.HTTP_400_BAD_REQUEST)
        
        if checkin_date >= checkout_date:
            return Response({'error': 'Checkout date must be after check-in date.'}, status=status.HTTP_400_BAD_REQUEST)
        
        total_guests = adults + children
        subtotal, fee, total_amount = Booking.calculate_booking_price(homestay, checkin_date, checkout_date)
        
        booking = Booking.objects.create(
            user=user,
            homestay=homestay,
            checkin_date=checkin_date,
            checkout_date=checkout_date,
            guests=total_guests,
            status='pending',
            currency=currency,
            subtotal=subtotal,
            fee=fee,
            total_amount=total_amount,
            note=note
        )
        
        serializer = BookingSerializer(booking)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

