from rest_framework import serializers
from .models import User
from create.models import UserWallet, UserProfile


class UserSerializer(serializers.ModelSerializer):
    referral_code = serializers.CharField(write_only=True, required=False, allow_blank=True)

    class Meta:
        model = User
        fields = ['user_id', 'email', 'username', 'first_name', 'last_name', 'password', 'referral_code',
                  'referral_count', 'date_joined']
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        referral_code = validated_data.pop('referral_code', None)
        user = User.objects.create_user(**validated_data)
        UserWallet.objects.create(user=user)
        UserProfile.objects.create(user=user)

        if referral_code:
            try:
                referrer = User.objects.get(referral_code=referral_code)
                referrer.referral_count += 1
                referrer.save()
                user.referred_by = referrer
                user.save()
            except User.DoesNotExist:
                pass  # Optional: handle invalid referral code

        return user
