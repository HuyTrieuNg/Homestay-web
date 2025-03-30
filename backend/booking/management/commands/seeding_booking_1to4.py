import random
from decimal import Decimal
from datetime import date, timedelta
from django.core.management.base import BaseCommand
from booking.models import Booking, BookingLine
from users.models import User
from homestays.models import Homestay

class Command(BaseCommand):
    help = "Tạo Booking từ 1/4 - 4/4 cho tất cả homestays"

    def handle(self, *args, **options):
        """Hàm chính để seed dữ liệu"""
        self.create_fixed_bookings()

    def create_fixed_bookings(self):
        """Tạo Booking cố định từ ngày 1/4 - 4/4"""
        users = User.objects.all()
        homestays = Homestay.objects.all()

        if not users or not homestays:
            self.stdout.write(self.style.WARNING("❌ Không có User hoặc Homestay trong database!"))
            return

        checkin_date = date(2025, 4, 1)
        checkout_date = date(2025, 4, 4)
        status = "pending"
        currency = "VND"

        for homestay in homestays:
            user = random.choice(users)  # Chọn user ngẫu nhiên
            guests = random.randint(1, homestay.max_guests)  # Số khách

            # Tính toán giá tiền
            nights = (checkout_date - checkin_date).days
            subtotal = homestay.base_price * nights
            fee = subtotal * Decimal('0.1')  # Phí dịch vụ 10%
            total_amount = subtotal + fee

            # Kiểm tra xem booking đã tồn tại chưa
            booking, created = Booking.objects.get_or_create(
                user=user,
                homestay=homestay,
                checkin_date=checkin_date,
                checkout_date=checkout_date,
                defaults={
                    "guests": guests,
                    "status": status,
                    "currency": currency,
                    "subtotal": subtotal,
                    "fee": fee,
                    "total_amount": total_amount,
                    "note": "Auto-generated booking",
                }
            )

            if created:
                self.stdout.write(self.style.SUCCESS(f"✔ Created Booking {booking.id} for {homestay.name}"))
                self.create_booking_lines(booking)
            else:
                self.stdout.write(self.style.WARNING(f"⚠ Booking for {homestay.name} already exists"))

    def create_booking_lines(self, booking):
        """Tạo BookingLine (dịch vụ đi kèm)"""
        services = [
            {"type": "Breakfast", "single_amount": Decimal('5.00'), "quantity": 1},
            {"type": "Airport Pickup", "single_amount": Decimal('15.00'), "quantity": 1},
            {"type": "Laundry", "single_amount": Decimal('7.00'), "quantity": 1},
        ]

        for _ in range(random.randint(1, 3)):  # Mỗi booking có từ 1-3 dịch vụ
            service_data = random.choice(services)
            service_data["sub_amount"] = service_data["single_amount"] * service_data["quantity"]
            service_data["booking"] = booking

            BookingLine.objects.create(**service_data)

        self.stdout.write(self.style.SUCCESS(f"✔ Added services for Booking {booking.id}"))
