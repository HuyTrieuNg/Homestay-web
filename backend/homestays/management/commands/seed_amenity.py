from django.core.management.base import BaseCommand
from homestays.models import Amenity, PropertyType

class Command(BaseCommand):
    help = "Seed initial amenity data"
    
    def handle(self, *args, **kwargs):
        Amenity.objects.all().delete()
        PropertyType.objects.all().delete()
        amenities = [
            # Essentials
            ("Wifi", "essentials"),
            ("Kitchen", "essentials"),
            ("Washer", "essentials"),
            ("Dryer", "essentials"),
            ("Air conditioning", "essentials"),
            ("Heating", "essentials"),
            ("Dedicated workspace", "essentials"),
            ("TV", "essentials"),
            ("Hair dryer", "essentials"),
            ("Iron", "essentials"),

            # Features
            ("Pool", "features"),
            ("Hot tub", "features"),
            ("Free parking", "features"),
            ("EV charger", "features"),
            ("Crib", "features"),
            ("King bed", "features"),
            ("Gym", "features"),
            ("BBQ grill", "features"),
            ("Breakfast", "features"),
            ("Indoor fireplace", "features"),
            ("Smoking allowed", "features"),

            # Location
            ("Beachfront", "location"),
            ("Waterfront", "location"),

            # Safety
            ("Smoke alarm", "safety"),
            ("Carbon monoxide alarm", "safety"),
        ]

        for name, category in amenities:
            obj, created = Amenity.objects.get_or_create(name=name, category=category)
            if created:
                print(f"Amenity '{name}' seeded successfully!")
            else:
                print(f"Amenity '{name}' already exists!") 

        print("Seed data added successfully!")
