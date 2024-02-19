from django.db import models
from django.utils.translation import gettext_lazy as _


class TimeStampMixin(models.Model):
    """
    Mixin to handle created and updated time for specific models.
    """
    created_on = models.DateTimeField(null=True, auto_now_add=True, verbose_name=_("created on"))
    updated_on = models.DateTimeField(null=True, auto_now=True, verbose_name=_("updated on"))

    class Meta:
        abstract = True
