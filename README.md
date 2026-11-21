# FriendlySplit – Angular client

FriendlySplit is a web app for splitting bills when people travel or go out together. You create a trip, add the people on it, record who paid for what, and the app works out who owes whom.

This repository is the **Angular front end** (Web Programming 2, Part 2). It uses the FriendlySplit REST API, which is in a separate repository:

- Front end (this repo): https://github.com/Adriana-st/FriendlySplitAngular
- Back end (Express API): https://github.com/Adriana-st/FriendlySplit (branch `part2Modifications`)

## Features

- **Trips:** list, view, create, edit and delete
- **People on a trip:** list, add, edit and remove
- **Expenses:** list, add and delete (the amount is split equally between everyone on the trip)
- **Settle up:** shows what each person paid and owes, and the payments needed to settle everyone up
- Reactive forms with validation that matches the API's rules (required fields, lengths, email format, 3-letter currency code, blank-only text)
- Friendly error messages, including the API's own messages for business rules (e.g. a duplicate email on a trip, or an expense date outside the trip dates)
- Loading, error and empty states on every page
- Responsive layout for phone, tablet and laptop

## Tech stack

- Angular 21
- Angular Material 21 (Material 3)
- RxJS
- TypeScript

## Before you start

You need:

- **Node.js** (version 20 or later) and npm
- **The FriendlySplit API running on `http://localhost:3000`.** The API allows requests from `http://localhost:4200` (CORS), so the front end must run on port 4200.

To start the API, in the `FriendlySplit` back-end folder:

```bash
npm install
npm run seed   # optional: loads sample trips, people and expenses (replaces the database)
npm run dev
```

The API needs its `.env` file (MongoDB connection string)

## Running the front end

```bash
git clone https://github.com/Adriana-st/FriendlySplitAngular.git
cd FriendlySplitAngular
npm install
ng serve -o
```

The app opens at `http://localhost:4200/` and reloads when you change a file.

To make a production build:

```bash
ng build
```

The output goes into the `dist/` folder.

## Pages

| URL | Page |
| --- | --- |
| `/trips` | All trips |
| `/trips/new` | Create a trip |
| `/trips/:id` | One trip, with its people and expenses |
| `/trips/:id/edit` | Edit a trip |
| `/trips/:id/balances` | Settle up: who owes whom |
| `/trips/:tripId/participants/new` | Add a person to a trip |
| `/trips/:tripId/participants/:participantId/edit` | Edit a person |
| `/trips/:tripId/expenses/new` | Add an expense |

## Project structure

The code is organised by feature. Each feature has its own models, services and pages.

```
src/app/
  core/interceptors/   error.interceptor.ts – turns HTTP errors into friendly messages
  shared/              load-state.ts (loading / loaded / error helper), validators
  features/
    trips/             models, trip.service.ts, trip list / details / form pages, trip card
    participants/      models, participant.service.ts, participant list, participant form
    expenses/          models, expense.service.ts, expense list, expense form
    balances/          models, balances page
```

- **Services** do all the HTTP calls. Components never call `HttpClient` directly.
- **Pages** have their own route; **components** sit inside a page (e.g. the participant list on the trip page).
- Route parameters reach components as inputs (`withComponentInputBinding()`).

## Notes on the data

- **Money is stored in cents** by the API (e.g. `2550` = €25.50). The app divides by 100 to show amounts, and multiplies by 100 (rounded) before saving.
- **Dates** are sent as `YYYY-MM-DD`. The API returns full date-times, which the app formats with the `date` pipe.
- **List endpoints** return `{ data, meta }`. The services keep only `data`.

## Known limitations

- Expenses added from the app are always split equally. The API also supports custom shares, but the form does not offer them yet.
- Expenses cannot be edited from the app yet (add or delete only).
- There are no user accounts yet. Login and authorisation are planned for Part 3.
- The API URL (`http://localhost:3000/api/v1`) is written in the services rather than in an environment file.

## Accessibility

Lighthouse (mobile) scored **100 for Accessibility**, **100 for Best Practices** and **100 for SEO**. The app uses one `<h1>` per page, labels on every form field, `role="alert"` for errors, `role="status"` for loading messages, aria-labels on repeated buttons, and an accessible table on the balances page.

