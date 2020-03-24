from django.template import loader
from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import get_object_or_404, render
from django.urls import reverse
from .serializer import hexes
from .models import HexMap, Hex
# Create your views here.

def index(request):

    context = {
        'hexes': hexes
    }

    return render(request, 'hexmap/index.html', context)