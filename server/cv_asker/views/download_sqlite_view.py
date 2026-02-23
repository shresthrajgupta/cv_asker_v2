import os
from django.conf import settings
from django.http import FileResponse
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status


class DownloadDatabaseView(APIView):
    def get(self, request):
        db_path = os.path.join(settings.BASE_DIR, "db.sqlite3")

        if not os.path.exists(db_path):
            return Response(
                {"error": "Database file not found."},
                status=status.HTTP_404_NOT_FOUND
            )

        user = request.user

        if not user.is_staff:
            return Response(
                {"error": "Admin privileges required."},
                status=status.HTTP_403_FORBIDDEN
            )

        response = FileResponse(
            open(db_path, "rb"),
            as_attachment=True,
            filename="db.sqlite3"
        )
        return response
