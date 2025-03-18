# # Create your views here.
# def test_view(request):
#     return JsonResponse({"message": "Hello from Django API!"})
from django.shortcuts import render
from django.http import JsonResponse
from users.models import User

from users.serializer import MyTokenObtainPairSerializer, RegisterSerializer, UserSerializer

from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework import generics
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes


class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = (AllowAny,)
    serializer_class = RegisterSerializer

class UserProfileView(generics.RetrieveUpdateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user  # Lấy user đang đăng nhập


# Get All Routes

@api_view(['GET'])
def getRoutes(request):
    routes = [
        '/api/token/',
        '/api/register/',
        '/api/token/refresh/',
        # 'api/profile/'
    ]
    return Response(routes)


@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def testEndPoint(request):
    if request.method == 'GET':
        data = f"Congratulation {request.user}, your API just responded to GET request"
        return Response({'response': data}, status=status.HTTP_200_OK)
    elif request.method == 'POST':
        text = "Hello buddy"
        data = f'Congratulation your API just responded to POST request with text: {text}'
        return Response({'response': data}, status=status.HTTP_200_OK)
    return Response({}, status.HTTP_400_BAD_REQUEST)

# from rest_framework.views import APIView
# from rest_framework.permissions import AllowAny
# from django.contrib.auth import authenticate
# from rest_framework_simplejwt.tokens import RefreshToken
# from rest_framework import status


# class LoginView(APIView):
#     permission_classes = [AllowAny]  # Cho phép mọi người truy cập API này

#     def post(self, request):
#         username = request.data.get('username')
#         password = request.data.get('password')
#         print (request.data.get('username'))
#         print (request.data.get('password'))
#         user = authenticate(username=username, password=password)
#         if user is None:
#             print("❌ DEBUG: Login thất bại - Sai username hoặc password!")
#             return Response({"error": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)

#         if not user.is_active:
#             print("❌ DEBUG: Tài khoản bị vô hiệu hóa!")
#             return Response({"error": "User is inactive"}, status=status.HTTP_403_FORBIDDEN)

#         if user is not None:
#             refresh = RefreshToken.for_user(user)
#             return Response({
#                 'refresh': str(refresh),
#                 'access': str(refresh.access_token),
#                 'user_id': user.id,
#                 'username': user.username,
#                 'type': user.type  # Host hoặc Guest
#             }, status=status.HTTP_200_OK)
#         else:
#             return Response({"error": "Sai tài khoản hoặc mật khẩu"}, status=status.HTTP_401_UNAUTHORIZED)
        
