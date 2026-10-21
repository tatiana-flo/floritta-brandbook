# BRIEF – ТЗ для агентов-сборщиков экранов CRM Floritta (редизайн 2026-10)

Папка: `~/Documents/Claude/Floritta_Brain_Main/Дизайн-и-брендинг/CRM_Redesign_2026-10/`.
Перед работой прочитать: этот файл, `shell.html` (целиком – токены, CSS-классы, демо-данные, рантайм `App`), `research/01_audit_frontend.md`, `research/02_audit_domain.md`, `research/03_benchmark.md`. Эталон архитектуры – `../../../..` не нужен: всё, что надо, уже в `shell.html`.

## Жёсткие правила
1. Пишешь ТОЛЬКО свой файл `screens/NN-*.html`. Ничего больше не правишь (ни `shell.html`, ни чужие экраны, ни `build.py`). Нужно что-то в шелле – напиши в отчёте, строкой «что поменять в шелле».
2. Файл – фрагмент HTML (без `<html>/<head>/<body>`), не больше 70 КБ. Структура:
   ```html
   <style>/* все стили со скоупом #s-<id> … */</style>
   <section class="scr" id="s-<id>" data-nav="Имя в списке стенда" data-group="Группа" data-title="Заголовок топбара" data-roles="owner manager florist" data-parent="orders">
     <div class="scr-head">…</div>   <!-- опционально: фильтры, вкладки, кнопки -->
     <div class="scr-body">…</div>   <!-- прокручиваемое тело; .flush – без паддинга -->
   </section>
   <script>
   window.mount_<id с _ вместо ->=function(params){ … };
   document.addEventListener('orders',()=>{if(App.state.current==='<id>')window.mount_<id>(App.state.params)});
   </script>
   ```
   `data-roles` – кому экран доступен (пропуск = всем). `data-parent` – id пункта сайдбара, который подсвечивать (для вложенных экранов). `data-group` – группа в левом списке стенда (одинаковая для всех экранов файла). `data-sub` – серая подпись рядом с заголовком.
3. Build: `python3 build.py` склеивает `shell.html` + `screens/*.html` + `notes.html` в `index.html`. Смотреть ТОЛЬКО собранный `index.html` через свой http-сервер: `python3 -m http.server <твой порт> --directory "<папка>"` и встроенный браузер `http://localhost:<порт>/index.html#<id>`. Порты: 01 → 8711, 02 → 8712, 03 → 8713, 04 → 8714, 05 → 8715, 06 → 8716, 07 → 8717. Чужие порты не трогать. Сервер, если уже поднят на твоём порту, переиспользуй.
4. Каждая кнопка что-то делает: меняет состояние через `App.*`, открывает шторку/модалку/поповер или показывает `App.toast('…')`. Мёртвых кнопок нет. Ссылки на экраны, которых нет в прототипе, – `App.go('<id>')` покажет тост «not in this prototype yet», это допустимо для редких второстепенных пунктов.
5. Стиль – только классы и CSS-переменные из `shell.html`. Никаких своих цветов, hex, градиентов, теней, скруглений. Радиус 0 везде. Иконки – `App.icon('name')` (список в `ICONS` в шелле) или свой inline SVG stroke 1.5. Без эмодзи. Шрифты: заголовки и KPI – `.h1/.h2/.h3/.kpi`, остальное Jost через наследование. Цифры в таблицах – класс `tnum`/`num`.
6. Тексты интерфейса – British English, коротко. Данные только из `App.data` (40 заказов, 12 сотрудников, 25 клиентов, 30 товаров, 8 чатов, 8 задач, 17 позиций склада). Нужны свои демо-данные (смены, уроки, бонусы, поставки) – объявляй их внутри своего `<script>` с префиксом файла (`const T7_SHIFTS=…`), только вымышленные, сотрудники – только имена.
7. Проверить в браузере все свои экраны: роли Owner / Manager / Florist (`App.setRole`), темы Ivory / Ink, плотность, размеры Desktop 1440 / iPad 1024 / Phone 390. Консоль без ошибок. На iPad всё должно быть рабочим; на Phone – читаемым (можно упростить раскладку через `[data-size="phone"] #s-<id> …`).
8. Не слать скриншоты пользователю и не писать ему в чат. Не коммитить, не пушить, в интернет не ходить.
9. Отчёт в конце – ровно 6 строк: экраны; что работает; роли; что не доделано; что нужно поменять в шелле; размер файла.

