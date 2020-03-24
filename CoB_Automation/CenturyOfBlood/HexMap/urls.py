from django.urls import path

from . import views

app_name = 'HexMap'
urlpatterns = [
    path('', views.index, name='index'),
]