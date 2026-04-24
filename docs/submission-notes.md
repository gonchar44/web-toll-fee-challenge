# Submission Notes

## Run and Test

Full setup and command details are in the main `README.md`.

```bash
pnpm install
pnpm dev
pnpm test
```

Services:

- API: `http://localhost:4000`
- Frontend: `http://localhost:3000`

## Frontend Scope

This submission focuses on the frontend implementation for the toll fee challenge. The app provides an interactive UI for recording toll passages and reviewing calculated fees returned by the API.

Implemented on the frontend:

- Next.js 16 app using React 19 and TypeScript.
- Passage form with vehicle ID, vehicle type, date/time, and timezone offset.
- Client-side validation with `react-hook-form` and `zod`.
- Vehicle type options loaded from the API.
- Known-vehicle auto-fill based on previously recorded passages.
- API integration for listing, creating, and deleting passages.
- TanStack Query setup for loading, caching, mutation, and invalidation.
- Passage history grouped by vehicle and local date.
- Display of base fee, charged fee, and daily total per passage.
- Recent passage preview after successful submission.
- Loading, empty, error, and delete confirmation states.
- Not found and error pages.
- Frontend linting and formatting setup.
- Frontend unit tests for key data transformation and form logic.
- Upgraded the frontend from Next.js 15 to Next.js 16, including the related React and Next ESLint package updates.

## Small Backend Fix

One backend fix was made to support the frontend correctly: toll calculation now derives local time from the timezone offset in each timestamp instead of hardcoding `Europe/Copenhagen`. This affects fee brackets, local date grouping, weekend/holiday checks, and keeps the behavior aligned with the assignment requirement that timestamps include a timezone offset.

## Assumptions

- The API is the source of truth for toll calculation.
- The frontend should focus on input, API integration, state management, and clear presentation of returned fee data.
- The timestamp timezone offset is selected explicitly in the form and included in the submitted payload.
- Daily totals shown in the UI are returned by the API per vehicle/date grouping.
- The app is intended for local challenge review, not production deployment.

## Frontend Tradeoffs

- I kept the UI passage-oriented to match the existing API flow. A dedicated daily calculator screen would map more directly to the assignment DTOs, but would duplicate or bypass the provided passage API.
- I used TanStack Query for server state. This adds a small amount of structure, but gives clean loading, error, mutation, and cache invalidation behavior.
- I used `react-hook-form` and `zod` for client-side validation. This keeps UX validation explicit while leaving final correctness to the API.
- I used Bulma with CSS modules to keep styling lightweight and scoped within the timebox.
- For a larger follow-up iteration, I would likely prefer Tailwind CSS and Radix for more control over component behavior, styling, and design tokens.
- I chose grouped cards instead of a table because pagination was not implemented. Cards keep the page manageable for the current scope and allow each group to expose more detail when expanded.
- I tested core helpers and form logic, but did not add browser-level end-to-end tests within the timebox.
- I added known-vehicle auto-fill as a usability improvement, while keeping manual vehicle type selection for new vehicles.

## Known Limitations

- There is no toast or notification system yet for success and error messages.
- The date/time picker UX needs refinement. Selecting a date can close the picker too early, and manual time entry can behave inconsistently.
- The passage form flow can be improved. Vehicle ID and vehicle type should not reset or override each other unless there is a clear reason.
- The UI still uses basic symbols in a few places. I would replace them with a consistent icon set.
- Delete actions could use more granular loading states.
- The current visual design is intentionally minimal. With more time, I would refine spacing, hierarchy, iconography, and overall polish.
- Cross-browser testing was outside the current timebox.

## Improvements, Scalability, and Next Steps

- Add a dedicated daily toll calculator view matching `DailyTollRequest` / `DailyTollResponse`.
- Show charged windows directly in the UI, including window start, window end, applied fee, and triggering timestamp.
- Surface API validation messages more specifically in the form instead of using a generic mutation error.
- Add toast notifications for create/delete success and API errors.
- Add clearer inline help for timezone selection and make offset behavior easier to verify.
- Add filters by date, vehicle type, and fee status for larger passage histories.
- Add pagination or virtualization as the passage list grows.
- Add optimistic UI updates for create/delete actions.
- Backend follow-up: reject a passage when an existing vehicle ID is submitted with a conflicting vehicle type.
- Backend follow-up: return a stable reason code when a passage has zero toll fee, so the UI can explain whether it was free because of vehicle type, weekend, holiday, or fee schedule.
- Add localization support, starting with English and Danish.
- Add stronger accessibility checks for form errors, controls, and expandable history rows.
- Extract more shared UI primitives if the app grows beyond this page.
- Add a small frontend architecture diagram if needed for the follow-up discussion.

## Tests

Current frontend tests use Vitest.

Frontend tests cover:

- Date/time formatting.
- Passage grouping by vehicle/date.
- Form schema validation.
- API payload creation from form values.
- Known-vehicle lookup behavior.

Supporting API-side tests also cover the timezone-offset fix, but the main deliverable focus is the frontend.

Recommended next tests:

- Component tests for the passage form and passage list states.
- API error rendering tests.
- Playwright end-to-end tests for the main user flow: create passage, review fee, expand group, delete passage.
- API mocking for frontend tests so UI states can be tested without a running server.
- Scenario-by-scenario UI smoke tests based on `docs/scenarios.md`.

## Frontend Architecture Notes

- `features/passage-form`: form state, validation, payload creation, timezone selection, and known-vehicle behavior.
- `features/passages`: fetching, grouping, formatting, listing, recent passage display, and deletion.
- `features/vehicle-types`: vehicle type option loading.
- `shared/ui/select`: reusable select UI.
- `lib/api`: HTTP helpers and API error handling.
- `lib/api/query-client.ts`: TanStack Query client setup.
- `app/page.tsx`: page composition and initial query prefetching.
