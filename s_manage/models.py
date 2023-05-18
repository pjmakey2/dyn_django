from django.db import models

# Create your models here.
class CustomerChannel(models.Model):
    name = models.CharField(max_length=255)

    def __str__(self):
        return self.name
    
class CustomerChain(models.Model):
    name = models.CharField(max_length=255)

    def __str__(self):
        return self.name


class Customer(models.Model):
    name = models.CharField(max_length=255)
    channel = models.ForeignKey(CustomerChannel, on_delete=models.CASCADE)
    chain = models.ForeignKey(CustomerChain, on_delete=models.CASCADE)

    def __str__(self):
        return self.name

class ProductCategory(models.Model):
    name = models.CharField(max_length=255)

    def __str__(self):
        return self.name

class ProductFamily(models.Model):
    name = models.CharField(max_length=255)

    def __str__(self):
        return self.name

class ProductBrand(models.Model):
    name = models.CharField(max_length=255)

    def __str__(self):
        return self.name

class Product(models.Model):
    name = models.CharField(max_length=255)
    code = models.IntegerField()
    pack = models.BooleanField()
    category = models.ForeignKey(ProductCategory, on_delete=models.CASCADE)
    family = models.ForeignKey(ProductFamily, on_delete=models.CASCADE)
    brand = models.ForeignKey(ProductBrand, on_delete=models.CASCADE)

    def __str__(self):
        return self.name

class Price(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    price = models.FloatField()
    chanell = models.ForeignKey(CustomerChannel, on_delete=models.CASCADE, null=True)
    customer = models.ForeignKey(Customer, on_delete=models.CASCADE, null=True)
    start_date = models.DateField()

    def __str__(self):
        return f"{self.product} - {self.price} - {self.chanell} - {self.customer}"

class OrderHeader(models.Model):
    date = models.DateField()
    reception_date = models.DateField()
    customer = models.ForeignKey(Customer, on_delete=models.CASCADE)

    def __str__(self):
        return f"Order Header #{self.id}"

class OrderDetail(models.Model):
    order_header = models.ForeignKey(OrderHeader, on_delete=models.CASCADE)
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity_original = models.IntegerField()
    quantity = models.IntegerField()
    price = models.FloatField()
    rejected = models.BooleanField(default=False)

    def __str__(self):
        return f"Order Detail #{self.id}"
