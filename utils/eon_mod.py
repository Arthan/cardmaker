#-*- coding: utf-8 -*-
import codecs
import sys

class EonMod(object):
    def __init__(self, filename, version=2):
        self.file_data = None
        
        with open(filename, 'rb+')  as f:
            self.file_data = f.read()
        
        self.nazwa = self.get_value('DIY')
        #self.typ_karty = self.get_value('Card') #2
        self.typ = self.get_value('Type')
        self.nr_spotkania = self.get_value('EncounterNumber')
        self.efekt = self.get_value('SpecialText')
        #self.rozszerzenie = self.get_value('Expansion') #2
        # self.ognioodporna = self.get_value('Fireproof') # 3s
        
        self.obraz_sciezka = self.get_value('t'+chr(0)+chr(0))
        
        self.obraz = self.get_img()
        #with open('img.png', 'wb+')  as f:
        #    f.write(self.obraz)
        
    def save_img(self, filename):
        with open(filename, 'wb+')  as f:
            f.write(self.obraz)
    
        
    def get_value(self, caption, p_size=2):    
        txt = ''
        txt_p = len(caption) + 1 + self.file_data.find(caption+'t')    
        if txt_p >= 0:
            txt_size = self.file_data[txt_p:txt_p+p_size]
            txt_size = int(codecs.encode(txt_size, 'hex'), 16)
            txt = self.file_data[txt_p+p_size:txt_p+p_size+txt_size]
        return txt
    
    def set_value(self, caption, new_value, p_size=2):
        txt_p = self.file_data.find(caption+'t')
        if txt_p >= 0:
            txt_p += len(caption) + 1
            txt_size = self.file_data[txt_p:txt_p+p_size]
            txt_size = int(codecs.encode(txt_size, 'hex'), 16)
            txt_new_size = len(new_value)
            new_size_1 = txt_new_size / 256
            new_size_2 = txt_new_size % 256
            txt_new_size = bytes(bytearray([new_size_1, new_size_2]))
            new_file_data = self.file_data[:txt_p] + txt_new_size + new_value + self.file_data[txt_p+p_size+txt_size:]
            self.file_data = new_file_data

    def set_nazwa(self, txt):
        self.set_value('DIY', txt)
        
    def set_typ_karty(self, txt):
        self.set_value('Card', txt)
        
    def set_typ(self, txt):
        self.set_value('Type', txt)
        
    def set_nr_spotkania(self, txt):
        self.set_value('EncounterNumber', txt)
        
    def set_efekt(self, txt):
        self.set_value('SpecialText', txt)
        
    def set_rozszerzenie(self, txt):
        self.set_value('Expansion', txt)

    def get_img(self):
        caption = chr(137)+'PNG'
        txt_p = self.file_data.find(caption) # + len(caption)
        txt = self.file_data[txt_p:-1]
        return txt

    def int_to_hex(self, number, size=4):
        reszty = []
        nr = number
        while nr > 0:
            reszty.insert(0, nr % 256)
            nr = nr / 256
        while len(reszty) < size:
            reszty.insert(0, 0)
        reszty = bytes(bytearray(reszty))
        return reszty
    
    def comment_chars(self, chars, char):
        txt_size = len(chars)
        new_value = char * txt_size
        new_file_data = self.file_data.replace(chars, new_value)
        self.file_data = new_file_data
    
    def replace_chars(self, chars, new_value):
        new_file_data = self.file_data.replace(chars, new_value)
        self.file_data = new_file_data
    
    def set_scale_50(self):
        self.replace_chars('pngw0'+chr(0x40)+chr(0x69)+chr(0xc0), 'pngw0'+chr(0x3f)+chr(0xe0)+chr(0x00) )
    
    def set_img(self, img_name):
        caption = chr(137)+'PNG'
        txt_p = self.file_data.find(caption) # + len(caption)
        if txt_p < 0:
            return None
        txt_p_size = txt_p - 4
        
        with open(img_name, 'rb') as f:
            new_value = f.read()
        
        
        txt_new_size = self.int_to_hex(len(new_value))
        
        new_file_data = self.file_data[:txt_p_size] + txt_new_size + new_value + chr(120)
        self.file_data = new_file_data
        
    def save(self, filename):
        with open(filename, 'wb+')  as f:
            f.write(self.file_data)
    
if __name__ == '__main__':
    src_filename = 'eon_src\\3_przygody.eon'
    filename = 'Testowa.eon'
    #txt_size = ''
    #txt_size = int(codecs.encode(txt_size, 'hex'), 16)
    #print txt_size
    
    eon = EonMod(src_filename)
    print eon.nazwa
    eon.set_nazwa('Testowa')
    eon.set_typ_karty( 'Karta Przygody')
    eon.set_typ('Wróg - Humanoid')
    eon.set_nr_spotkania('2')
    eon.set_rozszerzenie('Edycja Podstawowa')
    eon.set_efekt('jakiś super opis karty o magicznym działaniu '*6)
    eon.comment_chars('krzysztof.lemka', 'x')
    eon.set_img(r'turniej\static\img\old_1\czary\1.png')
    eon.set_scale_50()
    eon.save(filename)