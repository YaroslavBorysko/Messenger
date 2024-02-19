from django.contrib.auth import get_user_model
from rest_framework.serializers import ModelSerializer
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

from user.models import ChatMessage

User = get_user_model()


class CustomTokenCreateSerializer(TokenObtainPairSerializer):
    """
    Custom serializer for creating JWT tokens during login.

    Extends:
        TokenObtainPairSerializer
    """

    @classmethod
    def get_token(cls, user):
        """
        Overwrite the default method to set the
        username in the access token.

        Args:
            user (User): The user for whom the token is created.

        Returns:
            dict: A dictionary containing the JWT token with the username.
        """
        token = super().get_token(user)
        token['username'] = user.username
        return token


class ChatMessageSerializer(ModelSerializer):
    """
    Serializer for the ChatMessage model.

    Extends:
        ModelSerializer
    """

    class Meta:
        model = ChatMessage
        fields = '__all__'


class UserSerializer(ModelSerializer):
    """
    Serializer for the User model.

    Extends:
        ModelSerializer
    """

    class Meta:
        model = User
        fields = ['id', 'username']
