import random
from datetime import timedelta, date
from django.core.management.base import BaseCommand
from django.utils import timezone
from decimal import Decimal
from booking.models import Booking, BookingLine, HomestayAvailability
from homestays.models import Homestay
from users.models import User

class Command(BaseCommand):
    help = "Seed bookings with realistic data"

    def handle(self, *args, **options):
        today = timezone.now().date()
        
        # Xóa tất cả dữ liệu cũ
        self.stdout.write(self.style.WARNING("Đang xóa dữ liệu booking cũ..."))
        BookingLine.objects.all().delete()
        HomestayAvailability.objects.all().delete()
        Booking.objects.all().delete()
        self.stdout.write(self.style.SUCCESS("✅ Đã xóa dữ liệu booking cũ"))

        guests = User.objects.filter(type='guest')
        homestays = list(Homestay.objects.all())

        if not guests.exists() or not homestays:
            self.stdout.write(self.style.ERROR("❌ Không có đủ dữ liệu guests hoặc homestays."))
            return
        
        # Lưu lại ngày đã được đặt cho mỗi homestay
        booked_dates = {homestay.id: set() for homestay in homestays}

        # Tạo booking trong 3 tháng trước
        self.stdout.write(self.style.WARNING("Đang tạo booking cho 3 tháng trước..."))
        three_months_ago = today - timedelta(days=90)
        past_homestays = homestays
        
        for homestay in past_homestays:
            # Mỗi homestay có 10-15 booking trong 3 tháng trước
            for _ in range(random.randint(10, 15)):
                guest = random.choice(guests)
                
                # Tìm ngày checkin hợp lệ (trong khoảng 3 tháng trước đến hôm nay)
                max_attempts = 20  # Giới hạn số lần thử để tránh vòng lặp vô hạn
                attempt = 0
                valid_dates_found = False
                
                while attempt < max_attempts and not valid_dates_found:
                    attempt += 1
                    
                    # Ngày checkout trong khoảng từ 3 tháng trước đến hôm nay
                    days_before_today = random.randint(1, 90)
                    checkout_date = today - timedelta(days=days_before_today)
                    
                    # Thời gian lưu trú từ 1-7 ngày
                    stay_duration = random.randint(1, 7)
                    checkin_date = checkout_date - timedelta(days=stay_duration)
                    
                    # Đảm bảo ngày checkin không sớm hơn 3 tháng trước
                    if checkin_date < three_months_ago:
                        continue
                    
                    # Kiểm tra xem khoảng thời gian này đã được đặt chưa
                    date_range = set(checkin_date + timedelta(days=d) for d in range(stay_duration))
                    if not date_range.intersection(booked_dates[homestay.id]):
                        valid_dates_found = True
                        booked_dates[homestay.id].update(date_range)
                
                if not valid_dates_found:
                    self.stdout.write(self.style.WARNING(f"⚠️ Không thể tìm ngày trống cho homestay {homestay.id}"))
                    continue

                status = random.choice(['confirmed', 'cancelled', 'rejected'])
                subtotal, fee, total = Booking.calculate_booking_price(homestay, checkin_date, checkout_date)

                booking = Booking.objects.create(
                    user=guest,
                    homestay=homestay,
                    checkin_date=checkin_date,
                    checkout_date=checkout_date,
                    guests=random.randint(1, homestay.max_guests),
                    status=status,
                    currency='USD',
                    subtotal=subtotal,
                    fee=fee,
                    total_amount=total,
                    note=''
                )

                self.create_booking_lines(booking)

                # Gắn với HomestayAvailability
                for single_date in (checkin_date + timedelta(n) for n in range((checkout_date - checkin_date).days)):
                    HomestayAvailability.objects.get_or_create(
                        homestay=homestay,
                        date=single_date,
                        defaults={
                            'price': homestay.base_price,
                            'status': 'booked',
                            'booking': booking
                        }
                    )
                
                self.stdout.write(f"  ✅ Booking {booking.id}: {checkin_date} → {checkout_date} ({(checkout_date - checkin_date).days} ngày)")

        # Tạo booking sau hôm nay cho 100 homestays
        self.stdout.write(self.style.WARNING("Đang tạo booking cho tương lai..."))
        future_homestays = random.sample(homestays, min(100, len(homestays)))
        for homestay in future_homestays:
            for _ in range(random.randint(1, 2)):
                guest = random.choice(guests)
                
                # Tìm ngày checkin hợp lệ trong tương lai
                max_attempts = 20
                attempt = 0
                valid_dates_found = False
                
                while attempt < max_attempts and not valid_dates_found:
                    attempt += 1
                    
                    delta_days = random.randint(2, 7)  # Thời gian lưu trú
                    checkin_date = today + timedelta(days=random.randint(1, 30))  # Trong vòng 30 ngày tới
                    checkout_date = checkin_date + timedelta(days=delta_days)
                    
                    # Kiểm tra xem khoảng thời gian này đã được đặt chưa
                    date_range = set(checkin_date + timedelta(days=d) for d in range(delta_days))
                    if not date_range.intersection(booked_dates[homestay.id]):
                        valid_dates_found = True
                        booked_dates[homestay.id].update(date_range)
                
                if not valid_dates_found:
                    self.stdout.write(self.style.WARNING(f"⚠️ Không thể tìm ngày trống cho homestay {homestay.id} trong tương lai"))
                    continue

                status = random.choice(['pending', 'confirmed', 'cancelled', 'rejected'])
                subtotal, fee, total = Booking.calculate_booking_price(homestay, checkin_date, checkout_date)

                booking = Booking.objects.create(
                    user=guest,
                    homestay=homestay,
                    checkin_date=checkin_date,
                    checkout_date=checkout_date,
                    guests=random.randint(1, homestay.max_guests),
                    status=status,
                    currency='USD',
                    subtotal=subtotal,
                    fee=fee,
                    total_amount=total,
                    note='Request from guest'
                )

                self.create_booking_lines(booking)

                for single_date in (checkin_date + timedelta(n) for n in range((checkout_date - checkin_date).days)):
                    HomestayAvailability.objects.get_or_create(
                        homestay=homestay,
                        date=single_date,
                        defaults={
                            'price': homestay.base_price,
                            'status': 'booked',
                            'booking': booking
                        }
                    )
                
                self.stdout.write(f"  ✅ Booking tương lai {booking.id}: {checkin_date} → {checkout_date}")

        self.stdout.write(self.style.SUCCESS("🎉 Đã seed dữ liệu bookings thành công!"))

    def create_booking_lines(self, booking):
        """Tạo dịch vụ đi kèm cho booking một cách đa dạng"""
        service_catalog = [
            {"type": "Breakfast", "price_range": (3, 10)},
            {"type": "Airport Pickup", "price_range": (10, 25)},
            {"type": "Laundry", "price_range": (5, 15)},
            {"type": "City Tour", "price_range": (20, 50)},
            {"type": "Bike Rental", "price_range": (5, 15)},
            {"type": "Dinner", "price_range": (7, 20)},
            {"type": "Parking", "price_range": (2, 10)},
            {"type": "Pet Fee", "price_range": (10, 30)},
        ]

        used_types = set()
        for _ in range(random.randint(1, 4)):
            service = random.choice(service_catalog)
            while service["type"] in used_types and len(used_types) < len(service_catalog):
                service = random.choice(service_catalog)
            used_types.add(service["type"])

            single_amount = Decimal(random.uniform(*service["price_range"])).quantize(Decimal('0.01'))
            quantity = random.randint(1, 3)
            sub_amount = single_amount * quantity

            BookingLine.objects.create(
                booking=booking,
                type=service["type"],
                single_amount=single_amount,
                quantity=quantity,
                sub_amount=sub_amount
            )