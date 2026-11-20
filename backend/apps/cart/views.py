from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.accounts.authentication import DevelopmentSessionAuthentication
from apps.products.models import Product
from .models import Cart, CartItem


class CartView(APIView):
    authentication_classes = [DevelopmentSessionAuthentication]
    permission_classes = [IsAuthenticated]
    def get(self, request):
        cart, _ = Cart.objects.get_or_create(user=request.user)
        items = cart.items.select_related("product").all()
        return Response([{"catalogue_id": item.product.catalogue_id, "name": item.product.name, "price": str(item.product.selling_price), "quantity": item.quantity} for item in items])

    def post(self, request):
        product = Product.objects.get(catalogue_id=request.data["catalogue_id"], is_active=True)
        cart, _ = Cart.objects.get_or_create(user=request.user)
        item, created = CartItem.objects.get_or_create(cart=cart, product=product, defaults={"quantity": 1})
        if not created:
            item.quantity += 1
            item.save(update_fields=["quantity"])
        return self.get(request)
