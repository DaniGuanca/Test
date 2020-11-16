from aplicacion.models import Order, OrderDetail, Product
from rest_framework import serializers
from rest_framework.parsers import FormParser, JSONParser, MultiPartParser

class ProductSerializer(serializers.HyperlinkedModelSerializer):
    parser_classes = (FormParser, JSONParser, MultiPartParser)
    class Meta:
        model = Product
        fields = ['url', 'id', 'name', 'price']

class OrderSerializer(serializers.HyperlinkedModelSerializer):
    parser_classes = (FormParser, JSONParser, MultiPartParser)
    class Meta:
        model = Order
        fields = ['url', 'id', 'date_time', 'get_total']

class OrderDetailSerializer(serializers.HyperlinkedModelSerializer):
    parser_classes = (FormParser, JSONParser, MultiPartParser)
    class Meta:
        model = OrderDetail
        fields = ['url', 'id', 'order', 'cuantity', 'price', 'product']
