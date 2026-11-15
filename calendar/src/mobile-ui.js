/* ===== Календарь команды в приложении Floritta Team – экраны и шторки ===== */
const IC={
  users:'<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20a6.5 6.5 0 0 1 13 0"/><circle cx="17" cy="9" r="2.5"/><path d="M15.5 14.5a5 5 0 0 1 6 5.5"/>',
  flag:'<path d="M5 21V4h11l-1.5 3.5L16 11H5"/>',truck:'<path d="M3 7h11v9H3zM14 10h4l3 3v3h-7z"/><circle cx="7" cy="18" r="2"/><circle cx="17" cy="18" r="2"/>',
  chat:'<path d="M4 5h16v11H9l-5 4z"/>',sun:'<circle cx="12" cy="12" r="4"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M5 5l2 2M17 17l2 2M19 5l-2 2M7 17l-2 2"/>',
  clock:'<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',gift:'<rect x="3" y="9" width="18" height="12"/><path d="M3 13h18M12 9v12M12 9c-2-4-6-4-6-1s4 1 6 1zM12 9c2-4 6-4 6-1s-4 1-6 1z"/>',
  lock:'<rect x="5" y="11" width="14" height="10"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/>',
  back:'<path d="M15 5l-7 7 7 7"/>',chev:'<path d="m9 6 6 6-6 6"/>',close:'<path d="M6 6l12 12M18 6L6 18"/>',
  link:'<path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1"/>',
  home:'<circle cx="12" cy="12" r="4"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M4.9 19.1 7 17M17 7l2.1-2.1"/>',
  tasks:'<rect x="3" y="4" width="5" height="16"/><rect x="9.5" y="4" width="5" height="11"/><rect x="16" y="4" width="5" height="7"/>',
  work:'<circle cx="12" cy="12" r="2.5"/><ellipse cx="12" cy="6" rx="2.6" ry="3.4"/><ellipse cx="12" cy="18" rx="2.6" ry="3.4"/><ellipse cx="6" cy="12" rx="3.4" ry="2.6"/><ellipse cx="18" cy="12" rx="3.4" ry="2.6"/>',
  learn:'<path d="M4 5h6a2 2 0 0 1 2 2v13a2 2 0 0 0-2-2H4zM20 5h-6a2 2 0 0 0-2 2v13a2 2 0 0 1 2-2h6z"/>',
  me:'<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>',
};
const ic=(n,c)=>`<svg class="i ${c||''}" viewBox="0 0 24 24">${IC[n]||''}</svg>`;
const LIC={meeting:'users',commercial:'flag',delivery:'truck',booking:'chat',leave:'sun',shift:'clock',birthday:'gift',hr:'lock'};
const $=id=>document.getElementById(id);
const monday=d=>addDays(d,-dow(d));
const M={screen:'cal',sel:iso(TODAY),mview:'week',anchor:monday(TODAY),cursor:D(2026,11,1),stack:[]};
let BK={},REFS=[];
const refAttr=r=>{REFS.push(r);return `data-ref="${REFS.length-1}"`};
const toast=m=>{const t=$('toast');t.textContent=m;t.classList.add('on');clearTimeout(toast.h);toast.h=setTimeout(()=>t.classList.remove('on'),2600)};
const push=(title,body)=>{const p=$('push');p.innerHTML=`<div class="lg">F</div><div style="flex:1;min-width:0"><small>Floritta Team · сейчас</small><b>${title}</b><span>${body}</span></div>`;p.classList.add('on');clearTimeout(push.h);push.h=setTimeout(()=>p.classList.remove('on'),4200)};
const lead=()=>S.role==='hr'||S.role==='owner';
const range=p=>fmtD(p.blackout[0])+(iso(p.blackout[0])!==iso(p.blackout[1])?' – '+fmtD(p.blackout[1]):'');

