from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions

from ..models import UserProfile
from ..serializers import UserProfileCreateSerializer
from ..serializers import UserProfileUpdateSerializer
from ..serializers import UserProfileGetSerializer


# fmt: off
class UserProfileCreateView(APIView):
    def post(self, request):
        serializer = UserProfileCreateSerializer(data=request.data, context={"request": request})

        if serializer.is_valid():
            profile = serializer.save()

            return Response(
                {"message": "Profile created successfully", "id": profile.id},
                status=status.HTTP_201_CREATED
            )

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def patch(self, request):
        input = request.data

        allowed_keys = ["job_profile", "experience_years", "skills"]
        if any(key not in allowed_keys for key in input.keys()):
            return Response({"error": "invalid request format"})

        try:
            profile = UserProfile.objects.get(user=request.user)
        except UserProfile.DoesNotExist:
            return Response({"detail": "Profile not found"}, status=status.HTTP_404_NOT_FOUND)

        serializer = UserProfileUpdateSerializer(profile, data=request.data, partial=True, context={"request": request})
        if serializer.is_valid():
            profile = serializer.save()
            return Response({"message": "Profile updated"}, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def get(self, request):
        try:
            profile = request.user.profile
        except UserProfile.DoesNotExist:
            return Response({"detail": "Profile not found."}, status=404)

        serializer = UserProfileGetSerializer(profile)
        return Response(serializer.data)
