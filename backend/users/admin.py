from django.contrib import admin

from homestays.models import *
from users.models import *

# Register your models here.

admin.site.register(User)
admin.site.register(Profile)
admin.site.register(Homestay)
admin.site.register(Province)
admin.site.register(District)
admin.site.register(Commune)
admin.site.register(Amenity)
admin.site.register(HomestayAmenity)
admin.site.register(HomestayAvailability)




