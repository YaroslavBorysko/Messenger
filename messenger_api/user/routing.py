from django.urls import re_path

from user.consumers import ChatConsumer

websocket_urlpatterns = [
    re_path(r'ws/chat/(?P<sender>[^/]+)/(?:(?P<receiver>[^/]+)/)?$', ChatConsumer.as_asgi())
]
