from django.db import models
from django.contrib.auth.models import AbstractUser
from django.db.models.signals import post_save

class User(AbstractUser):
    phone = models.CharField(max_length=10, blank=False, null=False)
    name = models.CharField(max_length=50)
    USE_TYPE_CHOICES = [
        ('host', 'Host'),
        ('guest', 'Guest'),
    ]
    type = models.CharField(max_length=10, choices=USE_TYPE_CHOICES, default='guest')
    status = models.BooleanField(default=True)

    def __str__(self):
        return self.name
    
class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="profile")
    avatar = models.ImageField(upload_to="avatars/", blank=True, null=True)
    work = models.CharField(max_length=255, blank=True, null=True)
    about = models.TextField(blank=True, null=True)
    interests = models.TextField(blank=True, null=True)
    status = models.BooleanField(default=True)
    
    def __str__(self):
        return f"Profile of {self.user.username}"

def create_user_profile(sender, instance, created, **kwargs):
    if created:
        Profile.objects.create(user=instance)

def save_user_profile(sender, instance, **kwargs):
    instance.profile.save()

post_save.connect(create_user_profile, sender=User)
post_save.connect(save_user_profile, sender=User)
