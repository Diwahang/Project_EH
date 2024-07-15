from django.contrib import admin
from .models import Advertisement, Category, UserWallet, UserTransaction, UserProfile

admin.site.register(Advertisement)
admin.site.register(Category)
admin.site.register(UserWallet)
admin.site.register(UserTransaction)
admin.site.register(UserProfile)

