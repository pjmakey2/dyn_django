from django.urls import path
from s_manage.views import ProductUi, CustomerUi

urlpatterns = [
    path('product', ProductUi.as_view(), name='product_ui'),
    path('customer', CustomerUi.as_view(), name='customer_ui')
]