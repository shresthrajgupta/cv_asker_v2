from django.contrib.auth import get_user_model
from djoser.views import UserViewSet

User = get_user_model()


class CustomSignUpView(UserViewSet):
    def create(self, request, *args, **kwargs):
        email = request.data.get("email")
        
        # If user exists but is inactive, delete them so they can re-register
        try:
            existing_user = User.objects.get(email=email)
            if not existing_user.is_active:
                print("Deleting user...")
                existing_user.delete()
        except User.DoesNotExist:
            pass

        return super().create(request, *args, **kwargs)
