from django.urls import path
from .views import AdminAdvertisementListCreateView, AdminAdvertisementDetailView, AdminAdvertisementListView

urlpatterns = [
    path('admin_ads/', AdminAdvertisementListCreateView.as_view(), name='admin_ads-list-create'),
    path('admin_ads/<int:pk>/', AdminAdvertisementDetailView.as_view(), name='admin_ads-detail'),
    path('admin_ads/list/', AdminAdvertisementListView.as_view(), name='admin_ads-list'),
]
