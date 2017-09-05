# -*- coding: utf-8 -*-
import os
from os.path import join, dirname, abspath, basename, splitext
from django.contrib.auth import login, authenticate
from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth.decorators import login_required
from django.shortcuts import render_to_response, render, redirect
from django.http import JsonResponse, HttpResponse 
from utils.find_title import find_title
from utils.eon_mod import EonMod
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
    if request.user.is_authenticated() and request.method == 'POST':
        if not data['karta']:
            data['karta'] = KartaNowa(user=request.user)
        
        if data['karta'] and data['karta'].user == request.user:
            layout = request.POST.get("layout", "")
            if layout:
                db_layouts = Layout.objects.filter(id=layout)
                if db_layouts:
                    data['karta'].layout = db_layouts[0]
            
            title = request.POST.get("title", "")
            if title:
                data['karta'].nazwa = title
            
            data['karta'].typ = request.POST.get("type", "")
            
            data['karta'].nr_spotkania = request.POST.get("encounter_nr", "")
            
            data['karta'].opis = request.POST.get("text", "")
            
            data['karta'].pic_sepia = request.POST.get("eff-sepia", 'off') == 'on'
            data['karta'].pic_bw = request.POST.get("eff-b-w", 'off') == 'on'
  
            data['karta'].pic_scale_x = float(request.POST.get("pic_scale_x", 1.0))
            data['karta'].pic_scale_y = float(request.POST.get("pic_scale_y", 1.0))

            data['karta'].pic_x = int(request.POST.get("pic_x", 1))
            data['karta'].pic_y = int(request.POST.get("pic_y", 1))
  
            if data['karta'].nazwa:
                data['karta'].save()
                return redirect('/Talisman/{}/'.format(data['karta'].id))

            
    layouts = []
    db_layouts = Layout.objects.filter(element__game__nazwa=game_name, on_layout_list=True).order_by('caption')
    for db_layout in db_layouts:
        layout = {
          'id': db_layout.id,
          'name': db_layout.name,
          'caption': db_layout.caption,
          'en_nr': db_layout.encounter_nr,
          'type_txt': db_layout.type_text,
          'dpi300': db_layout.dpi300,
          'long_txt': db_layout.long_text,
          'w': db_layout.element.width,
          'h': db_layout.element.height,
          'radius': db_layout.element.border_radius,
          'expansions': list(dodatek.id for dodatek in db_layout.dodatek_set.all()),
          'exp_sym': db_layout.exp_symbol,
        }
        if db_layout.exp_symbol_background:
            layout['exp_sym_bg'] = db_layout.exp_symbol_background
        layouts.append(json.dumps(layout))
    data['layouts'] = layouts
 
    data['dodatki'] = Dodatek.objects.filter(game__nazwa=game_name)
 
    return render(request, 'generator.html', data)

def image_list(request):
    data = {}
    #db_game = Game.objects.get(nazwa=game_name)
    #data['game'] = db_game
    images = Layout.objects.filter(official=False, on_reverse_list=True)
    images_official = Layout.objects.filter(official=True, on_reverse_list=True).order_by('element__width')
    data['images'] = images
    data['images_official'] = images_official
    return render_to_response('image_list.html', data)

def signup(request):
    if request.method == 'POST':
        form = UserCreationForm(request.POST)
        if form.is_valid():
            form.save()
            username = form.cleaned_data.get('username')
            raw_password = form.cleaned_data.get('password1')
            user = authenticate(username=username, password=raw_password)
            login(request, user)
            return redirect('index')
    else:
        form = UserCreationForm()
    return render(request, 'signup.html', {'form': form})
    
def check_title(request):
    title = request.GET.get('title', '')
    partial = request.GET.get('part', '0') == '1'
    data = {'result': []}
    if len(title) > 2:
        data['result'] = find_title(title, partial)
    return JsonResponse(data)

def card_list(request):
    if request.user.is_authenticated():
        cards = KartaNowa.objects.filter(user=request.user).order_by('nazwa')
    else:
        cards = []
    data = {'cards': cards}
    return render(request, 'card_list.html', data)

def handle_uploaded_file(request, f):
    base_folder = dirname(dirname(abspath(__file__)))
    folder = join(base_folder, 'static', 'cards')
    filename = join(folder, f.name)
    print filename
    with open(filename, 'wb+') as destination:
        for chunk in f.chunks():
            destination.write(chunk)

    eon = EonMod(filename)
    #print eon.nazwa
    if eon.nazwa:
        karta = KartaNowa(user=request.user)
        folder = join(base_folder, 'static', 'cards', str(karta.id))
        #print folder 
        os.makedirs(folder)
        
        img_filename = splitext(basename(eon.obraz_sciezka))[0] + '.png'
        eon.save_img(join(folder, img_filename))
        karta.layout = Layout.objects.get(name='adventure')
        karta.picture = img_filename
        
        karta.nazwa = eon.nazwa
        karta.typ = eon.typ
        karta.nr_spotkania = eon.nr_spotkania
        karta.opis = eon.efekt
        karta.save()
        
        os.rename(filename, join(folder, f.name))
        return karta.id
    return 0

@login_required
def import_eon(request):
    if request.method == 'POST':
        id_karty = handle_uploaded_file(request, request.FILES['file'])
        return HttpResponse('ok')
    return HttpResponse('fail')
