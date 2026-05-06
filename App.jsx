import { useState, useEffect, createContext, useContext } from "react"

const API = "http://localhost:8000/api"
const AuthCtx = createContext(null)

function useAuth() { return useContext(AuthCtx) }

// ─── API helpers ────────────────────────────────────────────────────
async function apiFetch(path, options = {}) {
  const token = localStorage.getItem("nf_token")
  const res = await fetch(API + path, {
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    ...options,
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.detail || "Request failed")
  }
  return res.json()
}

// ─── Design tokens ───────────────────────────────────────────────────
const colors = {
  green:      "#1D9E75",
  greenLight: "#E1F5EE",
  greenDark:  "#0F6E56",
  blue:       "#378ADD",
  blueLight:  "#E6F1FB",
  amber:      "#BA7517",
  amberLight: "#FAEEDA",
  purple:     "#7F77DD",
  purpleLight:"#EEEDFE",
  coral:      "#D85A30",
  coralLight: "#FAECE7",
  bg:         "#F8FAF9",
  surface:    "#FFFFFF",
  border:     "rgba(0,0,0,0.08)",
  text:       "#1A1A1A",
  muted:      "#6B7280",
}

const s = {
  app: { minHeight: "100vh", background: colors.bg, fontFamily: "'DM Sans', 'Segoe UI', sans-serif", color: colors.text },
  nav: { background: colors.surface, borderBottom: `1px solid ${colors.border}`, padding: "0 2rem", display: "flex", alignItems: "center", gap: "2rem", height: 60, position: "sticky", top: 0, zIndex: 100 },
  navBrand: { display: "flex", alignItems: "center", gap: 10, textDecoration: "none", color: colors.text },
  navLogo: { width: 34, height: 34, borderRadius: 9, background: colors.green, display: "flex", alignItems: "center", justifyContent: "center" },
  navLinks: { display: "flex", gap: "0.25rem", flex: 1 },
  navLink: (active) => ({ padding: "6px 14px", borderRadius: 20, fontSize: 14, border: "none", cursor: "pointer", background: active ? colors.green : "transparent", color: active ? "#fff" : colors.muted, fontWeight: active ? 500 : 400 }),
  navRight: { marginLeft: "auto", display: "flex", gap: 10, alignItems: "center" },
  page: { maxWidth: 900, margin: "0 auto", padding: "2rem 1.5rem" },
  card: { background: colors.surface, border: `1px solid ${colors.border}`, borderRadius: 14, padding: "1.5rem" },
  cardSm: { background: colors.surface, border: `1px solid ${colors.border}`, borderRadius: 12, padding: "1rem 1.1rem" },
  grid2: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 },
  grid3: { display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12 },
  grid4: { display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12 },
  label: { fontSize: 12, color: colors.muted, marginBottom: 4, display: "block", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.04em" },
  input: { width: "100%", padding: "10px 12px", border: `1px solid ${colors.border}`, borderRadius: 8, fontSize: 14, outline: "none", boxSizing: "border-box", background: colors.surface },
  select: { width: "100%", padding: "10px 12px", border: `1px solid ${colors.border}`, borderRadius: 8, fontSize: 14, outline: "none", background: colors.surface, boxSizing: "border-box" },
  btn: (color = colors.green) => ({ padding: "10px 20px", background: color, color: "#fff", border: "none", borderRadius: 8, fontSize: 14, fontWeight: 500, cursor: "pointer", width: "100%" }),
  btnOutline: { padding: "10px 20px", background: "transparent", color: colors.green, border: `1.5px solid ${colors.green}`, borderRadius: 8, fontSize: 14, fontWeight: 500, cursor: "pointer" },
  badge: (bg, text) => ({ background: bg, color: text, fontSize: 11, padding: "3px 10px", borderRadius: 20, fontWeight: 500, display: "inline-block" }),
  h1: { fontSize: 26, fontWeight: 600, margin: "0 0 0.25rem" },
  h2: { fontSize: 18, fontWeight: 600, margin: "0 0 1rem" },
  h3: { fontSize: 15, fontWeight: 600, margin: "0 0 0.75rem" },
  tag: { fontSize: 12, color: colors.muted, marginBottom: 3 },
  val: { fontSize: 22, fontWeight: 600, color: colors.text },
  row: { display: "flex", alignItems: "center", gap: 12 },
  divider: { border: "none", borderTop: `1px solid ${colors.border}`, margin: "1rem 0" },
  err: { background: "#FEE2E2", color: "#991B1B", padding: "10px 14px", borderRadius: 8, fontSize: 13, marginBottom: 12 },
  success: { background: colors.greenLight, color: colors.greenDark, padding: "10px 14px", borderRadius: 8, fontSize: 13, marginBottom: 12 },
}

