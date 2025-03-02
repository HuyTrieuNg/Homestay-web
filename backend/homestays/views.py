from rest_framework.views import APIView
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from .models import Homestay, PropertyType, Amenity
from .serializers import HomestaySerializer, PropertitypeSerializer, AmenitySerializer

class HomestayListView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        homestays = Homestay.objects.all()
        serializer = HomestaySerializer(homestays, many=True)
        return Response(serializer.data)

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