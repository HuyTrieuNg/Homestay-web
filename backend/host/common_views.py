from django.shortcuts import get_object_or_404
from rest_framework import generics, permissions, status
from rest_framework.views import APIView
from rest_framework.response import Response
from homestays.models import Homestay, Province, District, Commune, Amenity, PropertyType
from .common_serializers import ProvinceSerializer, DistrictSerializer, CommuneSerializer, AmenitySerializer

# Endpoint trả về danh sách loại homestay dựa vào Homestay.HOMESTAY_TYPES
class HomestayTypeListAPIView(APIView):
    permission_classes = [permissions.AllowAny]
    authentication_classes = []  # Tắt authentication cho view này

    def get(self, request):
        types = PropertyType.objects.all()
        data = [{"value": t.id, "label": t.name} for t in types]
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

class CommuneListAPIView(generics.ListAPIView):
    serializer_class = CommuneSerializer
    permission_classes = [permissions.AllowAny]
    authentication_classes = []  # Tắt authentication cho view này

    def list(self, request, *args, **kwargs):
        commune_id = self.request.query_params.get("id")  # Lấy id của xã
        district_id = self.request.query_params.get("district_id")  # Lấy id của huyện

        if commune_id:  # Nếu có `commune_id`, trả về thông tin xã + huyện + tỉnh
            commune = get_object_or_404(Commune, id=commune_id)
            district = commune.district
            province = district.province

            return Response({
                "commune_name": commune.name,
                "district_id": district.id,
                "district_name": district.name,
                "province_id": province.id,
                "province_name": province.name,
            })

        elif district_id:  # Nếu có `district_id`, trả về danh sách xã thuộc huyện
            queryset = Commune.objects.filter(district_id=district_id)
            serializer = self.get_serializer(queryset, many=True)
            return Response(serializer.data)


        


# Endpoint trả về danh sách amenities
class AmenityListAPIView(generics.ListAPIView):
    queryset = Amenity.objects.all()
    serializer_class = AmenitySerializer
    permission_classes = [permissions.AllowAny]
    authentication_classes = []  # Tắt authentication cho view này
