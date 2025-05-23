import os
import random
import cloudinary.uploader
from django.core.management.base import BaseCommand
from django.conf import settings
from homestays.models import Homestay, HomestayImage, PropertyType, Amenity, Commune
from users.models import User

class Command(BaseCommand):
    help = "Seed 180 homestays with assigned hosts and provinces"

    def handle(self, *args, **kwargs):
        province_coordinates = {
            "Thành phố Huế": (16.4625, 107.5853),
            "Tỉnh Quảng Nam": (15.5569, 108.0367),
            "Thành phố Hồ Chí Minh": (10.7626, 106.6601),
            "Thành phố Hà Nội": (21.0285, 105.8542),
            "Thành phố Đà Nẵng": (16.0605, 108.2209),
            "Tỉnh Khánh Hòa": (12.2451, 109.1943),
            "Tỉnh Bắc Ninh": (21.1861, 106.0763),
        }

        fixed_hosts = {
            "hosttphue": "Thành phố Huế",
            "hostquangnam": "Tỉnh Quảng Nam",
            "hosttphcm": "Thành phố Hồ Chí Minh",
            "hosthanoi": "Thành phố Hà Nội",
            "hostdanang": "Thành phố Đà Nẵng",
        }

        shared_provinces = [
            "Thành phố Huế",
            "Tỉnh Quảng Nam",
            "Thành phố Hồ Chí Minh",
            "Thành phố Hà Nội",
            "Thành phố Đà Nẵng",
            "Tỉnh Khánh Hòa",
            "Tỉnh Bắc Ninh",
        ]

        shared_hosts = {
            "host1": shared_provinces,
            "host2": shared_provinces,
        }

        property_types = list(PropertyType.objects.all())
        amenities = list(Amenity.objects.all())
        if not property_types or not amenities:
            self.stdout.write(self.style.ERROR("❌ Thiếu dữ liệu PropertyType hoặc Amenity"))
            return

        homestay_counter = 1

        # Xử lý các host cố định 1 tỉnh
        for host_username, province in fixed_hosts.items():
            try:
                host = User.objects.get(username=host_username)
            except User.DoesNotExist:
                self.stdout.write(self.style.ERROR(f"❌ Không tìm thấy host: {host_username}"))
                continue

            communes = Commune.objects.filter(district__province__name=province)
            if not communes:
                self.stdout.write(self.style.ERROR(f"❌ Không có xã cho tỉnh: {province}"))
                continue

            for _ in range(20):
                homestay_counter = self.create_homestay(homestay_counter, host, province, communes, province_coordinates, property_types, amenities)

        # Xử lý các host chia sẻ 7 tỉnh
        for host_username, provinces in shared_hosts.items():
            try:
                host = User.objects.get(username=host_username)
            except User.DoesNotExist:
                self.stdout.write(self.style.ERROR(f"❌ Không tìm thấy host: {host_username}"))
                continue

            per_province = 40 // len(provinces)
            for province in provinces:
                communes = Commune.objects.filter(district__province__name=province)
                if not communes:
                    self.stdout.write(self.style.ERROR(f"❌ Không có xã cho tỉnh: {province}"))
                    continue

                for _ in range(per_province):
                    homestay_counter = self.create_homestay(homestay_counter, host, province, communes, province_coordinates, property_types, amenities)

        self.stdout.write(self.style.SUCCESS("🎉 Đã seed xong toàn bộ 180 homestay!"))

    def create_homestay(self, counter, host, province, communes, province_coordinates, property_types, amenities):
        folder_path = os.path.join("temp", str(counter))
        info_path = os.path.join(folder_path, "info.txt")

        if not os.path.exists(info_path):
            self.stdout.write(self.style.WARNING(f"⚠️ Không có info.txt trong {folder_path}"))
            return counter + 1

        with open(info_path, "r", encoding="utf-8") as f:
            lines = f.read().splitlines()
            name = lines[0].strip() if lines else f"Homestay {counter}"
            description = "\n".join(lines[1:]) if len(lines) > 1 else "Mô tả đang cập nhật"

        commune = random.choice(communes)
        address = f"{commune.name}, {commune.district.name}, {commune.district.province.name}"
        base_lat, base_lon = province_coordinates.get(province, (0.0, 0.0))
        lat = base_lat + random.uniform(-0.02, 0.02)  # Thêm độ lệch nhỏ ngẫu nhiên
        lon = base_lon + random.uniform(-0.02, 0.02)
        price = round(random.uniform(10, 1000), 2)
        guests = random.randint(1, 10)
        prop_type = random.choice(property_types)

        homestay = Homestay.objects.create(
            host=host,
            name=name,
            description=description,
            type=prop_type,
            base_price=price,
            address=address,
            longitude=lon,
            latitude=lat,
            max_guests=guests,
            commune=commune
        )

        selected_amenities = random.sample(amenities, k=random.randint(5, min(10, len(amenities))))
        homestay.amenities.set(selected_amenities)

        images = [f for f in os.listdir(folder_path) if f.lower().endswith(('.jpg', '.jpeg', '.png'))]
        for img in images:
            img_path = os.path.join(folder_path, img)
            try:
                result = cloudinary.uploader.upload(img_path, folder="homestay_images")
                HomestayImage.objects.create(homestay=homestay, image=result["public_id"])
            except Exception as e:
                self.stdout.write(self.style.WARNING(f"⚠️ Lỗi upload ảnh {img_path}: {e}"))

        self.stdout.write(self.style.SUCCESS(f"✅ {counter}. {name} ({host.username}) tại {province}"))
        return counter + 1