## Что даёт шелл (`window.App`)
- Данные: `App.data.{orders,staff,customers,products,convos,tasks,inventory,slots}`; `App.NOW` (вт 21 окт 2026, 10:42), `App.T(h,m,dayOffset)` → ISO.
- Хелперы: `App.$ / App.$$`, `App.user(id)`, `App.me()`, `App.role()` (`owner|manager|florist`), `App.isMgr()`, `App.fmt(n)` → `£120`, `App.fmtTime/fmtDay/fmtDate/timeAgo`, `App.isLate(order)`, `App.customer(id)`, `App.product(id)`, `App.order(id)`, `App.esc(s)`.
- Вёрстка: `App.icon(name)`, `App.pill(status[,label])` (статусы `queue making photo ready out delivered cancelled todo doing review done late urgent paid unpaid partial`), `App.orderPill(order)` (учитывает просрочку), `App.avatar(staffId,'--s|--l|--ink')`, `App.chanTag(chan)`.
- Навигация: `App.go(id, params)`, `App.back()`.
- Оверлеи: `App.sheet({eyebrow,title,tabs,body,foot,head,wide,narrow,flush,back,onMount})` – правая шторка; `App.closeSheet()`; `App.modal({title,body,foot,wide})`, `App.confirm(title,text,cta,fn,{danger})`, `App.closeModal()`; `App.pop(event, [ 'Заголовок', {t,ic,fn,cls}, '-' ])` – поповер-меню; `App.toast(msg[,action,fn])`; `App.push(title,body,{icon,go,type})` – пуш-превью + запись в центр уведомлений.
- Палитра ⌘K: `App.palette()`; свои команды – `App.registerCommands([{g:'Actions',t:'…',ic:'…',fn}])` при mount.
- Домен (мутируют данные, шлют событие `orders`, перерисовывают бейджи сайдбара): `App.setOrderStatus(id,status,{note,courier,florist,silent})`, `App.assignFlorist(id,staffId)`, `App.assignCourier(id,staffId|'Uber Direct')`, `App.markPaid(id)`, `App.cancelOrder(id)`, `App.addOrder({customer,product,size,total,chan,slot,type,addr,recipient,card,notes,paid})` → заказ, `App.sendPhoto(id)`, `App.paymentLink(id)`, `App.emit('orders')`.
- Общие шторки: `App.openOrder(id[, 'summary'|'chat'|'history'])` – карточка заказа (статусы, оплата, фото, допы, чат с Flora, история, меню «…»); `App.openCustomer(id)`. Использовать их, а не рисовать свою карточку заказа.
- Подписка на изменения: `document.addEventListener('orders', …)`; свои события – `App.emit('tasks')` и т.п.
- Заказ: `{id, n (0 сегодня, 1 завтра, −1 вчера), customer, product, size, addons[], chan, status, paid, total, delivery, type (delivery|collection), slot '10:00–12:00', date, addr, recipient, card, florist, courier, photo, photoSent, placed, notes, problem, late, log[]}`.

## Общие паттерны (из бенчмарка, соблюдать)
- Список слева – карточка в правой шторке (не модалка). Модалка только для подтверждений и коротких форм.
- Таблица: `.toolbar` (поиск, чипы-фильтры, сегмент вид) → `.views` (сохранённые виды с счётчиками) → `.tbl-wrap > table.tbl` (строка 44/36, hover-действия `.acts`, чекбоксы → `.bulk`-панель). Сортировка по клику на `th.sort`.
- Kanban – `.kanban > .kcol > .k-head + .k-body > .kcard`. Перетаскивание не нужно: кнопка «→ next» на карточке / в шторке.
- Пустые состояния – `.empty` с иконкой, заголовком и одним действием.
- Просрочка/проблема – `--accent` (только для этого), готово – `--ok`, на проверке – `--warn`.
- Всё время – Europe/London, слоты из `App.SLOTS`. Магазин 80 Willow Walk, Bermondsey SE1 5SY, 8:00–22:00, same-day до 22:00. Маркетплейсы Deliveroo и Uber Eats. Цветы RFH вт/чт/сб. Бухгалтерия Xero.

## Нарезка экранов по файлам

