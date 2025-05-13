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

from users.permissions import IsAdmin
from django.utils.dateparse import parse_date
from django.db.models import Sum, Count


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

        # booked_dates = HomestayAvailability.objects.filter(
        #     homestay=homestay, status='booked'
        # ).values_list('date', flat=True)

        booked_dates = HomestayAvailability.objects.filter(
            homestay=homestay,
            status__in=['booked', 'blocked']  # Lọc những status thuộc danh sách này
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
    permission_classes = [IsAuthenticated]

    def get(self, request):
        bookings = Booking.objects.filter(user=request.user).order_by('-checkin_date')
        serializer = BookingSerializer(bookings, many=True, context={"request": request})
        return Response(serializer.data)

class BookingDetailView(generics.RetrieveAPIView):
    permission_classes = [IsAuthenticated]
    
    queryset = Booking.objects.all()
    serializer_class = BookingSerializer

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



class BookingStatisticsView(APIView):
    permission_classes = [IsAdmin]

    def get(self, request):
        # Lấy khoảng thời gian từ query param, mặc định 30 ngày gần nhất
        start_date = request.query_params.get('start_date')
        end_date = request.query_params.get('end_date')

        if not start_date or not end_date:
            from datetime import date, timedelta
            end_date = date.today()
            start_date = end_date - timedelta(days=30)
        else:
            start_date = parse_date(start_date)
            end_date = parse_date(end_date)

        bookings = Booking.objects.filter(checkout_date__range=[start_date, end_date])
        confirmed = bookings.filter(status='confirmed')

        # Tổng doanh thu
        total_revenue_all = confirmed.aggregate(total=Sum('total_amount'))['total'] or 0

        # Top homestay theo doanh thu
        top_homestays = confirmed.values('homestay__id', 'homestay__name') .annotate(total_revenue=Sum('total_amount')).order_by('-total_revenue')[:20]

        # Doanh thu theo loại phòng
        by_type = confirmed.values('homestay__type__name') .annotate(total_revenue=Sum('total_amount'))

        # Doanh thu theo ngày checkout
        by_date = confirmed.values('checkout_date') .annotate(total_revenue=Sum('total_amount')) .order_by('checkout_date')

        # Tỉ lệ trạng thái booking
        status_ratio = bookings.values('status').annotate(count=Count('id'))

        top_booked_homestays = confirmed.values('homestay__id', 'homestay__name').annotate(count=Count('id')) .order_by('-count')[:20]

        return Response({
            "start_date": start_date,
            "end_date": end_date,
            "total_revenue": total_revenue_all,
            "top_homestays": RevenueByHomestaySerializer(top_homestays, many=True).data,
            "by_type": RevenueByTypeSerializer(by_type, many=True).data,
            "by_date": RevenueByDateSerializer(by_date, many=True).data,
            "status_ratio": BookingStatusRatioSerializer(status_ratio, many=True).data,
            "top_booked_homestays": BookingCountByHomestaySerializer(top_booked_homestays, many=True).data,

        })
