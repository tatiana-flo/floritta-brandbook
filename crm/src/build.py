#!/usr/bin/env python3
import glob,os,re
base=os.path.dirname(os.path.abspath(__file__))
shell=open(os.path.join(base,'shell.html'),encoding='utf8').read()
sections=[];scripts=[]
for f in sorted(glob.glob(os.path.join(base,'screens','*.html'))):
    s=open(f,encoding='utf8').read()
    sc=re.findall(r'<script[^>]*>[\s\S]*?</script>',s)
    s=re.sub(r'<script[^>]*>[\s\S]*?</script>','',s)
    sections.append(f'<!-- {os.path.basename(f)} -->\n'+s.strip()); scripts+=sc
np_=os.path.join(base,'notes.html'); notes=open(np_,encoding='utf8').read() if os.path.exists(np_) else ''
out=shell.replace('<!-- SCREENS -->','\n'.join(sections)).replace('<!-- SCRIPTS -->','\n'.join(scripts)).replace('<!-- NOTES -->',notes)
open(os.path.join(base,'index.html'),'w',encoding='utf8').write(out); print('built',len(out))
