import datetime
import json

from channels.generic.websocket import AsyncWebsocketConsumer
from django.contrib.auth import get_user_model

from .models import ChatMessage

User = get_user_model()


async def save_messages(user, recipient, message):
    """
    Save a chat message in the database.

    Args:
        user (int): The ID of the sender.
        recipient (int): The ID of the recipient.
        message (str): The content of the message.

    Returns:
        int: The ID of the saved chat message.
    """
    sender = await User.objects.aget(id=user)
    recipient = await User.objects.aget(id=recipient)
    chat_message = await ChatMessage.objects.acreate(recipient=recipient, sender=sender, message=message)
    return chat_message.id


async def delete_messages(message_id):
    """
    Delete a chat message from the database.

    Args:
        message_id (int): The ID of the message to be deleted.
    """
    try:
        message = await ChatMessage.objects.aget(id=message_id)
        await message.adelete()
    except ChatMessage.DoesNotExist:
        pass


async def get_chat_name(sender, receiver):
    """
    Generate a unique chat room name based on sender and receiver IDs.

    Args:
        sender (str): The sender's ID.
        receiver (str): The receiver's ID.

    Returns:
        str: The generated chat room name.
    """
    return "chat" + "_".join(sorted([sender, receiver]))


class ChatConsumer(AsyncWebsocketConsumer):
    """
    WebSocket consumer for handling chat functionality.

    Attributes:
        sender (str): The sender's ID.
        receiver (str): The receiver's ID.
        room_group_name (str): The name of the chat room group.
    """

    async def connect(self):
        """
        Connect to the WebSocket.

        Fetch sender and receiver IDs from the URL route parameters
        and join the corresponding room group.
        """
        self.sender = self.scope['url_route']['kwargs']['sender']
        self.receiver = self.scope['url_route']['kwargs']['receiver']
        self.room_group_name = await get_chat_name(self.sender, self.receiver)

        # Join room group
        await self.channel_layer.group_add(self.room_group_name, self.channel_name)

        await self.accept()

    async def disconnect(self, close_code):
        """
        Disconnect from the WebSocket.

        Leave the room group.
        """
        # Leave room group
        await self.channel_layer.group_discard(self.room_group_name, self.channel_name)

    async def receive(self, text_data):
        """
        Receive a message from the WebSocket.

        Parse the received JSON data and perform corresponding actions:
        - If 'action' is 'delete', delete the specified message.
        - Otherwise, save the received message in the database and broadcast
          it to the room group.

        Args:
            text_data (str): The received JSON data.
        """
        text_data_json = json.loads(text_data)
        action = text_data_json.get('action')

        if action == 'delete':
            message_id = text_data_json.get('message_id')
            await self.delete_message(message_id)
        else:
            message = text_data_json["message"]
            to_user = text_data_json["to"]

            message_id = await save_messages(self.sender, self.receiver, message)

            # Send message to room group
            await self.channel_layer.group_send(
                self.room_group_name, {
                    "type": "chat.message",
                    "message": message,
                    "to_user": to_user,
                    "message_id": message_id
                }
            )

    async def chat_message(self, event):
        """
        Receive a message from the room group.

        Format the message data and send it to the WebSocket.

        Args:
            event (dict): The received event data.
        """
        message = event["message"]
        to_user = int(event["to_user"])
        message_id = event["message_id"]
        data = {
            "message": message,
            "created_on": f"{datetime.datetime.utcnow()}",
            "to_user": to_user,
            "message_id": message_id
        }
        await self.send(text_data=json.dumps(data))

    async def delete_message(self, message_id):
        """
        Delete a message and notify the room group about the deletion.

        Args:
            message_id (int): The ID of the message to be deleted.
        """
        await delete_messages(message_id)

        # Notify the room group about the deletion
        await self.channel_layer.group_send(
            self.room_group_name, {
                'type': 'chat.message_deleted',
                'message_id': message_id,
            }
        )

    async def chat_message_deleted(self, event):
        """
        Notify the WebSocket about a deleted message.

        Args:
            event (dict): The received event data.
        """
        message_id = event['message_id']

        # Notify WebSocket about the deleted message
        await self.send(text_data=json.dumps({
            'action': 'delete',
            'message_id': message_id,
        }))
