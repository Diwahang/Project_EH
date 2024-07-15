from rest_framework import generics, permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import AdminAdvertisement
from .serializers import AdminAdvertisementSerializer
from .permissions import IsAdminUser


class AdminAdvertisementListCreateView(generics.ListCreateAPIView):
    queryset = AdminAdvertisement.objects.all().order_by('priority')
    serializer_class = AdminAdvertisementSerializer
    permission_classes = [permissions.IsAdminUser]

    def perform_create(self, serializer):
        serializer.save()


class AdminAdvertisementDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = AdminAdvertisement.objects.all()
    serializer_class = AdminAdvertisementSerializer
    permission_classes = [permissions.AllowAny]


class AdminAdvertisementListView(generics.ListAPIView):
    queryset = AdminAdvertisement.objects.all().order_by('priority')
    serializer_class = AdminAdvertisementSerializer
    permission_classes = [permissions.AllowAny]
