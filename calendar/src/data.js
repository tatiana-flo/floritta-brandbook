/* ===== Календарь команды – демо-данные и расчёт дат. Имена, поставщики и события вымышлены. ===== */
const pad=n=>String(n).padStart(2,'0');
const D=(y,m,d)=>new Date(y,m-1,d,12);
const iso=d=>`${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`;
const fromIso=s=>{const[a,b,c]=s.split('-').map(Number);return D(a,b,c)};
const addDays=(d,n)=>{const x=new Date(d);x.setDate(x.getDate()+n);return x};
const dow=d=>(d.getDay()+6)%7; // 0 = понедельник
const daysBetween=(a,b)=>Math.round((b-a)/864e5);
const WD=['пн','вт','ср','чт','пт','сб','вс'];
const WDF=['понедельник','вторник','среда','четверг','пятница','суббота','воскресенье'];
const MON=['января','февраля','марта','апреля','мая','июня','июля','августа','сентября','октября','ноября','декабря'];
const MONN=['Январь','Февраль','Март','Апрель','Май','Июнь','Июль','Август','Сентябрь','Октябрь','Ноябрь','Декабрь'];
const fmtD=d=>`${d.getDate()} ${MON[d.getMonth()]}`;
const fmtS=d=>`${d.getDate()} ${MON[d.getMonth()].slice(0,3)}`;
const fmtDW=d=>`${WD[dow(d)]}, ${fmtD(d)}`;
const plural=(n,a,b,c)=>{const m=n%100,k=n%10;return m>10&&m<20?c:k===1?a:k>1&&k<5?b:c};
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const TODAY=D(2026,11,15);

