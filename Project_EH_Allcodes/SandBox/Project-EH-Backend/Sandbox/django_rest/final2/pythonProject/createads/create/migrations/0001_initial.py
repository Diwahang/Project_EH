# Generated by Django 5.0.6 on 2024-07-12 06:15

import django.utils.timezone
import phonenumber_field.modelfields
import uuid
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Advertisement',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('title', models.CharField(max_length=255)),
                ('budget', models.DecimalField(decimal_places=2, max_digits=10)),
                ('remaining_budget', models.DecimalField(decimal_places=2, max_digits=10)),
                ('per_job', models.DecimalField(decimal_places=2, max_digits=10)),
                ('limit', models.CharField(choices=[('days', 'Days'), ('jobs', 'Jobs')], max_length=10)),
                ('description', models.TextField()),
                ('confirmation_requirements', models.TextField()),
                ('requires_media', models.BooleanField(default=False)),
                ('media_type', models.CharField(blank=True, choices=[('photo', 'Photo'), ('video', 'Video'), ('both', 'Both')], max_length=10, null=True)),
                ('thumbnail', models.ImageField(blank=True, null=True, upload_to='thumbnails/')),
                ('video', models.FileField(blank=True, null=True, upload_to='videos/')),
                ('status', models.CharField(choices=[('Active', 'Active'), ('completed', 'completed'), ('draft', 'draft'), ('unapproved', 'Unapproved')], default='unapproved', max_length=10)),
                ('terminate', models.DateField()),
                ('created_at', models.DateTimeField(default=django.utils.timezone.now)),
                ('submissions', models.IntegerField(default=0, null=True)),
            ],
        ),
        migrations.CreateModel(
            name='Category',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=255)),
            ],
        ),
        migrations.CreateModel(
            name='UserProfile',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('photo', models.ImageField(blank=True, null=True, upload_to='profile_photos/')),
                ('date_of_birth', models.DateField(blank=True, null=True)),
                ('nationality', models.CharField(blank=True, max_length=50, null=True)),
                ('gender', models.CharField(blank=True, choices=[('M', 'Male'), ('F', 'Female'), ('O', 'Other')], max_length=1, null=True)),
                ('bio', models.CharField(blank=True, max_length=50, null=True)),
                ('phone_number', phonenumber_field.modelfields.PhoneNumberField(blank=True, max_length=128, null=True, region=None)),
            ],
        ),
        migrations.CreateModel(
            name='UserTransaction',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('transaction_type', models.CharField(choices=[('deposit', 'Deposit'), ('withdraw', 'Withdraw'), ('earn', 'Earn'), ('spend', 'Spend'), ('refund', 'Refund')], max_length=10)),
                ('advertisement_title', models.CharField(blank=True, max_length=255)),
                ('amount', models.DecimalField(decimal_places=2, max_digits=10)),
                ('date', models.DateTimeField(auto_now_add=True)),
                ('status', models.CharField(choices=[('pending', 'Pending'), ('approved', 'Approved'), ('rejected', 'Rejected'), ('refund', 'Refund')], default='pending', max_length=10)),
                ('proof', models.ImageField(blank=True, null=True, upload_to='proofs/')),
            ],
        ),
        migrations.CreateModel(
            name='UserWallet',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('balance', models.DecimalField(decimal_places=2, default=0.0, max_digits=10)),
            ],
        ),
    ]
