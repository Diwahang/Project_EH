from django.contrib.auth.models import AbstractUser, Group, Permission
from django.db import models
import uuid
from django.utils import timezone
from datetime import timedelta
import random
import string


class User(AbstractUser):
    email = models.EmailField(unique=True)
    is_verified = models.BooleanField(default=False)
    user_id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    otp = models.CharField(max_length=6, blank=True, null=True)
    otp_expiration = models.DateTimeField(blank=True, null=True)
    referral_code = models.CharField(max_length=6, unique=True, blank=True, null=True)
    referral_count = models.PositiveIntegerField(default=0)
    referred_by = models.ForeignKey('self', on_delete=models.SET_NULL, null=True, blank=True, related_name='referrals')
    date_joined = models.DateField(default=timezone.now)
    REQUIRED_FIELDS = ['email']

    def __str__(self):
        return self.username

    groups = models.ManyToManyField(Group, related_name='user_set_custom', blank=True)
    user_permissions = models.ManyToManyField(Permission, related_name='user_set_custom', blank=True)

    def generate_otp(self):
        self.otp = str(random.randint(100000, 999999))
        self.otp_expiration = timezone.now() + timedelta(minutes=10)
        self.save()

    def check_otp(self, otp):
        return self.otp == otp and timezone.now() < self.otp_expiration

    def generate_referral_code(self):
        code = ''.join(random.choices(string.ascii_uppercase + string.digits, k=6))
        while User.objects.filter(referral_code=code).exists():
            code = ''.join(random.choices(string.ascii_uppercase + string.digits, k=6))
        self.referral_code = code
        self.save()
