from django.db import models
from django.db.models.deletion import RESTRICT


class ProductCategory(models.Model):
    category_name = models.CharField(max_length=100)
    parent = models.ForeignKey(
        "self",
        on_delete=models.RESTRICT,
        null=True,
        blank=True,
        related_name="subcategories",
    )


class Product(models.Model):
    catalogue_id = models.CharField(max_length=20, unique=True)

    category = models.ForeignKey(
        ProductCategory, on_delete=models.RESTRICT, related_name="products"
    )

    name = models.CharField(max_length=256)
    description = models.TextField()

    mrp = models.DecimalField(max_digits=12, decimal_places=2)
    selling_price = models.DecimalField(max_digits=12, decimal_places=2)

    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    details = models.JSONField()


class ProductRequirements(models.Model):
    """
    Required products to go along with main product

    One row per requirement
    """

    product = models.ForeignKey(
        Product, on_delete=RESTRICT, related_name="requirements"
    )
    requirement = models.ForeignKey(
        Product, on_delete=RESTRICT, related_name="required_by"
    )

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=["product", "requirement"],
                name="unique_product_requirement",
            ),
            models.CheckConstraint(
                condition=~models.Q(product=models.F("requirement")),
                name="product_cannot_require_itself",
            ),
        ]


class ProductImage(models.Model):
    product = models.ForeignKey(
        Product, on_delete=models.CASCADE, related_name="images"
    )
    url = models.URLField(max_length=500)
    is_primary = models.BooleanField(default=False)
    position = models.PositiveSmallIntegerField(default=0)

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=["product"],
                condition=models.Q(is_primary=True),
                name="one_primary_image_per_product",
            ),
        ]


class Inventory(models.Model):
    product = models.ForeignKey(Product, on_delete=RESTRICT, related_name="items")

    total_quantity = models.PositiveIntegerField(default=0)
    reserved_quantity = models.PositiveIntegerField(default=0)

    class Meta:
        constraints = [
            models.CheckConstraint(
                condition=models.Q(reserved_quantity__lte=models.F("total_quantity")),
                name="reserved_quantity_lte_total",
            )
        ]
