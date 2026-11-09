# BRIEF – прототип Floritta Team (staff/) для агентов-сборщиков экранов

Прототип приложения сотрудников Floritta Team в палитре сайта (брендбук `../../site/index.html`). Собирается из `shell.html` + `screens/NN-*.html` + `notes.html` скриптом `build.py` → `src/index.html`; основная сессия кладёт сборку в `staff/index.html` (картинки `img/` лежат в `staff/`, поэтому в `src/index.html` они не грузятся – это нормально).

## Структура файла экрана
Фрагмент HTML без `<html>/<head>/<body>`. Экраны и стили – статично, скрипты вырезаются сборкой и ставятся в конец документа (после шелла), поэтому `window.App` и данные шелла в скрипте уже есть.
```html
<style>/* стили со скоупом #s-<id> … */</style>
<section class="scr" id="s-<id>" data-nav="Имя в списке стенда" data-group="Группа" data-tab="home|tasks|work|learn|me">
  <div class="appbar"><button class="ib" onclick="App.back()" aria-label="Back">…</button><div class="ttl">Title</div></div>
  <div class="scr-body">…</div>
</section>
<script>
(function(){const A=window.App;
window.mount_<id с _ вместо ->=function(params){ … };
})();
</script>
```
`data-nav` – подпись в левом списке стенда (нет атрибута – экран в список не попадает); `data-group` – группа в списке; `data-tab` – какая вкладка таббара подсвечена (нет – таббар скрыт, экран «внутренний»); `data-scrolltop="keep"` – не сбрасывать прокрутку. Готовые классы смотреть в `shell.html` (appbar, ib, ttl, card, row, btn, btn-ink, pill, chip, seg, kpi, grp, list, empty, sheet…) и в соседних экранах.

## Рантайм `window.App` (шелл)
- Состояние: `App.state.{me, current, params, history}`; `App.NOW` (вт 20 окт 2026, 11:12, London), `App.T(h,m,dayOffset)`.
- Люди: `App.user(id)`, `App.me()`, `App.role()` → `owner|manager|florist|courier`, `App.isTrainee()`, `App.setUser(id)`; персоны стенда – `window.PERSONAS` (Zhanna · casual worker, Lola · reserve, Mina · self-employed florist, Katrina · florist, Anton · courier, Vanessa · manager, Ayla · trainee, Devon · self-employed courier, Sam · freelance, Tatiana · admin/owner). Контур – поле `engagement` у `window.STAFF[i]` (employee / worker / contractor / reserve).
- Данные: `window.STAFF, TASKS, ORDERS, SCHEDULE, LESSONS, ANNOUNCEMENTS, TEMPLATES, ROUTE, PATHS, REVIEW_CARDS, FL`. Свои демо-данные – только внутри своего `<script>` с префиксом файла (`const T55_…`).
- Формат: `App.fmt(n)` → `£12`, `fmtTime, fmtDay, fmtDue, isLate, timeAgo, nextDays`.
- Вёрстка: `App.icon(name)` (inline SVG stroke 1.5; список в шелле), `App.avatar(user,'--sm|--lg')`, `App.pill(status)`, `App.opill(order)`, `App.ring(pct)`, `App.taskCard(t)`, `App.lessonCard(l)`, `App.orderCard(o)`.
- Навигация: `App.go(id, params, {replace})`, `App.back(fallback)`, `App.tab(name)`.
- Оверлеи: `App.sheet(html,{full,onOpen})` – нижняя шторка, `App.closeSheet()`, `App.confirm(title,text,okLabel,onOk)`, `App.toast(msg,{action,fn})`, `App.push(title,body,{go})` – превью пуша + запись в Inbox, `App.haptic()`.
- Домен: `App.setTaskStatus, toggleCheck, attachPhoto, addComment, addTask, ack(announcement), completeLesson, setLessonProgress, clock(), readNotif, unread(), renderBadges()`.
- События: `document.addEventListener('screen', e => e.detail.{id,params})`, `'user'` при смене персоны.

## Правила
1. Пишешь только свои файлы экранов (`screens/NN-*.html` из задания) и свой `notes-<имя>.txt`. `shell.html`, `build.py`, `notes.html`, чужие экраны – не трогать. Нужно что-то в шелле – строка в отчёте.
2. Стиль – только классы и CSS-переменные шелла: радиус 0, без теней, своих hex, градиентов, курсива, эмодзи. Акцент `--accent` – только ошибки, просрочки, «срочно». Заголовки Cormorant Infant капсом – через готовые классы.
3. Каждая кнопка что-то делает (`App.go / sheet / confirm / toast / push`). Мёртвых кнопок нет.
4. Данные вымышленные: люди только из `window.STAFF`, телефоны `+44 7700 900xxx`, адреса клиентов выдуманные, без реальных токенов и ключей.
5. **ID реестра в HTML-комментариях – обязательно:** `<!-- ids: TM-XXX-001 TM-XXX-002 -->` у блока, где функция действительно показана. Скрипт покрытия ищет ID только в комментариях.
6. Размер файла – до 150 КБ; больше – второй файл `NN-<имя>-2.html`.
7. Новые `id="s-…"` – уникальные, с префиксом своей зоны (`s-stk-…`, `s-rs-…`); сборка падает на дубле.
8. Телефон: стенд показывает экран в рамке 390×844. Проверять каждый экран и персоны, которым он виден; консоль без ошибок.
