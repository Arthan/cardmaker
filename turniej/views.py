from django.shortcuts import render_to_response
from .models import *

def index(request):
    data = {}
    karta_id = request.GET.get('id', 1)
    nawa_tali = request.GET.get('talia', 'przygody')
    db_karta = Karta.objects.get(old_nr=karta_id, talia__nazwa=nawa_tali)
    data['karta'] = db_karta
    return render_to_response('index.html', data)

def canvas(request):
    data = {}
    karta_id = request.GET.get('id', 1)
    nawa_tali = request.GET.get('talia', 'przygody')
    db_karta = Karta.objects.get(old_nr=karta_id, talia__nazwa=nawa_tali)
    data['karta'] = db_karta
    return render_to_response('canvas.html', data)

