from django.core.management.base import BaseCommand
from reviews.models import Review
from homestays.models import Homestay
from users.models import User
from booking.models import Booking
from django.utils import timezone
import random
from faker import Faker

fake = Faker('vi_VN')

class Command(BaseCommand):
    help = 'Seed reviews data'

    def handle(self, *args, **kwargs):
        self.stdout.write('Seeding reviews...')

        # Lấy tất cả homestay và user
        homestays = Homestay.objects.all()
        users = User.objects.filter(is_staff=False)  # Chỉ lấy user thường
        
        # Lấy các booking đã xác nhận và đã checkout
        today = timezone.now().date()
        bookings = Booking.objects.filter(
            status='confirmed',
            checkout_date__lt=today
        )

        if not homestays.exists():
            self.stdout.write(self.style.ERROR('No homestays found. Please seed homestays first.'))
            return

        if not users.exists():
            self.stdout.write(self.style.ERROR('No users found. Please seed users first.'))
            return

        if not bookings.exists():
            self.stdout.write(self.style.ERROR('No confirmed bookings with past check-out dates found. Please seed bookings first.'))
            return

        # Tạo reviews cho mỗi booking đã xác nhận và đã checkout
        for booking in bookings:
            # Kiểm tra xem booking này đã có review chưa
            if not hasattr(booking, 'review'):
                # Tạo các rating ngẫu nhiên
                ratings = {
                    'overall_rating': random.randint(4, 5) if random.random() < 0.8 else random.randint(1, 3),
                    'cleanliness_rating': random.randint(4, 5) if random.random() < 0.8 else random.randint(1, 3),
                    'accuracy_rating': random.randint(4, 5) if random.random() < 0.8 else random.randint(1, 3),
                    'checkin_rating': random.randint(4, 5) if random.random() < 0.8 else random.randint(1, 3),
                    'communication_rating': random.randint(4, 5) if random.random() < 0.8 else random.randint(1, 3),
                    'location_rating': random.randint(4, 5) if random.random() < 0.8 else random.randint(1, 3),
                    'value_rating': random.randint(4, 5) if random.random() < 0.8 else random.randint(1, 3),
                }

                # Tạo review
                Review.objects.create(
                    user=booking.user,
                    homestay=booking.homestay,
                    booking=booking,
                    **ratings,
                    comment=fake.paragraph(nb_sentences=3),
                    created_at=booking.checkout_date,
                    updated_at=booking.checkout_date
                )

        self.stdout.write(self.style.SUCCESS('Successfully seeded reviews')) 