from django.core.management.base import BaseCommand
from homestays.models import Province, City, District, Ward, Homestay

class Command(BaseCommand):
    help = "Seed initial homestay data"

    def handle(self, *args, **kwargs):
        province, _ = Province.objects.get_or_create(name='Hanoi')
        city, _ = City.objects.get_or_create(name='Ba Dinh', province=province)
        district, _ = District.objects.get_or_create(name='Kim Ma', city=city)
        ward, _ = Ward.objects.get_or_create(name='Ngoc Khanh', district=district)

        homestays = [
            {
                "host_id": 1,
                "name": "Luxury Homestay",
                "description": "A beautiful and modern homestay in the city center.",
                "type": "Apartment",
                "images": "luxury1.jpg,luxury2.jpg",
                "base_price": 100.00,
                "address": "123 Kim Ma, Ba Dinh, Hanoi",
                "longitude": 105.824,
                "latitude": 21.033,
                "geometry": None,
                "max_guests": 4
            },
            {
                "host_id": 2,
                "name": "Cozy Homestay",
                "description": "A cozy place to stay with family.",
                "type": "House",
                "images": "cozy1.jpg,cozy2.jpg",
                "base_price": 80.00,
                "address": "456 Hoang Hoa Tham, Ba Dinh, Hanoi",
                "longitude": 105.822,
                "latitude": 21.035,
                "geometry": None,
                "max_guests": 6
            }
        ]

        # Seed homestays
        for data in homestays:
            homestay, created = Homestay.objects.get_or_create(
                name=data["name"],
                defaults={**data, "ward": ward, "district": district, "city": city, "province": province}
            )
            if created:
                self.stdout.write(self.style.SUCCESS(f'Created: {homestay.name}'))
            else:
                self.stdout.write(self.style.WARNING(f'Already exists: {homestay.name}'))

        self.stdout.write(self.style.SUCCESS("✅ Homestay seeding completed!"))
