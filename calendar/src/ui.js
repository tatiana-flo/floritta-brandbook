/* ===== Календарь команды – экраны и панели ===== */
const IC={
  users:'<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20a6.5 6.5 0 0 1 13 0"/><circle cx="17" cy="9" r="2.5"/><path d="M15.5 14.5a5 5 0 0 1 6 5.5"/>',
  flag:'<path d="M5 21V4h11l-1.5 3.5L16 11H5"/>',truck:'<path d="M3 7h11v9H3zM14 10h4l3 3v3h-7z"/><circle cx="7" cy="18" r="2"/><circle cx="17" cy="18" r="2"/>',
  chat:'<path d="M4 5h16v11H9l-5 4z"/>',sun:'<circle cx="12" cy="12" r="4"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M5 5l2 2M17 17l2 2M19 5l-2 2M7 17l-2 2"/>',
  clock:'<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',gift:'<rect x="3" y="9" width="18" height="12"/><path d="M3 13h18M12 9v12M12 9c-2-4-6-4-6-1s4 1 6 1zM12 9c2-4 6-4 6-1s-4 1-6 1z"/>',
  lock:'<rect x="5" y="11" width="14" height="10"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/>',calendar:'<rect x="3" y="5" width="18" height="16"/><path d="M3 10h18M8 3v4M16 3v4"/>',
  close:'<path d="M6 6l12 12M18 6L6 18"/>',back:'<path d="M15 5l-7 7 7 7"/>',chev:'<path d="m9 6 6 6-6 6"/>',plus:'<path d="M12 5v14M5 12h14"/>',check:'<path d="m5 12 5 5L20 7"/>',
  link:'<path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1"/>',cog:'<circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M5 5l2 2M17 17l2 2M19 5l-2 2M7 17l-2 2"/>',
  alert:'<path d="M12 3 2 20h20z"/><path d="M12 10v4M12 17h.01"/>',
};
const ic=(n,s)=>`<svg class="i${s?' s':''}" viewBox="0 0 24 24">${IC[n]||''}</svg>`;
const LIC={meeting:'users',commercial:'flag',delivery:'truck',booking:'chat',leave:'sun',shift:'clock',birthday:'gift',hr:'lock'};
const $=id=>document.getElementById(id);
const toast=m=>{const t=$('toast');t.textContent=m;t.classList.add('on');clearTimeout(toast.h);toast.h=setTimeout(()=>t.classList.remove('on'),2600)};
const canManage=()=>S.role==='hr'||S.role==='owner';
let REFS=[];const refAttr=r=>{REFS.push(r);return `data-ref="${REFS.length-1}"`};

/* ---------- оболочка ---------- */
function shell(){
  const sb=[['','Сегодня'],['Работа'],['','Заказы'],['','Сообщения'],['','Доставка'],['','Клиенты'],['','Каталог'],['','Склад'],['Команда'],['on','Задачи'],['','Команда'],['','Обучение'],['Рост'],['','Маркетинг'],['','Аналитика'],['','Система']];
  $('sb').innerHTML=sb.map(x=>x.length===1?`<div class="sb-group">${x[0]}</div>`:`<button class="sb-item ${x[0]}" ${x[0]?'':'data-toast="Другие разделы CRM в этом прототипе не открываются"'}>${x[1]}</button>`).join('');
  $('roles').innerHTML=Object.entries(ROLES).map(([k,v])=>`<button class="${k===S.role?'on':''}" data-role="${k}">${v.label}</button>`).join('');
  $('me-av').textContent=initials(me().name);$('me-name').textContent=me().name;$('me-role').textContent=me().label;
}
function render(){
  REFS=[];shell();
  const layers=LAYERS.filter(l=>!l.roles||l.roles.includes(S.role));
  const views=[['my','Мой календарь'],['week','Неделя'],['month','Месяц'],['list','14 дней']];
  const per=S.view==='month'?`${MONN[S.cursor.getMonth()]} ${S.cursor.getFullYear()}`:S.view==='week'?`${fmtD(S.weekStart)} – ${fmtD(addDays(S.weekStart,6))}`:`${fmtD(TODAY)} – ${fmtD(addDays(TODAY,13))}`;
  const nav=S.view==='month'||S.view==='week';
  $('view').innerHTML=`
  <div class="cal-head">
    <div class="seg-ctl">${views.map(([k,t])=>`<button class="${S.view===k?'on':''}" data-view="${k}">${t}</button>`).join('')}</div>
    ${nav?`<button class="ib" data-nav="-1" title="Назад">${ic('back')}</button>`:''}
    <div class="per">${per}</div>
    ${nav?`<button class="ib" data-nav="1" title="Вперёд">${ic('chev')}</button><button class="textbtn" data-nav="0">Сегодня</button>`:''}
    <button class="textbtn" data-jump="2027-03">К двойному пику 7–8 марта 2027</button>
    <span class="sp"></span>
    <button class="btn --sm" data-act="book">${ic('chat',1)} Записаться на 1:1</button>
    ${me().host?`<button class="btn --sm --secondary" data-act="host">Мои слоты и записи</button>`:''}
    <button class="btn --sm --ghost" data-act="leave">Отпуск</button>
    <button class="btn --sm --ghost" data-act="ical">${ic('link',1)} iCal</button>
    ${canManage()?`<button class="btn --sm --ghost" data-act="settings">${ic('cog',1)} Настройки</button>`:''}
  </div>
  <div class="cal-layers">${layers.map(l=>`<button class="chip ${S.layers.has(l.k)?'on':''}" data-layer="${l.k}">${ic(l.ic,1)} ${l.t}</button>`).join('')}</div>
  ${S.view==='my'?viewMy():S.view==='week'?viewWeek():S.view==='month'?viewMonth():viewList()}`;
  $('notes').innerHTML=NOTES;
}
const evRow=e=>`<button class="ev l-${e.layer} ${e.cls||''} ${e.alert?'alert':''}" ${refAttr(e.ref)}>${ic(LIC[e.layer])}<span class="tm num">${e.tm?`${e.tm}–${e.end}`:'весь день'}</span><span class="tx"><b>${esc(e.title)}</b><small>${esc(e.sub||'')}</small></span>${e.alert?'<span class="tag --accent">внимание</span>':''}</button>`;
function dayBlocks(list,from,n){
  let h='';
  for(let i=0;i<n;i++){const d=addDays(from,i),k=iso(d),evs=list.filter(e=>e.d===k);
    if(!evs.length&&k!==iso(TODAY))continue;
    h+=`<div class="day ${k===iso(TODAY)?'today':''} ${isPeakDay(d)?'peak':''}"><div class="d"><b class="num">${d.getDate()}</b><small>${k===iso(TODAY)?'сегодня':WD[dow(d)]+' · '+MON[d.getMonth()].slice(0,3)}</small></div><div>${evs.map(evRow).join('')||'<span class="muted sm">Событий нет</span>'}</div></div>`;
  }
  return h||'<p class="muted">На эти дни событий нет.</p>';
}

