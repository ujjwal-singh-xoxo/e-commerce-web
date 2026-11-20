from rest_framework.generics import ListAPIView

from .models import Product
from .serializers import ProductCatalogueSerializer


class ProductCatalogueView(ListAPIView):
    serializer_class = ProductCatalogueSerializer

    def get_queryset(self):
        return Product.objects.filter(is_active=True).select_related("category").prefetch_related("images").order_by("name")
