# Generated by Django 5.0.6 on 2024-07-12 08:48

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('create', '0002_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='advertisement',
            name='watch_full_video',
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name='advertisement',
            name='youtube_link',
            field=models.URLField(blank=True, null=True),
        ),
    ]
