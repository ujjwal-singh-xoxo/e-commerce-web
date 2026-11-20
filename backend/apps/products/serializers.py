from rest_framework import serializers

from .models import Product


class ProductCatalogueSerializer(serializers.ModelSerializer):
    category = serializers.CharField(source="category.category_name", read_only=True)
    image_url = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields = ["catalogue_id", "name", "category", "description", "mrp", "selling_price", "details", "image_url"]

    def get_image_url(self, product: Product) -> str | None:
        image = product.images.filter(is_primary=True).first() or product.images.first()
        return image.url if image else None
