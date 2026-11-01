#!/usr/bin/env python3
"""Склейка прототипа CRM: shell.html + screens/*.html + notes.html → index.html.
Файлы экранов идут в естественном порядке (11-order-card.html раньше 11-order-card-2.html);
дубль id="s-…" между файлами – ошибка сборки."""
import glob,os,re,sys
base=os.path.dirname(os.path.abspath(__file__))
shell=open(os.path.join(base,'shell.html'),encoding='utf8').read()
def natkey(p):
    name=os.path.basename(p)
    return [int(t) if t.isdigit() else t.lower() for t in re.split(r'(\d+)',name)]
files=sorted(glob.glob(os.path.join(base,'screens','*.html')),key=natkey)
sections=[];scripts=[];seen={}
for f in files:
    s=open(f,encoding='utf8').read()
    for sid in re.findall(r'id="(s-[a-z0-9-]+)"',s):
        if sid in seen:
            sys.exit(f'build error: duplicate {sid} in {os.path.basename(f)} (already in {seen[sid]})')
        seen[sid]=os.path.basename(f)
    sc=re.findall(r'<script[^>]*>[\s\S]*?</script>',s)
    s=re.sub(r'<script[^>]*>[\s\S]*?</script>','',s)
    sections.append(f'<!-- {os.path.basename(f)} -->\n'+s.strip()); scripts+=sc
np_=os.path.join(base,'notes.html'); notes=open(np_,encoding='utf8').read() if os.path.exists(np_) else ''
out=shell.replace('<!-- SCREENS -->','\n'.join(sections)).replace('<!-- SCRIPTS -->','\n'.join(scripts)).replace('<!-- NOTES -->',notes)
open(os.path.join(base,'index.html'),'w',encoding='utf8').write(out); print('built',len(out),'screens',len(seen),'files',len(files))
