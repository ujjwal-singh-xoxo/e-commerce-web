from django.shortcuts import render


def home(request):
    return render(request, "index.html")


def profile(request):
    return render(request, "pages/profile.html")


def auth(request):
    return render(request, "pages/auth.html")


def shopping(request):
    return render(request, "pages/shopping.html")


def cart(request):
    return render(request, "pages/cart.html")


def payment(request):
    return render(request, "pages/payment.html")
