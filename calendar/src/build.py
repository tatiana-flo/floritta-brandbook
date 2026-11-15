#!/usr/bin/env python3
"""Склейка прототипа календаря команды: shell.html + data.js + ui.js → ../index.html (веб), mobile-shell.html + data.js + mobile-ui.js → ../mobile.html (приложение). Каждый – один файл без зависимостей."""
import os
base=os.path.dirname(os.path.abspath(__file__))
rd=lambda n:open(os.path.join(base,n),encoding='utf8').read()
logo=open(os.path.join(base,'..','..','crm','logo.svg'),encoding='utf8').read()
logo=logo[logo.index('<svg'):].replace('width="287" height="32"','height="18" role="img" aria-label="Floritta"',1)
out=rd('shell.html').replace('<img src="../crm/logo.svg" alt="Floritta">',logo).replace('/* SCRIPT */',rd('data.js')+'\n'+rd('ui.js'))
open(os.path.join(base,'..','index.html'),'w',encoding='utf8').write(out); print('built index',len(out))
mob=rd('mobile-shell.html').replace('/* SCRIPT */',rd('data.js')+'\n'+rd('mobile-ui.js'))
open(os.path.join(base,'..','mobile.html'),'w',encoding='utf8').write(mob); print('built mobile',len(mob))
