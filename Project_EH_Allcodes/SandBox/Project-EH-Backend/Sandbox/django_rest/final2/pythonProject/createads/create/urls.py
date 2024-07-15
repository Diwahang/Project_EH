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

    # Fund addition URL
    path('add-fund/', AddFundView.as_view(), name='add-fund'),

    # Wallet URLs
    path('wallet/', UserWalletView.as_view(), name='user-wallet'),

    # Transaction URLs
    path('transactions/', UserTransactionListView.as_view(), name='user-transaction-list'),
    path('transactions/<uuid:transaction_id>/approve/', ApproveSubmissionView.as_view(), name='approve-transaction'),
    path('transactions/<uuid:transaction_id>/', DeleteSubmissionView.as_view(), name='delete-transaction'),
    # Category URLs
    path('categories/', CategoryListView.as_view(), name='category-list'),
    path('categories/<pk>/', CategoryListView.as_view(), name='category-detail'),

    # Proof Submission and Approval URLs
    path('submit-proof/', SubmitProofView.as_view(), name='submit-proof'),

    # Add Balance URL
    path('add-balance/', AddBalanceView.as_view(), name='add-balance'),

    # View submissions for a specific advertisement
    path('advertisements/<uuid:advertisement_id>/submissions/', AdvertisementSubmissionsView.as_view(), name='advertisement-submissions'),

    path('profile/', UserProfileDetail.as_view(), name='user-profile'),

    path('update-profile/', ProfileUpdateAPIView.as_view(), name='profile-update'),
    path('update-watched-video/', UpdateWatchedVideoView.as_view(), name='update-watched-video'),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
