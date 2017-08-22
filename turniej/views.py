# -*- coding: utf-8 -*-
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

def generator(request, game_name='Talisman', card_id=''):
    data = {}
    db_game = Game.objects.get(nazwa=game_name)
    data['game'] = db_game
    
    if card_id != '':
      db_card = KartaNowa.objects.get(id=card_id)
      data['karta'] = db_card
    else:
      data['karta'] = None 
    
    layouts = []
    db_layouts = Layout.objects.filter(element__game__nazwa=game_name, on_layout_list=True).order_by('caption')
    for db_layout in db_layouts:
        layout = {
          'name': db_layout.name,
          'caption': db_layout.caption,
          'en_nr': db_layout.encounter_nr,
          'type_txt': db_layout.type_text,
          'dpi300': db_layout.dpi300,
          'long_txt': db_layout.long_text,
          'w': db_layout.element.width,
          'h': db_layout.element.height,
          'radius': db_layout.element.border_radius,
        }
        layouts.append(json.dumps(layout))
    data['layouts'] = layouts
 
    return render_to_response('generator.html', data)

def image_list(request):
    data = {}
    #db_game = Game.objects.get(nazwa=game_name)
    #data['game'] = db_game
    images = Layout.objects.filter(official=False, on_reverse_list=True)
    images_official = Layout.objects.filter(official=True, on_reverse_list=True).order_by('element__width')
    data['images'] = images
    data['images_official'] = images_official
    return render_to_response('image_list.html', data)