/* ---------- навигация ---------- */
function go(s,anim){if(s!==M.screen)M.stack.push(M.screen);M.screen=s;draw(anim!==false)}
function back(){M.screen=M.stack.pop()||'cal';draw(true)}
function home(){M.stack=[];M.screen='cal';draw(true)}
function draw(anim){
  REFS=[];const el=$('scr');
  el.innerHTML=({cal:scrCal,book1:scrBook1,book2:scrBook2,book3:scrBook3,leave:scrLeave,host:scrHost})[M.screen]();
  if(anim){el.classList.remove('in');void el.offsetWidth;el.classList.add('in')}
  $('tabbar').classList.toggle('hide',M.screen!=='cal');
  gutters();
  if(M.screen==='leave')checkLeave();
}
function gutters(){
  $('tabbar').innerHTML=[['home','Сегодня'],['tasks','Задачи'],['work','Работа'],['learn','Обучение'],['me','Я']].map(([k,t])=>`<button class="tab ${k==='tasks'?'on':''}" ${k==='tasks'?'data-act="home"':'data-toast="Другие вкладки приложения в этом прототипе не открываются"'}><svg viewBox="0 0 24 24">${IC[k]}</svg>${t}</button>`).join('');
  $('g-roles').innerHTML=Object.entries(ROLES).map(([k,v])=>`<li><button class="${k===S.role?'on':''}" data-role="${k}">${v.label}<small>${v.name}</small></button></li>`).join('');
  $('g-go').innerHTML=[['home','Календарь – сегодня'],['book','Записаться на 1:1'],['march','Двойной пик 7–8 марта 2027'],['leave','Заявка на отпуск в пик'],['peakweek','Встреча на пиковой неделе'],['pushdemo','Пуш-напоминание'],['ical','Подписка iCal'],...(me().host?[['host','Мои слоты и записи']]:[])].map(([k,t])=>`<li><button data-act="${k}">${t}</button></li>`).join('');
  $('notes').innerHTML=NOTES;
}

/* ---------- календарь ---------- */
function dots(evs){return `<span class="dots">${evs.slice(0,4).map(e=>`<i class="${e.cls==='peak'?'pk':e.layer==='shift'?'sf':''}"></i>`).join('')}</span>`}
function dayCell(d,list,out){const k=iso(d);return `<button class="sd ${k===M.sel?'on':''} ${k===iso(TODAY)?'today':''} ${isPeakDay(d)?'peak':''} ${blackoutOf(d)?'bo':''} ${out?'out':''}" data-day="${k}"><b class="num">${d.getDate()}</b>${dots(list.filter(e=>e.d===k))}</button>`}
const evRow=e=>`<button class="ev l-${e.layer} ${e.cls||''} ${e.alert?'alert':''}" ${refAttr(e.ref)}><span class="tm">${e.tm?`${e.tm}<br>${e.end}`:'весь<br>день'}</span><span class="tx"><b>${esc(e.title)}</b><small>${esc(e.sub||'')}</small></span>${ic(LIC[e.layer])}</button>`;
function scrCal(){
  const sel=fromIso(M.sel),layers=LAYERS.filter(l=>!l.roles||l.roles.includes(S.role));
  let grid,title;
  if(M.mview==='week'){const list=events(M.anchor,addDays(M.anchor,6));title=`${MONN[addDays(M.anchor,3).getMonth()]} ${addDays(M.anchor,3).getFullYear()}`;
    grid=`<div class="strip">${WD.map((w,i)=>{const d=addDays(M.anchor,i);return dayCell(d,list).replace('<b ',`<small>${w}</small><b `)}).join('')}</div>`;
  }else{const y=M.cursor.getFullYear(),m=M.cursor.getMonth(),first=D(y,m+1,1),start=addDays(first,-dow(first)),list=events(start,addDays(start,41));title=`${MONN[m]} ${y}`;
    let h='';for(let i=0;i<42;i++){const d=addDays(start,i);if(i>=35&&d.getMonth()!==m)break;h+=dayCell(d,list,d.getMonth()!==m)}
    grid=`<div class="mgrid">${WD.map(w=>`<div class="wdn">${w}</div>`).join('')}${h}</div>`;
  }
  const p=nextPeak(TODAY),left=daysBetween(TODAY,p.dates[0]),bo=blackoutOf(sel);
  const ag=events(sel,addDays(sel,6));
  let agenda='';
  for(let i=0;i<7;i++){const d=addDays(sel,i),k=iso(d),evs=ag.filter(e=>e.d===k);if(i>0&&!evs.length)continue;
    const lbl=k===iso(TODAY)?'Сегодня':k===iso(addDays(TODAY,1))?'Завтра':WDF[dow(d)][0].toUpperCase()+WDF[dow(d)].slice(1);
    agenda+=`<div class="dhead"><div class="h3">${lbl}</div><span class="caps">${fmtD(d)}</span></div>${i===0&&bo?`<div class="pad" style="margin-bottom:8px"><div class="callout">${bo.title}: отпуск на этот день закрыт.</div></div>`:''}${evs.map(evRow).join('')||'<div class="empty-day">Событий нет. Свободный день.</div>'}`;
  }
  const mine=S.bookings.filter(b=>b.by===me().name&&b.d>=iso(TODAY));
  return `<div class="appbar"><div class="ttl">Задачи</div><button class="ib" data-act="ical" aria-label="iCal">${ic('link')}</button></div>
  <div class="scr-body has-tab">
    <div class="pad"><div class="seg"><button data-toast="Список задач – уже есть в приложении">Задачи</button><button class="on">Календарь</button></div></div>
    <div class="mhead"><div class="h3">${title}</div><button class="textbtn" data-act="mview">${M.mview==='week'?'Месяц':'Неделя'}</button><button class="ib" data-nav="-1" aria-label="Назад">${ic('back')}</button><button class="ib" data-nav="1" aria-label="Вперёд">${ic('chev')}</button></div>
    ${grid}
    <div class="chips">${layers.map(l=>`<button class="chip ${S.layers.has(l.k)?'on':''}" data-layer="${l.k}">${ic(l.ic,'s')} ${l.t}</button>`).join('')}</div>
    <div class="qa"><button class="btn --sm" data-act="book">${ic('chat','s')} Записаться на 1:1</button><button class="btn --sm --ghost" data-act="leave" style="flex:0 0 auto">Отпуск</button></div>
    ${mine.length?`<div class="pad xs muted" style="margin-top:6px">Ваша запись: ${mine.map(b=>`${fmtS(fromIso(b.d))}, ${b.t} – ${host(b.host).name}`).join('; ')}</div>`:''}
    ${me().host?`<div class="pad" style="margin-top:8px"><button class="btn --sm --secondary --block" data-act="host">Мои слоты и записи</button></div>`:''}
    <button class="peakbar" ${refAttr({type:'peak',key:p.key})}><span class="n num">${left}</span><span class="t"><b>${plural(left,'день','дня','дней')} до пика – ${p.title}</b><small>${p.cutoffs.map(c=>'cut-off '+fmtS(c.d)).join(' · ')}</small></span>${ic('chev')}</button>
    ${agenda}
    <div class="demo"><span class="caps">Прототип · смотреть как</span><div class="chips">${Object.entries(ROLES).map(([k,v])=>`<button class="chip ${k===S.role?'on':''}" data-role="${k}">${v.label}</button>`).join('')}</div><div class="chips"><button class="chip" data-act="march">Двойной пик, март 2027</button><button class="chip" data-act="pushdemo">Пуш-напоминание</button></div></div>
  </div>`;
}