/* ---------- мой календарь ---------- */
function viewMy(){
  const list=events(TODAY,addDays(TODAY,13)).filter(e=>!(e.layer==='leave'&&e.title!=='Мой отпуск')&&e.cls!=='busy');
  const p=nextPeak(TODAY),left=daysBetween(TODAY,p.dates[0]);
  const nm=events(TODAY,addDays(TODAY,40)).find(e=>e.layer==='meeting');
  const nd=S.role==='hr'?null:events(TODAY,addDays(TODAY,40)).find(e=>e.layer==='delivery'&&e.ref.type==='delivery');
  const mine=S.bookings.filter(b=>b.by===me().name&&b.d>=iso(TODAY));
  const inbox=me().host?S.bookings.filter(b=>b.host===me().host&&b.d>=iso(TODAY)):[];
  return `<div class="my"><div>${dayBlocks(list,TODAY,14)}</div><div>
    <div class="side-card peak"><span class="caps">Ближайший пик</span>
      <div class="row" style="align-items:flex-end;gap:14px"><div class="h1 accent num">${left}</div><div class="sm soft" style="padding-bottom:4px">${plural(left,'день','дня','дней')} до пика<br><b>${p.title}</b> · ${p.dates.map(fmtD).join(' и ')}</div></div>
      <div class="mt16">${p.cutoffs.map(c=>`<div class="ms"><span class="t"><b>${c.t}</b></span><span class="w num">${fmtDW(c.d)}</span></div>`).join('')}
      <div class="ms"><span class="t">Отпуск закрыт</span><span class="w num">${fmtD(p.blackout[0])}${iso(p.blackout[0])!==iso(p.blackout[1])?' – '+fmtD(p.blackout[1]):''}</span></div></div>
      <button class="textbtn mt16" ${refAttr({type:'peak',key:p.key})}>Вехи подготовки</button>
    </div>
    <div class="side-card"><span class="caps">Запись на 1:1</span>
      ${mine.length?mine.map(b=>`<div class="mt8"><b>${fmtDW(fromIso(b.d))}, ${b.t}</b><div class="sm soft">${host(b.host).name} · ${host(b.host).role}</div><button class="textbtn mt8" ${refAttr({type:'booking',id:b.id})}>Перенести или отменить</button></div>`).join('<div class="hr"></div>'):'<p class="sm soft mt8">Записей нет. Выберите, с кем поговорить, и свободное время – три нажатия.</p>'}
      ${inbox.length?`<div class="hr"></div><span class="caps">Ко мне записаны</span>${inbox.map(b=>`<button class="ev l-meeting" ${refAttr({type:'booking',id:b.id})}><span class="tm num">${fmtS(fromIso(b.d))} ${b.t}</span><span class="tx"><b>${b.by}</b><small>${b.topic?esc(b.topic):'Тема не указана'}</small></span></button>`).join('')}`:''}
      <button class="btn --sm --block mt16" data-act="book">Записаться</button>
    </div>
    ${nm?`<div class="side-card"><span class="caps">Ближайшая встреча</span><b>${nm.title}</b><div class="sm soft">${fmtDW(fromIso(nm.d))}, ${nm.tm}–${nm.end}</div><div class="row mt16"><button class="btn --sm ${S.rsvp[nm.ref.id]==='yes'?'':'--secondary'}" data-rsvp="yes" data-id="${nm.ref.id}">Буду</button><button class="btn --sm ${S.rsvp[nm.ref.id]==='no'?'':'--ghost'}" data-rsvp="no" data-id="${nm.ref.id}">Не смогу</button><span class="sp"></span><button class="textbtn" ${refAttr(nm.ref)}>Открыть</button></div></div>`:''}
    ${nd?`<div class="side-card"><span class="caps">Ближайшая поставка</span><b>${nd.title.replace('Поставка – ','')}</b><div class="sm soft">${fmtDW(fromIso(nd.d))}</div><div class="sm mt8">${esc(POS.find(x=>x.code===nd.ref.code).what)}</div><button class="textbtn mt16" ${refAttr(nd.ref)}>Подробнее</button></div>`:''}
  </div></div>`;
}
function viewList(){return dayBlocks(events(TODAY,addDays(TODAY,13)),TODAY,14)}

/* ---------- неделя ---------- */
function viewWeek(){
  const list=events(S.weekStart,addDays(S.weekStart,6));let h='<div class="week">';
  for(let i=0;i<7;i++){const d=addDays(S.weekStart,i),k=iso(d),evs=list.filter(e=>e.d===k);
    h+=`<div class="wcol ${k===iso(TODAY)?'today':''} ${isPeakDay(d)?'peak':''}"><div class="wh"><b class="num">${d.getDate()}</b><small>${WD[i]}</small>${blackoutOf(d)?'<span class="bl">отпуск закрыт</span>':''}</div><div class="wb">${evs.map(e=>`<button class="wev l-${e.layer} ${e.cls||''}" ${refAttr(e.ref)}><b>${esc(e.title)}</b><small>${e.tm?`${e.tm}–${e.end}`:esc(e.sub||'')}</small></button>`).join('')}</div></div>`;
  }
  return h+'</div>';
}

