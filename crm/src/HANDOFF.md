# Хендофф: редизайн CRM Floritta – 21.10.2026

Для коллеги, которая продолжает работу на другом компьютере. Всё нужное лежит в двух репозиториях GitHub, локальные папки Tatiana не нужны.

## Где что

| Что | Где |
|---|---|
| Прототип (смотреть) | https://tatiana-flo.github.io/floritta-brandbook/crm/ |
| Концепция (смотреть) | https://tatiana-flo.github.io/floritta-brandbook/crm/concept.html |
| Схемы (смотреть) | https://tatiana-flo.github.io/floritta-brandbook/crm/diagrams.html |
| Исходники прототипа | репо `tatiana-flo/floritta-brandbook`, папка `crm/src/` (`shell.html`, `screens/01…08-*.html`, `notes.html`, `build.py`, `BRIEF.md`) |
| Опубликованные файлы | тот же репо, `crm/index.html`, `crm/concept.html`, `crm/diagrams.html`, `crm/img/`, `crm/logo.svg` |
| Концепция текстом | эта папка, `Концепция_CRM_2026-10.md` |
| ТЗ для сборщиков экранов | эта папка, `BRIEF.md` (копия `crm/src/BRIEF.md`) |
| Ресёрч | эта папка, `research/01_audit_frontend.md`, `02_audit_domain.md`, `03_benchmark.md`, `04_audit_analytics.md` |

Репо брендбука публичный – туда только демо-данные, никаких реальных клиентов, телефонов, ключей. Ресёрч с путями кода CRM лежит здесь, в приватном `floritta-shared`, а не в брендбуке.

## Как устроен прототип и как его править

1. Клонировать: `gh repo clone tatiana-flo/floritta-brandbook ~/floritta-work/floritta-brandbook` (вне `~/Documents`, чтобы не грузить iCloud).
2. Править только `crm/src/shell.html` (токены, общие компоненты, демо-данные, рантайм `App`) и `crm/src/screens/NN-*.html` (по экрану на файл). `index.html` руками не править – он собирается.
3. Собрать: `cd crm/src && python3 build.py`, затем `cp index.html ../index.html`.
4. Посмотреть: `python3 -m http.server 8710 --directory crm/src` → http://localhost:8710/index.html. Всегда смотреть собранный `index.html`, фрагменты `screens/*.html` сами по себе не открываются.
5. Опубликовать: `git add crm && git commit && git pull --rebase && git push` в `main`. GitHub Pages пересобирается около минуты; статус – `gh api repos/tatiana-flo/floritta-brandbook/pages/builds/latest`.
6. После `concept.html` правок – держать в синхроне с `Концепция_CRM_2026-10.md` здесь.

Правила для экранов и API `App` – в `BRIEF.md`. Коротко: каждая кнопка что-то делает; только CSS-переменные шелла; радиус 0; British English в интерфейсе; данные вымышленные; проверять роли Owner / Manager / Florist, плотности и размеры MacBook 13" / iPad 11" / Phone.

## Что сделано (на 21.10.2026)

- **17 экранов в 8 файлах:** Today; Orders, New order; Production, Ready now; Delivery; Inbox, Customers; Catalog, Stock, Purchasing; Team, Tasks, Learning, Growth, Settings; Analytics.
- **Новая IA:** 28 пунктов меню → 14: Today · Orders · Production · Delivery · Inbox · Customers · Catalog · Stock · Team · Tasks · Learning · Analytics · Growth · Settings.
- **Общее:** карточка заказа – одна правая шторка на всех экранах; палитра ⌘K; горячие клавиши; сохранённые виды; уведомления; мини-фото у каждого заказа; календарь заказов на Orders (кнопка Calendar и вид Week).
- **Analytics:** 14 подразделов, сведена вся текущая аналитика CRM (29 вкладок) плюс статистика карточек товара, UTM, блог, маркетплейсы. Инвентаризация – `research/04_audit_analytics.md`. В карточке товара отдельная вкладка Stats.
- **Проверка:** все экраны × 3 роли × 3 размера × 2 плотности без ошибок в консоли.

## Решения Tatiana (не пересматривать без неё)

- Фон Ivory осветлён: paper `#fdfbf8`, панель `#faf7f2`, silver `#f5f1eb`, hair `#e8e2d9`. Брендбук сайта пока остаётся на `#faf7f2`.
- Акцент – **Petal `#c98c91`** (hover `#bd7f85`, светлый фон выделения `#f6e4e5`, текст на светлом `#9c646b`). Чёрной заливки (ink) нет нигде: кнопки, активное меню, чипы, переключатели, прогресс, bulk-панель, тост, пузырьки чата. Ink – только текст. Красный `#b4595f` – только просрочки и ошибки.
- Тёмной темы нет. Остаются темы `ivory` и `bloom` (откат), остальные шесть нынешних тем CRM снять.
- Основное устройство в магазине – MacBook 13" (1440 × 900); iPad 11" – проверочный размер.
- Tasks отдельно, Active → Team · Bonus. Workshops не отдельный раздел: вид в Orders + товары в Catalog.
- Курьеру минимальный веб: My deliveries + Schedule.
- Flora: «Send» без правки только для простых намерений (статус, часы, адрес), остальное через Edit.
- Плотность по умолчанию comfortable 44 px. Флорист стартует в Production с фильтром Mine.
- Внедрение: новая тема `ivory` через существующие CSS-переменные и `users.theme` как личный тумблер «New design», без A/B. Порядок в концепции, раздел 7–8.

## Что осталось (по приоритету)

1. **Хвосты после решений.** На стенде остался переключатель Accent с вариантами (Ink, Graphite, Sage, Dusty…Powder) – после окончательного «да» Tatiana убрать его и оставить Petal зашитым в `:root`. В `shell.html` остался блок `[data-theme="ink"]` – удалить. В `concept.html` (раздел 6 «тёмная тема Ink») и `diagrams.html` (схемы IA на 13 разделов, упоминания Ink) – обновить под решения выше: 14 разделов, без тёмной темы, Petal.
2. **Сквозные фильтры.** Analytics и Today передают параметры, которые соседние экраны пока не применяют: `orders {chan, utm, promo, source}`, `customers {view, rfm}`, `inbox {chan, assigned, view}`, `production {florist, tab}`, `team {who}`, `purchasing {new}`. Экран открывается, но без фильтра.
3. **Дельты в Analytics** – сейчас детерминированные демо-числа, не расчёт по демо-дням. Для прототипа терпимо.
4. **Ждём от Tatiana:** список метрик, которых не хватает в Analytics; утверждение `#fdfbf8` и Petal как токенов CRM в брендбуке.
5. **Код CRM не трогали.** Фаза 0 внедрения (тема `ivory` + тумблер) – отдельная задача в `floritta-crm` по правилам этого репо (ветка от `origin/develop`, merge в `develop`, без PR). Начинать только по слову Tatiana.

## Грабли, на которые уже наступили

- Весь CSS шелла – в одном `<style>` до `</head>`; обёртке экрана `overflow:clip`, не `hidden`.
- Браузер кеширует `index.html` – при проверке добавлять `?v=N` к адресу.
- Параллельные агенты делят одну вкладку встроенного браузера – каждому свой порт (8711–8718).
- `App.sheet` открывает шторку в следующем кадре: проверка `classList` сразу после вызова ложно отрицательная.
- Даты заказов считаются от `NOW` = вт 20.10.2026 10:42 (London); в шелле дата берётся как `T(12,0,n)`, чтобы не съезжать на вчера из-за UTC.