/* ---------- запись на 1:1: три нажатия ---------- */
const bar=(t,act)=>`<div class="appbar"><button class="ib" data-act="${act||'back'}" aria-label="Назад">${ic('back')}</button><div class="ttl">${t}</div></div>`;
function scrBook1(){
  return `${bar('Запись на 1:1')}<div class="scr-body" style="padding-bottom:32px"><div class="steps"><i class="on"></i><i></i><i></i></div>
    <div class="pad caps" style="margin-bottom:4px">С кем поговорить</div>
    ${HOSTS.filter(h=>h.name!==me().name).map(h=>{const n=slotsFor(h).reduce((a,x)=>a+x.list.filter(s=>!s.shift).length,0),has=S.bookings.some(b=>b.host===h.id&&b.by===me().name&&b.d>=iso(TODAY));return `<button class="row" data-host="${h.id}" ${has?'data-has="1"':''}><span class="avatar">${initials(h.name)}</span><span class="rt"><div class="l">${h.name}</div><div class="d">${h.role}</div></span><span class="val">${has?'вы записаны':n+' '+plural(n,'слот','слота','слотов')}</span>${ic('chev','chev s')}</button>`}).join('')}
    <div class="pad" style="margin-top:22px"><button class="btn --ghost --block" data-act="talk">Хочу поговорить, без даты</button>
    <p class="sm soft" style="margin:18px 0 0">Тему и сам факт встречи видят только вы и тот, к кому вы записались. Руководитель о записи не узнаёт.</p>
    <p class="sm soft" style="margin:10px 0 0">Срочный вопрос или жалоба – не через календарь: <button class="textbtn" data-toast="Открывается порядок обращений и жалоб">порядок обращений</button></p></div></div>`;
}
function scrBook2(){
  const h=host(BK.host),days=slotsFor(h);
  return `${bar(h.name)}<div class="scr-body" style="padding-bottom:32px"><div class="steps"><i class="on"></i><i class="on"></i><i></i></div><div class="pad">
    <p class="sm soft" style="margin:0 0 16px">${h.role} · встреча ${h.slot} минут · время по Лондону</p>
    ${days.length?days.map(x=>`<span class="caps">${fmtDW(x.d)}</span><div class="slots">${x.list.map(s=>`<button class="slot num" ${s.shift?'disabled':`data-slot="${iso(x.d)} ${s.t}"`}>${s.t}</button>`).join('')}</div>`).join(''):'<div class="callout --plain">Свободных слотов нет. Оставьте запрос «без даты».</div>'}
    <p class="xs muted" style="margin:4px 0 0">Зачёркнутые слоты выпадают на вашу смену. Занятые слоты не показываются. Запись открыта на ${h.ahead} ${plural(h.ahead,'день','дня','дней')} вперёд.</p></div></div>`;
}
function scrBook3(){
  const h=host(BK.host),[d,t]=BK.slot.split(' ');
  return `${bar('Подтвердите')}<div class="scr-body has-cta"><div class="steps"><i class="on"></i><i class="on"></i><i class="on"></i></div><div class="pad">
    <dl class="kv"><dt>С кем</dt><dd><b>${h.name}</b><br><span class="sm soft">${h.role}</span></dd><dt>Когда</dt><dd><b>${fmtDW(fromIso(d))}</b><br>${t}–${hm(mins(t)+h.slot)}</dd><dt>Где</dt><dd>${h.format}</dd></dl>
    <div class="hr"></div>
    <div class="field"><label>Тема – по желанию</label><textarea class="input" id="bk-topic" placeholder="Можно оставить пустым"></textarea><span class="xs muted">Тему увидит только ${h.name}.</span></div>
    <p class="xs muted">Напомним за день и за час. Перенести или отменить можно не позже чем за ${h.cancel} ${plural(h.cancel,'час','часа','часов')} до встречи.</p></div></div>
    <div class="cta-bar"><button class="btn" data-act="book-ok">Записаться</button></div>`;
}
/* ---------- отпуск ---------- */
function scrLeave(){
  return `${bar('Отпуск')}<div class="scr-body has-cta"><div class="pad" style="padding-top:8px">
    <div class="field"><label>Тип</label><select class="input" id="lv-type"><option value="holiday">Ежегодный отпуск</option><option value="sick">Больничный</option><option value="dep">Отгул по семейным обстоятельствам</option><option value="unpaid">За свой счёт</option></select></div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px"><div class="field"><label>С</label><input class="input" type="date" id="lv-from" value="2027-03-05"></div><div class="field"><label>По</label><input class="input" type="date" id="lv-to" value="2027-03-09"></div></div>
    <div id="lv-msg"></div>
    <div class="hr"></div><span class="caps">Дни, когда отпуск закрыт</span>
    ${allPeaks().filter(p=>p.blackout[1]>=TODAY).slice(0,4).map(p=>`<div class="ms"><span class="t">${p.title}</span><span class="w num">${range(p)} ${p.blackout[0].getFullYear()}</span></div>`).join('')}
    <p class="xs muted" style="margin-top:14px">Правило записано в политике отпусков. Запрет касается только ежегодного отпуска: больничный и отгул по семейным обстоятельствам оформляются в любой день.</p></div></div>
    <div class="cta-bar"><button class="btn" id="lv-send" data-act="leave-ok">Отправить заявку</button></div>`;
}
function checkLeave(){
  const ty=$('lv-type').value,a=$('lv-from').value,b=$('lv-to').value,box=$('lv-msg'),btn=$('lv-send');if(!a||!b)return;
  let hit=null;for(let d=fromIso(a);d<=fromIso(b);d=addDays(d,1)){const p=blackoutOf(d);if(p){hit=p;break}}
  if(ty==='holiday'&&hit){box.innerHTML=`<div class="callout"><b>На эти даты отпуск не оформляется.</b><br>${hit.title}: отпуск закрыт ${range(hit)}. Выберите другие дни.</div>`;btn.disabled=true}
  else if(hit){box.innerHTML='<div class="callout --plain">Даты попадают на пик, но этот тип отсутствия не блокируется.</div>';btn.disabled=false}
  else{box.innerHTML='';btn.disabled=false}
}
/* ---------- адресат ---------- */
function scrHost(){
  const h=host(me().host),inbox=S.bookings.filter(b=>b.host===h.id&&b.d>=iso(TODAY)),talk=S.talk.filter(x=>x.host===h.id);
  return `${bar('Мои слоты')}<div class="scr-body" style="padding-bottom:32px">
    <div class="pad caps" style="margin:6px 0 2px">Записаны ко мне</div>
    ${inbox.length?inbox.map(b=>`<button class="row" ${refAttr({type:'booking',id:b.id})}><span class="avatar">${initials(b.by)}</span><span class="rt"><div class="l">${b.by}</div><div class="d">${b.topic?esc(b.topic):'Тема не указана'}</div></span><span class="val num">${fmtS(fromIso(b.d))}<br>${b.t}</span></button>`).join(''):'<div class="empty-day">Пока никто не записан.</div>'}
    <div class="pad caps" style="margin:22px 0 2px">Хотят поговорить, без даты</div>
    ${talk.length?talk.map(x=>`<div class="row"><span class="avatar">${initials(x.by)}</span><span class="rt"><div class="l">${x.by}</div><div class="d">запрос от ${fmtD(fromIso(x.d))}</div></span><button class="btn --xs --ghost" data-toast="Сотруднику ушло предложение времени">Предложить</button></div>`).join(''):'<div class="empty-day">Запросов нет.</div>'}
    <div class="pad caps" style="margin:22px 0 2px">Окна доступности</div>
    ${h.windows.map(w=>`<div class="row"><span class="rt"><div class="l">Каждый ${WDF[w.wd]}</div><div class="d">${w.from}–${w.to} · слот ${h.slot} мин${h.buf?' · буфер '+h.buf+' мин':''}</div></span><button class="textbtn" data-toast="Окно убрано – сделанные записи остаются">Убрать</button></div>`).join('')}
    <div class="pad" style="margin-top:16px"><button class="btn --secondary --block" data-act="window">Добавить окно</button><p class="xs muted" style="margin:12px 0 0">Открыто на ${h.ahead} ${plural(h.ahead,'день','дня','дней')} вперёд · отмена не позже ${h.cancel} ч</p></div></div>`;
}