/* ---------- месяц ---------- */
function viewMonth(){
  const y=S.cursor.getFullYear(),m=S.cursor.getMonth(),first=D(y,m+1,1),start=addDays(first,-dow(first));
  const list=events(start,addDays(start,41));
  const pk=allPeaks().find(p=>p.double&&p.dates[0].getFullYear()===y&&p.dates[0].getMonth()===m);
  let h=pk?`<div class="banner"><div class="big num">${pk.dates.map(d=>d.getDate()).join(' + ')}</div><div style="flex:1;min-width:220px"><b>Двойной пик: ${pk.title}</b><div class="sm soft">Mothering Sunday – ${fmtDW(pk.dates[0])}, 8 марта – ${fmtDW(pk.dates[1])}. Двое суток без паузы: вехи подготовки стоят задачами, отпуск на эти дни закрыт.</div></div><button class="btn --sm --secondary" ${refAttr({type:'peak',key:pk.key})}>Вехи подготовки</button></div>`:'';
  h+='<div class="month">'+WD.map(w=>`<div class="wd">${w}</div>`).join('');
  for(let i=0;i<42;i++){const d=addDays(start,i),k=iso(d),evs=list.filter(e=>e.d===k),out=d.getMonth()!==m;
    h+=`<div class="cell ${out?'out':''} ${k===iso(TODAY)?'today':''} ${isPeakDay(d)?'peak':''}" data-day="${k}"><div class="dn"><b class="num">${d.getDate()}</b>${blackoutOf(d)?'<span class="bl">отпуск закрыт</span>':''}</div>${evs.slice(0,3).map(e=>`<div class="mini l-${e.layer} ${e.cls||''}">${e.tm?e.tm+' ':''}${esc(e.title)}</div>`).join('')}${evs.length>3?`<div class="more">ещё ${evs.length-3}</div>`:''}<div class="dots">${evs.slice(0,6).map(e=>`<i class="${e.cls==='peak'?'pk':e.layer==='shift'?'sf':''}"></i>`).join('')}</div></div>`;
  }
  return h+'</div><div class="row mt16 xs muted" style="flex-wrap:wrap"><span class="tag --soft">пик</span> акцентный цвет – только пик, cut-off и запрет отпусков <span class="tag --ink">1:1</span> моя запись <span class="tag --line">занято</span> чужая запись без подробностей <span class="tag">поставка</span></div>';
}

/* ---------- панель ---------- */
function sheet(o){
  $('sheet').innerHTML=`<div class="sh-head">${o.back?`<button class="ib" data-act="${o.back}">${ic('back')}</button>`:''}<div style="flex:1;min-width:0">${o.eyebrow?`<div class="caps">${o.eyebrow}</div>`:''}<div class="h2">${o.title}</div></div><button class="ib" data-close>${ic('close')}</button></div>${o.tabs||''}<div class="sh-body">${o.body}</div>${o.foot?`<div class="sh-foot">${o.foot}</div>`:''}`;
  $('sheet').classList.add('on');$('scrim').classList.add('on');
}
const closeSheet=()=>{$('sheet').classList.remove('on');$('scrim').classList.remove('on')};
function openRef(r){
  ({meeting:sheetMeeting,peak:sheetPeak,delivery:sheetDelivery,booking:sheetBookingView,busy:sheetBusy,
    regular:r=>sheet({eyebrow:'Поставка по расписанию',title:r.sup,body:`<dl class="kv"><dt>Когда</dt><dd>${fmtDW(fromIso(r.d))}</dd><dt>Что</dt><dd>Регулярная поставка цветов</dd><dt>Откуда</dt><dd>Дни поставщика заданы в настройках календаря</dd></dl><div class="callout --plain mt16">В день поставки флористы видят «приёмка и обработка» – место в холодильнике и время в смене планируются заранее.</div>`}),
    date:r=>sheet({eyebrow:'Коммерческий календарь',title:r.title,body:`<dl class="kv"><dt>Дата</dt><dd>${fmtDW(fromIso(r.d))}</dd><dt>Влияние</dt><dd>${LEVEL[r.lv]}</dd><dt>Откуда</dt><dd>Дата считается кодом на любой год</dd></dl><p class="sm soft mt16">Уровень влияния сейчас задан по умолчанию. На этапе v3 он считается по истории заказов CRM. Суммы в календаре не показываются – только уровень.</p>`}),
    leave:r=>sheet({eyebrow:'Отсутствие',title:r.name===me().name?'Мой отпуск':r.name,body:`<dl class="kv"><dt>Даты</dt><dd>${fmtD(fromIso(r.from))} – ${fmtD(fromIso(r.to))}</dd><dt>Статус</dt><dd>В отпуске</dd></dl><div class="callout --plain mt16">Команда видит только факт «в отпуске». Тип и причина отсутствия видны HR в разделе «Документы и отсутствия».</div>`}),
    shift:r=>sheet({eyebrow:'График',title:'Моя смена',body:`<dl class="kv"><dt>Когда</dt><dd>${fmtDW(fromIso(r.d))}, ${me().shift.from}–${me().shift.to}</dd><dt>Где</dt><dd>Студия SE1</dd></dl><p class="sm soft mt16">Смены берутся из экрана «График». Здесь они только показываются; на время смены слоты 1:1 недоступны.</p>`,foot:'<button class="btn --sm --ghost" data-toast="Открывается экран «График» – уже есть в CRM">Открыть график</button>'}),
    bday:r=>sheet({eyebrow:r.k,title:r.name,body:`<div class="callout --plain">Показано, потому что сотрудник сам разрешил это в настройках признания. Возраст не показывается никогда.</div>`}),
    hr:r=>sheet({eyebrow:'HR-дата',title:r.t,body:`<dl class="kv"><dt>Раздел</dt><dd>${r.s}</dd><dt>Кто видит</dt><dd>Только HR и владелец</dd></dl>`,foot:'<button class="btn --sm --ghost" data-toast="Открывается HR-календарь – уже есть в CRM">Открыть в HR</button>'}),
  })[r.type](r);
}

