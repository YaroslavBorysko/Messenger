from django.db import models
from django.contrib.auth import get_user_model
from django.utils.translation import gettext_lazy as _
from user.models import TimeStampMixin

UserModel = get_user_model()


class ChatMessage(TimeStampMixin):
    """
    Model representing a chat message between users.

    Attributes:
        sender (UserModel): The sender of the message.
        recipient (UserModel): The recipient of the message.
        message (str): The content of the message.
    """

    sender = models.ForeignKey(
        UserModel, on_delete=models.CASCADE, related_name='sender', verbose_name=_('sender')
    )
    recipient = models.ForeignKey(
        UserModel, on_delete=models.CASCADE, related_name='recipient', verbose_name=_("recipient")
    )

    message = models.TextField(max_length=300, verbose_name=_("message"))

    class Meta:
        """
        Meta class defining the ordering of chat messages.
        """
        ordering = ("created_on",)

    def __str__(self):
        """
        Return a string representation of the chat message.

        Returns:
            str: A string containing information about the sender, recipient, and creation timestamp.
        """
        return f'Message from {self.sender} to {self.recipient}({self.created_on})'
