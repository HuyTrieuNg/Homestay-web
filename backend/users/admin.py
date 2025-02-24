from django.contrib import admin
from users.models import User,Profile

class UserAdmin(admin.ModelAdmin):
    list_display = ['name', 'phone']


class ProfileAdmin(admin.ModelAdmin):
    list_editable = ['interests']
    list_display = ['user', 'interests' ,'about']

admin.site.register(User, UserAdmin)
admin.site.register( Profile,ProfileAdmin)