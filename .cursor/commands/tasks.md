---
name: "/tasks"
id: "tasks"
category: "Workflow"
description: "Show the open board tasks and wait for the person to choose one"
---

The person runs this to see which tasks exist. Do not take a card. Do not change a label or a Status. Do not write a plan.

```bash
gh issue list --label board:backlog --limit 30
```

Show that list in this chat. The next step is `/choose-task` with one issue number.
