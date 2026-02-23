from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.response import Response
from rest_framework import status
import datetime


class CustomTokenObtainPairView(TokenObtainPairView):
    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)
        if response.status_code == status.HTTP_200_OK:
            refresh = response.data["refresh"]
            access = response.data["access"]

            response.set_cookie(
                key="refresh_token",
                value=refresh,
                httponly=True,
                secure=False, # True for HTTPS
                samesite="Lax", # "Strict" for HTTPS
                max_age=7 * 24 * 60 * 60  # 7 days
            )

            response.data = {"access": access}

        return response
