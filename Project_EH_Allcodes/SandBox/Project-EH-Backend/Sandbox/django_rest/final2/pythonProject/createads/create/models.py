from django.db import models
from login.models import User
import uuid
from django.utils import timezone
from django.core.exceptions import ValidationError
from moviepy.editor import VideoFileClip
from datetime import date
from phonenumber_field.modelfields import PhoneNumberField


class Category(models.Model):
    name = models.CharField(max_length=255)

    def __str__(self):
        return self.name


class Advertisement(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    title = models.CharField(max_length=255)
    category = models.ForeignKey(Category, null=True, blank=True, default=None, on_delete=models.SET_NULL)
    budget = models.DecimalField(max_digits=10, decimal_places=2)
    remaining_budget = models.DecimalField(max_digits=10, decimal_places=2)
    per_job = models.DecimalField(max_digits=10, decimal_places=2)
    limit = models.CharField(max_length=10, choices=[('days', 'Days'), ('jobs', 'Jobs')])
    description = models.TextField()
    confirmation_requirements = models.TextField()
    requires_media = models.BooleanField(default=False)
    media_type = models.CharField(max_length=10, choices=[('photo', 'Photo'), ('video', 'Video'), ('both', 'Both')],
                                  null=True, blank=True)
    thumbnail = models.ImageField(upload_to='thumbnails/', null=True, blank=True)
    video = models.FileField(upload_to='videos/', null=True, blank=True)
    status = models.CharField(max_length=10, default='unapproved',
                              choices=[('Active', 'Active'), ('completed', 'completed'), ('draft', 'draft'),
                                       ('unapproved', 'Unapproved')])
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    terminate = models.DateField()
    created_at = models.DateTimeField(default=timezone.now)
    submissions = models.IntegerField(default=0, null=True)
    youtube_link = models.URLField(max_length=200, blank=True, null=True)


    def clean(self):
        if self.requires_media:
            if self.media_type == 'photo' and not self.thumbnail:
                raise ValidationError("Thumbnail is required when media type is 'photo'.")
            if self.media_type in ['video', 'both'] and not self.video:
                raise ValidationError("Video is required when media type is 'video' or 'both'.")
            if self.video:
                video_file = self.video.file
                clip = VideoFileClip(video_file.temporary_file_path())
                duration = clip.duration
                if duration > 30:
                    raise ValidationError("Video duration must not exceed 30 seconds.")

    def __str__(self):
        return self.title

    def check_and_activate(self):
        if self.status == 'unapproved' and timezone.now() >= self.created_at + timezone.timedelta(seconds=15):
            self.status = 'active'
            self.save()


class UserWallet(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    balance = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    total_earning = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    total_spending = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)

    def __str__(self):
        return f"Wallet of {self.user.username}"


class UserTransaction(models.Model):
    TRANSACTION_TYPES = [
        ('deposit', 'Deposit'),
        ('withdraw', 'Withdraw'),
        ('earn', 'Earn'),
        ('spend', 'Spend'),
        ('refund', 'Refund')
    ]
    TRANSACTION_STATUS = [
        ('pending', 'Pending'),
        ('approved', 'Approved'),
        ('rejected', 'Rejected'),
        ('refund', 'Refund')
    ]
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    advertisement = models.ForeignKey(Advertisement, null=True, blank=True, on_delete=models.SET_NULL)
    transaction_type = models.CharField(max_length=10, choices=TRANSACTION_TYPES)
    advertisement_title = models.CharField(max_length=255, blank=True)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    date = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=10, choices=TRANSACTION_STATUS, default='pending')
    proof = models.ImageField(upload_to='proofs/', null=True, blank=True)
    watch_full_video = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.transaction_type.capitalize()} of {self.amount} by {self.user.username}"


class UserProfile(models.Model):
    GENDER_CHOICES = [
        ('M', 'Male'),
        ('F', 'Female'),
        ('O', 'Other')
    ]

    user = models.OneToOneField(User, on_delete=models.CASCADE)
    photo = models.ImageField(upload_to='profile_photos/', null=True, blank=True)
    date_of_birth = models.DateField(null=True, blank=True)
    nationality = models.CharField(max_length=50, null=True, blank=True)
    gender = models.CharField(max_length=1, choices=GENDER_CHOICES, null=True, blank=True)
    bio = models.CharField(max_length=50, null=True, blank=True)
    phone_number = PhoneNumberField(blank=True, null=True)

    def __str__(self):
        return f"Profile of {self.user.username}"

    @property
    def age(self):
        if self.date_of_birth:
            return (date.today() - self.date_of_birth).days // 365
        return None

    @property
    def wallet_balance(self):
        return self.user.userwallet.balance if hasattr(self.user, 'userwallet') else None
