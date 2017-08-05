from __future__ import unicode_literals

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
