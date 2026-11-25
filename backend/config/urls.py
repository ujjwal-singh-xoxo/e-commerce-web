"""
URL configuration for config project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/6.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""

from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import path

from apps.accounts.views import (
    CsrfView,
    LoginView,
    LogoutView,
    RegisterView,
    SessionView,
)
from apps.cart.views import CartView
from apps.orders.views import PaymentInitView, PaymentVerifyView
from apps.products.views import ProductCatalogueView
from config import views

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/products/", ProductCatalogueView.as_view(), name="product-catalogue"),
    path("api/payments/init/", PaymentInitView.as_view(), name="payment-init"),
    path("api/payments/verify/", PaymentVerifyView.as_view(), name="payment-verify"),
    path("api/auth/csrf/", CsrfView.as_view()),
    path("api/auth/register/", RegisterView.as_view()),
    path("api/auth/login/", LoginView.as_view()),
    path("api/auth/logout/", LogoutView.as_view()),
    path("api/auth/session/", SessionView.as_view()),
    path("api/cart/", CartView.as_view()),
    path("", views.home),
    path("profile/", views.profile),
    path("auth/", views.auth),
    path("shopping/", views.shopping),
    path("cart/", views.cart),
    path("payment/", views.payment),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