/* ---------- встреча ---------- */
function sheetMeeting(r){
  const s=SERIES.find(x=>x.id===r.series),d0=fromIso(r.date),sug=blackoutOf(d0)?suggestMove(d0):null,mv=S.moves[r.id],d=mv==='moved'?sug:d0;
  const att=S.attend[r.id]||(S.attend[r.id]={}),ag=S.agreements[r.id]||(S.agreements[r.id]=[]);
  const lead=canManage();
  const offShift=n=>n.length%2===0; // демо: часть флористов вне смены
  sheet({eyebrow:`${s.aud} · ${s.ruleText}`,title:s.title,body:`
    ${sug&&!mv?`<div class="callout mb16"><b>Встреча попала на пиковое окно (${blackoutOf(d0).title}).</b><br>Система предлагает перенос на ${fmtDW(sug)}, ${s.time}. Молча встреча не переносится.${lead?`<div class="row mt8"><button class="btn --sm" data-move="moved" data-id="${r.id}">Перенести на ${fmtD(sug)}</button><button class="btn --sm --ghost" data-move="kept" data-id="${r.id}">Оставить как есть</button></div>`:'<div class="mt8 xs">Решение принимает HR или владелец.</div>'}</div>`:''}
    <dl class="kv"><dt>Когда</dt><dd><b>${fmtDW(d)}, ${s.time}–${hm(mins(s.time)+s.dur)}</b> по Лондону</dd><dt>Где</dt><dd>${s.format}</dd><dt>Ссылка</dt><dd><button class="textbtn" data-toast="Открывается Google Meet">Подключиться к Meet</button></dd><dt>Ведёт</dt><dd>${s.host}</dd><dt>Участники</dt><dd>${s.people.length} – все из группы «${s.aud}». Новый сотрудник группы попадает в серию сам.</dd>${s.paid?'<dt>Оплата</dt><dd>Встреча оплачивается. Кто на смене – в студии, кто вне смены – онлайн; им время встречи попадает в график часами.</dd>':''}</dl>
    <div class="row mt16"><span class="caps">Вы придёте?</span><button class="btn --sm ${S.rsvp[r.id]==='yes'?'':'--secondary'}" data-rsvp="yes" data-id="${r.id}">Буду</button><button class="btn --sm ${S.rsvp[r.id]==='no'?'':'--ghost'}" data-rsvp="no" data-id="${r.id}">Не смогу</button></div>
    <div class="hr"></div><span class="caps">Повестка</span><pre class="dg mt8">${AGENDA}</pre>
    ${lead?`<div class="hr"></div><span class="caps">Явка</span><table class="t mt8"><tr><th>Сотрудник</th><th>Ответ</th><th>Был</th><th>Часы в график</th></tr>${s.people.map((n,i)=>`<tr><td>${n}</td><td class="muted">${['буду','буду','нет ответа','не смогу','буду'][i%5]}</td><td><label class="check"><input type="checkbox" data-att="${r.id}" data-n="${n}" ${att[n]?'checked':''}></label></td><td class="num">${s.paid&&att[n]&&offShift(n)?`${s.dur} мин · вне смены`:s.paid&&att[n]?'на смене':'–'}</td></tr>`).join('')}</table>
    <div class="hr"></div><div class="field"><label>Протокол</label><textarea class="textarea" placeholder="Коротко: что решили">${esc(S.minutes[r.id]||'')}</textarea></div>
    <div class="mt16"><span class="caps">Договорённости → задачи</span>${ag.map(a=>`<div class="ms"><span class="t">${esc(a.t)}</span><span class="w">${a.o} · до ${a.due}</span><span class="tag --line">задача создана</span></div>`).join('')}
    <div class="grid g2 mt8"><input class="input" id="ag-t" placeholder="Что сделать"><select class="select" id="ag-o">${s.people.map(n=>`<option>${n}</option>`).join('')}</select></div><div class="row mt8"><input class="input" id="ag-d" type="date" value="${iso(addDays(d,7))}" style="max-width:170px"><button class="btn --sm --secondary" data-ag="${r.id}">Добавить задачу</button></div></div>`:''}`,
    foot:lead?'<button class="btn --sm" data-toast="Протокол и явка сохранены">Сохранить</button><span class="sp"></span><span class="xs muted">Явку и протокол ведёт ведущий, HR или владелец</span>':''});
  sheetMeeting.last=r;
}

/* ---------- пик ---------- */
function sheetPeak(r){
  const p=allPeaks().find(x=>x.key===r.key),edit=S.role==='manager'||S.role==='owner';
  sheet({eyebrow:p.double?'Двойной пик':'Пик продаж',title:p.title,body:`
    <dl class="kv"><dt>${p.dates.length>1?'Даты':'Дата'}</dt><dd><b>${p.dates.map(fmtDW).join(' и ')}</b> ${p.dates[0].getFullYear()}</dd>${p.cutoffs.map(c=>`<dt>Cut-off</dt><dd>${fmtDW(c.d)} – ${c.t}</dd>`).join('')}<dt>Отпуск закрыт</dt><dd>${fmtD(p.blackout[0])}${iso(p.blackout[0])!==iso(p.blackout[1])?' – '+fmtD(p.blackout[1]):''}. Больничный и отгул по семейным обстоятельствам не блокируются.</dd></dl>
    ${p.double?'<div class="callout mt16">Mothering Sunday и 8 марта идут подряд: воскресенье и понедельник. Смены, курьеры и закупка планируются на оба дня сразу.</div>':''}
    <div class="hr"></div><span class="caps">Вехи подготовки – каждая стоит задачей</span>
    <div class="mt8">${p.milestones.map(m=>{const done=!!msDone[m.id],late=!done&&m.d<TODAY;return `<div class="ms ${done?'done':''} ${late?'late':''}"><button class="bx" ${edit?`data-ms="${m.id}" data-key="${p.key}"`:''} title="${edit?'Отметить':'Отмечает ответственный'}"></button><span class="t">${m.t}<br><small class="muted">${m.owner} · за ${-m.off} ${plural(-m.off,'день','дня','дней')}</small></span><span class="w num">${late?'просрочено · ':''}${fmtDW(m.d)}</span></div>`}).join('')}</div>
    <p class="xs muted mt16">Смещения вех и ответственные задаются в настройках. Суммы закупок и выручка в календаре не показываются.</p>`,
    foot:`<button class="btn --sm --ghost" data-toast="Открывается список задач с фильтром по этому пику">Задачи пика</button>`});
  sheetPeak.last=r;
}
function sheetDelivery(r){
  const p=POS.find(x=>x.code===r.code);
  sheet({eyebrow:`Поставка · ${p.code}`,title:p.sup,body:`<dl class="kv"><dt>Ожидается</dt><dd><b>${fmtDW(fromIso(p.d))}</b></dd><dt>Что везут</dt><dd>${p.what}</dd><dt>Статус</dt><dd>${p.st}</dd></dl>
    <div class="callout --plain mt16">${S.role==='florist'?'В этот день на смене – приёмка и обработка. Подготовьте место в холодильнике.':'Флористы видят этот день как «приёмка и обработка».'}</div>
    <p class="xs muted mt16">Цены и суммы закупок в календаре не показываются никому. Они остаются на складе у тех, у кого есть доступ.</p>`,
    foot:'<button class="btn --sm --secondary" data-toast="Открывается экран «Ожидается» на складе – уже есть в CRM">Открыть в «Ожидается»</button>'});
}
function sheetBusy(r){const h=host(r.host);sheet({eyebrow:'1:1',title:h.busy,body:`<div class="callout --plain">У ${h.name} в это время личная встреча. С кем и о чём – видят только двое: сотрудник и тот, к кому он записался. Руководитель о записи не узнаёт.</div><p class="sm soft mt16">Так же запись выглядит в чужой iCal-ленте: «занято», без имён и темы.</p>`})}

