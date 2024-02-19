from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter

from user.views import MessageReadOnlyModelViewSet, UserReadOnlyModelViewSet

router = DefaultRouter()
router.register(r'message', MessageReadOnlyModelViewSet, basename="message")
router.register(r'user', UserReadOnlyModelViewSet, basename="user")

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('user.urls')),
    # router urls
    path("api/", include(router.urls)),
] + static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)

