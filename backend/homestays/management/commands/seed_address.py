from django.core.management.base import BaseCommand
from homestays.models import Province, District, Commune

class Command(BaseCommand):
    help = "Seed initial address data (Provinces, Districts, Communes)"

    def handle(self, *args, **kwargs):
        # Xóa dữ liệu cũ để tránh trùng lặp
        Commune.objects.all().delete()
        District.objects.all().delete()
        Province.objects.all().delete()

        # Danh sách địa chỉ để seed
        address_data = [
            {
                "province": "Hà Nội",
                "districts": [
                    {
                        "name": "Ba Đình",
                        "communes": ["Ngọc Khánh", "Kim Mã", "Giảng Võ"]
                    },
                    {
                        "name": "Hoàn Kiếm",
                        "communes": ["Hàng Bài", "Hàng Trống", "Tràng Tiền"]
                    }
                ]
            },
            {
                "province": "Hồ Chí Minh",
                "districts": [
                    {
                        "name": "Quận 1",
                        "communes": ["Bến Nghé", "Bến Thành", "Phạm Ngũ Lão"]
                    },
                    {
                        "name": "Quận 3",
                        "communes": ["Võ Thị Sáu", "Phường 6", "Phường 7"]
                    }
                ]
            },
            {
                "province": "Đà Nẵng",
                "districts": [
                    {
                        "name": "Hải Châu",
                        "communes": ["Hải Châu 1", "Hải Châu 2", "Phước Ninh"]
                    },
                    {
                        "name": "Sơn Trà",
                        "communes": ["An Hải Bắc", "An Hải Đông", "Nại Hiên Đông"]
                    }
                ]
            },
            {
                "province": "Lâm Đồng",
                "districts": [
                    {
                        "name": "Đà Lạt",
                        "communes": ["Phường 1", "Phường 2", "Phường 3"]
                    },
                    {
                        "name": "Bảo Lộc",
                        "communes": ["B'Lao", "Lộc Phát", "Lộc Sơn"]
                    }
                ]
            }
        ]

        # Seed dữ liệu
        for province_data in address_data:
            province = Province.objects.create(name=province_data["province"])
            for district_data in province_data["districts"]:
                district = District.objects.create(name=district_data["name"], province=province)
                for commune_name in district_data["communes"]:
                    Commune.objects.create(name=commune_name, district=district)

        self.stdout.write(self.style.SUCCESS("✅ Address seeding completed!"))
