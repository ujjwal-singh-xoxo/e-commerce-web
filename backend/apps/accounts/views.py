from django.contrib.auth import authenticate, login, logout
from django.views.decorators.csrf import ensure_csrf_cookie
from django.utils.decorators import method_decorator
from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from .authentication import DevelopmentSessionAuthentication
from .models import UserProfile


@method_decorator(ensure_csrf_cookie, name="dispatch")
class CsrfView(APIView):
    permission_classes = [AllowAny]
    def get(self, request):
        return Response({"detail": "CSRF cookie set"})


class RegisterView(APIView):
    permission_classes = [AllowAny]
    def post(self, request):
        data = request.data
        if UserProfile.objects.filter(email=data.get("email", "").lower()).exists():
            return Response({"detail": "An account already exists for this email."}, status=400)
        required = ("name", "email", "phone_number", "password")
        if any(not data.get(field) for field in required):
            return Response({"detail": "Please complete every field."}, status=400)
        user = UserProfile(name=data["name"], email=data["email"].lower(), phone_number=data["phone_number"], is_active=True, is_staff=False)
        user.set_password(data["password"])
        user.full_clean()
        user.save()
        login(request, user)
        return Response({"name": user.name, "email": user.email}, status=status.HTTP_201_CREATED)


class LoginView(APIView):
    permission_classes = [AllowAny]
    def post(self, request):
        user = authenticate(request, username=request.data.get("email"), password=request.data.get("password"))
        if not user:
            return Response({"detail": "Email or password is incorrect."}, status=400)
        login(request, user)
        return Response({"name": user.name, "email": user.email})


class SessionView(APIView):
    authentication_classes = [DevelopmentSessionAuthentication]
    permission_classes = [IsAuthenticated]
    def get(self, request):
        return Response({"name": request.user.name, "email": request.user.email, "phone_number": request.user.phone_number})


class LogoutView(APIView):
    authentication_classes = [DevelopmentSessionAuthentication]
    permission_classes = [IsAuthenticated]
    def post(self, request):
        logout(request)
        return Response(status=status.HTTP_204_NO_CONTENT)
