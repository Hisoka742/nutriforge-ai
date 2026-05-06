# NutriForge AI — Backend API

AI-powered fitness platform: nutrition, workouts, and supplements.

## Quick start in VS Code

### 1. Open the project
```
File → Open Folder → select nutriforge-api
```

### 2. Create Python virtual environment
Open the integrated terminal (Ctrl + ` ) and run:
```bash
python -m venv venv
```

Activate it:
```bash
# Windows
venv\Scripts\activate

# Mac / Linux
source venv/bin/activate
```

### 3. Install dependencies
```bash
pip install -r requirements.txt
```

### 4. Set up environment variables
```bash
# Windows
copy .env.example .env

# Mac / Linux
cp .env.example .env
```
Open `.env` and set a real `SECRET_KEY` (any long random string).

### 5. Run the API
```bash
uvicorn app.main:app --reload
```
Or press **F5** in VS Code (launch config is already set up).

---

## Test the API

Open `api_tests.http` — click **Send Request** above any block to test.
Or visit: **http://localhost:8000/docs** for the full interactive Swagger UI.

---

## Project structure

```
nutriforge-api/
├── app/
│   ├── main.py              ← FastAPI app entry point
│   ├── config.py            ← Settings (.env)
│   ├── database.py          ← SQLAlchemy + SQLite setup
│   ├── routers/
│   │   ├── users.py         ← Register, login, JWT auth, profile
│   │   ├── nutrition.py     ← Macros, BMI, food search, meal plan
│   │   ├── workout.py       ← Workout plan generator
│   │   ├── supplements.py   ← Supplement advisor
│   │   └── progress.py      ← Weight/body fat logging
│   ├── models/
│   │   └── user_model.py    ← SQLAlchemy DB models
│   ├── ml/
│   │   ├── macro_engine.py      ← BMR, TDEE, macro calculator
│   │   ├── workout_engine.py    ← Exercise DB + plan generator
│   │   └── supplement_engine.py ← Gender-aware supplement advisor
│   ├── schemas/             ← Pydantic request/response models
│   └── services/
│       └── auth_service.py  ← JWT + bcrypt auth
├── frontend/
│   └── App.jsx              ← Full React frontend (connect to Vite)
├── .vscode/
│   ├── launch.json          ← F5 debug config
│   └── extensions.json      ← Recommended extensions
├── api_tests.http           ← REST Client test file
├── requirements.txt
└── .env.example
```

---

## API endpoints

| Method | Path | Description |
|--------|------|-------------|
| POST | /api/users/register | Create account |
| POST | /api/users/login | Login → JWT token |
| GET  | /api/users/me | Current user |
| POST | /api/users/profile | Save fitness profile |
| GET  | /api/users/profile | Get fitness profile |
| POST | /api/nutrition/macros | Calculate macro targets |
| GET  | /api/nutrition/bmi | BMI + category |
| POST | /api/nutrition/food/search | USDA food search |
| POST | /api/nutrition/meal-plan | Sample meal plan |
| POST | /api/workout/plan | Generate workout split |
| GET  | /api/workout/exercises/{group} | Exercises by muscle |
| POST | /api/supplements/plan | Supplement recommendations |
| POST | /api/progress/log | Log weight entry |
| GET  | /api/progress/history | All progress entries |
| GET  | /api/progress/summary | Progress summary |

---

## Next steps

- [ ] Connect USDA API key for real food search
- [ ] Set up PostgreSQL (Supabase) for production database
- [ ] Build React frontend with Vite
- [ ] Train scikit-learn macro recommendation model on NHANES data
- [ ] Add food photo recognition (Phase 3)
