import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Create.css";

const Create = () => {
  const [formData, setFormData] = useState({
    title: "",
    category_name: "",
    budget: 0,
    per_job: 0,
    limit: "days",
    time: "",
    description: "",
    confirmation_requirements: "",
    requires_media: false,
    media_type: "",
    thumbnail: null,
    video: null
  });
  const [showPreview, setShowPreview] = useState(false);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [showFullConfirmation, setShowFullConfirmation] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (type === "checkbox") {
      setFormData({
        ...formData,
        [name]: checked,
      });
    } else if (type === "file") {
      setFormData({
        ...formData,
        [name]: files[0],
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const calculateBudget = (terminateDate) => {
    const currentDate = new Date();
    const terminate = new Date(terminateDate);
    const timeDiff = terminate - currentDate;
    const days = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
    return days * 100;
  };

  useEffect(() => {
    if (formData.limit === "days" && formData.time) {
      const calculatedBudget = calculateBudget(formData.time);
      setFormData((prevFormData) => ({
        ...prevFormData,
        budget: calculatedBudget,
      }));
    }
  }, [formData.limit, formData.time]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await createAdvertisement();
  };

  const handleSaveAsDraft = async () => {
    await createAdvertisement(true);
  };

  const createAdvertisement = async (isDraft = false) => {
    const token = localStorage.getItem('access_token');

    const data = new FormData();
    for (const key in formData) {
      if (formData[key] !== null) {
        if (key !== "budget" || formData.limit !== "days") {
          data.append(key, formData[key]);
        }
      }
    }

    if (formData.limit === "days") {
      data.set("terminate", formData.time);
    } else if (formData.limit === "jobs") {
      data.set("terminate", new Date(new Date().setDate(new Date().getDate() + 60)).toISOString().split('T')[0]);
    }

    if (isDraft) {
      data.append("status", "draft");
    }

    try {
      const response = await axios.post(
        "http://localhost:8000/api/advertisements/create/",
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: Bearer ${token}
          },
        }
      );
      console.log(response.data);
      alert(isDraft ? "Advertisement saved as draft successfully!" : "Advertisement created successfully!");
      setShowPreview(false);
    } catch (error) {
      console.error(isDraft ? "There was an error saving the advertisement as draft!" : "There was an error creating the advertisement!", error);
      alert(isDraft ? "Failed to save advertisement as draft. Please try again." : "Failed to create advertisement. Please try again.");
    }
  };

  const handlePreview = () => {
    setShowPreview(true);
  };

  const truncateText = (text, wordLimit) => {
    const words = text.split(' ');
    if (words.length > wordLimit) {
      return words.slice(0, wordLimit).join(' ') + '...';
    }
    return text;
  };

  return (
    <div className="form-container">
      <h1>Create Advertisement</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">Title:</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="category_name">Category Name:</label>
          <input
            type="text"
            id="category_name"
            name="category_name"
            value={formData.category_name}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="budget">Budget:</label>
          <input
            type="number"
            id="budget"
            name="budget"
            value={formData.budget}
            onChange={handleChange}
            disabled={formData.limit === "days"}
          />
        </div>

        <div className="form-group">
          <label htmlFor="per_job">Per Job:</label>
          <input
            type="number"
            id="per_job"
            name="per_job"
            value={formData.per_job}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="limit">Limit:</label>
          <select
            id="limit"
            name="limit"
            value={formData.limit}
            onChange={handleChange}
          >
            <option value="days">Days</option>
            <option value="jobs">Jobs</option>
          </select>
        </div>

        {formData.limit === "days" && (
          <div className="form-group">
            <label htmlFor="time">Time:</label>
            <input
              type="date"
              id="time"
              name="time"
              value={formData.time}
              onChange={handleChange}
              required
            />
          </div>
        )}

        <div className="form-group">
          <label htmlFor="description">Description:</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
          ></textarea>
        </div>

        <div className="form-group">
          <label htmlFor="confirmation_requirements">Confirmation Requirements:</label>
          <textarea
            id="confirmation_requirements"
            name="confirmation_requirements"
            value={formData.confirmation_requirements}
            onChange={handleChange}
          ></textarea>
        </div>

        <div className="form-group">
          <label>Does your ad need to upload screenshots or videos?</label>
          <input
            type="radio"
            id="yes"
            name="requires_media"
            value={true}
            checked={formData.requires_media}
            onChange={handleChange}
          />
          <label htmlFor="yes">Yes</label>
          <input
            type="radio"
            id="no"
            name="requires_media"
            value={false}
            checked={!formData.requires_media}
            onChange={handleChange}
          />
          <label htmlFor="no">No</label>
        </div>

        {formData.requires_media && (
          <div className="form-group">
            <label>If yes, Photos or video?</label>
            <input
              type="radio"
              id="photos"
              name="media_type"
              value="photo"
              checked={formData.media_type === "photo"}
              onChange={handleChange}
            />
            <label htmlFor="photos">Photos</label>
            <input
              type="radio"
              id="videos"
              name="media_type"
              value="video"
              checked={formData.media_type === "video"}
              onChange={handleChange}
            />
            <label htmlFor="videos">Videos</label>
            <input
              type="radio"
              id="both"
              name="media_type"
              value="both"
              checked={formData.media_type === "both"}
              onChange={handleChange}
            />
            <label htmlFor="both">Both</label>
          </div>
        )}

        {formData.requires_media && formData.media_type !== 'photo' && (
          <div className="form-group">
            <label htmlFor="video">Upload video:</label>
            <input
              type="file"
              id="video"
              name="video"
              accept="video/*"
              onChange={handleChange}
            />
          </div>
        )}

        {formData.requires_media && formData.media_type !== 'video' && (
          <div className="form-group">
            <label htmlFor="thumbnail">Upload thumbnail:</label>
            <input
              type="file"
              id="thumbnail"
              name="thumbnail"
              accept="image/*"
              onChange={handleChange}
            />
          </div>
        )}

        <div className="button-group">
          <button type="submit">Create Advertisement</button>
          <button type="button" onClick={handlePreview}>Preview</button>
        </div>
      </form>

      {showPreview && (
        <div className="preview-popup">
          <div className="preview-content">
            <h2>Advertisement Preview</h2>
            <div className="ad-card">
              {formData.thumbnail && (
                <div className="media-section thumbnail">
                  <img src={URL.createObjectURL(formData.thumbnail)} alt="Thumbnail" />
                </div>
              )}
              <div className="ad-content">
                <h2 className="ad-title">{formData.title}</h2>
                <div className="text-box ad-description">
                  <h3>Description</h3>
                  <p>
                    {showFullDescription
                      ? formData.description
                      : truncateText(formData.description, 50)}
                  </p>
                  {formData.description.split(' ').length > 50 && (
                    <button onClick={() => setShowFullDescription(!showFullDescription)}>
                      {showFullDescription ? 'View Less' : 'View More'}
                    </button>
                  )}
                </div>
                <div className="text-box confirmation-requirements">
                  <h3>Confirmation Requirements</h3>
                  <ul>
                    {(showFullConfirmation
                      ? formData.confirmation_requirements.split('. ')
                      : formData.confirmation_requirements.split('. ').slice(0, 3)
                    ).map((requirement, index) => (
                      <li key={index}>{requirement}</li>
                    ))}
                  </ul>
                  {formData.confirmation_requirements.split('. ').length > 3 && (
                    <button onClick={() => setShowFullConfirmation(!showFullConfirmation)}>
                      {showFullConfirmation ? 'View Less' : 'View More'}
                    </button>
                  )}
                </div>
                <div className="ad-info">
                  <div className="info-item">
                    <span className="info-label">Category:</span>
                    <span className="info-value">{formData.category_name}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Budget:</span>
                    <span className="info-value">${formData.budget}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Per Job:</span>
                    <span className="info-value">${formData.per_job}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Limit:</span>
                    <span className="info-value">{formData.limit}</span>
                  </div>
                </div>
                <div className="ad-details">
                  <div className="detail-item">
                    <span className="detail-label">Requires Media:</span>
                    <span className="detail-value">{formData.requires_media ? 'Yes' : 'No'}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Media Type:</span>
                    <span className="detail-value">{formData.media_type}</span>
                  </div>
                  {formData.limit === "days" && (
                    <div className="detail-item">
                      <span className="detail-label">Terminate Date:</span>
                      <span className="detail-value">{new Date(formData.time).toLocaleDateString()}</span>
                    </div>
                  )}
                </div>
              </div>
              {formData.video && (
                <div className="media-section video-section">
                  <h3>Video Tutorial</h3>
                  <video src={URL.createObjectURL(formData.video)} controls />
                </div>
              )}
            </div>
            <div className="preview-buttons">
              <button onClick={handleSubmit}>Create Advertisement</button>
              <button onClick={handleSaveAsDraft}>Save to Draft</button>
              <button onClick={() => setShowPreview(false)}>Close Preview</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Create;  

this is models

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



this is my view
from datetime import timedelta, datetime

from django.utils import timezone
from django.utils.timezone import now
from django.db import transaction
from rest_framework import generics, status, permissions
from rest_framework.pagination import PageNumberPagination
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import Advertisement, UserWallet, Category, UserTransaction, UserProfile
from .serializers import (
    AdvertisementSerializer, UserWalletSerializer, UserTransactionSerializer,
    CategorySerializer, AddBalanceSerializer, AdvertisementAllSerializer,
    UserProfileSerializer, ProfileUpdateSerializer
)
from rest_framework.permissions import IsAuthenticated
from .pagination import CustomPagination


class AdvertisementListView(generics.ListAPIView):
    serializer_class = AdvertisementSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        status = self.request.query_params.get('status')
        queryset = Advertisement.objects.filter(user=user)

        if status and status != 'all':
            queryset = queryset.filter(status=status)
        elif status == 'all':
            queryset = Advertisement.objects.filter(user=user)

        return queryset


class AdvertisementCreateView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        data = request.data.copy()
        data['user'] = request.user.pk

        limit = data.get('limit')
        if limit == 'jobs':
            data['terminate'] = (datetime.now().date() + timedelta(days=60)).isoformat()
            if 'budget' not in data:
                data['budget'] = float(data['per_job']) * 20
        elif limit == 'days':
            terminate = data.get('terminate')
            if terminate:
                terminate_date = datetime.strptime(terminate, '%Y-%m-%d').date()
                days = (terminate_date - datetime.now().date()).days
                data['budget'] = days * 100
            else:
                return Response({"detail": "Termination date must be provided for days limit."},
                                status=status.HTTP_400_BAD_REQUEST)
        else:
            return Response({"detail": "Invalid limit choice."}, status=status.HTTP_400_BAD_REQUEST)

        serializer = AdvertisementSerializer(data=data)
        if serializer.is_valid():
            with transaction.atomic():
                user_wallet = UserWallet.objects.get(user=request.user)
                ad_budget = serializer.validated_data['budget']
                status_choice = data.get('status', 'pending')

                if status_choice == 'draft' or user_wallet.balance >= ad_budget:
                    category_name = serializer.validated_data.pop('category_name', 'default')
                    category, created = Category.objects.get_or_create(name=category_name)

                    if status_choice != 'draft':
                        user_wallet.balance -= ad_budget
                        user_wallet.save()

                    advertisement = serializer.save(user=request.user, remaining_budget=ad_budget,
                                                    category=category, status=status_choice)
                    if status_choice != 'draft':
                        UserTransaction.objects.create(
                            user=request.user,
                            advertisement=advertisement,
                            transaction_type='spend',
                            advertisement_title=advertisement.title,
                            amount=ad_budget,
                            status='approved'
                        )

                    response_data = {
                        "message": "Advertisement saved as draft." if status_choice == 'draft' else "Advertisement created successfully. Waiting for approval. Estimated time for approval is 1 hour.",
                        "spend": 0 if status_choice == 'draft' else ad_budget,
                        "remaining_balance": user_wallet.balance,
                        "ad_id": advertisement.id
                    }
                    return Response(response_data, status=status.HTTP_201_CREATED)
                else:
                    return Response({"detail": "Insufficient balance in wallet."}, status=status.HTTP_400_BAD_REQUEST)
        else:
            print(serializer.errors)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class CategoryCreateView(generics.CreateAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [permissions.IsAuthenticated]

class AdvertisementsByCategoryView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, category_id):
        advertisements = Advertisement.objects.filter(category_id=category_id)
        serializer = AdvertisementSerializer(advertisements, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class AdvertisementSubmissionsView(generics.ListAPIView):
    serializer_class = UserTransactionSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        advertisement_id = self.kwargs['advertisement_id']
        return UserTransaction.objects.filter(
            advertisement_id=advertisement_id,
            advertisement__user=self.request.user,
            transaction_type='earn',
            status='pending'
        )


class AdvertisementListAllView(generics.ListAPIView):
    serializer_class = AdvertisementAllSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        return Advertisement.objects.filter(status='Active')


class AdvertisementDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Advertisement.objects.all()
    serializer_class = AdvertisementSerializer
    permission_classes = [permissions.IsAuthenticated]
    lookup_field = 'id'



class UpdateWatchedVideoView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        advertisement_id = request.data.get('advertisement_id')

        if not advertisement_id:
            return Response({"detail": "advertisement_id is required."}, status=status.HTTP_400_BAD_REQUEST)

        advertisement = Advertisement.objects.get(id=advertisement_id)
        user_transaction = UserTransaction.objects.filter(user=request.user, advertisement=advertisement).last()

        if user_transaction:
            user_transaction.watched_video = True
            user_transaction.save()
            return Response({"detail": "watched_video updated successfully."}, status=status.HTTP_200_OK)
        return Response({"detail": "User transaction not found."}, status=status.HTTP_404_NOT_FOUND)


this is urls
from django.conf import settings
from django.conf.urls.static import static
from django.urls import path
from .views import (
    AdvertisementListView,
    AdvertisementCreateView,
    AddFundView,
    UserWalletView,
    UserTransactionListView,
    CategoryListView,
    SubmitProofView,
    ApproveSubmissionView,
    AddBalanceView,
    AdvertisementsByCategoryView,
    AdvertisementSubmissionsView,
    AdvertisementListAllView,
    AdvertisementDetailView, UserProfileDetail, ProfileUpdateAPIView, DeleteSubmissionView, UpdateWatchedVideoView,
)

urlpatterns = [
    # Advertisement URLs
    path('advertisements/', AdvertisementListView.as_view(), name='advertisement-list'),
    path('advertisements/create/', AdvertisementCreateView.as_view(), name='advertisement-create'),
    path('advertisements/category/<int:category_id>/', AdvertisementsByCategoryView.as_view(), name='advertisements-by-category'),
    path('advertisements/all/', AdvertisementListAllView.as_view(), name='advertisement-list-all'),
    path('advertisements/<uuid:id>/', AdvertisementDetailView.as_view(), name='advertisement-detail'),

    # Category URLs
    path('categories/', CategoryListView.as_view(), name='category-list'),
    path('categories/<pk>/', CategoryListView.as_view(), name='category-detail'),


    # View submissions for a specific advertisement
    path('advertisements/<uuid:advertisement_id>/submissions/', AdvertisementSubmissionsView.as_view(), name='advertisement-submissions'),


    path('update-watched-video/', UpdateWatchedVideoView.as_view(), name='update-watched-video'),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)


this is serializers
from phonenumber_field.serializerfields import PhoneNumberField
from .models import Advertisement, UserWallet, UserTransaction, Category, UserProfile
from django.contrib.auth.models import AbstractUser
from .models import User
from rest_framework import serializers

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'


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




now i the jsx file i want yo add few things
1. just like we add Does your ad need to upload screenshots or videos? 
when user clicks on yes you can see what what we have done. Now i want to add Does you ad need to Upload tutorial video?? and when user clicks on yes we show them a firld for url field where ad creater can put url of the video.  do not change other functionality just add new features just like i said i have made necessary changes in the backend 