
from rest_framework import status, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from .serializers import UserSerializer, LoginSerializer, TokenResponseSerializer

class RegisterView(APIView):
    permission_classes = [permissions.AllowAny]
    
    def post(self, request):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            
            # Generate token
            refresh = RefreshToken.for_user(user)
            token = str(refresh.access_token)
            
            # Return user data and token
            response_serializer = TokenResponseSerializer({
                'token': token,
                'user': user
            })
            return Response(response_serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class LoginView(APIView):
    permission_classes = [permissions.AllowAny]
    
    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            email = serializer.validated_data['email']
            password = serializer.validated_data['password']
            
            user = authenticate(request, username=email, password=password)
            
            if user is not None:
                # Generate token
                refresh = RefreshToken.for_user(user)
                token = str(refresh.access_token)
                
                # Return user data and token
                user_serializer = UserSerializer(user)
                response_serializer = TokenResponseSerializer({
                    'token': token,
                    'user': user
                })
                return Response(response_serializer.data)
            else:
                return Response(
                    {'error': 'Invalid email or password'}, 
                    status=status.HTTP_401_UNAUTHORIZED
                )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class LogoutView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    
    def post(self, request):
        try:
            # In a real production system, you might want to blacklist the token here
            # For simplicity, we're just returning a success message
            return Response({"message": "Successfully logged out"}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

class UserView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    
    def get(self, request):
        """Get the current authenticated user's details"""
        serializer = UserSerializer(request.user)
        return Response(serializer.data)
