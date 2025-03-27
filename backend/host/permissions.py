from rest_framework import permissions

class IsHost(permissions.BasePermission):
    """
    Chỉ cho phép người dùng có quyền 'host' truy cập.
    """

    def has_permission(self, request, view):
        # Kiểm tra nếu người dùng đã đăng nhập và có quyền 'host'
        return bool(request.user and request.user.is_authenticated and request.user.type == 'host')

    def has_object_permission(self, request, view, obj):
        # Kiểm tra nếu object (homestay) thuộc về host hiện tại
        return obj.host == request.user