### 01-today.html · порт 8711 · группа «Today»
- `s-today` (все роли). Менеджер/владелец: верхняя строка KPI (`.grid.g4 > .kpi-card`): заказов сегодня / выручка дня / просрочки (accent) / непрочитанных в инбоксе – клик ведёт на экран. Блок «Needs you now» – список проблем: просроченные заказы, неоплаченные с близким слотом, проблемы доставки, просроченные задачи, низкий склад – каждая строка открывает заказ/экран. «Orders by slot» – 7 слотов горизонтально с мини-барами (queue/making/ready/out) и кликом на слот → `App.go('orders',{slot})`. «On shift now» – аватары с ролями и что делают (кол-во заказов в работе). «Tomorrow» – кол-во заказов и первые слоты. Флорист видит: мои заказы в работе, следующий в очереди, мои задачи, обучение на сегодня – проще и крупнее (iPad у стола).
- Зарегистрировать команды палитры «Open today's late orders» и т.п.
- Владелец дополнительно: мини-блок «Week» (выручка 7 дней `.bar`) и «Marketplaces» (Deliveroo/Uber Eats сегодня).

### 02-orders.html · порт 8712 · группа «Orders»
- `s-orders` (все роли; флорист видит только сегодня/завтра без сумм). Виды: Today · Tomorrow · Unpaid · Problems · Marketplaces · All · + «Save view». Тулбар: поиск, чипы слот/статус/канал/тип, сегмент «Table | Board», плотность наследуется. Таблица: #, customer (+ recipient под ним), product (+ size, add-ons), slot, status (`orderPill`), paid, channel, florist/courier аватары, total. Клик по строке → `App.openOrder`. Чекбоксы → bulk: print tickets, assign florist, mark paid, export. Клавиша `j/k` по строкам, `enter` открыть – по желанию. Params: `{open:id}` – открыть заказ сразу, `{slot}` – фильтр по слоту, `{view}`.
- `s-order-new` (owner, manager; флористу – тоже, для Walk-in): форма приёма заказа по телефону одной страницей в две колонки: слева клиент (поиск по телефону/имени с автоподстановкой из `App.data.customers`, новый клиент), получатель, адрес/самовывоз, дата+слот (чипы), карточка; справа – товар (поиск по каталогу с фото, размер Standard/Deluxe/Grand, допы чипами с ценой), итог с доставкой, оплата (ссылка Stripe / оплачено наличными / по счёту), канал. Кнопка «Create order» → `App.addOrder` → toast → `App.openOrder(newId)`. Params `{customer:id}` – предзаполнить.

### 03-production.html · порт 8713 · группа «Production»
- `s-production` (все роли). Kanban Queue → Making → Photo → Ready (4 колонки) на сегодня, фильтр по слоту и флористу; карточка: #, product+size, slot, флорист-аватар, иконка допов/карточки, accent-полоса если поздно. На карточке действия: «Take» (флорист берёт себе → `assignFlorist(id, me)`), «→ Photo», «→ Ready». Клик по карточке → `App.openOrder`. Верхняя полоса «Who's making what»: флористы в смене с кол-вом в работе и загрузкой (`.progress`). Вкладка/сегмент «Photo check»: сетка фото 4:5 на проверке (status photo) – «Approve & send» (`App.sendPhoto`) / «Retake» (status → making с note). Флорист: по умолчанию фильтр «mine» + крупные кнопки для iPad.
- `s-ready-now` (все роли, `data-parent="production"`). Витрина «Ready now» – готовые одноразовые букеты, опубликованные на сайт: сетка фото, цена, кто сделал, статус «On site / Sold / Hidden», кнопка «Publish a bouquet» (модалка: фото-плейсхолдер из `img/`, название, цена, кол-во) → добавляет карточку, toast «Published to floritta.uk». Params `{new:true}` – сразу открыть модалку.

### 04-delivery.html · порт 8714 · группа «Delivery»
- `s-delivery` (owner, manager). Диспетчер: слева список заказов на доставку сегодня, сгруппированных по слоту (ready/out/delivered), с адресом, курьером, проблемой (accent). Центр – `.map` плейсхолдер с пинами (магазин SE1 и адреса; цвет = статус), клик по пину открывает заказ. Справа/низ – курьеры: Daniel (van), George (bike), Omar (freelance) с кол-вом остановок, ETA, статус; «Runs» – рейсы: создать рейс из выбранных заказов (чекбоксы → «Create run» → `assignCourier` на каждый, toast, пуш курьеру), «Call Uber Direct» (модалка: заказ, цена ~£9, ETA, кнопка → `assignCourier(id,'Uber Direct')`). Блок «Problems»: заказы с `problem` – «Call recipient», «Resolve», «Return to shop». Сегмент Map | List для iPad. Params `{open:id}` – открыть заказ, `{uber:true}` – открыть модалку Uber.