// ─── Auth pages ──────────────────────────────────────────────────────
function AuthPage({ onLogin }) {
  const [mode, setMode] = useState("login")
  const [form, setForm] = useState({ email: "", password: "", name: "" })
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  async function submit(e) {
    e.preventDefault()
    setError("")
    setLoading(true)
    try {
      if (mode === "register") {
        await apiFetch("/users/register", { method: "POST", body: JSON.stringify({ email: form.email, password: form.password, name: form.name }) })
        setMode("login")
        return
      }
      const data = await apiFetch("/users/login", { method: "POST", body: JSON.stringify({ email: form.email, password: form.password }) })
      localStorage.setItem("nf_token", data.access_token)
      onLogin()
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight: "100vh", background: colors.bg, display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem" }}>
      <div style={{ width: "100%", maxWidth: 420 }}>
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <div style={{ width: 52, height: 52, background: colors.green, borderRadius: 14, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1rem" }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round"><path d="M12 2L4 7v10l8 5 8-5V7z"/><path d="M12 7v10M8 9.5l4 2.5 4-2.5"/></svg>
          </div>
          <h1 style={{ ...s.h1, textAlign: "center" }}>NutriForge AI</h1>
          <p style={{ color: colors.muted, fontSize: 14 }}>Your adaptive fitness intelligence platform</p>
        </div>
        <div style={s.card}>
          <div style={{ display: "flex", gap: 8, marginBottom: "1.5rem" }}>
            {["login", "register"].map(m => (
              <button key={m} onClick={() => setMode(m)} style={{ flex: 1, padding: "8px", border: `1px solid ${m === mode ? colors.green : colors.border}`, borderRadius: 8, background: m === mode ? colors.greenLight : "transparent", color: m === mode ? colors.greenDark : colors.muted, cursor: "pointer", fontWeight: m === mode ? 600 : 400, fontSize: 14 }}>
                {m === "login" ? "Sign in" : "Create account"}
              </button>
            ))}
          </div>
          {error && <div style={s.err}>{error}</div>}
          <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {mode === "register" && (
              <div><label style={s.label}>Name</label><input style={s.input} placeholder="Your name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required /></div>
            )}
            <div><label style={s.label}>Email</label><input style={s.input} type="email" placeholder="you@example.com" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required /></div>
            <div><label style={s.label}>Password</label><input style={s.input} type="password" placeholder="••••••••" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required /></div>
            <button style={s.btn()} disabled={loading}>{loading ? "Please wait…" : mode === "login" ? "Sign in" : "Create account"}</button>
          </form>
        </div>
      </div>
    </div>
  )
}

// ─── Onboarding / Profile ────────────────────────────────────────────
function ProfilePage({ onSave }) {
  const [form, setForm] = useState({ gender: "male", age: 25, weight_kg: 75, height_cm: 175, activity_level: "moderate", goal: "fat_loss", diet_style: "none", allergies: [] })
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  function set(k, v) { setForm(f => ({ ...f, [k]: v })) }

  async function submit(e) {
    e.preventDefault()
    setLoading(true)
    setError("")
    try {
      await apiFetch("/users/profile", { method: "POST", body: JSON.stringify(form) })
      onSave()
    } catch (e) { setError(e.message) }
    finally { setLoading(false) }
  }

  const fields = [
    { k: "gender", label: "Gender", type: "select", opts: [["male","Male"],["female","Female"]] },
    { k: "activity_level", label: "Activity level", type: "select", opts: [["sedentary","Sedentary (desk job)"],["light","Light (1-3×/week)"],["moderate","Moderate (3-5×/week)"],["active","Active (6-7×/week)"],["very_active","Very active (athlete)"]] },
    { k: "goal", label: "Goal", type: "select", opts: [["fat_loss","Fat loss"],["muscle_gain","Muscle gain"],["maintain","Maintain"],["athlete","Athlete performance"]] },
    { k: "diet_style", label: "Diet style", type: "select", opts: [["none","No restriction"],["vegetarian","Vegetarian"],["vegan","Vegan"],["keto","Keto"],["halal","Halal"],["gluten_free","Gluten-free"]] },
  ]

  return (
    <div style={s.page}>
      <div style={{ marginBottom: "1.5rem" }}>
        <h1 style={s.h1}>Set up your profile</h1>
        <p style={{ color: colors.muted, fontSize: 14 }}>This lets the AI personalise your nutrition, workouts and supplements.</p>
      </div>
      {error && <div style={s.err}>{error}</div>}
      <form onSubmit={submit}>
        <div style={{ ...s.card, marginBottom: 12 }}>
          <h2 style={s.h2}>Your stats</h2>
          <div style={{ ...s.grid2, marginBottom: 12 }}>
            <div><label style={s.label}>Age</label><input style={s.input} type="number" min={14} max={90} value={form.age} onChange={e => set("age", +e.target.value)} required /></div>
            <div><label style={s.label}>Weight (kg)</label><input style={s.input} type="number" step="0.1" value={form.weight_kg} onChange={e => set("weight_kg", +e.target.value)} required /></div>
            <div><label style={s.label}>Height (cm)</label><input style={s.input} type="number" value={form.height_cm} onChange={e => set("height_cm", +e.target.value)} required /></div>
          </div>
        </div>
        <div style={{ ...s.card, marginBottom: 12 }}>
          <h2 style={s.h2}>Preferences</h2>
          <div style={s.grid2}>
            {fields.map(f => (
              <div key={f.k}>
                <label style={s.label}>{f.label}</label>
                <select style={s.select} value={form[f.k]} onChange={e => set(f.k, e.target.value)}>
                  {f.opts.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                </select>
              </div>
            ))}
          </div>
        </div>
        <button style={s.btn()} type="submit" disabled={loading}>{loading ? "Saving…" : "Save profile and continue →"}</button>
      </form>
    </div>
  )
}

// ─── Dashboard ───────────────────────────────────────────────────────
function Dashboard({ user }) {
  const [macros, setMacros] = useState(null)
  const [bmi, setBmi] = useState(null)
  const [profile, setProfile] = useState(null)

  useEffect(() => {
    apiFetch("/users/profile").then(p => {
      setProfile(p)
      return apiFetch("/nutrition/macros", { method: "POST", body: JSON.stringify(p) })
    }).then(m => {
      setMacros(m)
    }).catch(() => {})

    apiFetch("/users/profile").then(p => {
      return fetch(`${API}/nutrition/bmi?weight_kg=${p.weight_kg}&height_cm=${p.height_cm}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("nf_token")}` }
      }).then(r => r.json()).then(setBmi)
    }).catch(() => {})
  }, [])

  const macroCards = macros ? [
    { label: "Daily calories", val: `${macros.calories} kcal`, color: colors.green, bg: colors.greenLight },
    { label: "Protein", val: `${macros.protein_g}g`, color: "#185FA5", bg: colors.blueLight },
    { label: "Carbs", val: `${macros.carbs_g}g`, color: colors.amber, bg: colors.amberLight },
    { label: "Fat", val: `${macros.fat_g}g`, color: colors.coral, bg: colors.coralLight },
    { label: "Fiber", val: `${macros.fiber_g}g`, color: colors.purple, bg: colors.purpleLight },
    { label: "Water", val: `${macros.water_ml}ml`, color: "#185FA5", bg: colors.blueLight },
  ] : []

  return (
    <div style={s.page}>
      <div style={{ marginBottom: "1.5rem" }}>
        <h1 style={s.h1}>Good {getGreeting()}, {user?.name?.split(" ")[0]} 👋</h1>
        <p style={{ color: colors.muted, fontSize: 14 }}>Here's your personalised daily overview.</p>
      </div>

      {bmi && (
        <div style={{ ...s.cardSm, marginBottom: 12, display: "flex", alignItems: "center", gap: 16, background: colors.greenLight, border: `1px solid rgba(29,158,117,0.2)` }}>
          <div>
            <div style={{ fontSize: 11, color: colors.greenDark, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>BMI</div>
            <div style={{ fontSize: 26, fontWeight: 700, color: colors.greenDark }}>{bmi.bmi}</div>
          </div>
          <div style={{ width: 1, height: 40, background: "rgba(15,110,86,0.2)" }} />
          <div style={{ fontSize: 14, color: colors.greenDark }}>{bmi.category}</div>
        </div>
      )}

      {macros ? (
        <div style={{ ...s.grid3, marginBottom: 16 }}>
          {macroCards.map(c => (
            <div key={c.label} style={{ ...s.cardSm, background: c.bg, border: `1px solid ${c.color}22` }}>
              <div style={{ fontSize: 11, color: c.color, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 4 }}>{c.label}</div>
              <div style={{ fontSize: 22, fontWeight: 700, color: c.color }}>{c.val}</div>
            </div>
          ))}
        </div>
      ) : (
        <div style={{ ...s.card, textAlign: "center", padding: "2rem", color: colors.muted, marginBottom: 16 }}>Loading your targets…</div>
      )}

      <div style={s.grid2}>
        <QuickCard icon="🥗" title="Meal plan" desc="View your 7-day AI meal plan" color={colors.green} />
        <QuickCard icon="🏋️" title="Workout plan" desc="See today's training session" color={colors.blue} />
        <QuickCard icon="💊" title="Supplements" desc="Your personalised supplement stack" color={colors.purple} />
        <QuickCard icon="📈" title="Progress" desc="Log your weight and body stats" color={colors.coral} />
      </div>
    </div>
  )
}

function QuickCard({ icon, title, desc, color }) {
  return (
    <div style={{ ...s.card, display: "flex", gap: 14, alignItems: "flex-start", cursor: "pointer", transition: "border-color 0.15s" }}>
      <div style={{ width: 40, height: 40, borderRadius: 10, background: color + "18", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0 }}>{icon}</div>
      <div>
        <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 3 }}>{title}</div>
        <div style={{ fontSize: 13, color: colors.muted }}>{desc}</div>
      </div>
    </div>
  )
}

function getGreeting() {
  const h = new Date().getHours()
  return h < 12 ? "morning" : h < 17 ? "afternoon" : "evening"
}

// ─── Nutrition page ───────────────────────────────────────────────────
function NutritionPage() {
  const [macros, setMacros] = useState(null)
  const [mealPlan, setMealPlan] = useState(null)
  const [search, setSearch] = useState("")
  const [searchResults, setSearchResults] = useState(null)
  const [loading, setLoading] = useState(false)
  const [tab, setTab] = useState("targets")

  useEffect(() => {
    apiFetch("/users/profile").then(p => {
      apiFetch("/nutrition/macros", { method: "POST", body: JSON.stringify(p) }).then(setMacros)
      apiFetch("/nutrition/meal-plan", { method: "POST", body: JSON.stringify(p) }).then(setMealPlan)
    }).catch(() => {})
  }, [])

  async function searchFood() {
    if (!search.trim()) return
    setLoading(true)
    try {
      const data = await apiFetch("/nutrition/food/search", { method: "POST", body: JSON.stringify({ query: search, max_results: 8 }) })
      setSearchResults(data)
    } catch (e) { }
    finally { setLoading(false) }
  }

  return (
    <div style={s.page}>
      <h1 style={{ ...s.h1, marginBottom: "0.25rem" }}>Nutrition</h1>
      <p style={{ color: colors.muted, fontSize: 14, marginBottom: "1.5rem" }}>Your daily targets, meal plan and food database.</p>

      <div style={{ display: "flex", gap: 8, marginBottom: "1.5rem" }}>
        {[["targets","Targets"],["meals","Meal plan"],["search","Food search"]].map(([k,l]) => (
          <button key={k} onClick={() => setTab(k)} style={{ padding: "7px 16px", borderRadius: 20, border: `1px solid ${k === tab ? colors.green : colors.border}`, background: k === tab ? colors.green : "transparent", color: k === tab ? "#fff" : colors.muted, cursor: "pointer", fontSize: 13, fontWeight: k === tab ? 500 : 400 }}>{l}</button>
        ))}
      </div>

      {tab === "targets" && macros && (
        <div style={s.card}>
          <h2 style={s.h2}>Daily macro targets</h2>
          {[
            ["Calories", macros.calories, "kcal", colors.green, macros.calories, 3000],
            ["Protein",  macros.protein_g, "g", "#185FA5", macros.protein_g, 250],
            ["Carbs",    macros.carbs_g,   "g", colors.amber, macros.carbs_g, 400],
            ["Fat",      macros.fat_g,     "g", colors.coral, macros.fat_g,  120],
            ["Fiber",    macros.fiber_g,   "g", colors.purple, macros.fiber_g, 40],
          ].map(([name, val, unit, color, cur, max]) => (
            <div key={name} style={{ marginBottom: 16 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                <span style={{ fontSize: 14, fontWeight: 500 }}>{name}</span>
                <span style={{ fontSize: 14, color, fontWeight: 600 }}>{val} {unit}</span>
              </div>
              <div style={{ height: 6, background: color + "20", borderRadius: 4, overflow: "hidden" }}>
                <div style={{ height: "100%", width: `${Math.min(100, (cur / max) * 100)}%`, background: color, borderRadius: 4 }} />
              </div>
            </div>
          ))}
          <hr style={s.divider} />
          <div style={{ fontSize: 13, color: colors.muted }}>💧 Daily water target: <strong>{macros.water_ml}ml</strong></div>
        </div>
      )}

      {tab === "meals" && mealPlan && (
        <div style={s.card}>
          <h2 style={s.h2}>Sample day meal plan</h2>
          {Object.entries(mealPlan.sample_day || {}).map(([meal, desc]) => (
            <div key={meal} style={{ marginBottom: 14, paddingBottom: 14, borderBottom: `1px solid ${colors.border}` }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: colors.green, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 4 }}>{meal}</div>
              <div style={{ fontSize: 14 }}>{desc}</div>
            </div>
          ))}
          <div style={{ fontSize: 13, color: colors.muted, marginTop: 8 }}>{mealPlan.note}</div>
        </div>
      )}

      {tab === "search" && (
        <div style={s.card}>
          <h2 style={s.h2}>Food search</h2>
          <div style={{ display: "flex", gap: 8, marginBottom: "1rem" }}>
            <input style={{ ...s.input, flex: 1 }} placeholder="Search food (e.g. chicken breast, oats…)" value={search} onChange={e => setSearch(e.target.value)} onKeyDown={e => e.key === "Enter" && searchFood()} />
            <button onClick={searchFood} style={{ ...s.btn(), width: "auto", padding: "10px 20px" }} disabled={loading}>{loading ? "…" : "Search"}</button>
          </div>
          {searchResults && (
            <div>
              {(searchResults.mock_result?.foods || searchResults.foods || []).map((f, i) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: `1px solid ${colors.border}`, fontSize: 14 }}>
                  <span style={{ fontWeight: 500 }}>{f.name}</span>
                  <span style={{ color: colors.muted }}>{f.calories || f.calories_per_100g} kcal / 100g · P: {f.protein_g}g · C: {f.carbs_g}g · F: {f.fat_g}g</span>
                </div>
              ))}
              {searchResults.message && <div style={{ fontSize: 13, color: colors.muted, marginTop: 8 }}>{searchResults.message}</div>}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// ─── Workout page ─────────────────────────────────────────────────────
function WorkoutPage() {
  const [plan, setPlan] = useState(null)
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState(0)

  useEffect(() => {
    apiFetch("/users/profile").then(p => {
      return apiFetch("/workout/plan", { method: "POST", body: JSON.stringify({ profile: p, request: { sessions_per_week: 4, equipment: "full_gym" } }) })
    }).then(setPlan).catch(() => {}).finally(() => setLoading(false))
  }, [])

  if (loading) return <div style={{ ...s.page, color: colors.muted }}>Loading your workout plan…</div>
  if (!plan) return <div style={s.page}><div style={s.err}>Could not load workout plan. Make sure your profile is saved.</div></div>

  const day = plan.plan[selected]

  return (
    <div style={s.page}>
      <h1 style={{ ...s.h1, marginBottom: "0.25rem" }}>Workout plan</h1>
      <p style={{ color: colors.muted, fontSize: 14, marginBottom: "1.5rem" }}>{plan.weeks}-week programme · {plan.sessions_per_week} sessions/week · {plan.difficulty}</p>

      <div style={{ display: "flex", gap: 8, marginBottom: "1.5rem", flexWrap: "wrap" }}>
        {plan.plan.map((d, i) => (
          <button key={i} onClick={() => setSelected(i)} style={{ padding: "7px 14px", borderRadius: 20, border: `1px solid ${i === selected ? colors.green : colors.border}`, background: i === selected ? colors.green : "transparent", color: i === selected ? "#fff" : colors.muted, cursor: "pointer", fontSize: 13, fontWeight: i === selected ? 500 : 400 }}>{d.day_name}</button>
        ))}
      </div>

      {day && (
        <div style={s.card}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1rem" }}>
            <div>
              <h2 style={{ ...s.h2, margin: 0 }}>{day.session_type}</h2>
              <div style={{ fontSize: 13, color: colors.muted, marginTop: 4 }}>{day.day_name} · {day.duration_minutes} min · ~{day.calories_burned} kcal burned</div>
            </div>
            <span style={s.badge(colors.greenLight, colors.greenDark)}>{day.exercises.length} exercises</span>
          </div>
          <hr style={s.divider} />
          {day.exercises.map((ex, i) => (
            <div key={i} style={{ display: "flex", gap: 14, padding: "12px 0", borderBottom: `1px solid ${colors.border}` }}>
              <div style={{ width: 32, height: 32, borderRadius: 8, background: colors.greenLight, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, color: colors.greenDark, flexShrink: 0 }}>{i + 1}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 3 }}>{ex.name}</div>
                <div style={{ fontSize: 12, color: colors.muted }}>{ex.muscle_group} · {ex.equipment}</div>
              </div>
              <div style={{ textAlign: "right", flexShrink: 0 }}>
                <div style={{ fontSize: 14, fontWeight: 600 }}>{ex.sets} × {ex.reps}</div>
                <div style={{ fontSize: 12, color: colors.muted }}>Rest {ex.rest_seconds}s</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ─── Supplements page ─────────────────────────────────────────────────
function SupplementsPage() {
  const [plan, setPlan] = useState(null)
  const priorityColor = { essential: [colors.greenLight, colors.greenDark], recommended: [colors.blueLight, "#185FA5"], optional: [colors.amberLight, colors.amber] }

  useEffect(() => {
    apiFetch("/users/profile").then(p => {
      return apiFetch("/supplements/plan", { method: "POST", body: JSON.stringify(p) })
    }).then(setPlan).catch(() => {})
  }, [])

  if (!plan) return <div style={{ ...s.page, color: colors.muted }}>Loading supplement recommendations…</div>

  return (
    <div style={s.page}>
      <h1 style={{ ...s.h1, marginBottom: "0.25rem" }}>Supplements</h1>
      <p style={{ color: colors.muted, fontSize: 14, marginBottom: "1.5rem" }}>Evidence-based recommendations for your profile and goals.</p>

      <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: "1.5rem" }}>
        {plan.supplements.map((sup, i) => {
          const [bg, text] = priorityColor[sup.priority] || [colors.greenLight, colors.greenDark]
          return (
            <div key={i} style={s.card}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                <div style={{ fontWeight: 600, fontSize: 15 }}>{sup.name}</div>
                <span style={s.badge(bg, text)}>{sup.priority}</span>
              </div>
              <div style={{ display: "flex", gap: 20, marginBottom: 8 }}>
                <div><div style={{ fontSize: 11, color: colors.muted, fontWeight: 600, textTransform: "uppercase", marginBottom: 2 }}>Dose</div><div style={{ fontSize: 13, fontWeight: 500 }}>{sup.dose}</div></div>
                <div><div style={{ fontSize: 11, color: colors.muted, fontWeight: 600, textTransform: "uppercase", marginBottom: 2 }}>Timing</div><div style={{ fontSize: 13 }}>{sup.timing}</div></div>
              </div>
              <div style={{ fontSize: 13, color: colors.muted, lineHeight: 1.6 }}>{sup.reason}</div>
            </div>
          )
        })}
      </div>

      <div style={{ ...s.cardSm, background: colors.amberLight, border: `1px solid ${colors.amber}33` }}>
        <div style={{ fontSize: 12, fontWeight: 600, color: colors.amber, marginBottom: 6, textTransform: "uppercase" }}>Important note</div>
        <div style={{ fontSize: 13, color: "#78350F", lineHeight: 1.6 }}>{plan.notes}</div>
      </div>
    </div>
  )
}

// ─── Progress page ────────────────────────────────────────────────────
function ProgressPage() {
  const [entries, setEntries] = useState([])
  const [summary, setSummary] = useState(null)
  const [form, setForm] = useState({ date: new Date().toISOString().split("T")[0], weight_kg: "", body_fat_pct: "", notes: "" })
  const [msg, setMsg] = useState("")

  function load() {
    apiFetch("/progress/history").then(d => setEntries(d.entries || []))
    apiFetch("/progress/summary").then(setSummary).catch(() => {})
  }

  useEffect(() => { load() }, [])

  async function logEntry(e) {
    e.preventDefault()
    await apiFetch("/progress/log", { method: "POST", body: JSON.stringify({ ...form, weight_kg: +form.weight_kg, body_fat_pct: form.body_fat_pct ? +form.body_fat_pct : null }) })
    setMsg("Progress logged!")
    setForm({ ...form, weight_kg: "", body_fat_pct: "", notes: "" })
    load()
    setTimeout(() => setMsg(""), 3000)
  }

  return (
    <div style={s.page}>
      <h1 style={{ ...s.h1, marginBottom: "0.25rem" }}>Progress tracker</h1>
      <p style={{ color: colors.muted, fontSize: 14, marginBottom: "1.5rem" }}>Log your weight and body composition over time.</p>

      {summary?.total_change_kg !== undefined && (
        <div style={{ ...s.grid3, marginBottom: "1.5rem" }}>
          <div style={{ ...s.cardSm, background: colors.greenLight }}><div style={{ fontSize: 11, color: colors.greenDark, fontWeight: 600, textTransform: "uppercase" }}>Start</div><div style={{ fontSize: 22, fontWeight: 700, color: colors.greenDark }}>{summary.starting_weight} kg</div></div>
          <div style={{ ...s.cardSm, background: colors.blueLight }}><div style={{ fontSize: 11, color: "#185FA5", fontWeight: 600, textTransform: "uppercase" }}>Current</div><div style={{ fontSize: 22, fontWeight: 700, color: "#185FA5" }}>{summary.current_weight} kg</div></div>
          <div style={{ ...s.cardSm, background: summary.total_change_kg < 0 ? colors.greenLight : colors.amberLight }}><div style={{ fontSize: 11, color: summary.total_change_kg < 0 ? colors.greenDark : colors.amber, fontWeight: 600, textTransform: "uppercase" }}>Change</div><div style={{ fontSize: 22, fontWeight: 700, color: summary.total_change_kg < 0 ? colors.greenDark : colors.amber }}>{summary.total_change_kg > 0 ? "+" : ""}{summary.total_change_kg} kg</div></div>
        </div>
      )}

      <div style={{ ...s.grid2, alignItems: "start" }}>
        <div style={s.card}>
          <h2 style={s.h2}>Log entry</h2>
          {msg && <div style={s.success}>{msg}</div>}
          <form onSubmit={logEntry} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div><label style={s.label}>Date</label><input style={s.input} type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} /></div>
            <div><label style={s.label}>Weight (kg)</label><input style={s.input} type="number" step="0.1" placeholder="75.5" value={form.weight_kg} onChange={e => setForm({ ...form, weight_kg: e.target.value })} required /></div>
            <div><label style={s.label}>Body fat % (optional)</label><input style={s.input} type="number" step="0.1" placeholder="18.5" value={form.body_fat_pct} onChange={e => setForm({ ...form, body_fat_pct: e.target.value })} /></div>
            <div><label style={s.label}>Notes</label><input style={s.input} placeholder="Feeling strong today…" value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} /></div>
            <button style={s.btn()} type="submit">Log progress</button>
          </form>
        </div>

        <div style={s.card}>
          <h2 style={s.h2}>History</h2>
          {entries.length === 0 ? (
            <div style={{ color: colors.muted, fontSize: 14 }}>No entries yet — log your first weight above.</div>
          ) : [...entries].reverse().map((e, i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "9px 0", borderBottom: `1px solid ${colors.border}`, fontSize: 14 }}>
              <span style={{ color: colors.muted }}>{e.logged_at ? new Date(e.logged_at).toLocaleDateString() : e.date}</span>
              <span style={{ fontWeight: 600 }}>{e.weight_kg} kg{e.body_fat_pct ? ` · ${e.body_fat_pct}% bf` : ""}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── App shell ────────────────────────────────────────────────────────
const PAGES = { dashboard: Dashboard, nutrition: NutritionPage, workout: WorkoutPage, supplements: SupplementsPage, progress: ProgressPage }
const NAV = [["dashboard","Dashboard"],["nutrition","Nutrition"],["workout","Workout"],["supplements","Supplements"],["progress","Progress"]]

export default function App() {
  const [token, setToken] = useState(localStorage.getItem("nf_token"))
  const [user, setUser] = useState(null)
  const [hasProfile, setHasProfile] = useState(null)
  const [page, setPage] = useState("dashboard")

  useEffect(() => {
    if (!token) return
    apiFetch("/users/me").then(setUser).catch(() => { localStorage.removeItem("nf_token"); setToken(null) })
    apiFetch("/users/profile").then(() => setHasProfile(true)).catch(() => setHasProfile(false))
  }, [token])

  function logout() { localStorage.removeItem("nf_token"); setToken(null); setUser(null); setHasProfile(null) }

  if (!token) return <AuthPage onLogin={() => setToken(localStorage.getItem("nf_token"))} />
  if (hasProfile === false) return <ProfilePage onSave={() => setHasProfile(true)} />
  if (hasProfile === null) return <div style={{ ...s.app, display: "flex", alignItems: "center", justifyContent: "center" }}>Loading…</div>

  const CurrentPage = PAGES[page]

  return (
    <div style={s.app}>
      <nav style={s.nav}>
        <div style={s.navBrand}>
          <div style={s.navLogo}><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round"><path d="M12 2L4 7v10l8 5 8-5V7z"/><path d="M12 7v10M8 9.5l4 2.5 4-2.5"/></svg></div>
          <span style={{ fontWeight: 700, fontSize: 15 }}>NutriForge</span>
        </div>
        <div style={s.navLinks}>
          {NAV.map(([k, l]) => <button key={k} onClick={() => setPage(k)} style={s.navLink(page === k)}>{l}</button>)}
        </div>
        <div style={s.navRight}>
          <span style={{ fontSize: 13, color: colors.muted }}>{user?.name}</span>
          <button onClick={logout} style={{ ...s.btnOutline, padding: "6px 14px", fontSize: 13 }}>Sign out</button>
        </div>
      </nav>
      <CurrentPage user={user} />
    </div>
  )
}