/* ---------- шторки ---------- */
function sheet(o){
  $('sheet').innerHTML=`<div class="grab"></div><div class="sh-head">${o.eyebrow?`<div class="caps">${o.eyebrow}</div>`:''}<div class="h3" style="margin-top:2px">${o.title}</div></div><div class="sh-body">${o.body}</div>${o.foot?`<div class="sh-foot">${o.foot}</div>`:''}`;
  $('sheet').classList.add('on');$('scrim').classList.add('on');
}
const closeSheet=()=>{$('sheet').classList.remove('on');$('scrim').classList.remove('on')};
function openRef(r){
  ({meeting:shMeeting,peak:shPeak,booking:shBooking,
    delivery:r=>{const p=POS.find(x=>x.code===r.code);sheet({eyebrow:`Поставка · ${p.code}`,title:p.sup,body:`<dl class="kv"><dt>Ожидается</dt><dd><b>${fmtDW(fromIso(p.d))}</b></dd><dt>Что везут</dt><dd>${p.what}</dd><dt>Статус</dt><dd>${p.st}</dd></dl><div class="callout --plain" style="margin-top:16px">${S.role==='florist'?'В этот день на смене – приёмка и обработка. Подготовьте место в холодильнике.':'Флористы видят этот день как «приёмка и обработка».'}</div><p class="xs muted" style="margin:12px 0 0">Цены и суммы закупок в календаре не показываются.</p>`})},
    regular:r=>sheet({eyebrow:'Поставка по расписанию',title:r.sup,body:`<dl class="kv"><dt>Когда</dt><dd>${fmtDW(fromIso(r.d))}</dd><dt>Что</dt><dd>Регулярная поставка цветов</dd></dl><div class="callout --plain" style="margin-top:16px">В день поставки на смене – приёмка и обработка.</div>`}),
    busy:r=>{const h=host(r.host);sheet({eyebrow:'1:1',title:h.busy,body:`<div class="callout --plain">У ${h.name} в это время личная встреча. С кем и о чём – видят только двое: сотрудник и тот, к кому он записался.</div>`})},
    date:r=>sheet({eyebrow:'Коммерческий календарь',title:r.title,body:`<dl class="kv"><dt>Дата</dt><dd>${fmtDW(fromIso(r.d))}</dd><dt>Влияние</dt><dd>${LEVEL[r.lv]}</dd></dl><p class="sm soft" style="margin:14px 0 0">Суммы в календаре не показываются – только уровень влияния на продажи.</p>`}),
    leave:r=>sheet({eyebrow:'Отсутствие',title:r.name===me().name?'Мой отпуск':r.name,body:`<dl class="kv"><dt>Даты</dt><dd>${fmtD(fromIso(r.from))} – ${fmtD(fromIso(r.to))}</dd><dt>Статус</dt><dd>В отпуске</dd></dl><div class="callout --plain" style="margin-top:16px">Команда видит только факт «в отпуске», без типа и причины.</div>`}),
    shift:r=>sheet({eyebrow:'График',title:'Моя смена',body:`<dl class="kv"><dt>Когда</dt><dd>${fmtDW(fromIso(r.d))}<br>${me().shift.from}–${me().shift.to}</dd><dt>Где</dt><dd>Студия SE1</dd></dl>`,foot:'<button class="btn --ghost" data-toast="Открывается экран «График» – уже есть в приложении">Открыть график</button>'}),
    bday:r=>sheet({eyebrow:r.k,title:r.name,body:'<div class="callout --plain">Показано, потому что сотрудник сам это разрешил. Возраст не показывается никогда.</div>'}),
    hr:r=>sheet({eyebrow:'HR-дата',title:r.t,body:`<dl class="kv"><dt>Раздел</dt><dd>${r.s}</dd><dt>Кто видит</dt><dd>Только HR и владелец</dd></dl>`}),
  })[r.type](r);
}
function shMeeting(r){
  const s=SERIES.find(x=>x.id===r.series),d0=fromIso(r.date),sug=blackoutOf(d0)?suggestMove(d0):null,mv=S.moves[r.id],d=mv==='moved'?sug:d0,att=S.attend[r.id]||(S.attend[r.id]={});
  shMeeting.last=r;
  sheet({eyebrow:`${s.aud} · ${s.ruleText.toLowerCase()}`,title:s.title,body:`
    ${sug&&!mv?`<div class="callout" style="margin-bottom:16px"><b>Встреча попала на пиковое окно.</b><br>Предложен перенос на ${fmtDW(sug)}, ${s.time}. ${lead()?'':'Решение принимает HR или владелец.'}${lead()?`<div style="display:flex;gap:8px;margin-top:10px"><button class="btn --xs" data-move="moved" data-id="${r.id}">Перенести</button><button class="btn --xs --ghost" data-move="kept" data-id="${r.id}">Оставить</button></div>`:''}</div>`:''}
    <dl class="kv"><dt>Когда</dt><dd><b>${fmtDW(d)}</b><br>${s.time}–${hm(mins(s.time)+s.dur)} по Лондону</dd><dt>Где</dt><dd>${s.format}</dd><dt>Ведёт</dt><dd>${s.host}</dd>${s.paid?'<dt>Оплата</dt><dd>Оплачивается. На смене – в студии, вне смены – онлайн, время попадает в график часами.</dd>':''}</dl>
    <button class="btn --secondary --block" style="margin-top:16px" data-toast="Открывается Google Meet">Подключиться к Meet</button>
    <div class="hr"></div><span class="caps">Повестка</span><pre class="dg">${AGENDA}</pre>
    ${lead()?`<div class="hr"></div><span class="caps">Явка</span>${s.people.map(n=>`<label class="ms"><input type="checkbox" data-att="${r.id}" data-n="${n}" ${att[n]?'checked':''} style="width:22px;height:22px;accent-color:#1e1a17"><span class="t">${n}</span><span class="w">${s.paid&&att[n]?(n.length%2===0?s.dur+' мин в график':'на смене'):''}</span></label>`).join('')}<p class="xs muted" style="margin-top:10px">Протокол и договорённости-задачи ведутся на вебе.</p>`:''}`,
    foot:`<button class="btn ${S.rsvp[r.id]==='yes'?'':'--secondary'}" data-rsvp="yes" data-id="${r.id}">Буду</button><button class="btn ${S.rsvp[r.id]==='no'?'':'--ghost'}" data-rsvp="no" data-id="${r.id}">Не смогу</button>`});
}
function shPeak(r){
  const p=allPeaks().find(x=>x.key===r.key),edit=S.role==='manager'||S.role==='owner';shPeak.last=r;
  sheet({eyebrow:p.double?'Двойной пик':'Пик продаж',title:p.title,body:`
    <dl class="kv"><dt>${p.dates.length>1?'Даты':'Дата'}</dt><dd><b>${p.dates.map(fmtDW).join(' и ')}</b> ${p.dates[0].getFullYear()}</dd>${p.cutoffs.map(c=>`<dt>Cut-off</dt><dd>${fmtDW(c.d)}<br><span class="sm soft">${c.t}</span></dd>`).join('')}<dt>Отпуск</dt><dd>Закрыт ${range(p)}</dd></dl>
    ${p.double?'<div class="callout" style="margin-top:16px">Два пика подряд: воскресенье и понедельник, без паузы.</div>':''}
    <div class="hr"></div><span class="caps">Вехи подготовки</span>
    ${p.milestones.map(m=>{const done=!!msDone[m.id],late=!done&&m.d<TODAY;return `<div class="ms ${done?'done':''} ${late?'late':''}"><button class="bx" ${edit?`data-ms="${m.id}"`:''} aria-label="Отметить"></button><span class="t">${m.t}<br><small class="muted">${m.owner}</small></span><span class="w num">${late?'просрочено<br>':''}${fmtS(m.d)}</span></div>`}).join('')}
    <p class="xs muted" style="margin-top:12px">Каждая веха стоит задачей у ответственного. Сумм здесь нет.</p>`});
}
function shBooking(r){
  const b=S.bookings.find(x=>x.id===r.id),h=host(b.host),mine=b.by===me().name;
  sheet({eyebrow:'1:1',title:mine?h.name:b.by,body:`<dl class="kv"><dt>Когда</dt><dd><b>${fmtDW(fromIso(b.d))}</b><br>${b.t}–${hm(mins(b.t)+h.slot)}</dd><dt>Где</dt><dd>${h.format}</dd><dt>Тема</dt><dd>${b.topic?esc(b.topic):'<span class="muted">не указана</span>'}</dd></dl><div class="callout --plain" style="margin-top:16px">Эту запись видят двое: ${mine?'вы':b.by} и ${h.name===me().name?'вы':h.name}. Остальные видят «${h.busy}».</div>`,
    foot:`<button class="btn --secondary" data-rebook="${b.id}">Перенести</button><button class="btn --ghost" data-cancel="${b.id}">Отменить</button>`});
}
function shIcal(){
  sheet({eyebrow:'Только чтение',title:'Подписка iCal',body:`<p class="sm soft" style="margin:0 0 14px">Личная ссылка показывает ваш календарь в календаре телефона. Обратно в CRM ничего не записывается.</p>
    <button class="btn --block" data-toast="Открывается «Добавить подписной календарь»">Добавить в календарь телефона</button>
    <div style="display:flex;gap:10px;margin-top:10px"><button class="btn --ghost --sm" style="flex:1" data-toast="Ссылка скопирована">Копировать ссылку</button><button class="btn --ghost --sm" style="flex:1" data-toast="Новая ссылка готова, старая отключена">Перевыпустить</button></div>
    <div class="hr"></div>
    <div class="ms"><span class="t">Мои смены, встречи, мои записи на 1:1</span><span class="w">полностью</span></div>
    <div class="ms"><span class="t">Пики, cut-off, поставки</span><span class="w">название и дата</span></div>
    <div class="ms"><span class="t">Тема моей записи</span><span class="w">не передаётся</span></div>
    <div class="ms"><span class="t">Чужие записи на 1:1</span><span class="w">«занято»</span></div>`});
}
function shTalk(){
  sheet({eyebrow:'Без даты',title:'Хочу поговорить',body:`<div class="field"><label>С кем</label><select class="input" id="tk-h">${HOSTS.filter(h=>h.name!==me().name).map(h=>`<option value="${h.id}">${h.name} – ${h.role}</option>`).join('')}</select></div><div class="field"><label>О чём – по желанию</label><textarea class="input"></textarea></div><p class="xs muted" style="margin:0">Адресат сам предложит время. Запрос видите только вы и он.</p>`,foot:'<button class="btn" data-act="talk-ok">Отправить запрос</button>'});
}
function shWindow(){
  sheet({eyebrow:'Мои слоты',title:'Новое окно',body:`<div class="field"><label>День</label><select class="input"><option>Каждую неделю: понедельник</option><option>Каждую неделю: вторник</option><option>Один раз: выбрать дату</option></select></div><div style="display:grid;grid-template-columns:1fr 1fr;gap:10px"><div class="field"><label>С</label><input class="input" type="time" value="10:00"></div><div class="field"><label>До</label><input class="input" type="time" value="12:00"></div><div class="field"><label>Слот</label><select class="input"><option>30 мин</option><option>45 мин</option><option>60 мин</option></select></div><div class="field"><label>Буфер</label><select class="input"><option>без буфера</option><option>10 мин</option></select></div></div><div class="field"><label>Формат</label><select class="input"><option>Студия SE1</option><option>Google Meet</option></select></div>`,foot:'<button class="btn" data-act="window-ok">Добавить окно</button>'});
}

