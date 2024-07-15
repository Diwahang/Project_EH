import logging
from django.contrib.auth import authenticate, update_session_auth_hash
from rest_framework import status, permissions
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView
from django.db.utils import IntegrityError
from django.core.exceptions import ValidationError
from rest_framework_simplejwt.tokens import RefreshToken
from .models import User
from .serializers import UserSerializer
from .utils import send_verification_email

logger = logging.getLogger(__name__)


class RegisterView(APIView):
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        # logger.debug("Received registration request with data: %s", request.data)
        serializer = UserSerializer(data=request.data)

        if serializer.is_valid():
            # logger.debug("Serializer data is valid.")
            try:
                user = serializer.save()
                # logger.debug("User created with id: %d", user.user_id)
                user.generate_referral_code()
                user.generate_otp()
                # logger.debug("Referral code generated for user id: %d", user.user_id)
                send_verification_email(user)
                # logger.debug("Verification email sent to user id: %d", user.user_id)
                return Response({"detail": "User registered successfully. Please check your email for the OTP."},
                                status=status.HTTP_201_CREATED)
            except IntegrityError:
                logger.warning("User with email %s already exists.", request.data.get('email'))
                return Response({"detail": "User with this email already exists."}, status=status.HTTP_400_BAD_REQUEST)
            except ValidationError as e:
                logger.warning("Validation error occurred: %s", e)
                return Response({"detail": str(e)}, status=status.HTTP_400_BAD_REQUEST)
            except Exception as e:
                logger.error("An unexpected error occurred: %s", e, exc_info=True)
                return Response({"detail": "An unexpected error occurred."},
                                status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        else:
            # logger.debug("Serializer data is invalid: %s", serializer.errors)
            for field, errors in serializer.errors.items():
                logger.error("Field: %s, Errors: %s", field, errors)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class VerifyOTPView(APIView):
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        email = request.data.get('email')
        otp = request.data.get('otp')
        # logger.debug(f"Received OTP verification request for email: {email}")
        try:
            user = User.objects.get(email=email)
            if user.check_otp(otp):
                user.is_verified = True
                user.otp = None
                user.otp_expiration = None
                user.save()
                # logger.info(f"Email verified successfully for user: {email}")
                return Response({"detail": "Email verified successfully."}, status=status.HTTP_200_OK)
            # logger.warning("Invalid or expired OTP.")
            return Response({"detail": "Invalid or expired OTP."}, status=status.HTTP_400_BAD_REQUEST)
        except User.DoesNotExist:
            # logger.warning(f"User does not exist: {email}")
            return Response({"detail": "User does not exist."}, status=status.HTTP_400_BAD_REQUEST)


class LoginView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request, *args, **kwargs):
        email_or_username = request.data.get('email_or_username')
        password = request.data.get('password')

        if not email_or_username or not password:
            return Response({"detail": "Email/Username and password are required."},
                            status=status.HTTP_400_BAD_REQUEST)

        try:
            user = authenticate(request, username=email_or_username, password=password)
            if user is not None and user.is_verified:
                refresh = RefreshToken.for_user(user)
                access_token = str(refresh.access_token)
                return Response({
                    "user_id": user.user_id,
                    "username": user.username,
                    "access_token": access_token,
                }, status=status.HTTP_200_OK)
            else:
                return Response({"detail": "Invalid credentials or unverified account."},
                                status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({"detail": "An unexpected error occurred."},
                            status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class LogoutView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, *args, **kwargs):
        # logger.debug(f"User logged out: {request.user.username}")
        request.auth.delete()
        return Response({"detail": "Logged out successfully."}, status=status.HTTP_200_OK)


class ChangePasswordView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, *args, **kwargs):
        user = request.user
        old_password = request.data.get('old_password')
        new_password = request.data.get('new_password')
        confirm_new_password = request.data.get('confirm_new_password')

        if not old_password or not new_password or not confirm_new_password:
            return Response({"detail": "All fields are required."}, status=status.HTTP_400_BAD_REQUEST)

        if not user.check_password(old_password):
            return Response({"detail": "Old password is incorrect."}, status=status.HTTP_400_BAD_REQUEST)

        if new_password != confirm_new_password:
            return Response({"detail": "New passwords do not match."}, status=status.HTTP_400_BAD_REQUEST)

        if old_password == new_password:
            return Response({"detail": "New password must be different from the old password."},
                            status=status.HTTP_400_BAD_REQUEST)

        try:
            user.set_password(new_password)
            user.save()
            update_session_auth_hash(request,
                                     user)  # This is important to keep the user logged in after password change
            return Response({"detail": "Password changed successfully."}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"detail": "An error occurred while changing the password."},
                            status=status.HTTP_500_INTERNAL_SERVER_ERROR)
