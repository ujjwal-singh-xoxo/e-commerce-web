import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):
    initial = True
    dependencies = [migrations.swappable_dependency(settings.AUTH_USER_MODEL), ("products", "0001_initial")]
    operations = [
        migrations.CreateModel(name="Order", fields=[
            ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
            ("status", models.CharField(choices=[("pending", "Pending"), ("confirmed", "Confirmed"), ("processing", "Processing"), ("shipped", "Shipped"), ("delivered", "Delivered"), ("cancelled", "Cancelled"), ("refunded", "Refunded")], default="pending", max_length=32)),
            ("created_at", models.DateTimeField(auto_now_add=True)), ("updated_at", models.DateTimeField(auto_now=True)),
            ("sub_total", models.DecimalField(decimal_places=2, max_digits=15)), ("tax_total", models.DecimalField(decimal_places=2, max_digits=15)), ("grand_total", models.DecimalField(decimal_places=2, max_digits=15)),
            ("razorpay_order_id", models.CharField(blank=True, max_length=80, null=True, unique=True)), ("razorpay_payment_id", models.CharField(blank=True, max_length=80, null=True, unique=True)), ("paid_at", models.DateTimeField(blank=True, null=True)),
            ("user", models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, related_name="orders", to=settings.AUTH_USER_MODEL)),
        ], options={"constraints": [models.CheckConstraint(condition=models.Q(("sub_total__gte", 0)), name="sub_total_greater_than_or_equal_to_zero"), models.CheckConstraint(condition=models.Q(("tax_total__gte", 0)), name="tax_total_greater_than_or_equal_to_zero"), models.CheckConstraint(condition=models.Q(("grand_total__gte", models.F("sub_total"))), name="grand_total_greater_than_or_equal_to_zero")] }),
        migrations.CreateModel(name="OrderItem", fields=[
            ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")), ("product_name", models.CharField(max_length=256)), ("quantity", models.PositiveIntegerField()), ("selling_price", models.DecimalField(decimal_places=2, max_digits=12)), ("discount_percent", models.DecimalField(decimal_places=2, max_digits=6)), ("discount_amount", models.DecimalField(decimal_places=2, max_digits=15)), ("final_unit_price", models.DecimalField(decimal_places=2, max_digits=12)), ("sub_total", models.DecimalField(decimal_places=2, max_digits=15)), ("tax_total", models.DecimalField(decimal_places=2, max_digits=15)), ("item_total", models.DecimalField(decimal_places=2, max_digits=15)),
            ("order", models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name="items", to="orders.order")), ("product", models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, related_name="order_items", to="products.product")),
        ], options={"constraints": [models.UniqueConstraint(fields=("order", "product"), name="unique_product_per_order")]}),
    ]
