from rest_framework_simplejwt.views import TokenRefreshView
from rest_framework.response import Response


class CookieTokenRefreshView(TokenRefreshView):
    def post(self, request, *args, **kwargs):
        refresh_token = request.COOKIES.get("refresh_token")

        if not refresh_token:
            return Response({"message": "refresh token required", "status": 404})

        request.data["refresh"] = refresh_token
        response =  super().post(request, *args, **kwargs)

        response.data.pop("refresh")
        return response