from django.conf import settings
from rest_framework.authentication import SessionAuthentication


class DevelopmentSessionAuthentication(SessionAuthentication):
    """Skip CSRF only for local DEBUG demos; production keeps DRF's default check."""

    def enforce_csrf(self, request):
        if settings.DEBUG:
            return
        super().enforce_csrf(request)
