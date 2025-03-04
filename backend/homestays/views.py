from rest_framework.views import APIView
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.generics import RetrieveAPIView
from .models import Homestay, PropertyType, Amenity
from .serializers import HomestaySerializer, HomestayListSerializer, PropertitypeSerializer, AmenitySerializer

class HomestayListView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        homestays = Homestay.objects.all()
        serializer = HomestayListSerializer(homestays, many=True, context={'request': self.request})
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