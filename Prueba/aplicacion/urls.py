from django.urls import path, include
from aplicacion import views
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register(r'products', views.ProductViewSet)
router.register(r'orders', views.OrderViewSet)
router.register(r'orderDetails', views.OrderDetailViewSet)

urlpatterns = [
    path('', views.IndexView.as_view()),
    path('requests/', include(router.urls)),
]
