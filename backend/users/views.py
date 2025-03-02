from rest_framework.decorators import api_view
from rest_framework.response import Response

@api_view(['GET'])
def get_data(request):
    data = {"message": "Hello from Django!"}
    return Response(data)


from rest_framework.views import APIView
from rest_framework.permissions import AllowAny
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework import status


class LoginView(APIView):
    permission_classes = [AllowAny]  # Cho phép mọi người truy cập API này

    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        print (request.data.get('username'))
        print (request.data.get('password'))
        user = authenticate(username=username, password=password)
        if user is None:
            print("❌ DEBUG: Login thất bại - Sai username hoặc password!")
            return Response({"error": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)

        if not user.is_active:
            print("❌ DEBUG: Tài khoản bị vô hiệu hóa!")
            return Response({"error": "User is inactive"}, status=status.HTTP_403_FORBIDDEN)

        if user is not None:
            refresh = RefreshToken.for_user(user)
            return Response({
                'refresh': str(refresh),
                'access': str(refresh.access_token),
                'user_id': user.id,
                'username': user.username,
                'type': user.type  # Host hoặc Guest
            }, status=status.HTTP_200_OK)
        else:
            return Response({"error": "Sai tài khoản hoặc mật khẩu"}, status=status.HTTP_401_UNAUTHORIZED)
        


        