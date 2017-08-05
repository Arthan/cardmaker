from django.contrib import admin
from .models import *

class KartaAdmin(admin.ModelAdmin):
    list_display = ('nazwa', 'typ', 'podtyp', 'nr_spotkania', 'ilosc', 'old_nr', 'opis')
    list_filter = ('talia', 'typ', 'podtyp', 'nr_spotkania')

admin.site.register(Talia)
admin.site.register(Typ)
admin.site.register(Podtyp)
admin.site.register(Karta, KartaAdmin)