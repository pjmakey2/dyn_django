import random
from s_manage.models import *
import datetime

CustomerChannel.objects.all().delete()
CustomerChain.objects.all().delete()
Customer.objects.all().delete()
ProductCategory.objects.all().delete()
ProductFamily.objects.all().delete()
ProductBrand.objects.all().delete()
Product.objects.all().delete()
Price.objects.all().delete()
OrderHeader.objects.all().delete()
OrderDetail.objects.all().delete()


def random_date():
    today = datetime.date.today()
    random_day = today - datetime.timedelta(days=random.randint(-15, 15))
    return random_day


def generate_fake_data():
    for c in ["Online", "Retail", "Wholesale"]:
        CustomerChannel.objects.create(name=c)
    for c in ["Walmart", "Target", "Amazon"]:
        CustomerChain.objects.create(name=c)
    for c in ["Food", "Clothing", "Electronics"]:
        ProductCategory.objects.create(name=c)
    for c in ["Fruits", "Vegetables", "Apparel"]:
        ProductFamily.objects.create(name=c)

    for c in ["Apple", "Nike", "Samsung"]:
        ProductBrand.objects.create(name=c)
    pp = ['Apple iPhone', 'Nike Air Jordans', 'Samsung Galaxy S22', 
          'MacBook Pro', 'Logitech G502 Hero', 'Samsung 4K UHD Smart TV', 
          'Sony PlayStation 5', 'Xbox Series X', 'Nintendo Switch OLED', 'Google Pixel 6 Pro', 'Acer Aspire 5 Laptop', 'Dell XPS 13 Laptop', 'HP Spectre x360 Laptop', 'Logitech MX Master 3 Mouse', 'Apple AirPods Pro', 'Samsung Galaxy Buds Pro', 'Sony WH-1000XM5 Headphones', 'Bose QuietComfort 45 Headphones', 'Apple Watch Series 7', 'Fitbit Versa 3', 'Garmin Forerunner 245']
    for p in pp:
        Product.objects.create(
            name=p,
            code=random.randint(1, 10000),
            pack=random.choice([True, False]),
            category=random.choice(ProductCategory.objects.all()),
            family=random.choice(ProductFamily.objects.all()),
            brand=random.choice(ProductBrand.objects.all()),
        )
    for n in ["John Doe", "Jane Doe", "Michael Smith"]:
        Customer.objects.create(
            name=n,
            channel=random.choice(CustomerChannel.objects.all()),
            chain=random.choice(CustomerChain.objects.all()),
        )

    for t in Product.objects.all():
        for r in range(1, 10):
            Price.objects.create(
                product=t,
                price=random.randint(10000, 90000),
                chanell=random.choice(CustomerChannel.objects.all()),
                customer=random.choice(Customer.objects.all()),
                start_date=random_date(),
            )
    for r in range(1, 5):
        obj = OrderHeader.objects.create(
            date=random_date(),
            reception_date=random_date(),
            customer=random.choice(Customer.objects.all()),
        )
        for b in range(1, 5):
            pobj = random.choice(Product.objects.all())
            obj.orderdetail_set.create(
                product=pobj,
                quantity_original=random.randint(1, 10),
                quantity=random.randint(1, 100),
                price=random.choice(pobj.price_set.all()).price,
                rejected=random.choice([True, False]),
            )
generate_fake_data()
