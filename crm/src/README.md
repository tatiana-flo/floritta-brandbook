# Источники прототипа CRM

> ⚠ **С 01.11.2026 палитра – как на сайте** (решение Tatiana): фон `#fdfdfd`, подложка `#f2f2f4`, линии `#e6e6e6`, текст и основная кнопка `#1e1a17`, акцент `#b4595f`. Ivory и Petal ниже – история, не канон. Эталон – `../../site/index.html`.

> **С 17.11.2026 раздел «Доставка» – в виде Stage + viz** (релиз CRM `v2026.11.17-delivery-stage`): серебряная подложка, белые блоки, полоса показателей, графики только тональной шкалой чернил `--viz-1…4` (ink / graphite / grey / light – палитра та же). Компоненты – блок «STAGE + VIZ» в `shell.html` (CSS + помощники `VIZ.*`), экраны – `screens/15-delivery-stage.html`, правила – `DELIVERY_STAGE.md`.

`python3 build.py` в этой папке собирает `index.html` из `shell.html` + `screens/*.html` + `notes.html`; результат копировать на уровень выше (`crm/index.html`). ТЗ для экранов – `BRIEF.md`. Данные только демо.
