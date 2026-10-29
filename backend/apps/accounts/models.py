import phonenumbers
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin
from django.core.exceptions import ValidationError
from django.db import models


def validate_phone_number(value: str):
    try:
        number = phonenumbers.parse(value, None)
    except phonenumbers.NumberParseException:
        raise ValidationError("Invalid number format")

    if not phonenumbers.is_valid_number(number):
        raise ValidationError("Invalid number format")


class UserProfile(AbstractBaseUser, PermissionsMixin):
    USERNAME_FIELD = "email"

    id = models.BigAutoField(primary_key=True)
    name = models.CharField(max_length=150)

    phone_number = models.CharField(max_length=15, validators=[validate_phone_number])

    email = models.EmailField(max_length=254, unique=True)

    is_active = models.BooleanField()
    is_staff = models.BooleanField()


class AddressBook(models.Model):
    """
    A row per address line
    """

    user_id = models.ForeignKey(
        UserProfile, on_delete=models.CASCADE, related_name="addresses"
    )

    label = models.CharField(max_length=30, default="Other")
    recipient_name = models.CharField(max_length=150)

    phone_number = models.CharField(max_length=15, validators=[validate_phone_number])

    address_line_1 = models.CharField(max_length=255)
    address_line_2 = models.CharField(max_length=255, blank=True)
    locality = models.CharField(max_length=120)
    city = models.CharField(max_length=100)
    state = models.CharField(max_length=100)
    country = models.CharField(max_length=100)
    postal_code = models.CharField(max_length=20)
    country_code = models.CharField(max_length=2)