/* ---------- даты считаются кодом ---------- */
function easter(y){const a=y%19,b=Math.floor(y/100),c=y%100,d=Math.floor(b/4),e=b%4,f=Math.floor((b+8)/25),g=Math.floor((b-f+1)/3),h=(19*a+b-d-g+15)%30,i=Math.floor(c/4),k=c%4,l=(32+2*e+2*i-h-k)%7,m=Math.floor((a+11*h+22*l)/451),mo=Math.floor((h+l-7*m+114)/31),da=((h+l-7*m+114)%31)+1;return D(y,mo,da)}
function orthodoxEaster(y){const a=y%4,b=y%7,c=y%19,d=(19*c+15)%30,e=(2*a+4*b-d+34)%7,mo=Math.floor((d+e+114)/31),da=((d+e+114)%31)+1;return addDays(D(y,mo,da),13)}
function nthWd(y,m,wd,n){let d=D(y,m,1);while(dow(d)!==wd)d=addDays(d,1);return addDays(d,7*(n-1))}
function lastWd(y,m,wd){let d=D(y,m+1,0);while(dow(d)!==wd)d=addDays(d,-1);return d}
function bankHolidays(y){
  const e=easter(y),out=[];
  let ny=D(y,1,1);if(dow(ny)===5)ny=D(y,1,3);else if(dow(ny)===6)ny=D(y,1,2);
  out.push([ny,'New Year’s Day'],[addDays(e,-2),'Good Friday'],[addDays(e,1),'Easter Monday'],[nthWd(y,5,0,1),'Early May bank holiday'],[lastWd(y,5,0),'Spring bank holiday'],[lastWd(y,8,0),'Summer bank holiday']);
  const x=dow(D(y,12,25));
  if(x===5)out.push([D(y,12,27),'Christmas Day (перенос)'],[D(y,12,28),'Boxing Day (перенос)']);
  else if(x===6)out.push([D(y,12,26),'Boxing Day'],[D(y,12,27),'Christmas Day (перенос)']);
  else if(x===4)out.push([D(y,12,25),'Christmas Day'],[D(y,12,28),'Boxing Day (перенос)']);
  else out.push([D(y,12,25),'Christmas Day'],[D(y,12,26),'Boxing Day']);
  return out;
}
/* пики: даты, окно запрета отпусков, cut-off. Окна и смещения вех – настройки, здесь значения по умолчанию */
const MS_TPL=[{k:'content',t:'Контент и промо',off:-35,owner:'Маркетинг'},{k:'pack',t:'Упаковка и расходники',off:-28,owner:'Закупки'},{k:'flowers',t:'Заказ цветов у поставщиков',off:-21,owner:'Закупки'},{k:'shifts',t:'Усиление смен',off:-14,owner:'Управляющая студией'},{k:'couriers',t:'Дополнительные курьеры',off:-7,owner:'Менеджер смены'}];
const msDone={'christmas-2026:content':true};
function peaks(y){
  const ms=addDays(easter(y),-21),w8=D(y,3,8),list=[];
  list.push({key:'valentine-'+y,title:'День святого Валентина',dates:[D(y,2,14)],blackout:[D(y,2,14),D(y,2,14)],cutoffs:[{d:D(y,2,13),t:'Последний день приёма заказов на 14.02'}]});
  if(Math.abs(daysBetween(ms,w8))<=3){const a=ms<w8?ms:w8,b=ms<w8?w8:ms;
    list.push({key:'march-'+y,title:'Mothering Sunday + 8 марта',double:true,dates:[ms,w8].sort((p,q)=>p-q),blackout:[a,b],cutoffs:[{d:addDays(a,-1),t:'Последний день приёма заказов на оба дня'}]});
  }else{
    list.push({key:'mothering-'+y,title:'Mothering Sunday',dates:[ms],blackout:[ms,ms],cutoffs:[{d:addDays(ms,-1),t:'Последний день приёма заказов'}]});
    list.push({key:'women-'+y,title:'8 марта',dates:[w8],blackout:[w8,w8],cutoffs:[{d:D(y,3,7),t:'Последний день приёма заказов'}]});
  }
  list.push({key:'christmas-'+y,title:'Рождество',dates:[D(y,12,25)],blackout:[D(y,12,14),D(y,12,24)],cutoffs:[{d:D(y,12,18),t:'Cut-off: доставка по стране'},{d:D(y,12,24),t:'Cut-off: доставка по Лондону'}]});
  list.forEach(p=>{p.milestones=MS_TPL.map(m=>({...m,d:addDays(p.dates[0],m.off),id:p.key+':'+m.k}))});
  return list;
}
const allPeaks=()=>[...peaks(2026),...peaks(2027),...peaks(2028)];
function blackoutOf(d){const t=iso(d);return allPeaks().find(p=>iso(p.blackout[0])<=t&&t<=iso(p.blackout[1]))||null}
function isPeakDay(d){const t=iso(d);return allPeaks().some(p=>p.dates.some(x=>iso(x)===t))}
function nextPeak(from){return allPeaks().filter(p=>p.dates[p.dates.length-1]>=from).sort((a,b)=>a.dates[0]-b.dates[0])[0]}
/* остальные коммерческие даты: уровень влияния по умолчанию (калибровка по истории заказов – этап v3) */
function commercial(y){
  const e=easter(y),bf=addDays(nthWd(y,11,3,4),1);
  return [
    [D(y,1,7),'Православное Рождество','notable'],[e,'Пасха','notable'],[orthodoxEaster(y),'Православная Пасха','notable'],
    [nthWd(y,6,6,3),'Father’s Day','notable'],[D(y,10,5),'День учителя','bg'],[D(y,10,31),'Halloween','notable'],[D(y,11,5),'Bonfire Night','bg'],
    [bf,'Black Friday','high'],[addDays(bf,3),'Cyber Monday','notable'],[nthWd(y,12,5,1),'Small Business Saturday','notable'],[D(y,12,31),'Новый год','high'],
  ];
}
const LEVEL={peak:'Пик',high:'Высокий',notable:'Заметный',bg:'Фон'};

