import random
from decimal import Decimal
from datetime import date, timedelta
from django.core.management.base import BaseCommand
from booking.models import Booking, BookingLine
from users.models import User
from homestays.models import Homestay

class Command(BaseCommand):
    help = "Tạo dữ liệu Booking giả lập"

    def handle(self, *args, **options):
        self.create_fake_bookings(n=10)  # Số lượng bookings giả

    def create_fake_bookings(self, n=10):
        """Tạo n booking giả"""
        users = User.objects.all()
        homestays = Homestay.objects.all()

        if not users or not homestays:
            self.stdout.write("❌ Không có user hoặc homestay trong database. Hãy tạo trước.")
            return

        statuses = ['pending', 'confirmed', 'cancelled', 'rejected']
        currencies = ['USD', 'VND', 'EUR']
        start_date = date.today()
        end_date = start_date + timedelta(days=180)

        for _ in range(n):
            user = random.choice(users)
            homestay = random.choice(homestays)
            checkin_date = self.random_date(start_date, end_date)
            checkout_date = checkin_date + timedelta(days=random.randint(1, 14))
            guests = random.randint(1, homestay.max_guests)
            status = random.choice(statuses)
            currency = random.choice(currencies)

            # Tính toán giá
            nights = (checkout_date - checkin_date).days
            subtotal = homestay.base_price * nights
            fee = subtotal * Decimal('0.1')  # Phí dịch vụ 10%
            total_amount = subtotal + fee

            # Tạo booking
            booking = Booking.objects.create(
                user=user,
                homestay=homestay,
                checkin_date=checkin_date,
                checkout_date=checkout_date,
                guests=guests,
                status=status,
                currency=currency,
                subtotal=subtotal,
                fee=fee,
                total_amount=total_amount,
                note="Auto-generated booking"
            )
            self.stdout.write(f"✔ Created Booking {booking.id}")

            # Tạo BookingLine
            self.create_booking_lines(booking)

    def create_booking_lines(self, booking):
        """Tạo dịch vụ đi kèm cho booking"""
        services = [
            {"type": "Breakfast", "single_amount": Decimal('5.00'), "quantity": 1},
            {"type": "Airport Pickup", "single_amount": Decimal('15.00'), "quantity": 1},
            {"type": "Laundry", "single_amount": Decimal('7.00'), "quantity": 1},
        ]

        for _ in range(random.randint(1, 3)):  # Mỗi booking có từ 1-3 dịch vụ
            service_data = random.choice(services)

            # Tính toán tổng giá dịch vụ
            service_data["sub_amount"] = service_data["single_amount"] * service_data["quantity"]
            service_data["booking"] = booking  # Gán booking ID

            # Tạo BookingLine
            BookingLine.objects.create(**service_data)

        self.stdout.write(f"✔ Thêm dịch vụ vào Booking {booking.id}")

    def random_date(self, start, end):
        """Tạo ngày ngẫu nhiên trong khoảng"""
        return start + timedelta(days=random.randint(0, (end - start).days))
