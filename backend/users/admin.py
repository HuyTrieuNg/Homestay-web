from django.contrib import admin
from homestays.models import *
from users.models import *
from booking.models import *

class UserAdmin(admin.ModelAdmin):
    list_display = ['name', 'phone']


class ProfileAdmin(admin.ModelAdmin):
    list_editable = ['interests']
    list_display = ['user', 'interests' ,'about']

admin.site.register(User, UserAdmin)
admin.site.register(Profile,ProfileAdmin)
admin.site.register(Homestay)
admin.site.register(Province)
admin.site.register(District)
admin.site.register(Commune)
admin.site.register(Amenity)
admin.site.register(HomestayAvailability)
