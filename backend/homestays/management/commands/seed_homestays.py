from django.core.management.base import BaseCommand
from homestays.models import *

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
                "amenities": ["Heating", "Kitchen", "Washing machine"],
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
                "amenities": ["Wifi", "TV", "Air conditioning"],
            },
            {
                "host_id": 3,
                "name": "Luxury Beachfront Villa",
                "description": "A stunning beachfront villa with a private pool.",
                "type": "villa",
                "base_price": 250.00,
                "address": "789 My Khe Beach, Son Tra, Da Nang",
                "longitude": 108.249,
                "latitude": 16.057,
                "max_guests": 6,
                "images": ["homestay.avif"],
                "commune_name": "An Hải Đông",
                "amenities": ["Wifi", "Pool", "Free parking", "Beachfront", "BBQ grill"],
            },
            {
                "host_id": 1,
                "name": "Cozy Da Lat Cottage",
                "description": "A warm and cozy cottage surrounded by pine trees.",
                "type": "homestay",
                "base_price": 70.00,
                "address": "321 Ho Xuan Huong, Da Lat, Lam Dong",
                "longitude": 108.445,
                "latitude": 11.940,
                "max_guests": 3,
                "images": ["homestay.avif"],
                "commune_name": "Phường 3",
                "amenities": ["Heating", "TV", "Indoor fireplace", "Free parking", "Dedicated workspace"],
            },
            {
                "host_id": 2,
                "name": "Mountain View Retreat",
                "description": "A peaceful homestay with breathtaking mountain views.",
                "type": "resort",
                "base_price": 120.00,
                "address": "567 Bao Loc Mountain, Lam Dong",
                "longitude": 107.780,
                "latitude": 11.547,
                "max_guests": 5,
                "images": ["homestay.avif"],
                "commune_name": "B'Lao",
                "amenities": ["King bed", "Smoke alarm", "BBQ grill", "Breakfast", "Air conditioning"],
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

            amenities_names = data["amenities"]  
            amenities = [Amenity.objects.get_or_create(name=name)[0] for name in amenities_names]
            homestay.amenities.set(amenities)
            
            # Thêm hình ảnh
            for image in data["images"]:
                HomestayImage.objects.create(homestay=homestay, image=f"homestays/{image}")

            self.stdout.write(self.style.SUCCESS(f'✅ Created: {homestay.name} in {commune.name}'))
            

        self.stdout.write(self.style.SUCCESS("✅ Homestay seeding completed!"))
