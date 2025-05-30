# Generated by Django 5.1.6 on 2025-05-03 09:12

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('booking', '0002_alter_homestayavailability_status'),
        ('homestays', '0004_delete_homestayavailability'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Review',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('rating', models.IntegerField()),
                ('comment', models.TextField(blank=True, null=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('booking', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, to='booking.booking')),
                ('homestay', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='reviews', to='homestays.homestay')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]
