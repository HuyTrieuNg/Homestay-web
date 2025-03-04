from rest_framework import permissions

class IsHost(permissions.BasePermission):
    """
    Permission class to allow access only to users with the 'host' role.
    """

    def has_permission(self, request, view):
        # Kiểm tra nếu người dùng có role là 'host'
        return request.user.type == 'host'