/* ---------- заметки ---------- */
const NOTES=`
<h4>Что это</h4><p>Тот же календарь команды в приложении Floritta Team: вкладка «Календарь» в разделе «Задачи».</p>
<h4>Как смотреть</h4><ul><li>Слева – роли и готовые сценарии.</li><li>Полоса недели: точка – событие, акцентная черта сверху – отпуск закрыт. «Месяц» разворачивает сетку.</li><li>Запись на 1:1 – три нажатия: с кем, время, «Записаться».</li><li>Нажатие на событие открывает шторку снизу.</li></ul>
<h4>Чем отличается от веба</h4><ul><li>Главный вид – неделя и лента дня, а не сетка месяца.</li><li>Настройки календаря, протокол встречи и договорённости-задачи – только на вебе.</li><li>Явку ведущий отмечает и с телефона.</li><li>iCal – одной кнопкой «Добавить в календарь телефона».</li><li>Напоминания приходят пушем: за день и за час.</li></ul>
<h4>Кто что видит</h4><ul><li><b>Запись на 1:1</b> – только двое. Остальным «занято».</li><li><b>Отпуск</b> – команде только факт.</li><li><b>Поставки</b> – без цен.</li><li><b>HR-даты</b> – HR и владелец.</li></ul>
<h4>Этап</h4><p><span class="st ink">MVP</span> сервер и веб. <span class="st">v2</span> этот экран в приложении – API готовится сразу в MVP.</p>
<h4>Данные</h4><p>Имена, поставщики и события вымышлены. Даты считаются настоящим расчётом.</p>`;

