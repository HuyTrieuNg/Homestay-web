from django.core.management.base import BaseCommand
from django.contrib.auth.hashers import make_password
from users.models import User, Profile
import random

class Command(BaseCommand):
    help = "Seed 100 guest users with random profile data"

    def handle(self, *args, **kwargs):
        works = [
            "Freelancer", "Software Developer", "Graphic Designer",
            "Photographer", "Content Creator", "Marketing Specialist"
        ]
        abouts = [
            "I love traveling and meeting new people.",
            "Tech enthusiast and coffee addict.",
            "Always learning and improving.",
            "Passionate about design and creativity.",
            "Dream big, work hard.",
            "Enjoys nature and coding."
        ]
        interests = [
            "Hiking, Reading, Coding", 
            "Music, Gaming, Sports", 
            "Traveling, Movies, Cooking", 
            "Photography, Drawing, Running",
            "Blogging, Chess, Learning languages",
            "Biking, Yoga, Technology"
        ]

        for i in range(1, 101):
            username = f"guestfake{i}"
            name = f"Guest Fake {i}"
            phone = f"0{random.randint(100000000, 999999999)}"
            password = make_password("guestpassword")

            user = User.objects.create(
                username=username,
                name=name,
                phone=phone,
                type="guest",
                password=password,
            )

            # Gán avatar từ DiceBear (pixel-art) theo username
            avatar_url = f"https://api.dicebear.com/7.x/pixel-art/png?seed={username}"

            # Cập nhật profile với thông tin random
            profile = user.profile
            profile.avatar = avatar_url
            profile.work = random.choice(works)
            profile.about = random.choice(abouts)
            profile.interests = random.choice(interests)
            profile.save()

            self.stdout.write(self.style.SUCCESS(f"✅ Created {username}"))

        self.stdout.write(self.style.SUCCESS("✅ Successfully seeded 100 guest users"))
