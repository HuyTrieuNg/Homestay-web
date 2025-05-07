# # Create your views here.
# def test_view(request):
#     return JsonResponse({"message": "Hello from Django API!"})
from django.shortcuts import render
from django.http import JsonResponse
from users.models import User, Profile

from users.serializer import MyTokenObtainPairSerializer, RegisterSerializer, UserSerializer

from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework import generics
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.views import APIView

from django.db.models import Q
from .permissions import IsAdmin
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

class UserAvatarView(APIView):
    permission_classes = [IsAuthenticated]  # Chỉ cho phép user đã đăng nhập

    def get(self, request):
        user = request.user  # Lấy user hiện tại
        serializer = UserSerializer(user, context={'request': request})
        avatar_url = serializer.get_avatar_url(user)

        return Response({"avatar_url": avatar_url})

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
        
class UserStatisticsView(APIView):
    permission_classes = [IsAdmin]

    def get(self, request):
        total_users = User.objects.count()
        total_hosts = User.objects.filter(type='host').count()
        total_guests = User.objects.filter(type='guest').count()

        return Response({
            "total_users": total_users,
            "total_hosts": total_hosts,
            "total_guests": total_guests,
        })

# 1. Danh sách người dùng (có tìm kiếm từ khóa)
class UserListView(generics.ListAPIView):
    serializer_class = UserSerializer
    permission_classes = [IsAdmin]

    def get_queryset(self):
        keyword = self.request.query_params.get('keyword', '')
        return User.objects.filter(
            Q(type__in=["guest", "host"]) &
            (
                Q(username__icontains=keyword) |
                Q(email__icontains=keyword) |
                Q(name__icontains=keyword)
            )
        )


# 2. Cấp quyền host
class PromoteToHostView(APIView):
    permission_classes = [IsAdmin]

    def post(self, request, pk):
        try:
            user = User.objects.get(pk=pk)
            if user.type == 'host':
                return Response({'message': 'User is already a host'}, status=400)
            user.type = 'host'
            user.save()
            return Response({'message': 'User promoted to host successfully'})
        except User.DoesNotExist:
            return Response({'error': 'User not found'}, status=404)


# 3. Hạ quyền về guest
class DemoteToGuestView(APIView):
    permission_classes = [IsAdmin]

    def post(self, request, pk):
        try:
            user = User.objects.get(pk=pk)
            if user.type == 'guest':
                return Response({'message': 'User is already a guest'}, status=400)
            user.type = 'guest'
            user.save()
            return Response({'message': 'User demoted to guest successfully'})
        except User.DoesNotExist:
            return Response({'error': 'User not found'}, status=404)


# 4. Ban tài khoản (status = False)
class BanUserView(APIView):
    permission_classes = [IsAdmin]

    def post(self, request, pk):
        try:
            user = User.objects.get(pk=pk)
            if not user.status:
                return Response({'message': 'User is already banned'}, status=400)
            user.status = False
            user.save()
            return Response({'message': 'User has been banned'})
        except User.DoesNotExist:
            return Response({'error': 'User not found'}, status=404)


# 5. Unban tài khoản (status = True)
class UnbanUserView(APIView):
    permission_classes = [IsAdmin]

    def post(self, request, pk):
        try:
            user = User.objects.get(pk=pk)
            if user.status:
                return Response({'message': 'User is already active'}, status=400)
            user.status = True
            user.save()
            return Response({'message': 'User has been unbanned'})
        except User.DoesNotExist:
            return Response({'error': 'User not found'}, status=404)