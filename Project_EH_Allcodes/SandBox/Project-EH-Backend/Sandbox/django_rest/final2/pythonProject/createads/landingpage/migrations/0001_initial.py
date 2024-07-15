# Generated by Django 5.0.6 on 2024-07-12 06:15

import datetime
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='AdminAdvertisement',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(max_length=255)),
                ('details', models.TextField()),
                ('discounts', models.CharField(blank=True, max_length=255, null=True)),
                ('offers', models.CharField(blank=True, max_length=255, null=True)),
                ('referral_code', models.CharField(blank=True, max_length=50, null=True)),
                ('guidelines', models.TextField()),
                ('links', models.CharField(blank=True, max_length=255, null=True)),
                ('thumbnail', models.ImageField(upload_to='media/Adminads/thumbnail')),
                ('is_running', models.BooleanField(default=True)),
                ('duration', models.DurationField(default=datetime.timedelta(days=1))),
                ('priority', models.PositiveIntegerField(default=1)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
            ],
        ),
    ]
