from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from homestays.models import *
from users.models import *
from booking.models import *

# class UserAdmin(admin.ModelAdmin):
#     list_display = ['name', 'phone']


# class ProfileAdmin(admin.ModelAdmin):
#     list_editable = ['interests']
#     list_display = ['user', 'interests' ,'about']

class ProfileInline(admin.StackedInline):
    model = Profile
    can_delete = False
    verbose_name_plural = "Thông tin Profile"
    fk_name = "user"

# Tuỳ chỉnh UserAdmin để hiển thị Profile
class UserAdmin(BaseUserAdmin):
    list_display = ['id', 'username', 'name', 'phone', 'get_avatar', 'get_work', 'get_status']
    search_fields = ['username', 'name', 'phone']
    list_filter = ['profile__status']
    ordering = ['id']
    inlines = [ProfileInline]

    def get_avatar(self, obj):
        return obj.profile.avatar.url if obj.profile.avatar else "Chưa có avatar"
    get_avatar.short_description = "Avatar"

    def get_work(self, obj):
        return obj.profile.work if obj.profile else "Không có thông tin"
    get_work.short_description = "Công việc"

    def get_status(self, obj):
        return "Hoạt động" if obj.profile.status else "Không hoạt động"
    get_status.short_description = "Trạng thái"

# Đăng ký ProfileAdmin
class ProfileAdmin(admin.ModelAdmin):
    list_display = ['user', 'interests', 'work']
    list_editable = ['work']

admin.site.register(User, UserAdmin)
admin.site.register(Profile,ProfileAdmin)
admin.site.register(Homestay)
admin.site.register(Province)
admin.site.register(District)
admin.site.register(Commune)
admin.site.register(Amenity)
admin.site.register(HomestayAvailability)
