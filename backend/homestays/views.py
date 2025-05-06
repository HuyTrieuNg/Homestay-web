from rest_framework.views import APIView
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework import status
from rest_framework.generics import RetrieveAPIView
from .models import Homestay, PropertyType, Amenity, Province, District, Commune
from .serializers import *
from django.db.models import Count
from users.permissions import IsAdmin

class HomestayListView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        property_type_id = request.query_params.get('property_type_id', None)
        province = request.query_params.get('province', None)
        max_guests = request.query_params.get('max_guest_lte', None)  # Lấy giá trị max_guest từ query

        homestays = Homestay.objects.select_related(
            'type', 'commune__district__province'
        ).prefetch_related('images', 'amenities')

        if property_type_id:
            homestays = homestays.filter(type_id=property_type_id)
            
        if province:
            print("Province filter value:", province)
            homestays = homestays.filter(commune__district__province__name__icontains=province)

        if max_guests:
            try:
                max_guests = int(max_guests)
                homestays = homestays.filter(max_guests__gte=max_guests)
            except ValueError:
                return Response({"error": "Invalid max_guest value"}, status=status.HTTP_400_BAD_REQUEST)

        serializer = HomestaySerializer(homestays, many=True, context={'request': self.request})
        return Response(serializer.data)

    
class HomestayDetailView(RetrieveAPIView):
    permission_classes = [AllowAny]
    queryset = Homestay.objects.all()
    serializer_class = HomestaySerializer

class PropertyTypeListView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        property_types = PropertyType.objects.all()
        serializer = PropertitypeSerializer(property_types, many=True)
        return Response(serializer.data)
    
class AmenitiesListView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        amenities = Amenity.objects.all()
        serializer = AmenitySerializer(amenities, many=True)
        return Response(serializer.data)

class ProvincesListView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        provinces = Province.objects.all()
        serializer = ProvinceSerializer(provinces, many=True)
        return Response(serializer.data)
    
class DistrictsListView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        districts = District.objects.all()
        serializer = DistrictSerializer(districts, many=True)
        return Response(serializer.data)
    
class CommunesListView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        communes = Commune.objects.all()
        serializer = CommuneSerializer(communes, many=True)
        return Response(serializer.data)
        
class MaxGuestView(APIView):
    permission_classes = [AllowAny]
    
    def get(self, request, pk):
        homestay = Homestay.objects.get(pk=pk)
        max_guests = homestay.max_guests
        return Response({"max_guests": max_guests})
    

class HomestayStatisticsView(APIView):
    permission_classes = [IsAdmin]

    def get(self, request):
        # Tổng số homestay
        total_homestays = Homestay.objects.count()

        # Thống kê theo loại phòng
        homestay_by_type = Homestay.objects.values('type__name').annotate(count=Count('id')).order_by('type__name')

        # Trả về kết quả
        return Response({
            "total_homestays": total_homestays,
            "homestays_by_type": [{"type": item['type__name'], "count": item['count']} for item in homestay_by_type]
        })