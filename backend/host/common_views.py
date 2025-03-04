from rest_framework import generics, permissions, status
from rest_framework.views import APIView
from rest_framework.response import Response
from homestays.models import Homestay, Province, District, Commune, Amenity
from .common_serializers import ProvinceSerializer, DistrictSerializer, CommuneSerializer, AmenitySerializer

# Endpoint trả về danh sách loại homestay dựa vào Homestay.HOMESTAY_TYPES
class HomestayTypeListAPIView(APIView):
    permission_classes = [permissions.AllowAny]
    authentication_classes = []  # Tắt authentication cho view này

    def get(self, request):
        types = Homestay.HOMESTAY_TYPES
        data = [{"value": t[0], "label": t[1]} for t in types]
        return Response(data, status=status.HTTP_200_OK)

# Endpoint trả về danh sách provinces
class ProvinceListAPIView(generics.ListAPIView):
    queryset = Province.objects.all()
    serializer_class = ProvinceSerializer
    permission_classes = [permissions.AllowAny]
    authentication_classes = []  # Tắt authentication cho view này

# Endpoint trả về danh sách districts, có thể lọc theo province_id
class DistrictListAPIView(generics.ListAPIView):
    serializer_class = DistrictSerializer
    permission_classes = [permissions.AllowAny]
    authentication_classes = []  # Tắt authentication cho view này

    def get_queryset(self):
        province_id = self.request.query_params.get('province_id')
        queryset = District.objects.all()
        if province_id:
            queryset = queryset.filter(province_id=province_id)
        return queryset

# Endpoint trả về danh sách communes, có thể lọc theo district_id
class CommuneListAPIView(generics.ListAPIView):
    serializer_class = CommuneSerializer
    permission_classes = [permissions.AllowAny]
    authentication_classes = []  # Tắt authentication cho view này

    def get_queryset(self):
        district_id = self.request.query_params.get('district_id')
        queryset = Commune.objects.all()
        if district_id:
            queryset = queryset.filter(district_id=district_id)
        return queryset

# Endpoint trả về danh sách amenities
class AmenityListAPIView(generics.ListAPIView):
    queryset = Amenity.objects.all()
    serializer_class = AmenitySerializer
    permission_classes = [permissions.AllowAny]
    authentication_classes = []  # Tắt authentication cho view này
