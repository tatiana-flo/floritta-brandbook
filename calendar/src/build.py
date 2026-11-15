#!/usr/bin/env python3
"""Склейка прототипа календаря команды: shell.html + data.js + ui.js → ../index.html (один файл, без зависимостей)."""
import os
base=os.path.dirname(os.path.abspath(__file__))
rd=lambda n:open(os.path.join(base,n),encoding='utf8').read()
logo=open(os.path.join(base,'..','..','crm','logo.svg'),encoding='utf8').read()
logo=logo[logo.index('<svg'):].replace('width="287" height="32"','height="18" role="img" aria-label="Floritta"',1)
out=rd('shell.html').replace('<img src="../crm/logo.svg" alt="Floritta">',logo).replace('/* SCRIPT */',rd('data.js')+'\n'+rd('ui.js'))
open(os.path.join(base,'..','index.html'),'w',encoding='utf8').write(out); print('built',len(out))
