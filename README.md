# FitGuide — Beginner Gym Planner

A static beginner fitness planner designed for GitHub Pages.

## Included

- Beginner profile form: age, sex, height, weight, goal and activity level
- Estimated BMI, BMR/TDEE and daily calorie target
- Beginner 3–6 day workout structure
- Exercise library with YouTube search video guides
- Simple meal plan based on the estimated calorie target
- Monthly expense calculator: gym + food + other fitness costs
- Daily tracking: weight, exercise minutes, calories burned/eaten, water and workout completion
- Progress summary
- Offline beginner fitness Q&A helper
- "Open Meta AI" button
- Local browser storage with `localStorage`
- Responsive mobile design
- GitHub Actions deployment workflow

## Important

This is an educational fitness planner, not medical advice. Calorie and exercise-burn numbers are estimates. For medical conditions, pregnancy, eating-disorder history, minors, or therapeutic diets, use qualified professional guidance.

## Run locally

Option A: double-click `index.html`.

Option B (recommended):
1. Install VS Code.
2. Open this folder.
3. Open a terminal in the folder.
4. Run:
   - Windows: `py -m http.server 5500`
   - macOS/Linux: `python3 -m http.server 5500`
5. Visit `http://localhost:5500`

No npm, database or build step is required.

## GitHub Pages

1. Create a GitHub repository, for example `fitguide`.
2. Upload all files in this folder.
3. Push to the `main` branch.
4. In GitHub: Settings → Pages.
5. Under Build and deployment, choose **GitHub Actions**.
6. The included `.github/workflows/deploy.yml` will deploy the static site.
7. After the workflow succeeds, GitHub will show the Pages URL.

Typical project-site URL:
`https://YOUR-USERNAME.github.io/fitguide/`

## Data storage

The app currently stores profile and progress in the visitor's browser using `localStorage`.

This means:
- Data stays on that browser/device.
- Clearing site data can remove it.
- The data is not automatically available on another device.
- GitHub Pages does not provide a database.

### If you want accounts and cloud storage later

Add a backend such as Supabase/Firebase or your own server:
- Authentication
- `users` table
- `profiles` table
- `workout_logs` table
- `meal_logs` table
- `expenses` table

Then replace the localStorage functions in `app.js` with authenticated database reads/writes.

## Meta AI integration

The included site opens Meta AI in a new tab. This avoids putting a secret API key into public JavaScript.

If you have access to Meta's Model API, a production architecture should be:

Browser → your backend/serverless function → Meta Model API

Do **not** put a private API key directly in `app.js` or another GitHub Pages file.

The current offline assistant is deliberately simple and does not claim to be a medical or general-purpose AI.

## Suggested future upgrades

- Login/signup
- Cloud database
- Weekly progress charts
- Exercise completion calendar
- Food database and macro tracking
- Personalized shopping list
- BMI/weight trend chart
- PWA install support
- Admin panel for exercise/diet content
- Secure AI backend
