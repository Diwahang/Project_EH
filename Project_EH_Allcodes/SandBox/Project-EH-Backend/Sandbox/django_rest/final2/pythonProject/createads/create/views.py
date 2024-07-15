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
from django.db.models import F


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


class AddFundView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        with transaction.atomic():
            advertisement_id = request.data.get('advertisement_id')
            amount = request.data.get('amount')
            advertisement = Advertisement.objects.get(id=advertisement_id)
            user_wallet = UserWallet.objects.get(user=request.user)

            if user_wallet.balance >= amount:
                user_wallet.balance -= amount
                user_wallet.save()
                advertisement.remaining_budget += amount
                advertisement.status = 'active'
                advertisement.save()
                UserTransaction.objects.create(user=request.user, advertisement=advertisement,
                                               transaction_type='spend', amount=amount, status='approved')
                return Response({"detail": "Funds added successfully."}, status=status.HTTP_200_OK)
            return Response({"detail": "Insufficient balance in wallet."}, status=status.HTTP_400_BAD_REQUEST)


class SubmitProofView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        try:
            with transaction.atomic():
                advertisement_id = request.data.get('advertisement_id')
                proof = request.data.get('proof')

                if not advertisement_id or not proof:
                    return Response({"detail": "advertisement_id and proof are required."},
                                    status=status.HTTP_400_BAD_REQUEST)

                try:
                    advertisement = Advertisement.objects.get(id=advertisement_id)
                except Advertisement.DoesNotExist:
                    return Response({"detail": "Advertisement not found."}, status=status.HTTP_404_NOT_FOUND)

                user_transaction = UserTransaction.objects.filter(user=request.user, advertisement=advertisement).last()

                if advertisement.youtube_link and not (user_transaction and user_transaction.watched_video):
                    return Response({"detail": "you have not watched the full video."},
                                    status=status.HTTP_400_BAD_REQUEST)

                if advertisement.status == 'Active' and advertisement.remaining_budget >= advertisement.per_job:
                    UserTransaction.objects.create(
                        user=request.user,
                        advertisement=advertisement,
                        advertisement_title=advertisement.title,
                        transaction_type='earn',
                        amount=advertisement.per_job,
                        status='pending',
                        proof=proof
                    )
                    advertisement.submissions += 1
                    advertisement.save()

                    return Response({"detail": "Proof submitted successfully."}, status=status.HTTP_200_OK)

                return Response({"detail": "Advertisement is not active or insufficient budget."},
                                status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({"detail": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class ApproveSubmissionView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def patch(self, request, transaction_id):
        try:
            with transaction.atomic():
                user_transaction = UserTransaction.objects.get(
                    id=transaction_id,
                    advertisement__user=request.user,
                    status='pending',
                    transaction_type='earn'
                )

                advertisement = user_transaction.advertisement

                # Check if the remaining budget is sufficient
                if advertisement.remaining_budget <= 0 or advertisement.remaining_budget < user_transaction.amount:
                    return Response({"detail": "Insufficient budget. Please deposit more funds for further approvals."},
                                    status=status.HTTP_400_BAD_REQUEST)

                user_transaction.status = 'approved'
                user_transaction.save()

                earner_wallet = UserWallet.objects.get(user=user_transaction.user)
                earner_wallet.balance += user_transaction.amount
                earner_wallet.total_earning += user_transaction.amount  # Update total_earning
                earner_wallet.save()

                advertisement.remaining_budget -= user_transaction.amount
                advertisement.submissions -= 1
                advertisement.save()

                UserTransaction.objects.create(
                    user=request.user,
                    advertisement=advertisement,
                    transaction_type='spend',
                    advertisement_title=advertisement.title,
                    amount=user_transaction.amount,
                    status='approved'
                )

                spender_wallet = UserWallet.objects.get(user=request.user)
                spender_wallet.total_spending += user_transaction.amount  # Update total_spending
                spender_wallet.save()

                if advertisement.remaining_budget <= 0:
                    advertisement.status = 'completed'
                    advertisement.save()

                return Response({"detail": "Submission approved and spend transaction created."},
                                status=status.HTTP_200_OK)

        except UserTransaction.DoesNotExist:
            return Response({"detail": "Transaction not found or already approved."},
                            status=status.HTTP_404_NOT_FOUND)

        except Exception as e:
            return Response({"detail": str(e)}, status=status.HTTP_400_BAD_REQUEST)


class UserWalletView(generics.RetrieveAPIView):
    queryset = UserWallet.objects.all()
    serializer_class = UserWalletSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return UserWallet.objects.get(user=self.request.user)


class UserTransactionListView(generics.ListAPIView):
    serializer_class = UserTransactionSerializer
    permission_classes = [permissions.IsAuthenticated]
    pagination_class = CustomPagination

    def get_queryset(self):
        user = self.request.user
        filter_value = self.request.query_params.get('filter', None)
        queryset = UserTransaction.objects.filter(user=user)

        if filter_value:
            now = timezone.now()
            if filter_value == '7days':
                start_date = now - timedelta(days=7)
            elif filter_value == '15days':
                start_date = now - timedelta(days=15)
            elif filter_value == '3months':
                start_date = now - timedelta(days=90)
            else:
                start_date = None

            if start_date:
                queryset = queryset.filter(date__gte=start_date)

        # Sort the queryset by date in descending order (latest first)
        return queryset.order_by(F('date').desc())


class CategoryCreateView(generics.CreateAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [permissions.IsAuthenticated]


class CategoryListView(generics.ListAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [permissions.IsAuthenticated]


class AddBalanceView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        serializer = AddBalanceSerializer(data=request.data)
        if serializer.is_valid():
            with transaction.atomic():
                amount = serializer.validated_data['amount']
                user_wallet = UserWallet.objects.get(user=request.user)
                user_wallet.balance += amount
                user_wallet.save()

                UserTransaction.objects.create(
                    user=request.user,
                    transaction_type='deposit',
                    amount=amount,
                    status='approved'
                )

                return Response({"detail": "Balance added successfully."}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


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


class UserProfileDetail(generics.RetrieveUpdateAPIView):
    queryset = UserProfile.objects.all()
    serializer_class = UserProfileSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user.userprofile


class ProfileUpdateAPIView(generics.UpdateAPIView):
    queryset = UserProfile.objects.all()
    serializer_class = ProfileUpdateSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user.userprofile

    def put(self, request, *args, **kwargs):
        return self.update(request, *args, **kwargs)

    def patch(self, request, *args, **kwargs):
        return self.partial_update(request, *args, **kwargs)


class DeleteSubmissionView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def delete(self, request, transaction_id):
        try:
            with transaction.atomic():
                user_transaction = UserTransaction.objects.get(
                    id=transaction_id,
                    advertisement__user=request.user,
                    status='pending',
                    transaction_type='earn'
                )

                advertisement = user_transaction.advertisement

                user_transaction.delete()

                advertisement.submissions -= 1
                advertisement.save()

                return Response({"detail": "Submission deleted successfully."},
                                status=status.HTTP_200_OK)

        except UserTransaction.DoesNotExist:
            return Response({"detail": "Transaction not found or already processed."},
                            status=status.HTTP_404_NOT_FOUND)

        except Exception as e:
            return Response({"detail": str(e)}, status=status.HTTP_400_BAD_REQUEST)


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