/* ---------- запись на 1:1: три нажатия ---------- */
let BK={};
function sheetBook(step){
  if(step===1||!step){BK={};
    return sheet({eyebrow:'Запись на 1:1 · шаг 1 из 3',title:'С кем поговорить',body:`<div class="steps"><i class="on"></i><i></i><i></i></div>
      ${HOSTS.filter(h=>h.name!==me().name).map(h=>{const n=slotsFor(h).reduce((a,x)=>a+x.list.filter(s=>!s.shift).length,0),has=S.bookings.some(b=>b.host===h.id&&b.by===me().name&&b.d>=iso(TODAY));return `<button class="host" data-host="${h.id}" ${has?'data-has="1"':''}><span class="avatar --l">${initials(h.name)}</span><span class="t"><b>${h.name}</b><small>${h.role} · ${h.format}</small></span><span class="xs muted">${has?'вы уже записаны':n+' '+plural(n,'слот','слота','слотов')}</span>${ic('chev')}</button>`}).join('')}
      <div class="hr"></div><button class="textbtn" data-act="talk">Хочу поговорить, без даты</button>
      <p class="xs muted mt16">Тему и сам факт встречи видят только вы и тот, к кому вы записались. Срочный вопрос или жалоба – не через календарь: <button class="textbtn" data-toast="Открывается политика обращений и жалоб в HR-модуле">порядок обращений</button>.</p>`});
  }
  const h=host(BK.host);
  if(step===2){const days=slotsFor(h);
    return sheet({back:'book',eyebrow:'Шаг 2 из 3 · время по Лондону',title:h.name,body:`<div class="steps"><i class="on"></i><i class="on"></i><i></i></div>
      ${days.length?days.map(x=>`<div class="slots-day"><span class="caps">${fmtDW(x.d)}</span><div class="slots">${x.list.map(s=>`<button class="slot num" ${s.shift?'disabled title="В это время у вас смена"':`data-slot="${iso(x.d)} ${s.t}"`}>${s.t}</button>`).join('')}</div></div>`).join(''):'<p class="muted">Свободных слотов нет. Оставьте запрос «без даты».</p>'}
      <p class="xs muted mt16">Встреча ${h.slot} минут. Зачёркнутые слоты выпадают на вашу смену. Занятые слоты не показываются. Запись открыта на ${h.ahead} ${plural(h.ahead,'день','дня','дней')} вперёд.</p>`});
  }
  const[d,t]=BK.slot.split(' ');
  sheet({back:'book2',eyebrow:'Шаг 3 из 3',title:'Подтвердите запись',body:`<div class="steps"><i class="on"></i><i class="on"></i><i class="on"></i></div>
    <dl class="kv"><dt>С кем</dt><dd><b>${h.name}</b> · ${h.role}</dd><dt>Когда</dt><dd><b>${fmtDW(fromIso(d))}, ${t}–${hm(mins(t)+h.slot)}</b></dd><dt>Где</dt><dd>${h.format}</dd></dl>
    <div class="field mt16"><label>Тема – по желанию</label><textarea class="textarea" id="bk-topic" placeholder="Можно оставить пустым"></textarea><span class="xs muted">Тему увидит только ${h.name}.</span></div>
    <p class="xs muted mt16">Напомним за день и за час. Перенести или отменить можно не позже чем за ${h.cancel} ${plural(h.cancel,'час','часа','часов')} до встречи.</p>`,
    foot:'<button class="btn" data-act="book-ok">Записаться</button>'});
}
function sheetBookingView(r){
  const b=S.bookings.find(x=>x.id===r.id),h=host(b.host),mine=b.by===me().name;
  sheet({eyebrow:'1:1',title:mine?h.name:b.by,body:`<dl class="kv"><dt>Когда</dt><dd><b>${fmtDW(fromIso(b.d))}, ${b.t}–${hm(mins(b.t)+h.slot)}</b></dd><dt>Где</dt><dd>${h.format}</dd><dt>Тема</dt><dd>${b.topic?esc(b.topic):'<span class="muted">не указана</span>'}</dd></dl>
    <div class="callout --plain mt16">Эту запись видят двое: ${b.by===me().name?'вы':b.by} и ${h.name===me().name?'вы':h.name}. Остальные видят «${h.busy}».</div>`,
    foot:`<button class="btn --sm --secondary" data-rebook="${b.id}">Перенести</button><button class="btn --sm --ghost" data-cancel="${b.id}">Отменить запись</button>`});
}
function sheetTalk(){
  sheet({back:'book',eyebrow:'Без даты',title:'Хочу поговорить',body:`<div class="field"><label>С кем</label><select class="select" id="tk-h">${HOSTS.filter(h=>h.name!==me().name).map(h=>`<option value="${h.id}">${h.name} – ${h.role}</option>`).join('')}</select></div><div class="field mt16"><label>О чём – по желанию</label><textarea class="textarea"></textarea></div><p class="xs muted mt16">Адресат получит запрос и сам предложит время. Запрос видите только вы и он.</p>`,foot:'<button class="btn" data-act="talk-ok">Отправить запрос</button>'});
}
/* ---------- адресат: слоты и записи ---------- */
function sheetHost(){
  const h=host(me().host),inbox=S.bookings.filter(b=>b.host===h.id&&b.d>=iso(TODAY)),talk=S.talk.filter(x=>x.host===h.id);
  sheet({eyebrow:h.role,title:'Мои слоты и записи',body:`
    <span class="caps">Окна доступности</span>
    <table class="t mt8"><tr><th>Когда</th><th>Время</th><th>Слот</th><th>Буфер</th><th></th></tr>${h.windows.map(w=>`<tr><td>Каждый ${WDF[w.wd]}</td><td class="num">${w.from}–${w.to}</td><td class="num">${h.slot} мин</td><td class="num">${h.buf} мин</td><td><button class="textbtn" data-toast="Окно удалено – уже сделанные записи остаются">Убрать</button></td></tr>`).join('')}</table>
    <div class="grid g2 mt16"><div class="field"><label>День</label><select class="select"><option>Каждую неделю: понедельник</option><option>Каждую неделю: вторник</option><option>Один раз: выбрать дату</option></select></div><div class="field"><label>Время</label><div class="row"><input class="input" type="time" value="10:00"><input class="input" type="time" value="12:00"></div></div>
    <div class="field"><label>Длительность и буфер</label><div class="row"><select class="select"><option>30 мин</option><option>45 мин</option><option>60 мин</option></select><select class="select"><option>без буфера</option><option>10 мин</option><option>15 мин</option></select></div></div><div class="field"><label>Формат</label><select class="select"><option>Студия SE1</option><option>Google Meet</option></select></div></div>
    <div class="row mt16"><button class="btn --sm --secondary" data-toast="Окно добавлено – слоты появились у сотрудников">Добавить окно</button><span class="xs muted">Открыто на ${h.ahead} ${plural(h.ahead,'день','дня','дней')} вперёд · отмена не позже ${h.cancel} ч</span></div>
    <div class="hr"></div><span class="caps">Записаны ко мне</span>
    ${inbox.length?inbox.map(b=>`<button class="ev l-meeting mt8" ${refAttr({type:'booking',id:b.id})}><span class="tm num">${fmtS(fromIso(b.d))} ${b.t}</span><span class="tx"><b>${b.by}</b><small>${b.topic?esc(b.topic):'Тема не указана'}</small></span></button>`).join(''):'<p class="sm muted mt8">Пока никто не записан.</p>'}
    <div class="hr"></div><span class="caps">Хотят поговорить, без даты</span>
    ${talk.length?talk.map(x=>`<div class="ms"><span class="t"><b>${x.by}</b><br><small class="muted">запрос от ${fmtD(fromIso(x.d))}</small></span><button class="btn --sm --ghost" data-toast="Сотруднику ушло предложение времени">Предложить время</button></div>`).join(''):'<p class="sm muted mt8">Запросов нет.</p>'}`});
}
/* ---------- отпуск: жёсткий запрет на пики ---------- */
function sheetLeave(){
  sheet({eyebrow:'Команда → Отпуск',title:'Заявка на отсутствие',body:`
    <div class="field"><label>Тип</label><select class="select" id="lv-type"><option value="holiday">Ежегодный отпуск</option><option value="sick">Больничный</option><option value="dep">Отгул по семейным обстоятельствам</option><option value="unpaid">За свой счёт</option></select></div>
    <div class="grid g2 mt16"><div class="field"><label>С</label><input class="input" type="date" id="lv-from" value="2027-03-05"></div><div class="field"><label>По</label><input class="input" type="date" id="lv-to" value="2027-03-09"></div></div>
    <div id="lv-msg" class="mt16"></div>
    <div class="hr"></div><span class="caps">Дни, когда отпуск закрыт</span>
    ${allPeaks().filter(p=>p.blackout[1]>=TODAY).slice(0,4).map(p=>`<div class="ms"><span class="t">${p.title}</span><span class="w num">${fmtD(p.blackout[0])}${iso(p.blackout[0])!==iso(p.blackout[1])?' – '+fmtD(p.blackout[1]):''} ${p.blackout[0].getFullYear()}</span></div>`).join('')}
    <p class="xs muted mt16">Правило записано в политике отпусков и известно заранее. Запрет касается только ежегодного отпуска: больничный и отгул по семейным обстоятельствам оформляются в любой день.</p>`,
    foot:'<button class="btn" id="lv-send" data-act="leave-ok">Отправить заявку</button>'});
  checkLeave();
}
function checkLeave(){
  const ty=$('lv-type').value,a=$('lv-from').value,b=$('lv-to').value,box=$('lv-msg'),btn=$('lv-send');if(!a||!b){return}
  let hit=null;for(let d=fromIso(a);d<=fromIso(b);d=addDays(d,1)){const p=blackoutOf(d);if(p){hit=p;break}}
  if(ty==='holiday'&&hit){box.innerHTML=`<div class="callout"><b>На эти даты отпуск не оформляется.</b><br>${hit.title}: отпуск закрыт ${fmtD(hit.blackout[0])}${iso(hit.blackout[0])!==iso(hit.blackout[1])?' – '+fmtD(hit.blackout[1]):''}. Выберите другие дни.</div>`;btn.disabled=true}
  else if(hit){box.innerHTML='<div class="callout --plain">Даты попадают на пик, но этот тип отсутствия не блокируется.</div>';btn.disabled=false}
  else{box.innerHTML='';btn.disabled=false}
}
/* ---------- iCal ---------- */
function sheetIcal(){
  const tok='k7f3'+'•'.repeat(18)+['q9','x2','m5'][S.icalRev%3];
  sheet({eyebrow:'Только чтение',title:'Подписка iCal',body:`
    <p class="sm soft">Личная ссылка показывает ваш календарь в Google Calendar или Apple Calendar. Обратно из них в CRM ничего не записывается.</p>
    <div class="field mt16"><label>Моя ссылка</label><div class="row"><input class="input num" readonly value="https://app.floritta.ai/calendar/ical/${tok}.ics"><button class="btn --sm --secondary" data-toast="Ссылка скопирована">Копировать</button></div></div>
    <div class="row mt8"><button class="textbtn" data-act="ical-rotate">Перевыпустить ссылку</button><span class="xs muted">старая перестанет работать</span></div>
    <div class="hr"></div><span class="caps">Что попадает в ленту</span>
    <div class="ms"><span class="t">Мои смены, встречи команды, мои записи на 1:1</span><span class="w">полностью</span></div>
    <div class="ms"><span class="t">Пики, cut-off, банковские выходные, поставки</span><span class="w">название и дата</span></div>
    <div class="ms"><span class="t">Тема моей записи на 1:1</span><span class="w">не передаётся</span></div>
    <div class="ms"><span class="t">Чужие записи на 1:1</span><span class="w">«занято»</span></div>
    <div class="ms"><span class="t">Суммы, причины отсутствий, HR-заметки</span><span class="w">никогда</span></div>`});
}
/* ---------- настройки (HR и владелец) ---------- */
let ST='meet';
function sheetSettings(){
  const tabs=[['meet','Встречи'],['peak','Пики и отпуска'],['hosts','Адресаты 1:1'],['sup','Поставки'],['dig','Дайджест']];
  const p=nextPeak(TODAY),wk=events(D(2026,11,16),D(2026,11,22));
  const body={
    meet:`${SERIES.map(s=>`<div class="card mb16"><div class="row"><b style="flex:1">${s.title}</b>${s.paid?'<span class="tag --line">оплачивается</span>':''}</div><div class="grid g2 mt8"><div class="field"><label>Повторение</label><select class="select"><option>${s.ruleText}</option><option>Каждую неделю</option><option>Раз в месяц</option></select></div><div class="field"><label>Время и длительность</label><div class="row"><input class="input" type="time" value="${s.time}"><select class="select"><option>${s.dur} мин</option><option>30 мин</option><option>60 мин</option></select></div></div><div class="field"><label>Участники</label><select class="select"><option>${s.aud} – по группе графика</option></select></div><div class="field"><label>Ведёт</label><select class="select"><option>${s.host}</option></select></div></div><div class="xs muted mt8">${s.format} · ссылка Meet задаётся один раз на серию</div></div>`).join('')}<p class="xs muted">День, время и длительность – данные, а не код. Если встреча попадает на пиковое окно, система предлагает перенос и ждёт подтверждения.</p>`,
    peak:`<span class="caps">Когда отпуск закрыт</span><table class="t mt8"><tr><th>Пик</th><th>Окно</th><th></th></tr><tr><td>День святого Валентина</td><td class="num">14 февраля</td><td><button class="textbtn" data-toast="Окно можно расширить, например 12–14 февраля">Изменить</button></td></tr><tr><td>Mothering Sunday + 8 марта</td><td class="num">оба дня и дни между ними</td><td><button class="textbtn" data-toast="Окно меняется здесь">Изменить</button></td></tr><tr><td>Рождество</td><td class="num">14–24 декабря</td><td><button class="textbtn" data-toast="Окно меняется здесь">Изменить</button></td></tr></table>
      <div class="callout --plain mt16">Запрет жёсткий и только для ежегодного отпуска. Больничный и отгул по семейным обстоятельствам не блокируются – это право по закону.</div>
      <div class="hr"></div><span class="caps">Вехи подготовки</span><table class="t mt8"><tr><th>Веха</th><th>За сколько дней</th><th>Ответственный</th></tr>${MS_TPL.map(m=>`<tr><td>${m.t}</td><td><input class="input num" style="width:70px" value="${-m.off}"></td><td>${m.owner}</td></tr>`).join('')}</table><p class="xs muted mt8">Каждая веха автоматически становится задачей ответственному.</p>`,
    hosts:`<p class="sm soft">К этим людям сотрудник может записаться сам. Каждый открывает свои свободные часы.</p><div class="mt16">${HOSTS.map(h=>`<div class="ms"><span class="avatar">${initials(h.name)}</span><span class="t"><b>${h.name}</b><br><small class="muted">${h.role}</small></span><span class="w">${h.id==='hr'?'по роли HR – автоматически':'<button class="textbtn" data-toast="Адресат убран из списка">убрать</button>'}</span></div>`).join('')}</div><div class="row mt16"><select class="select"><option>Добавить сотрудника…</option><option>Denis Orlov – менеджер</option><option>Alina Moroz – поддержка</option></select><button class="btn --sm --secondary" data-toast="Адресат добавлен">Добавить</button></div><p class="xs muted mt16">Все с ролью HR попадают в список сами. Остальных выбирает владелец.</p>`,
    sup:`<span class="caps">Регулярные дни поставок</span><table class="t mt8"><tr><th>Поставщик</th><th>День</th><th>Что</th><th></th></tr>${REGULAR.map(g=>`<tr><td>${g.sup}</td><td>${WDF[g.wd]}</td><td>${g.what}</td><td><button class="textbtn" data-toast="День убран">Убрать</button></td></tr>`).join('')}</table><button class="btn --sm --secondary mt16" data-toast="Форма: поставщик, день недели, что везут">Добавить день</button><p class="xs muted mt16">Разовые поставки берутся со склада из «Ожидается» сами. Здесь – только повторяющиеся дни.</p>`,
    dig:`<div class="grid g2"><div class="field"><label>Когда</label><div class="row"><select class="select"><option>Понедельник</option></select><input class="input" type="time" value="09:00"></div></div><div class="field"><label>Куда</label><select class="select"><option>Общий чат команды</option></select></div></div>
      <div class="mt16"><span class="caps">Так выглядит сообщение</span><pre class="dg mt8"><b>Неделя 16–22 ноября</b>

Встречи
${wk.filter(e=>e.layer==='meeting').map(e=>`· ${fmtDW(fromIso(e.d))}, ${e.tm} – ${e.title}`).join('\n')||'· на этой неделе встреч нет'}

Поставки
${POS.filter(x=>x.d>='2026-11-16'&&x.d<='2026-11-22').map(x=>`· ${fmtDW(fromIso(x.d))} – ${x.sup}`).join('\n')}

Ближайший пик
· ${p.title}, ${fmtD(p.dates[0])} – через ${daysBetween(D(2026,11,16),p.dates[0])} ${plural(daysBetween(D(2026,11,16),p.dates[0]),'день','дня','дней')}
${p.milestones.filter(m=>m.d>=D(2026,11,16)&&m.d<=D(2026,11,29)).map(m=>`· веха: ${m.t} – до ${fmtD(m.d)}`).join('\n')}</pre></div><p class="xs muted mt8">В дайджесте нет имён, личных данных и сумм.</p>`,
  };
  sheet({eyebrow:'HR и владелец',title:'Настройки календаря',tabs:`<div class="sh-tabs">${tabs.map(([k,t])=>`<button class="${ST===k?'on':''}" data-st="${k}">${t}</button>`).join('')}</div>`,body:body[ST],foot:'<button class="btn --sm" data-toast="Настройки сохранены">Сохранить</button>'});
}
function sheetDay(k){
  const d=fromIso(k),evs=events(d,d),p=blackoutOf(d);
  sheet({eyebrow:WDF[dow(d)],title:fmtD(d)+' '+d.getFullYear(),body:`${p?`<div class="callout mb16">${p.title}: отпуск на этот день закрыт.</div>`:''}${evs.map(evRow).join('')||'<p class="muted">Событий нет.</p>'}`});
}

