from django.shortcuts import render
from aplicacion.models import Order, OrderDetail, Product
from aplicacion.serializer import OrderSerializer, OrderDetailSerializer, ProductSerializer
from rest_framework.response import Response
from rest_framework import viewsets
from rest_framework.decorators import action
from django.views import View

# Create your views here.
class IndexView(View):
    template = 'index.html'
    
    def get(self, request):
        return render(request, self.template)


class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer

class OrderViewSet(viewsets.ModelViewSet):
    queryset = Order.objects.all()
    serializer_class = OrderSerializer

class OrderDetailViewSet(viewsets.ModelViewSet):
    queryset = OrderDetail.objects.all()
    serializer_class = OrderDetailSerializer