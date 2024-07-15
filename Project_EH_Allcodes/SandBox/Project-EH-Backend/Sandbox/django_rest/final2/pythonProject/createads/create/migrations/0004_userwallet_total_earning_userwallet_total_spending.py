# Generated by Django 5.0.6 on 2024-07-13 10:02

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('create', '0003_advertisement_watch_full_video_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='userwallet',
            name='total_earning',
            field=models.DecimalField(decimal_places=2, default=0.0, max_digits=10),
        ),
        migrations.AddField(
            model_name='userwallet',
            name='total_spending',
            field=models.DecimalField(decimal_places=2, default=0.0, max_digits=10),
        ),
    ]