/* ---------- люди и роли ---------- */
const ROLES={
  florist:{name:'Mila Novak',label:'Флорист',shift:{wd:[0,3,4,6],from:'08:00',to:'16:00'}},
  manager:{name:'Denis Orlov',label:'Менеджер',shift:{wd:[0,1,2,3,4],from:'09:00',to:'18:00'}},
  hr:{name:'Irina Petrova',label:'HR',host:'hr'},
  owner:{name:'Владелец',label:'Владелец',host:'owner'},
};
const HOSTS=[
  {id:'hr',name:'Irina Petrova',role:'HR / People Partner',busy:'HR занят',windows:[{wd:1,from:'14:00',to:'17:00'},{wd:3,from:'14:00',to:'17:00'}],slot:30,buf:10,format:'Студия SE1 или Google Meet',ahead:21,cancel:12},
  {id:'owner',name:'Владелец',role:'Основатель',busy:'Владелец занят',windows:[{wd:2,from:'16:00',to:'18:00'}],slot:30,buf:0,format:'Google Meet',ahead:21,cancel:24},
  {id:'ops',name:'Vera Kuznets',role:'Операционный руководитель',busy:'Vera Kuznets занята',windows:[{wd:0,from:'12:00',to:'14:00'},{wd:3,from:'16:30',to:'18:00'}],slot:30,buf:0,format:'Google Meet',ahead:14,cancel:12},
  {id:'studio',name:'Eva Marin',role:'Управляющая студией',busy:'Eva Marin занята',windows:[{wd:1,from:'08:30',to:'10:00'},{wd:5,from:'15:00',to:'16:30'}],slot:30,buf:0,format:'Студия SE1',ahead:14,cancel:12},
];
const host=id=>HOSTS.find(h=>h.id===id);
const mins=t=>{const[h,m]=t.split(':').map(Number);return h*60+m};
const hm=n=>`${pad(Math.floor(n/60))}:${pad(n%60)}`;
const initials=n=>n.split(' ').map(x=>x[0]).join('').slice(0,2).toUpperCase();

/* ---------- состояние (меняется кликами) ---------- */
const S={
  role:'florist',view:'my',cursor:D(2026,11,1),weekStart:D(2026,11,16),
  layers:new Set(['meeting','commercial','delivery','booking','leave','shift','birthday','hr']),
  bookings:[
    {id:1,host:'hr',d:'2026-11-17',t:'14:40',by:'Polina Sokol',topic:'График на декабрь'},
    {id:2,host:'hr',d:'2026-11-19',t:'14:00',by:'Jake Wilson',topic:''},
    {id:3,host:'owner',d:'2026-11-18',t:'16:30',by:'Kira Belova',topic:'Идея по свадебному направлению'},
    {id:4,host:'studio',d:'2026-11-17',t:'09:00',by:'Daria Lis',topic:''},
  ],
  talk:[{host:'hr',by:'Yana Kim',topic:'Хочу обсудить переход на полную ставку',d:'2026-11-14'}],
  rsvp:{},moves:{},attend:{},agreements:{},minutes:{},clock:{on:true,brk:false},topics:{},offers:{},
  icalRev:1,
};
const me=()=>ROLES[S.role];

/* ---------- встречи команды ---------- */
const SERIES=[
  {id:'fl',title:'Встреча флористов',aud:'Флористы',who:['florist','hr','owner'],rule:{f:'W',int:2,anchor:'2026-11-18'},ruleText:'Каждые 2 недели, среда',time:'15:00',dur:45,format:'Гибрид: студия SE1 + Google Meet',paid:true,host:'Eva Marin',people:['Mila Novak','Polina Sokol','Daria Lis','Kira Belova','Yana Kim']},
  {id:'on',title:'Встреча онлайн-команды',aud:'Менеджеры и поддержка',who:['manager','hr','owner'],rule:{f:'W',int:2,anchor:'2026-11-19'},ruleText:'Каждые 2 недели, четверг',time:'11:00',dur:45,format:'Google Meet',paid:false,host:'Vera Kuznets',people:['Denis Orlov','Alina Moroz','Nika Fedorova','Artem Gromov']},
  {id:'all',title:'Общая встреча команды',aud:'Вся команда',who:['florist','manager','hr','owner'],rule:{f:'M',nth:1,wd:1},ruleText:'Раз в месяц, первый вторник',time:'16:00',dur:60,format:'Гибрид: студия SE1 + Google Meet',paid:false,host:'Владелец',people:['Mila Novak','Polina Sokol','Daria Lis','Kira Belova','Yana Kim','Denis Orlov','Alina Moroz','Nika Fedorova','Artem Gromov','Jake Wilson']},
];
const AGENDA='1. Что получилось за две недели\n2. Что мешает работе\n3. Новое в ассортименте и CRM\n4. Ближайший пик: кто что готовит\n5. Вопросы команды';
function occurrences(s,from,to){
  const out=[];
  if(s.rule.f==='W'){let d=fromIso(s.rule.anchor);while(d<=to){if(d>=from)out.push(d);d=addDays(d,7*s.rule.int)}}
  else{let y=from.getFullYear(),m=from.getMonth()+1;for(let i=0;i<40;i++){const d=nthWd(y,m,s.rule.wd,s.rule.nth);if(d>to)break;if(d>=from)out.push(d);m++;if(m>12){m=1;y++}}}
  return out;
}
/* встреча попала в пиковое окно: система предлагает дату, человек подтверждает – молча не переносим */
function suggestMove(d){let a=addDays(d,-7);if(a>TODAY&&!blackoutOf(a))return a;let b=addDays(d,7);while(blackoutOf(b))b=addDays(b,7);return b}

