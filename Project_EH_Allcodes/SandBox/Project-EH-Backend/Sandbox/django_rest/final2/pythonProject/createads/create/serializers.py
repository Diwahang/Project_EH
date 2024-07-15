from phonenumber_field.serializerfields import PhoneNumberField
from .models import Advertisement, UserWallet, UserTransaction, Category, UserProfile
from django.contrib.auth.models import AbstractUser
from .models import User
from rest_framework import serializers


class AdvertisementSerializer(serializers.ModelSerializer):
    user_name = serializers.SerializerMethodField()
    category_name = serializers.CharField(source='category.name')

    class Meta:
        model = Advertisement
        fields = '__all__'
        read_only_fields = ['id', 'user', 'remaining_budget', 'created_at', 'submissions']

    def get_user_name(self, obj):
        return obj.user.username


class UserWalletSerializer(serializers.ModelSerializer):
    user_name = serializers.SerializerMethodField()

    class Meta:
        model = UserWallet
        fields = '__all__'

    def get_user_name(self, obj):
        return obj.user.username


class UserTransactionSerializer(serializers.ModelSerializer):
    user_name = serializers.SerializerMethodField()
    advertisement_title = serializers.SerializerMethodField()

    class Meta:
        model = UserTransaction
        fields = '__all__'

    def get_advertisement_title(self, obj):
        return obj.advertisement.title if obj.advertisement else None

    def get_user_name(self, obj):
        return obj.user.username


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = AbstractUser
        fields = ['id', 'email', 'username', 'first_name', 'last_name', 'password']
        extra_kwargs = {'password': {'write_only': True}}


class AddBalanceSerializer(serializers.Serializer):
    amount = serializers.DecimalField(max_digits=10, decimal_places=2)


class AdvertisementAllSerializer(serializers.ModelSerializer):
    user_name = serializers.SerializerMethodField()
    category_name = serializers.CharField(source='category.name', read_only=True)
    reward = serializers.DecimalField(source='per_job', max_digits=10, decimal_places=2)

    class Meta:
        model = Advertisement
        fields = ['id', 'title', 'description', 'confirmation_requirements', 'reward', 'user_name', 'category_name',
                  'submissions', 'status']

    def get_user_name(self, obj):
        return obj.user.username


class UserProfileSerializer(serializers.ModelSerializer):
    user_name = serializers.SerializerMethodField()
    user_id = serializers.UUIDField(source='user.user_id', read_only=True)
    email = serializers.EmailField(source='user.email', read_only=True)
    first_name = serializers.CharField(source='user.first_name', read_only=True)
    last_name = serializers.CharField(source='user.last_name', read_only=True)
    wallet_balance = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)
    referral_code = serializers.CharField(source='user.referral_code', read_only=True)
    referral_count = serializers.IntegerField(source='user.referral_count', read_only=True)
    phone_number = PhoneNumberField(required=False, allow_null=True, allow_blank=True)  # Allow null and blank values
    date_joined = serializers.DateField(source='user.date_joined', read_only=True)

    class Meta:
        model = UserProfile
        fields = ['id', 'user_name', 'user_id', 'email', 'first_name', 'last_name', 'photo', 'date_of_birth',
                  'age', 'nationality', 'gender', 'wallet_balance', 'referral_code', 'referral_count', 'bio',
                  'phone_number', 'date_joined']
        read_only_fields = ['user_name', 'user_id', 'email', 'first_name', 'last_name', 'age', 'wallet_balance', 'id',
                            'date_joined']

    def get_user_name(self, obj):
        return obj.user.username


class ProfileUpdateSerializer(serializers.ModelSerializer):
    first_name = serializers.CharField(source='user.first_name', required=False)
    last_name = serializers.CharField(source='user.last_name', required=False)
    phone_number = PhoneNumberField(required=False, allow_null=True, allow_blank=True)  # Allow null and blank values
    photo = serializers.ImageField(required=False)

    class Meta:
        model = UserProfile
        fields = ['photo', 'date_of_birth', 'age', 'nationality', 'gender', 'phone_number', 'bio', 'first_name',
                  'last_name']

    def update(self, instance, validated_data):
        user_data = validated_data.pop('user', {})
        instance = super().update(instance, validated_data)
        if user_data:
            user = instance.user
            if 'first_name' in user_data:
                user.first_name = user_data['first_name']
            if 'last_name' in user_data:
                user.last_name = user_data['last_name']
            user.save()
        return instance


