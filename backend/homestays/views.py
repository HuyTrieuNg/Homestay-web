from rest_framework.views import APIView
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from .models import Homestay
from .serializers import HomestaySerializer

class HomestayListView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        homestays = Homestay.objects.all()
        serializer = HomestaySerializer(homestays, many=True)
        return Response(serializer.data)
