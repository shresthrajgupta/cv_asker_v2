from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status


# fmt: off 
class CustomTokenDeleteView(APIView):
    def post(self, request, *args, **kwargs):
        response = Response({"message": "Logged out successfully"}, status=status.HTTP_200_OK)

        response.delete_cookie(
            key="refresh_token",
            path="/",
            samesite="Strict"
        )

        return response
