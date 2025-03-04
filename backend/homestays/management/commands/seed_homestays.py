from django.core.management.base import BaseCommand
from homestays.models import Homestay, PropertyType, HomestayImage, Commune, User

class Command(BaseCommand):
    help = "Seed initial homestay data"

    def handle(self, *args, **kwargs):
        HomestayImage.objects.all().delete()
        Homestay.objects.all().delete()
        PropertyType.objects.all().delete()

        property_types = ["villa", "apartment", "hotel", "resort", "homestay"]
        for name in property_types:
            PropertyType.objects.create(name=name)

        self.stdout.write(self.style.SUCCESS("🏠 Property types seeded successfully!"))

        # Seed Homestays
        homestays_data = [
            {
                "host_id": 1,
                "name": "Grey Rock Mountain Cabin w/ Jacuzzi 2 Anahaw",
                "description": "A beautiful and modern homestay in the city center.",
                "type": "apartment",
                "base_price": 100.00,
                "address": "123 Kim Ma, Ba Dinh, Hanoi",
                "longitude": 105.824,
                "latitude": 21.033,
                "max_guests": 4,
                "images": ["homestay.avif"],
                "commune_name": "Hàng Bài",
            },
            {
                "host_id": 2,
                "name": "Cozy Homestay",
                "description": "A cozy place to stay with family.",
                "type": "villa",
                "base_price": 80.00,
                "address": "456 Hoang Hoa Tham, Ba Dinh, Hanoi",
                "longitude": 105.822,
                "latitude": 21.035,
                "max_guests": 5,
                "images": ["homestay.avif"],
                "commune_name": "Hàng Trống",
            },
        ]

        for data in homestays_data:
            # Kiểm tra host tồn tại không
            try:
                host = User.objects.get(id=data["host_id"])
            except User.DoesNotExist:
                self.stdout.write(self.style.WARNING(f"⚠️ Skipping {data['name']}, host ID {data['host_id']} does not exist!"))
                continue

            # Kiểm tra loại hình homestay có tồn tại không
            try:
                property_type = PropertyType.objects.get(name=data["type"])
            except PropertyType.DoesNotExist:
                self.stdout.write(self.style.WARNING(f"⚠️ Property Type {data['type']} not found!"))
                continue

            # Kiểm tra commune có tồn tại không
            try:
                commune = Commune.objects.get(name=data["commune_name"])
            except Commune.DoesNotExist:
                self.stdout.write(self.style.WARNING(f"⚠️ Commune {data['commune_name']} not found!"))
                continue

            # Tạo Homestay
            homestay = Homestay.objects.create(
                host=host,
                name=data["name"],
                description=data["description"],
                type=property_type,
                base_price=data["base_price"],
                address=data["address"],
                longitude=data["longitude"],
                latitude=data["latitude"],
                max_guests=data["max_guests"],
                commune=commune,  # 🔥 Gán commune vào ForeignKey
            )

            # Thêm hình ảnh
            for image in data["images"]:
                HomestayImage.objects.create(homestay=homestay, image=f"homestays/{image}")

            self.stdout.write(self.style.SUCCESS(f'✅ Created: {homestay.name} in {commune.name}'))

        self.stdout.write(self.style.SUCCESS("✅ Homestay seeding completed!"))