/* ---------- заметки ---------- */
const NOTES=`
<h4>Что это</h4><p>Вкладка «Календарь» в разделе «Задачи». Одно место, где каждый видит встречи, пики продаж, поставки, свои смены и отпуска – и сам записывается на 1:1.</p>
<h4>Как смотреть</h4><ul><li>Переключатель «Смотреть как» вверху: флорист, менеджер, HR, владелец – видно, что скрыто от каждого.</li><li>Запись на 1:1 – три нажатия: с кем, время, «Записаться».</li><li>«К двойному пику» – март 2027: Mothering Sunday 7-го и 8 марта подряд.</li><li>«Отпуск» – заявка на 5–9 марта 2027 не проходит.</li></ul>
<h4>Уже есть в CRM – переиспользуем</h4><ul><li>HR-календарь и его источники дат</li><li>График смен и группы</li><li>Отпуска и журнал отсутствий</li><li>Склад «Ожидается»</li><li>Задачи – для вех и договорённостей</li><li>Согласие на показ дня рождения</li></ul>
<h4>Новое</h4><ul><li>Серии встреч команды, явка, протокол</li><li>Слоты и самозапись на 1:1 к четырём адресатам</li><li>Коммерческий календарь: пики, cut-off, вехи</li><li>Запрет ежегодного отпуска на пики</li><li>Личная iCal-лента, дайджест недели</li></ul>
<h4>Кто что видит</h4><ul><li><b>Запись на 1:1</b> – только двое. Остальным «занято».</li><li><b>Отпуск</b> – команде только факт, без типа и причины.</li><li><b>Поставки</b> – флористы, менеджеры, владелец. Без цен.</li><li><b>HR-даты</b> – HR и владелец.</li><li><b>Дни рождения</b> – только с согласия, без возраста.</li><li>Денег в календаре нет.</li></ul>
<h4>Этапы</h4><p><span class="st ink">MVP</span> всё, что на этом экране.</p><p><span class="st">v2</span> лимит одновременных отсутствий, обучение с записью, онбординг для самого сотрудника, экран в приложении Floritta Team.</p><p><span class="st">v3</span> уровень влияния дат по истории заказов, проверки помещения с журналом.</p>
<h4>Данные</h4><p>Имена, поставщики и события вымышлены. Даты праздников и банковских выходных считаются настоящим расчётом.</p>`;

