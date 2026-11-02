from django.conf import settings
from django.db import models


class OrderStatus(models.TextChoices):
    PENDING = "pending", "Pending"
    CONFIRMED = "confirmed", "Confirmed"
    PROCESSING = "processing", "Processing"
    SHIPPED = "shipped", "Shipped"
    DELIVERED = "delivered", "Delivered"
    CANCELLED = "cancelled", "Cancelled"
    REFUNDED = "refunded", "Refunded"


class Order(models.Model):
    """
    Placed orders of the user
    """

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.PROTECT, related_name="orders"
    )

    status = models.CharField(
        max_length=32, choices=OrderStatus, default=OrderStatus.PENDING
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    sub_total = models.DecimalField(max_digits=15, decimal_places=2)
    tax_total = models.DecimalField(max_digits=15, decimal_places=2)
    grand_total = models.DecimalField(max_digits=15, decimal_places=2)

    class Meta:
        constraints = [
            models.CheckConstraint(
                condition=models.Q(
                    sub_total__gte=0,
                ),
                name="sub_total_greater_than_or_equal_to_zero",
            ),
            models.CheckConstraint(
                condition=models.Q(
                    tax_total__gte=0,
                ),
                name="tax_total_greater_than_or_equal_to_zero",
            ),
            models.CheckConstraint(
                condition=models.Q(
                    grand_total_gt=models.F("sub_total"),
                ),
                name="grand_total_greater_than_or_equal_to_zero",
            ),
        ]


class OrderItem(models.Model):
    """
    Items in the order of the user.
    One item per row
    """

    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name="items")
    product = models.ForeignKey(
        "products.Product", on_delete=models.PROTECT, related_name="order_items"
    )

    product_name = models.CharField(max_length=256)

    quantity = models.PositiveIntegerField()
    selling_price = models.DecimalField(max_digits=12, decimal_places=2)

    discount_percent = models.DecimalField(
        max_digits=6, decimal_places=2
    )  # 3 cuz 100% for free if applicable
    discount_amount = models.DecimalField(max_digits=15, decimal_places=2)

    final_unit_price = models.DecimalField(max_digits=12, decimal_places=2)

    sub_total = models.DecimalField(max_digits=15, decimal_places=2)
    tax_total = models.DecimalField(max_digits=15, decimal_places=2)
    item_total = models.DecimalField(max_digits=15, decimal_places=2)

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=["order", "product"], name="unique_product_per_order"
            )
        ]
