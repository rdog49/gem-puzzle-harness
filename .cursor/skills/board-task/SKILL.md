---
name: board-task
description: Читает одну задачу доски GitHub, пишет план и держит человека только на согласовании и финальном pull request. Use when the user mentions a GitHub issue, board, backlog, канбан, or asks to look at a task.
---

# Задача с доски

Источник работы — issue в `rdog49/gem-puzzle-harness`. Колонки доски — метки:

- `board:backlog` — ещё не брали
- `board:in-progress` — план согласован, идёт работа
- `board:in-review` — проверка прошла, ждёт pull request человека
- `board:done` — человек влил pull request

## Прочитать задачу

```bash
gh issue view NUMBER
gh issue list --label board:backlog --limit 30
```

Бери одну задачу. Если человек не назвал номер, покажи бэклог и жди номер.

## Ответ до кода

Пиши по этой форме и останавливайся:

```markdown
## Задача
#NUMBER — название

## Описание
Что получит игрок, своими словами.

## Как сделаю
1. Шаги только этого объёма.
2. Какие скиллы применяю.
3. Какие файлы появятся или изменятся.

## Проверка
- Критерии из issue, которые закроет эта работа.

## Ветка
feat/gp-XX-slug → pull request в ветку процесса.

Жду согласие или правки. До ответа файлы не меняю.
```

Согласие: «делай», «согласен», «ок», «поехали» и прямые синонимы. Правка без такого слова обновляет план, работа не стартует.

## После согласия

1. Сними `board:backlog`, поставь `board:in-progress`.
2. В этом же чате выполни coder, затем evaluator.
3. После успешной проверки сними `board:in-progress`, поставь `board:in-review`.
4. Напиши человеку базу, имя ветки, заголовок pull request и строку `Closes #NUMBER`. Дальше действует человек.

```bash
gh issue edit NUMBER --remove-label board:backlog --add-label board:in-progress
gh issue edit NUMBER --remove-label board:in-progress --add-label board:in-review
```

Не ставь `board:done` и не закрывай issue. Это делает влитие pull request.

## Границы

- База ветки — `feat/single-chat-board`, пока её не влили в `main`. Потом база — `main`.
- Не трогай `feat/cursor_work_2`, `feat/cursor_work`, `feat/Task.md_basic_project_structure`.
- Не переноси коммиты образца и не подменяй задачу копией готовой игры.
- Если предыдущая по порядку задача ещё открыта, напиши это в плане. Решение продолжать остаётся за человеком.
- `TASK.md` не пополняй техническими требованиями.
