import datetime
from users.models import User
from homestays.models import Province, District, Commune, Homestay, Amenity, HomestayAmenity, HomestayAvailability

# Tạo dữ liệu mẫu cho địa chỉ

# 1. Tạo Province
hanoi = Province.objects.create(name="Hà Nội")
hcmc = Province.objects.create(name="Hồ Chí Minh")

# 2. Tạo District cho mỗi Province
ba_dinh = District.objects.create(name="Ba Đình", province=hanoi)
dong_da = District.objects.create(name="Đống Đa", province=hanoi)
district1 = District.objects.create(name="Quận 1", province=hcmc)
district2 = District.objects.create(name="Quận 2", province=hcmc)

# 3. Tạo Commune cho mỗi District
# Hà Nội
phuc_xa = Commune.objects.create(name="Phúc Xá", district=ba_dinh)
truc_bach = Commune.objects.create(name="Trúc Bạch", district=ba_dinh)
lang_ha = Commune.objects.create(name="Láng Hạ", district=dong_da)
# Hồ Chí Minh
ben_nghe = Commune.objects.create(name="Bến Nghé", district=district1)
tan_dinh = Commune.objects.create(name="Tân Định", district=district1)
an_phu = Commune.objects.create(name="An Phú", district=district2)

# Tạo dữ liệu mẫu cho Amenity
wifi = Amenity.objects.create(name="WiFi", icon="wifi.svg")
ac = Amenity.objects.create(name="Điều hòa", icon="ac.svg")
parking = Amenity.objects.create(name="Bãi đỗ xe", icon="parking.svg")
pool = Amenity.objects.create(name="Hồ bơi", icon="pool.svg")

# Tạo một host mẫu (nếu chưa có)
host, created = User.objects.get_or_create(username="host1", defaults={"name": "Host One"})
if created:
    # Sử dụng set_password để lưu mật khẩu đúng cách
    host.set_password("pass123")
    host.save()

# Tạo dữ liệu mẫu cho Homestay
homestay1 = Homestay.objects.create(
    host=host,
    name="Homestay Trung Tâm Hà Nội",
    description="Không gian ấm cúng, tiện nghi ngay trung tâm thủ đô.",
    type="homestay",  # Giá trị trong choices: villa, apartment, hotel, resort, homestay
    images="images/sample1.jpg",  # Đường dẫn mẫu, bạn có thể chỉnh sửa lại
    base_price=1000000.00,
    address="123 Phố Huế, Hà Nội",
    longitude=105.83416,
    latitude=21.02776,
    commune=phuc_xa,
    max_guests=4,
)

# Gán các tiện ích cho homestay qua bảng liên kết HomestayAmenity
HomestayAmenity.objects.create(homestay=homestay1, amenity=wifi)
HomestayAmenity.objects.create(homestay=homestay1, amenity=ac)
HomestayAmenity.objects.create(homestay=homestay1, amenity=parking)

# Tạo dữ liệu mẫu cho HomestayAvailability cho homestay1
HomestayAvailability.objects.create(
    homestay=homestay1,
    date=datetime.date(2023, 4, 1),
    price=1100000.00,
    status="available",
    booking_id=None,
)
HomestayAvailability.objects.create(
    homestay=homestay1,
    date=datetime.date(2023, 4, 2),
    price=1100000.00,
    status="booked",
    booking_id=1,  # Giả sử đã có booking với id=1
)


import datetime
from users.models import User
from homestays.models import Province, District, Commune, Amenity

# ----- Tạo dữ liệu mẫu cho địa chỉ -----

# Tạo Province (Tỉnh)
hn, created = Province.objects.get_or_create(name="Hà Nội")
hcmc, created = Province.objects.get_or_create(name="Hồ Chí Minh")

# Tạo District (Huyện/Quận) cho mỗi tỉnh
# Hà Nội
ba_dinh, created = District.objects.get_or_create(name="Ba Đình", province=hn)
dong_da, created = District.objects.get_or_create(name="Đống Đa", province=hn)
# Hồ Chí Minh
quan1, created = District.objects.get_or_create(name="Quận 1", province=hcmc)
quan2, created = District.objects.get_or_create(name="Quận 2", province=hcmc)

# Tạo Commune (Xã/Phường) cho mỗi huyện/quận
# Hà Nội - Ba Đình
phuc_xa, created = Commune.objects.get_or_create(name="Phúc Xá", district=ba_dinh)
truc_bach, created = Commune.objects.get_or_create(name="Trúc Bạch", district=ba_dinh)
# Hà Nội - Đống Đa
lang_ha, created = Commune.objects.get_or_create(name="Láng Hạ", district=dong_da)
# Hồ Chí Minh - Quận 1
ben_nghe, created = Commune.objects.get_or_create(name="Bến Nghé", district=quan1)
tan_dinh, created = Commune.objects.get_or_create(name="Tân Định", district=quan1)
# Hồ Chí Minh - Quận 2
an_phu, created = Commune.objects.get_or_create(name="An Phú", district=quan2)

# ----- Tạo dữ liệu mẫu cho Amenities -----
Amenity.objects.get_or_create(name="WiFi", icon="wifi.svg")
Amenity.objects.get_or_create(name="Điều hòa", icon="ac.svg")
Amenity.objects.get_or_create(name="Bãi đỗ xe", icon="parking.svg")
Amenity.objects.get_or_create(name="Hồ bơi", icon="pool.svg")


print("Dữ liệu mẫu đã được tạo thành công!")
