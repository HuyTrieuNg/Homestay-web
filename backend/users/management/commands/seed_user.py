from django.core.management.base import BaseCommand
from django.contrib.auth.hashers import make_password
from users.models import User

class Command(BaseCommand):
    help = "Seed initial user data"

    def handle(self, *args, **kwargs):
        # Xóa dữ liệu cũ để tránh trùng lặp
        User.objects.all().delete()

        users_data = [
            {"username": "host1", "name": "Host One", "phone": "0123456789", "type": "host", "password": "password123"},
            {"username": "host2", "name": "Host Two", "phone": "0987654321", "type": "host", "password": "password123"},
            {"username": "hostdanang", "name": "hostdanang", "phone": "0987654321", "type": "host", "password": "password123"},            
            {"username": "hosttphue", "name": "hosttphue", "phone": "0123456789", "type": "host", "password": "password123"},
            {"username": "hostquangnam", "name": "hostquangnam", "phone": "0123456789", "type": "host", "password": "password123"},
            {"username": "hosttphcm", "name": "hosttphcme", "phone": "0123456789", "type": "host", "password": "password123"},
            {"username": "hosthanoi", "name": "hosthanoi", "phone": "0123456789", "type": "host", "password": "password123"},
            {"username": "guest1", "name": "Guest One", "phone": "0345678901", "type": "guest", "password": "password123"},
            {"username": "guest2", "name": "Guest Two", "phone": "0765432109", "type": "guest", "password": "password123"},
            {"username": "administrator", "name": "Admin User", "phone": "0123456789", "type": "admin", "password": "administrator"},
        ]

        for user_data in users_data:
            user = User.objects.create(
                username=user_data["username"],
                name=user_data["name"],
                phone=user_data["phone"],
                type=user_data["type"],
                password=make_password(user_data["password"]),
            )
            self.stdout.write(self.style.SUCCESS(f"✅ Created User: {user.username} ({user.type})"))

        self.stdout.write(self.style.SUCCESS("✅ User seeding completed!"))
