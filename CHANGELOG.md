# Hosmos — Changelog / История разработки

> ESG SaaS Platform for SMEs
> GitHub: https://github.com/Mrzv-pv/hosmos
> Production: https://hosmos.vercel.app

---

## 2026-03-16

### `3372859` — Update login logo to Globe icon, PDF headers use blue-violet gradient

- Логотип на странице логина заменён с квадрата с листом (Leaf) на круглую планету (Globe)
- PDF-отчёты используют сине-фиолетовый градиент в заголовках (как на лого)
- **Файлы:** `login/page.tsx`, `generate-report.ts`

---

### `40cf589` — Redeploy: env vars now configured on Vercel

- Пустой коммит для тригера нового билда Vercel после добавления переменных окружения

---

### `f0577c6` — Trigger redeploy with env vars

- Пустой коммит для тригера Vercel-деплоя

---

### `9f4502d` — Fix registration: auto-redirect to dashboard when email auto-confirmed

- При регистрации, если email подтверждён автоматически (сессия создаётся сразу), пользователь перенаправляется на `/dashboard`
- Убрано промежуточное сообщение "Check your email" для auto-confirmed пользователей
- **Файлы:** `register/page.tsx`

---

### `7dcde7c` — Fix login: use full page navigation after auth

- Заменён `router.push()` на `window.location.href` для навигации после логина
- Гарантирует, что auth-куки подхватываются middleware при серверном рендере
- **Файлы:** `login/page.tsx`

---

### `c274dd1` — Fix middleware crash, add distinct GRI/ESRS PDF reports

- **Middleware:** добавлена защита от отсутствующих env vars (предотвращает 500 на Vercel)
- **PDF GRI Report:** полноценная структура по GRI Standards 2021 с номерами дисклоужеров (GRI 2, GRI 300, GRI 305)
- **PDF ESRS Report:** отдельный отчёт ESRS E1 Climate Change (зелёная цветовая схема, структура CSRD)
- **Исправление:** имя колонки `total` → `total_tco2e` в queries и calculator
- **Файлы:** `calculator/page.tsx`, `generate-report.ts`, `queries.ts`, `middleware.ts`

---

### `0009f7b` — feat: add PDF report generation (GRI/ESRS) with Supabase data

- Установлены библиотеки `jspdf` + `jspdf-autotable` для клиентской генерации PDF
- Создан `generate-report.ts` — профессиональный 2-страничный ESG-отчёт
- Содержимое: профиль компании, сводка выбросов GHG, KPI, месячный тренд, методология
- Страница Reports загружает реальные данные из Supabase и генерирует скачиваемые PDF
- Фоллбэк на демо-данные, если нет сохранённых результатов
- **Файлы:** `reports/page.tsx`, `generate-report.ts`, `package.json`

---

### `b9b03bb` — feat: connect dashboard and calculator to Supabase data

- Dashboard загружает данные компании и результаты выбросов из БД при монтировании
- Calculator загружает все факторы выбросов из БД (с фоллбэком на статические данные)
- Calculator сохраняет месячные данные и годовые результаты в Supabase
- Обе страницы показывают лоадеры при загрузке данных
- Грейсфул фоллбэк на демо-данные при отсутствии записей в БД
- **Файлы:** `dashboard/page.tsx`, `calculator/page.tsx`

---

### `61381c9` — feat: integrate Supabase for auth, emission factors DB, and data layer

- Supabase клиент (browser + server) и auth middleware
- Auth callback route для подтверждения email
- Слой запросов (queries) для всех таблиц факторов выбросов и данных компаний
- SQL-миграции: схема (13 таблиц + RLS) и seed (440+ факторов выбросов)
- Login/Register/Sidebar подключены к Supabase Auth
- Middleware защищает dashboard-роуты и обновляет сессии
- **Файлы:** 16 файлов (клиенты, middleware, queries, миграции)

---

## 2026-03-15

### `a788ae3` — Hosmos ESG SaaS platform v1.0

Полноценная ESG-платформа для малого и среднего бизнеса:

- **Carbon Calculator** — ввод месячных данных (Scope 1 + 2 + 3)
- **База факторов выбросов** — DEFRA/AIB/EEA (40+ европейских стран)
- **Scope 2** — факторы для электричества, отопления, пара, охлаждения
- **Dashboard** — интерактивная панель с графиком месячных выбросов
- **People & Social** — 40 параметров для социального блока ESG
- **Governance** — 25 параметров корпоративного управления
- **Reports** — построитель отчётов (GRI, ESRS, CDP)
- **Data Sources** — страница источников данных с верификацией для аудиторов
- **Auto-collect** — архитектура автосбора (интеграции с бухгалтерией + PDF-сканер)
- **Landing page** — анимированная планета с ESG-спутниками на орбитах
- **Terms & Privacy** — страница условий и политики конфиденциальности
- **Pricing** — 4 тарифа: Trial / Starter / Pro / Enterprise
- **Демо-компания:** GreenTech Solutions d.o.o. (тариф Starter)
- **Файлы:** 37 файлов (полная кодовая база)

---

### `3bf4fad` — Initial commit from Create Next App

- Базовый Next.js 14 проект (App Router, TypeScript, Tailwind CSS)

---

## Технологический стек

| Компонент | Технология |
|-----------|-----------|
| Frontend | Next.js 14 (App Router), TypeScript, Tailwind CSS |
| Backend / DB | Supabase (PostgreSQL + Auth + RLS) |
| PDF генерация | jsPDF + jspdf-autotable (client-side) |
| Деплой | Vercel (auto-deploy from GitHub) |
| Auth | Supabase Auth (email/password) |
| Данные выбросов | DEFRA, AIB, IPCC, IEA emission factors |
| Стандарты | GHG Protocol, GRI 2021, ESRS E1, CDP |

## Архитектура базы данных

13 таблиц с Row-Level Security:

| Таблица | Назначение |
|---------|-----------|
| `companies` | Данные компаний (отрасль, страна, тариф) |
| `profiles` | Профили пользователей (связь с auth.users) |
| `emission_factor_sources` | Источники факторов (DEFRA, AIB, IPCC) |
| `stationary_fuel_factors` | Факторы стационарного сжигания |
| `vehicle_factors` | Факторы транспорта |
| `flight_factors` | Факторы авиаперелётов |
| `grid_electricity_factors` | Факторы электросети по странам |
| `heat_district_factors` | Факторы централизованного отопления |
| `scope3_factors` | Факторы Scope 3 (отходы, вода, командировки) |
| `monthly_emissions_data` | Месячные данные ввода |
| `emission_results` | Итоговые расчёты за год |
| `data_source_connections` | Подключения к внешним источникам |
| `audit_log` | Журнал аудита |
