from django.db.models.signals import pre_delete
from django.dispatch import receiver
from .models import Advertisement, UserWallet, UserTransaction


@receiver(pre_delete, sender=Advertisement)
def refund_user_on_delete(sender, instance, **kwargs):
    UserTransaction.objects.filter(advertisement=instance).update(advertisement_title=instance.title)
    try:
        user_wallet = UserWallet.objects.get(user=instance.user)
        refund_amount = instance.remaining_budget

        # Refund the remaining budget to the user's wallet
        user_wallet.balance += refund_amount
        user_wallet.save()

        # Log the refund transaction
        transaction = UserTransaction.objects.create(
            user=instance.user,
            advertisement=instance,  # Ensure the advertisement is set
            transaction_type='refund',
            amount=refund_amount,
            status='approved'
        )
        print(f"Created transaction: {transaction.id} for advertisement: {transaction.advertisement.title}")
    except UserWallet.DoesNotExist:
        pass
