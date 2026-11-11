# BRIEF – screens of the HR-role prototype (Floritta CRM)

Prototype = `shell.html` (tokens, components, demo data `D`, runtime `App`, helpers `H`, icons `ic()`) + one fragment per screen in `screens/NN-name.html`. `python3 build.py` glues them into `index.html`. Never edit `index.html` by hand; never edit `shell.html` (if you truly need a shared helper, put it at the top of your own fragment under a unique name).

## Fragment format

```html
<style>
/* scope EVERY rule under your screen root: #s-<id> … (root element id is s-<screen id>) */
#s-growth .ladder{…}
</style>
<script>
App.reg('growth',{
  title:'Growth',
  crumb:(p)=>'Growth',            // optional
  render(el,params){ el.innerHTML=`…`; /* bind events on el */ },
  notes:`<h4>Что это</h4><p>…</p>…`   // or (params)=>string
});
</script>
```

- `App.go(id,{id,tab})` navigates; links can use `data-go="<screen>"`, `data-person="<personId>" [data-tab="growth"]` (opens person card), `data-toast="text"` (shows a toast).
- `App.sheet(title, bodyHtml, footHtml)` – right drawer; `App.modal(title, body, foot)`; `App.toast(msg)`; `App.close()`; any element with `data-close` closes.
- `App.role` is `'hr' | 'admin' | 'employee'` – use it where visibility differs (e.g. private notes: author-only even for admin; money never shown to HR).
- Data: `D.people[]` (fields: id, name, role, team, type (key of `D.types`), start, mgr, lvl, ladder, cad, last, next, pulse[] (0–10, oldest→newest), status (active|probation|leave|onboarding), probEnd, leaveTo, bday, pdp{goal,pct}, train[done,total], att{shifts,late,abs,ot} (null for remote), ops{k,v,q,r} (non-financial work metric), kudos, skills{design,wedding,speed,care,coach on the CRM's 0–3 scale}, tags[], signals[{lvl:'bad'|'warn'|'info',t}]), `P(id)`, `D.ladders`, `D.events`, `D.ones` (1:1 meetings: who,d,time,status today|planned|done, agenda[{by:'emp'|'hr'|'auto',t}], actions[{t,owner,due,done}], summary), `D.notes` (HR notes: who,by,d,vis priv|hr|mgr|shared,cat,t,link{k,ref}), `D.kudos` (from,to,d,val,t), `D.values`, `D.pulseTeam`, `D.enps`, `D.teams`, `D.types`, `NOW` (Wed 11 Nov 2026 10:30 London), `fmtD('2026-11-13')` (Russian short date), `ago()`, `inDays()`, `plural(n,'день','дня','дней')`. Reuse this shared data so screens stay consistent; you may mutate it in place (e.g. push a new note) – other screens will then show it too.
- Helpers: `H.av(p,'s'|'l'|'xl')`, `H.who(p,sub?)`, `H.type(p)`, `H.skillNames` (labels for skill keys), `H.aiLabel()` («Черновик AI – проверьте перед использованием»), `H.chip(text,'ok'|'warn'|'bad'|'info'|'ink'|'line')`, `H.bar(pct,'ac'|'ok')`, `H.spark(values,{color})`, `H.pulseColor(v)`, `H.vis('priv'|'hr'|'mgr'|'shared')` (visibility badge), `H.sig(signal)`, `H.lvl(p)`, `H.tenure(p)`, `H.statusChip(p)`, `H.esc()`, `ic(name)` (icons: home users user chat sprout clip heart book cal chart spark shield phone lock eye plus x check arrow back flag note file star alert clock target mic send filter dots link gift truck flower code coin).
- Classes ready in shell: `.scr-h h1 .sub .acts`, `.eyebrow`, `.btn (.pr .ac .s .ghost)`, `.inp .sel .ta label.f`, `.chip`, `.card .ch h3 .r .cb`, `.grid .g2 .g3 .g4`, `.kpi .k .v .d`, `.av`, `.pr-line`, `.bar`, `table.t tr.clk`, `.tabs button.on`, `.seg button.on`, `.vis`, `.empty .muted .sm .row .sp .hr-line`, `.ai` (AI card), `.ai-tag`, `.lockbox`, `.callout (.ok .info)`.

## Rules

1. **Every button does something** – navigates, opens a sheet/modal, changes state in place, or at least shows a meaningful toast. No dead clicks.
2. **Only shell CSS variables** for colour (`--ink --graphite --grey --light --hair --silver --paper --accent --accent-dark --accent-bg --ok --ok-bg --warn --warn-bg --info --info-bg --v-good --v-mid --v-bad --v1..v4`). Radius 0. Fonts: display = `var(--f-display)` for big numbers / h1 only; body Jost.
3. **UI language: Russian** – exactly like the real CRM's Russian locale (sections «Команда», «Задачи», «Обучение», «Аналитика»; existing screens «Люди», «Мотивация», «Отпуск», «График», «Объявления», «Развитие», «Напарник», «Матрица навыков», «Замер знаний», «Спроси у CRM»). Short dashes «–», no emoji, sentence case. The right-hand Notes panel (`notes`) is Russian too. Notes structure: `<h4>Что это</h4>`, `<h4>Зачем HR</h4>`, `<h4>Откуда идея</h4>` (sources as `<span class="src">Lattice</span>`…), `<h4>Данные из нашей CRM</h4>` (what existing tables/screens feed it), `<h4>Приоритет</h4>` (`<span class="pri p1">MVP</span>` / `p2` «Следующий шаг» / `p3` «Позже»), optionally `<h4>Доступы</h4>`.
4. **Show what is reused vs new.** Where a block re-uses an existing CRM screen/table, mark it with a small chip `H.chip('уже есть в CRM','ok')` / `H.chip('доработать','warn')` / `H.chip('новое','info')` (sparingly – in card headers), and say it in notes.
5. **Fictional data only.** Use only people in `D.people` (all invented). No real names, phones, emails, addresses, pay rates. **No money anywhere for HR**: no £, revenue, pay, rates, bonus amounts. Bonuses may appear only as "eligible / not eligible" without sums, and better not at all.
6. **Privacy visible in UI**: every note/record shows its visibility badge (`H.vis`). Anonymous survey results show "min 5 responses" thresholds. AI outputs carry an "AI draft – check before use" label and never make decisions (suggest only).
7. Desktop target 1440×900; must not break at 1280 and must stack at <900px (use `.grid.g2/.g3/.g4` which collapse automatically; avoid fixed widths > 600px; tables inside `overflow:auto` wrappers).
8. Plain JS, no libraries. Charts = inline SVG you draw yourself (bars, lines, heatmaps). Keep each fragment ≤ ~60 KB.
9. No console errors. After writing, run `python3 build.py` and check your screens in a browser: serve with `python3 -m http.server <your port> --directory .` (ports given in your task) and open `http://localhost:<port>/index.html#<screen>`.
