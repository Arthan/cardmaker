from django.shortcuts import render_to_response
from .models import *
import json

def index(request):
    data = {}
    karta_id = request.GET.get('id', 1)
    nawa_tali = request.GET.get('talia', 'przygody')
    db_karta = Karta.objects.get(old_nr=karta_id, talia__nazwa=nawa_tali)

    layouts = []
    db_layouts = Layout.objects.all().order_by('caption')
    for db_layout in db_layouts:
        layout = {
          'name': db_layout.name,
          'caption': db_layout.caption,
          'en_nr': db_layout.encounter_nr,
          'type_txt': db_layout.type_text,
          'dpi300': db_layout.dpi300,
          'long_txt': db_layout.long_text,
        }
        layouts.append(layout)


    data['karta'] = db_karta
    data['layouts'] = json.dumps(layouts)
    return render_to_response('index.html', data)

def canvas(request):
    data = {}
    karta_id = request.GET.get('id', 1)
    nawa_tali = request.GET.get('talia', 'przygody')
    db_karta = Karta.objects.get(old_nr=karta_id, talia__nazwa=nawa_tali)
    data['karta'] = db_karta
    return render_to_response('canvas.html', data)

