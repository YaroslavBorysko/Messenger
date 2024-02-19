from django.db.models import Q
from rest_framework import status
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet, ReadOnlyModelViewSet
from rest_framework.permissions import IsAuthenticated

from user.models import ChatMessage
from user.serializers import ChatMessageSerializer, UserSerializer
from django.contrib.auth import get_user_model

User = get_user_model()


class MessageReadOnlyModelViewSet(ModelViewSet):
    """
    API endpoint for managing chat messages.

    Attributes:
        queryset (QuerySet): The set of ChatMessage objects.
        serializer_class (type): The serializer class for ChatMessage objects.
        permission_classes (tuple): The permission classes for this viewset.
    """

    queryset = ChatMessage.objects.all()
    serializer_class = ChatMessageSerializer
    permission_classes = (IsAuthenticated,)

    def retrieve(self, request, *args, **kwargs):
        """
        Retrieve chat messages between the authenticated user and a specific recipient.

        Args:
            request (Request): The incoming request.
            pk (int): The primary key of the recipient.

        Returns:
            Response: A Response object containing the serialized chat messages.
        """
        recipient_id = self.kwargs.get('pk')

        chat_messages = ChatMessage.objects.filter(
            Q(sender_id=request.user.id) &
            Q(recipient_id=recipient_id) |
            Q(recipient_id=request.user.id) &
            Q(sender_id=recipient_id)
        ).order_by('created_on')

        serializer = ChatMessageSerializer(chat_messages, many=True)
        return Response(data=serializer.data, status=status.HTTP_200_OK)

    def list(self, request, *args, **kwargs):
        """
        List all chat messages involving the authenticated user.

        Args:
            request (Request): The incoming request.

        Returns:
            Response: A Response object containing the serialized chat messages.
        """
        chat_messages = ChatMessage.objects.filter(
            Q(sender_id=request.user.id) |
            Q(recipient_id=request.user.id)
        ).order_by('created_on')

        serializer = ChatMessageSerializer(chat_messages, many=True)
        return Response(data=serializer.data, status=status.HTTP_200_OK)


class UserReadOnlyModelViewSet(ReadOnlyModelViewSet):
    """
    API endpoint for retrieving user information.

    Attributes:
        permission_classes (tuple): The permission classes for this viewset.
    """

    permission_classes = (IsAuthenticated,)

    def list(self, request, *args, **kwargs):
        """
        List all users excluding the authenticated user.

        Args:
            request (Request): The incoming request.

        Returns:
            Response: A Response object containing the serialized user data.
        """
        users = User.objects.exclude(
            pk=request.user.pk
        )
        serializer = UserSerializer(users, many=True)
        return Response(data=serializer.data, status=status.HTTP_200_OK)