/* ---------- события ---------- */
function selectDay(k){M.sel=k;const d=fromIso(k);M.anchor=monday(d);M.cursor=D(d.getFullYear(),d.getMonth()+1,1)}
document.addEventListener('click',e=>{
  const el=e.target.closest('button');if(!el)return;const ds=el.dataset;
  $('push').classList.remove('on');
  if(ds.toast)return toast(ds.toast);
  if(ds.role){S.role=ds.role;closeSheet();return home()}
  if(ds.day){selectDay(ds.day);return draw()}
  if(ds.layer){S.layers.has(ds.layer)?S.layers.delete(ds.layer):S.layers.add(ds.layer);return draw()}
  if(ds.nav){const n=+ds.nav;if(M.mview==='week'){M.anchor=addDays(M.anchor,7*n);M.sel=iso(M.anchor);M.cursor=D(M.anchor.getFullYear(),M.anchor.getMonth()+1,1)}else{M.cursor=D(M.cursor.getFullYear(),M.cursor.getMonth()+1+n,1);M.sel=iso(M.cursor);M.anchor=monday(M.cursor)}return draw()}
  if(ds.ref!==undefined)return openRef(REFS[+ds.ref]);
  if(ds.rsvp){S.rsvp[ds.id]=ds.rsvp;toast(ds.rsvp==='yes'?'Отмечено: буду':'Отмечено: не смогу');return shMeeting(shMeeting.last)}
  if(ds.move){S.moves[ds.id]=ds.move;toast(ds.move==='moved'?'Встреча перенесена – участники получили пуш':'Встреча оставлена на прежней дате');draw();return shMeeting(shMeeting.last)}
  if(ds.ms){msDone[ds.ms]=!msDone[ds.ms];return shPeak(shPeak.last)}
  if(ds.host){if(ds.has)return toast('К этому человеку у вас уже есть запись');BK.host=ds.host;return go('book2')}
  if(ds.slot){BK.slot=ds.slot;return go('book3')}
  if(ds.rebook){const b=S.bookings.find(x=>x.id===+ds.rebook);S.bookings=S.bookings.filter(x=>x!==b);BK={host:b.host};closeSheet();toast('Выберите новое время');M.stack=['cal'];M.screen='book2';return draw(true)}
  if(ds.cancel){S.bookings=S.bookings.filter(x=>x.id!==+ds.cancel);closeSheet();draw();return toast('Запись отменена – слот снова свободен')}
  const act={back,home,book:()=>{BK={};closeSheet();M.stack=['cal'];M.screen='book1';draw(true)},leave:()=>{closeSheet();M.stack=['cal'];M.screen='leave';draw(true)},host:()=>{closeSheet();M.stack=['cal'];M.screen='host';draw(true)},
    ical:shIcal,talk:shTalk,window:shWindow,
    mview:()=>{M.mview=M.mview==='week'?'month':'week';draw()},
    march:()=>{closeSheet();M.mview='month';selectDay('2027-03-07');home()},
    peakweek:()=>{closeSheet();M.mview='week';selectDay('2026-12-16');home()},
    pushdemo:()=>push('Завтра 1:1 в 14:00','Irina Petrova · студия SE1. Перенести можно до 02:00.'),
    'book-ok':()=>{const[d,t]=BK.slot.split(' '),h=host(BK.host);S.bookings.push({id:Date.now(),host:BK.host,d,t,by:me().name,topic:$('bk-topic').value.trim()});M.mview='week';selectDay(d);home();push('Вы записаны на 1:1',`${fmtDW(fromIso(d))}, ${t} · ${h.name}. Напомним за день и за час.`)},
    'talk-ok':()=>{S.talk.push({host:$('tk-h').value,by:me().name,topic:'',d:iso(TODAY)});closeSheet();toast('Запрос отправлен – вам предложат время')},
    'leave-ok':()=>{home();toast('Заявка отправлена на согласование')},
    'window-ok':()=>{closeSheet();toast('Окно добавлено – слоты появились у сотрудников')},
  }[ds.act];
  if(act)act();
});
document.addEventListener('change',e=>{
  if(['lv-type','lv-from','lv-to'].includes(e.target.id))checkLeave();
  if(e.target.dataset.att){(S.attend[e.target.dataset.att]||(S.attend[e.target.dataset.att]={}))[e.target.dataset.n]=e.target.checked;shMeeting(shMeeting.last)}
});
$('scrim').addEventListener('click',closeSheet);
document.addEventListener('keydown',e=>{if(e.key==='Escape')closeSheet()});
draw();
