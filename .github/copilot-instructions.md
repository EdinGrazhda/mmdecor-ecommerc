# Copilot CLI Project Behavior Instructions

These instructions define how Copilot CLI should behave inside this project.

## Main Behavior

Before making code changes, first understand the project structure and the related files.

When project understanding is needed, use CodeGraph if it is available.

When terminal commands may produce long output, use RTK by prefixing the command with `rtk`.

The goal is to reduce unnecessary terminal output, save tokens, and keep the implementation safer.

---

## CodeGraph Rules

Use CodeGraph when the task requires understanding:

- project architecture
- routes
- controllers
- models
- views
- components
- services
- database relations
- feature flow
- dependencies between files

Before editing files, inspect the related files first.

Recommended behavior:

1. Use CodeGraph to understand the current structure.
2. Identify the files related to the requested feature or bug.
3. Explain the implementation plan.
4. Wait for approval if the change is large.
5. Implement changes step by step.
6. Run tests or checks after changes.

Example prompts to follow internally:

```text
Use CodeGraph to understand the related routes, controllers, models, and views before editing.
```

```text
Use CodeGraph to find the files connected to this feature, then explain the safest implementation plan.
```

---

## RTK Rules

Use RTK for terminal commands that can create long output.

Use RTK for commands like:

```bash
rtk git status
rtk git diff
rtk git log -n 10
rtk ls
rtk grep "search text" .
rtk npm test
rtk npm run build
rtk composer install
rtk composer update
```

### Laravel RTK Commands

For Laravel projects, use RTK with commands that may generate long output.

Use RTK for testing commands:

```bash
rtk php artisan test
rtk php artisan test --filter=ExampleTest
rtk php artisan test --testsuite=Feature
rtk php artisan test --testsuite=Unit
rtk vendor/bin/phpunit
rtk vendor/bin/phpunit --filter ExampleTest
```

Use RTK for route, config, event, and queue inspection:

```bash
rtk php artisan route:list
rtk php artisan route:list --path=admin
rtk php artisan route:list --name=admin
rtk php artisan config:show
rtk php artisan event:list
rtk php artisan queue:failed
rtk php artisan queue:monitor
```

Use RTK for database and migration inspection when output may be long:

```bash
rtk php artisan migrate:status
rtk php artisan db:show
rtk php artisan db:table users
rtk php artisan db:table products
rtk php artisan schema:dump --prune
```

Use RTK for Laravel discovery and debugging commands:

```bash
rtk php artisan about
rtk php artisan list
rtk php artisan model:show User
rtk php artisan model:show Product
rtk php artisan optimize:clear
rtk php artisan config:clear
rtk php artisan route:clear
rtk php artisan cache:clear
rtk php artisan view:clear
```

Use RTK for logs and file searches:

```bash
rtk type storage/logs/laravel.log
rtk cat storage/logs/laravel.log
rtk grep "ERROR" storage/logs/laravel.log
rtk grep "Exception" storage/logs/laravel.log
rtk grep "Route::" routes/web.php
rtk grep "class .*Controller" app/Http/Controllers -r
rtk grep "belongsTo\|hasMany\|hasOne\|belongsToMany" app/Models -r
```

Use RTK for frontend checks inside Laravel projects:

```bash
rtk npm run build
rtk npm run dev
rtk npm run lint
rtk npm test
```

Use RTK for Composer and dependency outputs:

```bash
rtk composer install
rtk composer update
rtk composer dump-autoload
rtk composer show
rtk composer outdated
rtk composer audit
```

### Laravel Commands That Should NOT Use RTK By Default

Do not use RTK for short Laravel commands with small output:

```bash
php artisan --version
php artisan env
php artisan inspire
php artisan key:generate --show
php artisan storage:link
```

For destructive or risky Laravel commands, do not run them unless the user clearly approves:

```bash
php artisan migrate:fresh
php artisan migrate:fresh --seed
php artisan migrate:reset
php artisan db:wipe
php artisan queue:flush
php artisan cache:forget
php artisan config:cache
php artisan route:cache
php artisan optimize
composer update
npm audit fix --force
```

If a command changes the database, clears important production cache, deletes data, or updates dependencies, explain the risk and ask first.

Do not use RTK for very small commands like:

```bash
node -v
npm -v
php -v
composer -V
pwd
```

For long markdown files, implementation plans, logs, or generated outputs:

- Read important requirement files carefully.
- Do not skip requirements just to reduce output.
- If a markdown file is very long, read it in sections instead of relying only on RTK.
- Use RTK mainly for terminal outputs such as diffs, tests, logs, search results, and directory listings.

---

## Implementation Behavior

When the user asks to implement a feature:

1. First inspect the project.
2. Find the related files.
3. Explain what needs to change.
4. Avoid changing unrelated files.
5. Keep the current structure and style of the project.
6. Implement in small safe steps.
7. After changes, run relevant checks.
8. Show a short summary of what changed.

Do not make large changes without explaining the plan first.

For big features, split work into phases:

```text
Phase 1: Database / models
Phase 2: Backend logic
Phase 3: Frontend / UI
Phase 4: Validation and testing
```

---

## Laravel Project Behavior

If this is a Laravel project, always check these areas when needed:

- `routes/web.php`
- `routes/api.php`
- `app/Http/Controllers`
- `app/Models`
- `resources/views`
- `resources/js`
- `database/migrations`
- `database/seeders`
- `.env.example`
- `config`
- `composer.json`
- `package.json`

For Laravel changes:

- Follow existing route naming style.
- Follow existing controller structure.
- Use validation before storing or updating data.
- Use existing models and relationships when possible.
- Do not invent database columns without checking migrations/models first.
- Do not remove existing code unless it is clearly unused or requested.

---

## React / Frontend Behavior

If this project uses React, always check:

- components
- pages
- hooks
- API calls
- state management
- routing
- styling system
- existing UI patterns

Do not redesign the whole structure unless requested.

Keep UI changes consistent with the existing project style.

---

## Safety Rules

Before editing files:

- Check the current implementation.
- Understand how the feature connects to existing code.
- Prefer small changes.
- Do not overwrite large files blindly.
- Do not delete code without explaining why.
- Do not change environment variables without asking.
- Do not run destructive commands unless the user approves.

Avoid commands like:

```bash
rm -rf
git reset --hard
git clean -fd
composer update
npm audit fix --force
```

unless the user clearly approves.

---

## Preferred Workflow

For every medium or large task, follow this workflow:

```text
1. Understand the project using CodeGraph if available.
2. Use RTK for long terminal outputs.
3. Identify related files.
4. Explain the plan.
5. Implement step by step.
6. Run checks/tests.
7. Summarize changes.
```

---

## Prompt Behavior

If the user gives a short request, still inspect the project before editing.

If the user gives a long implementation idea in a markdown file:

1. Read the file carefully.
2. Summarize the idea.
3. Break it into phases.
4. Ask for approval before full implementation.
5. Implement one phase at a time.

Do not skip important details from requirement files.

---

## Final Rule

Use CodeGraph for project understanding.

Use RTK for long terminal outputs.

Use normal commands for small outputs.

Always prioritize safe, understandable, step-by-step implementation.
