import json
from rest_framework import generics, permissions
from homestays.models import Homestay, HomestayImage
from .serializers import HomestaySerializer
from .permissions import IsHost
class HomestayRetrieveUpdateDestroyAPIView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = HomestaySerializer
    permission_classes = [IsHost]

    def get_queryset(self):
        return Homestay.objects.filter(host=self.request.user)
    

class HomestayListCreateAPIView(generics.ListCreateAPIView):
    serializer_class = HomestaySerializer
    permission_classes = [permissions.IsAuthenticated, IsHost]
    
    def get_queryset(self):
        return Homestay.objects.filter(host=self.request.user)