/* ---------- поставки (без цен и сумм) ---------- */
const POS=[
  {code:'PO-1184',d:'2026-11-17',sup:'Dutch Bloom BV',what:'Розы, эвкалипт, хризантема – 14 позиций',st:'В пути'},
  {code:'PO-1187',d:'2026-11-20',sup:'Pack & Ribbon Ltd',what:'Коробки, лента, тишью',st:'Заказано'},
  {code:'PO-1190',d:'2026-11-24',sup:'Dutch Bloom BV',what:'Амариллис, илекс, гиперикум – 11 позиций',st:'Заказано'},
  {code:'PO-1196',d:'2026-12-04',sup:'Evergreen Farm',what:'Рождественская зелень: нобилис, ель, омела',st:'Заказано'},
  {code:'PO-1203',d:'2026-12-11',sup:'Dutch Bloom BV',what:'Рождественская партия – 22 позиции',st:'Черновик'},
  {code:'PO-1262',d:'2027-02-10',sup:'Dutch Bloom BV',what:'Красная роза, тюльпан – партия к 14 февраля',st:'Черновик'},
  {code:'PO-1288',d:'2027-03-04',sup:'Dutch Bloom BV',what:'Тюльпан, мимоза, ранункулюс – партия к 7–8 марта',st:'Черновик'},
];
const REGULAR=[{wd:1,sup:'Dutch Bloom BV',what:'Регулярная поставка цветов'},{wd:4,sup:'Dutch Bloom BV',what:'Регулярная поставка цветов'}];

/* ---------- отпуска, дни рождения, HR-даты ---------- */
const LEAVES=[{name:'Polina Sokol',team:'Флористы',from:'2026-11-23',to:'2026-11-27'},{name:'Denis Orlov',team:'Менеджеры',from:'2026-12-01',to:'2026-12-03'},{name:'Kira Belova',team:'Флористы',from:'2027-03-15',to:'2027-03-19'}];
const BDAYS=[{name:'Kira Belova',md:'11-21',k:'День рождения'},{name:'Jake Wilson',md:'12-09',k:'День рождения'},{name:'Mila Novak',md:'11-30',k:'2 года в Floritta'},{name:'Alina Moroz',md:'03-12',k:'День рождения'}];
const HRDATES=[{d:'2026-11-19',t:'День рождения – Daria Lis',s:'Команде не показываем: нет согласия'},{d:'2026-11-20',t:'Конец испытательного срока – Yana Kim',s:'Онбординг и даты'},{d:'2026-11-26',t:'Check-in 30 дней – Artem Gromov',s:'Онбординг и даты'},{d:'2026-12-02',t:'Истекает right to work – курьер',s:'Документы',alert:true}];

