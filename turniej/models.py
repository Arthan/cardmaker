from __future__ import unicode_literals
import uuid

from django.db import models

class Talia(models.Model):
    nazwa = models.CharField(max_length=20)
    def __unicode__(self):
        return self.nazwa
        
class Typ(models.Model):
    nazwa = models.CharField(max_length=20)
    def __unicode__(self):
        return self.nazwa

class Podtyp(models.Model):
    nazwa = models.CharField(max_length=20)
    def __unicode__(self):
        return self.nazwa
    
class Karta(models.Model):
    nazwa = models.CharField(max_length=50)
    talia = models.ForeignKey('Talia')
    typ = models.ForeignKey('Typ')
    podtyp = models.ForeignKey('Podtyp')
    nr_spotkania = models.IntegerField()
    opis = models.TextField()
    ilosc = models.IntegerField(default=1)
    old_nr = models.IntegerField()
    def typ_text(self):
        ret = self.typ.nazwa
        if self.typ.nazwa != self.podtyp.nazwa:
            ret = ret + ' - ' + self.podtyp.nazwa
        return ret
    
    def __unicode__(self):
        return self.nazwa



class Layout(models.Model):
    element = models.ForeignKey('Element')
    name = models.CharField(max_length=50)
    caption = models.CharField(max_length=50)
    dpi300 = models.BooleanField(default=True)
    long_text = models.BooleanField(default=True)
    encounter_nr = models.BooleanField(default=True)
    type_text = models.BooleanField(default=True)
    official = models.BooleanField(default=True)
    on_reverse_list = models.BooleanField(default=True)
    on_layout_list = models.BooleanField(default=True)
    exp_symbol = models.BooleanField(default=False)
    class Meta:
        ordering = ['name']
    def __unicode__(self):
        return self.name
    
class KartaNowa(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    layout = models.ForeignKey('Layout')
    nazwa = models.CharField(max_length=50)
    typ = models.CharField(max_length=50)
    nr_spotkania = models.CharField(max_length=1)
    opis = models.TextField()
    picture = models.CharField(max_length=250)
    pic_x = models.IntegerField()
    pic_y = models.IntegerField()
    pic_scale = models.FloatField()
    
    def __unicode__(self):
        return self.nazwa

class Game(models.Model):
    nazwa = models.CharField(max_length=50)    
    def __unicode__(self):
        return self.nazwa

class Element(models.Model):
    game = models.ForeignKey('Game')
    nazwa = models.CharField(max_length=50)
    width = models.IntegerField()
    height = models.IntegerField()
    border_radius  = models.IntegerField()
    def __unicode__(self):
        return u'{} - {}'.format(self.game.nazwa, self.nazwa)

class Dodatek(models.Model):
    nazwa = models.CharField(max_length=50)
    game = models.ForeignKey('Game')
    layout = models.ManyToManyField('Layout')
    class Meta:
        ordering = ['nazwa']
    def __unicode__(self):
        return self.nazwa
