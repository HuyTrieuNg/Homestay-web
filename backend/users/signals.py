from django.dispatch import receiver
from django.db.models.signals import post_save

from users.models import Profile, User

@receiver(post_save, sender=True)
def create_profile(sender, instance, created, **kwargs):
    if created:
        Profile.objects.create(user=instance)

@receiver(post_save, sender = User)
def save_profile(sender, instance, **kwargs):
    instance.profile.save() 