/* ---------- сбор событий под зрителя ---------- */
function events(from,to){
  const r=S.role,out=[],f=iso(from),t=iso(to),inR=d=>{const x=iso(d);return x>=f&&x<=t};
  const push=e=>{if(S.layers.has(e.layer))out.push(e)};
  // встречи
  SERIES.filter(s=>s.who.includes(r)).forEach(s=>occurrences(s,addDays(from,-14),addDays(to,14)).forEach(d0=>{
    const id=s.id+':'+iso(d0);let d=d0,need=false;const sug=blackoutOf(d0)?suggestMove(d0):null;
    if(sug){if(S.moves[id]==='moved')d=sug;else if(S.moves[id]!=='kept')need=true}
    if(!inR(d))return;
    push({d:iso(d),tm:s.time,end:hm(mins(s.time)+s.dur),layer:'meeting',title:s.title,sub:need?`Попала на пиковое окно – предложен перенос на ${fmtD(sug)}`:s.format,alert:need,ref:{type:'meeting',id,series:s.id,date:iso(d0)}});
  }));
  // коммерческий календарь
  for(let y=from.getFullYear();y<=to.getFullYear();y++){
    peaks(y).forEach(p=>{
      p.dates.forEach(d=>{if(inR(d))push({d:iso(d),layer:'commercial',cls:'peak',title:p.double?`${iso(d)===iso(addDays(easter(y),-21))?'Mothering Sunday':'8 марта'} – двойной пик`:p.title,sub:blackoutOf(d)?'Пик · отпуск закрыт':'Пик продаж',ref:{type:'peak',key:p.key}})});
      p.cutoffs.forEach(c=>{if(inR(c.d))push({d:iso(c.d),layer:'commercial',cls:'peak',title:c.t,sub:p.title,ref:{type:'peak',key:p.key}})});
      if(r==='manager'||r==='owner')p.milestones.forEach(m=>{if(inR(m.d))push({d:iso(m.d),layer:'commercial',title:`Веха: ${m.t}`,sub:`${p.title} · ${m.owner}`,alert:m.d<TODAY&&!msDone[m.id],ref:{type:'peak',key:p.key}})});
    });
    commercial(y).forEach(([d,title,lv])=>{if(inR(d))push({d:iso(d),layer:'commercial',title,sub:`Влияние на продажи: ${LEVEL[lv].toLowerCase()}`,ref:{type:'date',title,lv,d:iso(d)}})});
    bankHolidays(y).forEach(([d,title])=>{if(inR(d))push({d:iso(d),layer:'commercial',title:`Bank holiday – ${title}`,sub:'Банковский выходной, Англия и Уэльс',ref:{type:'date',title:'Bank holiday – '+title,lv:'bg',d:iso(d)}})});
  }
  // поставки: флористы, менеджеры, владелец
  if(r!=='hr'){
    POS.forEach(p=>{const d=fromIso(p.d);if(inR(d))push({d:p.d,layer:'delivery',title:`Поставка – ${p.sup}`,sub:r==='florist'?`Приёмка и обработка · ${p.what}`:`${p.st} · ${p.what}`,ref:{type:'delivery',code:p.code}})});
    for(let d=new Date(from);d<=to;d=addDays(d,1))REGULAR.forEach(g=>{if(dow(d)===g.wd&&!POS.some(p=>p.d===iso(d)&&p.sup===g.sup))push({d:iso(d),layer:'delivery',title:`${g.what} – ${g.sup}`,sub:'По расписанию поставщика',ref:{type:'regular',d:iso(d),sup:g.sup}})});
  }
  // 1:1: свои видны целиком, чужие – только «занят»
  S.bookings.forEach(b=>{const d=fromIso(b.d);if(!inR(d))return;const h=host(b.host),end=hm(mins(b.t)+h.slot);
    if(b.by===me().name)push({d:b.d,tm:b.t,end,layer:'booking',title:`1:1 – ${h.name}`,sub:h.format,ref:{type:'booking',id:b.id}});
    else if(me().host===b.host)push({d:b.d,tm:b.t,end,layer:'booking',title:`1:1 – ${b.by}`,sub:b.topic?`Тема: ${b.topic}`:'Тема не указана',ref:{type:'booking',id:b.id}});
    else push({d:b.d,tm:b.t,end,layer:'booking',cls:'busy',title:h.busy,sub:'Подробности скрыты',ref:{type:'busy',host:b.host}});
  });
  // отпуска: без типа и причины
  LEAVES.forEach(l=>{for(let d=fromIso(l.from);d<=fromIso(l.to);d=addDays(d,1))if(inR(d))push({d:iso(d),layer:'leave',title:l.name===me().name?'Мой отпуск':`В отпуске – ${l.name}`,sub:l.team,ref:{type:'leave',name:l.name,from:l.from,to:l.to}})});
  // мои смены
  const sh=me().shift;
  if(sh)for(let d=new Date(from);d<=to;d=addDays(d,1))if(sh.wd.includes(dow(d))&&!isMyLeave(d))push({d:iso(d),tm:sh.from,end:sh.to,layer:'shift',title:'Моя смена',sub:'Студия SE1',ref:{type:'shift',d:iso(d)}});
  // дни рождения и годовщины – только по согласию
  for(let y=from.getFullYear();y<=to.getFullYear();y++)BDAYS.forEach(b=>{const d=fromIso(`${y}-${b.md}`);if(inR(d))push({d:iso(d),layer:'birthday',title:`${b.k} – ${b.name}`,sub:'Показано с согласия сотрудника',ref:{type:'bday',name:b.name,k:b.k}})});
  // HR-даты – только HR и владелец
  if(r==='hr'||r==='owner')HRDATES.forEach(h=>{if(inR(fromIso(h.d)))push({d:h.d,layer:'hr',title:h.t,sub:h.s,alert:h.alert,ref:{type:'hr',t:h.t,s:h.s}})});
  return out.sort((a,b)=>a.d.localeCompare(b.d)||(a.tm||'').localeCompare(b.tm||''));
}
function isMyLeave(d){const t=iso(d);return LEAVES.some(l=>l.name===me().name&&l.from<=t&&t<=l.to)}
const NOW_MIN=10*60+30;
const fmtH=m=>`${Math.floor(m/60)} ч${m%60?` ${m%60} мин`:''}`;
function shiftInfo(d){const sh=me().shift;if(!sh||!sh.wd.includes(dow(d))||isMyLeave(d))return null;const plan=mins(sh.to)-mins(sh.from),k=iso(d),t=iso(TODAY),base={plan,from:sh.from,to:sh.to};
  if(k<t)return{...base,state:'done',fact:plan+[-10,5,0,10,-5][d.getDate()%5]};
  if(k===t)return{...base,state:S.clock.on?'on':'closed',since:hm(mins(sh.from)-2),fact:NOW_MIN-mins(sh.from)+2};
  return{...base,state:'plan',fact:null}}
