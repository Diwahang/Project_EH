from django.contrib.auth.backends import ModelBackend
from django.contrib.auth import get_user_model


class CustomBackend(ModelBackend):
    def authenticate(self, request, username=None, password=None, **kwargs):
        UserModel = get_user_model()
        if username is None:
            username = kwargs.get(UserModel.USERNAME_FIELD)
        try:
            user = UserModel.objects.get(email=username)  # Attempt to fetch user by email
        except UserModel.DoesNotExist:
            try:
                user = UserModel.objects.get(username=username)  # Attempt to fetch user by username
            except UserModel.DoesNotExist:
                return None
        if user.check_password(password) and self.user_can_authenticate(user):
            return user
        return None