/* ---------- события ---------- */
document.addEventListener('click',e=>{
  const el=e.target.closest('button,[data-day],[data-close]');if(!el)return;const ds=el.dataset;
  if(el.id==='notes-hide'){$('app').classList.add('no-notes');$('app').classList.remove('notes-open');return}
  if(el.id==='notes-toggle'){$('app').classList.remove('no-notes');$('app').classList.toggle('notes-open');return}
  if('close' in ds)return closeSheet();
  if(ds.toast)return toast(ds.toast);
  if(ds.role){S.role=ds.role;closeSheet();return render()}
  if(ds.view){S.view=ds.view;return render()}
  if(ds.layer){S.layers.has(ds.layer)?S.layers.delete(ds.layer):S.layers.add(ds.layer);return render()}
  if(ds.nav!==undefined){const n=+ds.nav;if(S.view==='month')S.cursor=n?D(S.cursor.getFullYear(),S.cursor.getMonth()+1+n,1):D(2026,11,1);else S.weekStart=n?addDays(S.weekStart,7*n):D(2026,11,16);return render()}
  if(ds.jump){S.view='month';S.cursor=D(2027,3,1);return render()}
  if(ds.ref!==undefined)return openRef(REFS[+ds.ref]);
  if(ds.day)return sheetDay(ds.day);
  if(ds.rsvp){S.rsvp[ds.id]=ds.rsvp;toast(ds.rsvp==='yes'?'Отмечено: буду':'Отмечено: не смогу');render();if($('sheet').classList.contains('on')&&sheetMeeting.last)sheetMeeting(sheetMeeting.last);return}
  if(ds.move){S.moves[ds.id]=ds.move;toast(ds.move==='moved'?'Встреча перенесена – участники получили уведомление':'Встреча оставлена на прежней дате');render();return sheetMeeting(sheetMeeting.last)}
  if(ds.ag){const t=$('ag-t').value.trim();if(!t)return toast('Напишите, что сделать');S.agreements[ds.ag].push({t,o:$('ag-o').value,due:fmtD(fromIso($('ag-d').value))});toast('Задача создана и назначена');return sheetMeeting(sheetMeeting.last)}
  if(ds.ms){msDone[ds.ms]=!msDone[ds.ms];render();return sheetPeak(sheetPeak.last)}
  if(ds.host){if(ds.has)return toast('К этому человеку у вас уже есть запись – перенесите или отмените её');BK.host=ds.host;return sheetBook(2)}
  if(ds.slot){BK.slot=ds.slot;return sheetBook(3)}
  if(ds.rebook){const b=S.bookings.find(x=>x.id===+ds.rebook);S.bookings=S.bookings.filter(x=>x!==b);BK={host:b.host};render();toast('Выберите новое время');return sheetBook(2)}
  if(ds.cancel){S.bookings=S.bookings.filter(x=>x.id!==+ds.cancel);closeSheet();render();return toast('Запись отменена – слот снова свободен')}
  if(ds.st){ST=ds.st;return sheetSettings()}
  const act={book:()=>sheetBook(1),book2:()=>sheetBook(2),host:sheetHost,leave:sheetLeave,ical:sheetIcal,settings:sheetSettings,talk:sheetTalk,
    'book-ok':()=>{const[d,t]=BK.slot.split(' ');S.bookings.push({id:Date.now(),host:BK.host,d,t,by:me().name,topic:$('bk-topic').value.trim()});closeSheet();S.view='my';render();toast(`Вы записаны: ${fmtD(fromIso(d))}, ${t}. Напомним за день и за час`)},
    'talk-ok':()=>{S.talk.push({host:$('tk-h').value,by:me().name,topic:'',d:iso(TODAY)});closeSheet();toast('Запрос отправлен – вам предложат время')},
    'leave-ok':()=>{closeSheet();toast('Заявка отправлена на согласование')},
    'ical-rotate':()=>{S.icalRev++;sheetIcal();toast('Новая ссылка готова, старая отключена')},
  }[ds.act];
  if(act)act();
});
document.addEventListener('change',e=>{
  if(['lv-type','lv-from','lv-to'].includes(e.target.id))checkLeave();
  if(e.target.dataset.att){(S.attend[e.target.dataset.att]||(S.attend[e.target.dataset.att]={}))[e.target.dataset.n]=e.target.checked;sheetMeeting(sheetMeeting.last)}
});
$('scrim').addEventListener('click',closeSheet);
document.addEventListener('keydown',e=>{if(e.key==='Escape')closeSheet()});
render();
