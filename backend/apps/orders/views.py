import os
from decimal import Decimal

import razorpay
from django.db import transaction
from django.utils import timezone
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.accounts.authentication import DevelopmentSessionAuthentication
from apps.cart.models import CartItem
from .models import Order, OrderItem, OrderStatus


def client() -> razorpay.Client:
    key_id, key_secret = os.getenv("RAZORPAY_KEY_ID"), os.getenv("RAZORPAY_KEY_SECRET")
    if not key_id or not key_secret:
        raise RuntimeError("Razorpay is not configured")
    return razorpay.Client(auth=(key_id, key_secret))


class PaymentInitView(APIView):
    authentication_classes = [DevelopmentSessionAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request):
        items = list(CartItem.objects.select_related("product").filter(cart__user=request.user))
        if not items:
            return Response({"detail": "Your cart is empty."}, status=status.HTTP_400_BAD_REQUEST)
        subtotal = sum((item.product.selling_price * item.quantity for item in items), Decimal("0"))
        with transaction.atomic():
            order = Order.objects.create(user=request.user, sub_total=subtotal, tax_total=Decimal("0"), grand_total=subtotal)
            for item in items:
                price = item.product.selling_price
                OrderItem.objects.create(order=order, product=item.product, product_name=item.product.name, quantity=item.quantity, selling_price=price, discount_percent=Decimal("0"), discount_amount=Decimal("0"), final_unit_price=price, sub_total=price * item.quantity, tax_total=Decimal("0"), item_total=price * item.quantity)
            try:
                gateway_order = client().order.create({"amount": int(subtotal * 100), "currency": "INR", "receipt": f"lbs-{order.pk}"})
            except RuntimeError as error:
                return Response({"detail": str(error)}, status=status.HTTP_503_SERVICE_UNAVAILABLE)
            order.razorpay_order_id = gateway_order["id"]
            order.save(update_fields=["razorpay_order_id"])
        return Response({"key_id": os.environ["RAZORPAY_KEY_ID"], "order_id": order.razorpay_order_id, "amount": int(subtotal * 100), "currency": "INR", "name": "Luxurious Bath Studio"})


class PaymentVerifyView(APIView):
    authentication_classes = [DevelopmentSessionAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request):
        payload = request.data
        try:
            order = Order.objects.get(user=request.user, razorpay_order_id=payload["razorpay_order_id"])
            client().utility.verify_payment_signature(payload)
        except (Order.DoesNotExist, razorpay.errors.SignatureVerificationError, KeyError):
            return Response({"detail": "Payment verification failed."}, status=status.HTTP_400_BAD_REQUEST)
        order.razorpay_payment_id = payload["razorpay_payment_id"]
        order.status = OrderStatus.CONFIRMED
        order.paid_at = timezone.now()
        order.save(update_fields=["razorpay_payment_id", "status", "paid_at"])
        return Response({"order_id": order.pk, "status": order.status})
