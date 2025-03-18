from datetime import date, timedelta
from django.core.management.base import BaseCommand
from homestays.models import Homestay
from booking.models import HomestayAvailability

class Command(BaseCommand):
    help = 'Cập nhật bảng availability cho Homestay'

    def handle(self, *args, **options):
        today = date.today()
        six_months_later = today + timedelta(days=180)

        # 1. Xóa các bản ghi availability của những ngày đã qua (hoặc bạn có thể di chuyển sang bảng lưu trữ)
        deleted, _ = HomestayAvailability.objects.filter(date__lt=today).delete()
        self.stdout.write(f"Đã xóa {deleted} bản ghi availability cũ.")

        # 2. Với mỗi homestay, đảm bảo có bản ghi availability từ ngày hiện tại đến 6 tháng sau
        for homestay in Homestay.objects.all():
            # Tìm ngày cuối cùng đã có bản ghi cho homestay này
            last_entry = HomestayAvailability.objects.filter(homestay=homestay).order_by('-date').first()
            if last_entry:
                start_date = last_entry.date + timedelta(days=1)
            else:
                start_date = today

            # Nếu đã có đủ dữ liệu cho khoảng 6 tháng, bỏ qua
            if start_date > six_months_later:
                self.stdout.write(f"Availability của {homestay.name} đã được cập nhật đủ.")
                continue

            # Tạo các bản ghi mới cho khoảng thời gian từ start_date đến six_months_later
            new_entries = []
            current_date = start_date
            while current_date <= six_months_later:
                new_entries.append(
                    HomestayAvailability(
                        homestay=homestay,
                        date=current_date,
                        price=homestay.base_price,
                        status='available'
                    )
                )
                current_date += timedelta(days=1)

            HomestayAvailability.objects.bulk_create(new_entries)
            self.stdout.write(f"Đã thêm {len(new_entries)} bản ghi cho {homestay.name}.")

        self.stdout.write(self.style.SUCCESS("Cập nhật availability hoàn tất."))
