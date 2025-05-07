from rest_framework import permissions

class IsHost(permissions.BasePermission):
    """
    Chỉ cho phép người dùng có quyền 'host' truy cập.
    """

    def has_permission(self, request, view):
        if not request.user or not request.user.is_authenticated:
            return False
        if request.user.type != 'host':
            self.message = "Bạn không có quyền truy cập trang này."
            return False
        if not request.user.status:
            self.message = "Tài khoản bị khóa."
            return False
        return True

    def has_object_permission(self, request, view, obj):
        if obj.host != request.user:
            self.message = "Bạn không có quyền truy cập homestay này."
            return False
        return True
