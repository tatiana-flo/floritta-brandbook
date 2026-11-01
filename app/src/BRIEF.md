# BRIEF – прототип Floritta App (app/) для агентов-сборщиков экранов

Прототип клиентского приложения Floritta App в палитре сайта (брендбук `../../site/index.html`). Собирается из `shell.html` + `screens/NN-*.html` + `notes.html` скриптом `build.py` → `src/index.html`; основная сессия кладёт сборку в `app/index.html` (картинки `img/` лежат в `app/`, поэтому в `src/index.html` они не грузятся – это нормально).

## Структура файла экрана
Фрагмент HTML без `<html>/<head>/<body>`. Скрипты вырезаются сборкой и ставятся в конец документа, `window.App` в них уже есть.
```html
<style>/* стили со скоупом #s-<id> … */</style>
<section class="scr" id="s-<id>" data-nav="Имя в списке стенда" data-group="Группа" data-tab="home|shop|bag|account|community">
  <div class="appbar"><button class="ib" onclick="App.back()" aria-label="Back">…</button><div class="ttl">Title</div></div>
  <div class="scr-body">…</div>
</section>
<script>
(function(){
window.mount_<id с _ вместо ->=function(params){ … };
})();
</script>
```
`data-nav` – подпись в левом списке стенда (нет – в список не попадает); `data-group` – группа; `data-tab` – подсвеченная вкладка таббара (нет – таббар скрыт); `data-flag="bloomLive"` – экран за флагом (в списке полупрозрачный, пока флаг выключен). Классы – смотреть в `shell.html` и соседних экранах.

## Рантайм `window.App` (шелл)
- Состояние: `App.state.{flags, petals, bag[], fav:Set, history, current, user:{name,postcode,area}}`.
- Каталог: `window.PRODUCTS` (13), `window.ADDONS`, `window.FLORISTS` (3), `window.PETALS`; `App.product(id)`, `App.card(p)`, `App.miniCard(p)`, `App.tags(p)`, `App.stars(n)`, `App.fmt(n)` → `£45`, `App.nextDays(n)`, `App.dateLabel(d)`.
- Корзина: `App.addToBag(id,{size,addons,qty})`, `setQty, removeLine, bagCount, lineTotal, subtotal, deliveryFee, discount, total, clearBag`; `App.toggleFav(id)`; `App.addPetals(n)`.
- Навигация: `App.go(id, params, {replace})`, `App.back(fallback)`, `App.tab(name)`.
- Оверлеи: `App.sheet(html,{full,onOpen})`, `App.closeSheet()`, `App.confirm(title,text,okLabel,onOk)`, `App.toast(msg,{action,fn})`, `App.haptic()`, `App.icon(name)`.
- Модули экранов: `window.Shop.*` (openCat, quick, sortSheet, filterSheet, search), `window.Comm.*` (лента, пост, участник, compose), `window.Extras.*` (напоминания rem*, подписки sub*, конструктор bd*, Flora flSend, уведомления nt*), `window.PDP`, `window.TRK`, `window.Bloom`.
- Событие `document.addEventListener('screen', e => e.detail.{id,params})`.

## Правила
1. Пишешь только свои файлы экранов (`screens/NN-*.html` из задания) и свой `notes-<имя>.txt`. `shell.html`, `build.py`, `notes.html`, чужие экраны – не трогать. Нужно что-то в шелле – строка в отчёте.
2. Стиль – только классы и CSS-переменные шелла: радиус 0, без теней, своих hex, градиентов, курсива, эмодзи. Акцент `--accent` – только скидки, ошибки, «sale».
3. Каждая кнопка что-то делает (`App.go / sheet / confirm / toast`). Мёртвых кнопок нет.
4. Данные вымышленные: клиент «Tatiana, SE1 5SY» из `App.state.user`, телефоны `+44 7700 900xxx`, адреса выдуманные, карты только «•••• 4242», без реальных ключей.
5. **ID реестра в HTML-комментариях – обязательно:** `<!-- ids: APP-XXX-001 APP-XXX-002 -->` у блока, где функция действительно показана. Скрипт покрытия ищет ID только в комментариях.
6. Размер файла – до 150 КБ; больше – второй файл `NN-<имя>-2.html`.
7. Новые `id="s-…"` – уникальные, с префиксом своей зоны (`s-ck-…`, `s-acc-…`); сборка падает на дубле.
8. Телефон: стенд показывает экран в рамке 390×844. Проверять каждый экран; консоль без ошибок.
