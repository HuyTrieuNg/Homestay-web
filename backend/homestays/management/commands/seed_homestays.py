from django.core.management.base import BaseCommand
from homestays.models import Province, City, District, Ward, Homestay, PropertyType, HomestayImage

class Command(BaseCommand):
    help = "Seed initial homestay data"

    def handle(self, *args, **kwargs):
        HomestayImage.objects.all().delete()
        Homestay.objects.all().delete()
        PropertyType.objects.all().delete()

        property_types = ["House", "Apartment", "Guesthouse", "Hotel"]
        for name in property_types:
            PropertyType.objects.create(name=name)

        self.stdout.write(self.style.SUCCESS("🏠 Property types seeded successfully!"))

        province = Province.objects.create(name='Hanoi')
        city = City.objects.create(name='Ba Dinh', province=province)
        district = District.objects.create(name='Kim Ma', city=city)
        ward = Ward.objects.create(name='Ngoc Khanh', district=district)

        # Seed Homestays
        homestays_data = [
            {
                "host_id": 1,
                "name": "Grey Rock Mountain Cabin w/ Jacuzzi 2 Anahaw",
                "description": "A beautiful and modern homestay in the city center.",
                "type": "Apartment",
                "base_price": 100.00,
                "address": "123 Kim Ma, Ba Dinh, Hanoi",
                "longitude": 105.824,
                "latitude": 21.033,
                "geometry": None,
                "max_guests": 4,
                "images": ["homestay.avif"]
            },
            {
                "host_id": 2,
                "name": "Cozy Homestay",
                "description": "A cozy place to stay with family.",
                "type": "House",
                "base_price": 80.00,
                "address": "456 Hoang Hoa Tham, Ba Dinh, Hanoi",
                "longitude": 105.822,
                "latitude": 21.035,
                "geometry": None,
                "max_guests": 5,
                "images": ["homestay.avif"]
            },
    {
                "host_id": 3,
                "name": "A-Frame Garden Grove Hideaway",
                "description": "A beautiful and modern homestay in the city center.",
                "type": "Apartment",
                "base_price": 100.00,
                "address": "124 Kim Ma, Ba Dinh, Hanoi",
                "longitude": 105.824,
                "latitude": 21.033,
                "geometry": None,
                "max_guests": 4,
                "images": ["homestay.avif"]
            },
            {
                "host_id": 2,
                "name": "Casita Isabella Tiny House on wheels",
                "description": "A cozy place to stay with family.",
                "type": "House",
                "base_price": 80.00,
                "address": "476 Hoang Hoa Tham, Ba Dinh, Hanoi",
                "longitude": 105.822,
                "latitude": 21.035,
                "geometry": None,
                "max_guests": 6,
                "images": ["homestay.avif"]
            },
    {
                "host_id": 4,
                "name": "Nordic A villa , private pool",
                "description": "A beautiful and modern homestay in the city center.",
                "type": "Apartment",
                "base_price": 100.00,
                "address": "223 Kim Ma, Ba Dinh, Hanoi",
                "longitude": 105.824,
                "latitude": 21.033,
                "geometry": None,
                "max_guests": 4,
                "images": ["homestay.avif"]
            },
            {
                "host_id": 5,
                "name": "Casauary Tiny House",
                "description": "A cozy place to stay with family.",
                "type": "House",
                "base_price": 80.00,
                "address": "455 Hoang Hoa Tham, Ba Dinh, Hanoi",
                "longitude": 105.822,
                "latitude": 21.035,
                "geometry": None,
                "max_guests": 2,
                "images": ["homestay.avif"]
            },  
        ]

        for data in homestays_data:
            homestay = Homestay.objects.create(
                host_id=data["host_id"],
                name=data["name"],
                description=data["description"],
                type=PropertyType.objects.get(name=data["type"]),
                base_price=data["base_price"],
                address=data["address"],
                longitude=data["longitude"],
                latitude=data["latitude"],
                geometry=data["geometry"],
                max_guests=data["max_guests"],
                ward=ward,
                district=district,
                city=city,
                province=province,
            )

            for image in data["images"]:
                HomestayImage.objects.create(homestay=homestay, image=f"homestays/{image}")

            self.stdout.write(self.style.SUCCESS(f'✅ Created: {homestay.name} with images'))

        self.stdout.write(self.style.SUCCESS("✅ Homestay seeding completed!"))