function paidMeetings(from,to){const out=[];if(S.role!=='florist')return out;SERIES.filter(s=>s.paid).forEach(s=>occurrences(s,from,to).forEach(d=>{if(!onShift(d,s.time,s.dur)&&!blackoutOf(d))out.push({d,dur:s.dur,title:s.title})}));return out}
function weekHours(mon){let plan=0,fact=0;for(let i=0;i<7;i++){const x=shiftInfo(addDays(mon,i));if(x){plan+=x.plan;if(x.fact)fact+=x.fact}}return{plan,fact,meet:paidMeetings(mon,addDays(mon,6)).reduce((a,x)=>a+x.dur,0)}}
function onShift(d,time,dur){const sh=me().shift;if(!sh||!sh.wd.includes(dow(d))||isMyLeave(d))return false;const a=mins(time),b=a+dur;return a<mins(sh.to)&&b>mins(sh.from)}
/* свободные слоты адресата: окна → слоты, занятые скрыты, слоты на смене сотрудника недоступны */
function slotsFor(h){
  const days=[];
  for(let d=addDays(TODAY,1);daysBetween(TODAY,d)<=h.ahead;d=addDays(d,1)){
    if(blackoutOf(d))continue;
    const list=[];
    h.windows.filter(w=>w.wd===dow(d)).forEach(w=>{for(let a=mins(w.from);a+h.slot<=mins(w.to);a+=h.slot+h.buf){const t=hm(a);
      if(S.bookings.some(b=>b.host===h.id&&b.d===iso(d)&&b.t===t))continue;
      list.push({t,shift:onShift(d,t,h.slot)});
    }});
    if(list.length)days.push({d,list});
  }
  return days;
}
const LAYERS=[
  {k:'meeting',t:'Встречи',ic:'users'},{k:'commercial',t:'Праздники и пики',ic:'flag'},{k:'delivery',t:'Поставки',ic:'truck',roles:['florist','manager','owner']},
  {k:'booking',t:'1:1',ic:'chat'},{k:'leave',t:'Отпуска',ic:'sun'},{k:'shift',t:'Мои смены',ic:'clock',roles:['florist','manager']},
  {k:'birthday',t:'Дни рождения',ic:'gift'},{k:'hr',t:'HR-даты',ic:'lock',roles:['hr','owner']},
];