### 05-inbox.html · порт 8715 · группа «Inbox & Customers»
- `s-inbox` (owner, manager). Трёхколоночный `.split.--3`: слева список чатов (фильтры All / Unread / Mine / Unassigned, иконки каналов WhatsApp/Instagram/Email/Website chat, непрочитанные жирнее), центр – переписка (пузырьки, поле ввода, шаблоны-поповер, вложение фото), снизу «Flora suggests» – подсказка из `convo.flora` с кнопками «Send» / «Edit» / «Dismiss»; справа – контекст: карточка клиента (кнопка → `App.openCustomer`), связанный заказ (`App.openOrder`), быстрые действия «Send payment link» (`App.paymentLink`), «New order» (`App.go('order-new',{customer})`), «Assign to» (поповер). Отправка сообщения добавляет пузырёк и снимает unread. Params `{id}` – открыть чат, `{customer}` – чат клиента. На iPad – две колонки (контекст в шторке), на телефоне – одна.
- `s-customers` (owner, manager). Таблица клиентов: имя, телефон, теги (VIP/Corporate/Subscriber/Repeat), заказов, потрачено, последний заказ, повод+дата; виды All · VIP · Corporate · Birthdays this month · No email; поиск; клик → `App.openCustomer`. «Add customer» – модалка.

### 06-catalog.html · порт 8716 · группа «Catalog & Stock»
- `s-catalog` (все роли; флорист – только чтение и состав). Сетка/таблица товаров (сегмент), фото 4:5, название, категория, цена, размеры, активен (switch), остаток. Клик → шторка товара: фото, цены по размерам (inline-редактирование), состав букета (BOM) таблицей «стебель · кол-во · себестоимость», итог себестоимости и маржи, «Duplicate», «Hide from site». Params `{open:id}`.
- `s-stock` (все роли). Склад: таблица `App.data.inventory` – позиция, ед., остаток, par, следующая поставка, себестоимость; строка ниже par – accent; виды All · Low · Flowers · Sundries · Helium. Кнопки «Receive delivery» (модалка: RFH поставка вт/чт/сб – список позиций с кол-вом, «Receive all» → увеличивает qty, toast), «Write-off» (модалка причина), «Stocktake» (режим инлайн-ввода факта по строкам, «Apply»). Блок «Shop floor» – что на витрине сейчас (3–5 позиций, read-only для флориста).
- `s-purchasing` (owner, manager; `data-parent="stock"`). Закупки: заказы RFH по дням (Tue/Thu/Sat) со статусами Draft / Sent / Confirmed / Received, строки позиций, сумма; «New order from low stock» – собирает позиции ниже par.

### 07-team.html · порт 8717 · группа «Team & Business»
- `s-team` (все роли). Вкладки (сегмент) Schedule · Timesheet · Bonus. Schedule – недельная сетка сотрудники × дни с сменами (`T7_SHIFTS`), клик по ячейке – поповер (shift / off / swap); две сетки часов: флористы 08–17 / 13–22, линия 10–19. Timesheet – табель на утверждение (менеджер: «Approve all»). Bonus – командный котёл и личная строка (флорист видит только свою).
- `s-tasks` (все роли; `data-parent="tasks"`). Доска задач To do · In progress · To check · Done из `App.data.tasks` + «Mine / Team» фильтр, «New task» (модалка; params `{new:true}`), карточка задачи в шторке (чеклист, фото, комментарий, «Done»/«Approve»).
- `s-learning` (все роли). Матрица допусков: сотрудники × навыки (Wrap · Hand-tied · Sympathy · Helium · Till · Van) – точки ok/warn/empty, клик → поповер «Mark passed / Schedule check»; список уроков на сегодня (3-minute lesson), quiz of the day кнопка; для стажёра – buddy check-ins.
- `s-growth` (owner). Обзорно, одним экраном с сегментом Analytics · Upsell · Marketing · SEO · Content: KPI-карточки, бар-чарт 7 дней, таблица каналов, промокоды, топ-страницы SEO. Без глубины, но все кнопки с тостами.
- `s-settings` (owner). Настройки: General (магазин, часы, cut-off), Team & roles (таблица пользователей с ролью и переключателем «New design (beta)» – тот самый личный тумблер `users.theme`), Integrations (Stripe, WhatsApp, Deliveroo, Uber Eats, Uber Direct, Xero, Expo push, Telegram – статус точкой, «Reconnect»), Notifications, Appearance (тема/плотность – зовут `App.setTheme/setDensity`).

## Заметки для правой колонки стенда
Не пиши `notes.html` – это сделает основная сессия. В отчёте укажи 2–4 строки «что взяли у кого и зачем» по своим экранам (например: «Orders – сохранённые виды как в Linear; bulk-панель как в Shopify»).
