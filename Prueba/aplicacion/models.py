from django.db import models

# Create your models here.
class Product(models.Model):
    id = models.CharField(primary_key=True, unique=True, max_length=20)
    name = models.CharField(max_length=100)
    price = models.FloatField(max_length=20)


class Order(models.Model):
    date_time = models.DateTimeField(auto_now_add=False)

    def get_total(self):
        ordersDetails = OrderDetail.objects.filter(order = self.pk)
        total = 0

        for orderDetail in ordersDetails:
            total += orderDetail.price
        
        return total


class OrderDetail(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE)
    cuantity = models.IntegerField()
    price = models.FloatField(max_length=20)
    product = models.ForeignKey(Product, on_delete=models.CASCADE)