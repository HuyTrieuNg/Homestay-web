from django.core.management.base import BaseCommand
from users.models import User
import requests
import cloudinary.uploader

class Command(BaseCommand):
    help = "Update avatar for 100 guest users using DiceBear and Cloudinary"

    def handle(self, *args, **kwargs):
        users = User.objects.filter(username__startswith="guestfake")

        for user in users:
            username = user.username
            avatar_url = f"https://api.dicebear.com/7.x/pixel-art/png?seed={username}"

            try:
                # Tải ảnh từ DiceBear về bộ nhớ
                response = requests.get(avatar_url)
                response.raise_for_status()

                # Upload lên Cloudinary
                upload_result = cloudinary.uploader.upload(
                    response.content,
                    folder="user_avatars",
                    public_id=f"{username}_avatar",
                    overwrite=True,
                    resource_type="image"
                )

                # Cập nhật avatar profile
                profile = user.profile
                profile.avatar = upload_result["secure_url"]
                profile.save()

                self.stdout.write(self.style.SUCCESS(f"✅ Updated avatar for {username}"))

            except Exception as e:
                self.stdout.write(self.style.ERROR(f"❌ Failed for {username}: {str(e)}"))

        self.stdout.write(self.style.SUCCESS("🎉 All avatars updated successfully!"))
