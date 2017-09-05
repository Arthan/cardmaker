#-*- coding: utf-8 -*-
import os
from openpyxl import load_workbook


def find_title(txt, contains=False):
    BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    filename = os.path.join(BASE_DIR, 'utils', 'nazwy kart.xlsx')
    txt = txt.lower()
    wb = load_workbook(filename=filename, read_only=True)
    
    ws = wb.active
    
    founded = []
    for row in ws.rows:
        title = row[1].value.lower()
        if contains:
            if title.find(txt) > -1:
                founded.append(row)
        else:
            if txt == title:
                founded.append(row)
    ret = []
    for row in founded:
        ret.append(u'{tytul} [{typ}] - {dodatek}: talia {talia}'.format(
            tytul = row[1].value.title(),
            typ = row[2].value.title(),
            talia = row[3].value,
            dodatek = row[4].value.title()        
        ))
    return ret
    
if __name__ == '__main__':
    titles = find_title(u'smok', True)
    print u'znaleziono {}:'.format(len(titles))
    for title in titles:
        print title
