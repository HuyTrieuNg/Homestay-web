from rest_framework import permissions

class IsAdmin(permissions.BasePermission):
    """
    Chỉ cho phép người dùng có quyền 'admin' truy cập.
    """

    def has_permission(self, request, view):
        if not request.user or not request.user.is_authenticated:
            return False
        if request.user.type != 'admin':
            self.message = "Bạn không có quyền truy cập trang này."
            return False
        return True
