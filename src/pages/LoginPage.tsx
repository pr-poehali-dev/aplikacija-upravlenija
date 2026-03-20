import { useState, useEffect } from "react";
import Icon from "@/components/ui/icon";

interface LoginPageProps {
  onLogin: (user: { name: string; role: string; initials: string }) => void;
}

const DEMO_USERS = [
  { login: "ученик", password: "1234", name: "Алексей Смирнов", role: "Ученик · 9А класс", initials: "АС" },
  { login: "учитель", password: "1234", name: "Мария Петрова", role: "Учитель · Куратор", initials: "МП" },
  { login: "admin", password: "admin", name: "Администратор", role: "Администратор школы", initials: "АД" },
];

export default function LoginPage({ onLogin }: LoginPageProps) {
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [activeField, setActiveField] = useState<"login" | "password" | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    await new Promise((r) => setTimeout(r, 900));

    const user = DEMO_USERS.find(
      (u) => u.login === login.toLowerCase().trim() && u.password === password
    );

    if (user) {
      onLogin({ name: user.name, role: user.role, initials: user.initials });
    } else {
      setError("Неверный логин или пароль");
      setLoading(false);
    }
  };

  const fillDemo = (u: typeof DEMO_USERS[0]) => {
    setLogin(u.login);
    setPassword(u.password);
    setError("");
  };

  return (
    <div className="min-h-screen bg-app-bg font-golos flex flex-col overflow-hidden relative">
      {/* Ambient blobs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute -top-32 -left-32 w-80 h-80 rounded-full opacity-20 animate-float"
          style={{ background: "radial-gradient(circle, #7C5CFC, transparent)" }}
        />
        <div
          className="absolute top-1/3 -right-24 w-64 h-64 rounded-full opacity-15 animate-float"
          style={{ background: "radial-gradient(circle, #4A8CFF, transparent)", animationDelay: "2s" }}
        />
        <div
          className="absolute bottom-0 left-1/4 w-72 h-72 rounded-full opacity-10 animate-float"
          style={{ background: "radial-gradient(circle, #FF4D8B, transparent)", animationDelay: "4s" }}
        />
        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(rgba(124,92,252,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(124,92,252,0.5) 1px, transparent 1px)`,
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      {/* Top decoration */}
      <div className="relative z-10 pt-14 pb-6 px-6 flex flex-col items-center">
        {/* Logo */}
        <div
          className={`transition-all duration-700 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-8"}`}
        >
          <div className="relative mb-4">
            <div
              className="w-20 h-20 rounded-3xl gradient-violet flex items-center justify-center animate-glow shadow-2xl"
              style={{ boxShadow: "0 0 40px rgba(124,92,252,0.4)" }}
            >
              <span className="text-3xl">🎓</span>
            </div>
            {/* Decorative ring */}
            <div
              className="absolute inset-0 rounded-3xl border-2 border-app-violet/30 scale-110"
              style={{ borderColor: "rgba(124,92,252,0.3)" }}
            />
            <div
              className="absolute inset-0 rounded-3xl border border-app-violet/15 scale-125"
              style={{ borderColor: "rgba(124,92,252,0.15)" }}
            />
          </div>
        </div>

        <div
          className={`text-center transition-all duration-700 delay-100 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
        >
          <h1 className="text-3xl font-bold gradient-text-violet mb-1">ВнеКласс</h1>
          <p className="text-app-text-muted text-sm">Система управления внеклассной деятельностью</p>
          <div className="mt-2 inline-flex items-center gap-1.5 bg-app-card border border-app-border rounded-full px-3 py-1">
            <div className="w-1.5 h-1.5 rounded-full bg-app-green animate-pulse-dot" style={{ backgroundColor: "#2ECC8A" }} />
            <span className="text-[11px] text-app-text-muted">Школа №47 · Москва</span>
          </div>
        </div>
      </div>

      {/* Form card */}
      <div className="relative z-10 flex-1 px-5">
        <div
          className={`bg-app-card border border-app-border rounded-4xl p-6 shadow-2xl transition-all duration-700 delay-200 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
          style={{ boxShadow: "0 24px 80px rgba(0,0,0,0.4)" }}
        >
          <div className="mb-5">
            <h2 className="text-xl font-bold mb-1">Добро пожаловать!</h2>
            <p className="text-app-text-muted text-sm">Войдите в свой аккаунт</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Login field */}
            <div>
              <label className="text-xs font-medium text-app-text-muted uppercase tracking-wider mb-2 block">
                Логин
              </label>
              <div
                className={`relative flex items-center rounded-2xl border transition-all duration-200 ${
                  activeField === "login"
                    ? "border-app-violet bg-app-surface"
                    : "border-app-border bg-app-surface"
                }`}
                style={activeField === "login" ? { borderColor: "#7C5CFC", boxShadow: "0 0 0 3px rgba(124,92,252,0.15)" } : {}}
              >
                <div className="pl-4 flex-shrink-0">
                  <Icon name="User" size={16} className="text-app-text-muted" />
                </div>
                <input
                  type="text"
                  value={login}
                  onChange={(e) => { setLogin(e.target.value); setError(""); }}
                  onFocus={() => setActiveField("login")}
                  onBlur={() => setActiveField(null)}
                  placeholder="Введите логин"
                  className="flex-1 bg-transparent px-3 py-3.5 text-sm text-app-text placeholder:text-app-text-dim outline-none"
                  autoComplete="username"
                />
              </div>
            </div>

            {/* Password field */}
            <div>
              <label className="text-xs font-medium text-app-text-muted uppercase tracking-wider mb-2 block">
                Пароль
              </label>
              <div
                className={`relative flex items-center rounded-2xl border transition-all duration-200 ${
                  activeField === "password"
                    ? "border-app-violet bg-app-surface"
                    : "border-app-border bg-app-surface"
                }`}
                style={activeField === "password" ? { borderColor: "#7C5CFC", boxShadow: "0 0 0 3px rgba(124,92,252,0.15)" } : {}}
              >
                <div className="pl-4 flex-shrink-0">
                  <Icon name="Lock" size={16} className="text-app-text-muted" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setError(""); }}
                  onFocus={() => setActiveField("password")}
                  onBlur={() => setActiveField(null)}
                  placeholder="Введите пароль"
                  className="flex-1 bg-transparent px-3 py-3.5 text-sm text-app-text placeholder:text-app-text-dim outline-none"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="pr-4 flex-shrink-0 text-app-text-dim hover:text-app-text-muted transition-colors"
                >
                  <Icon name={showPassword ? "EyeOff" : "Eye"} size={16} />
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 rounded-2xl px-4 py-3 animate-fade-in">
                <Icon name="AlertCircle" size={14} className="text-red-400 flex-shrink-0" />
                <span className="text-xs text-red-400">{error}</span>
              </div>
            )}

            {/* Submit button */}
            <button
              type="submit"
              disabled={loading || !login || !password}
              className={`w-full py-4 rounded-2xl text-sm font-bold text-white transition-all duration-200 relative overflow-hidden ${
                loading || !login || !password
                  ? "opacity-50 cursor-not-allowed bg-app-border"
                  : "gradient-violet hover:opacity-90 hover:scale-[1.02] active:scale-[0.98]"
              }`}
              style={
                !loading && login && password
                  ? { boxShadow: "0 8px 30px rgba(124,92,252,0.4)" }
                  : {}
              }
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Входим...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2">
                  <span>Войти</span>
                  <Icon name="ArrowRight" size={16} />
                </div>
              )}
            </button>
          </form>
        </div>

        {/* Demo accounts */}
        <div
          className={`mt-4 transition-all duration-700 delay-300 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
        >
          <div className="text-center text-xs text-app-text-dim mb-3">Быстрый вход для демо</div>
          <div className="grid grid-cols-3 gap-2">
            {DEMO_USERS.map((u) => (
              <button
                key={u.login}
                onClick={() => fillDemo(u)}
                className="bg-app-card border border-app-border rounded-2xl p-3 text-center hover:border-app-violet/40 transition-all duration-200 hover:scale-105 active:scale-95"
                style={{ hover: { borderColor: "rgba(124,92,252,0.4)" } } as React.CSSProperties}
              >
                <div
                  className="w-8 h-8 rounded-xl mx-auto mb-1.5 flex items-center justify-center text-xs font-bold text-white"
                  style={{
                    background:
                      u.login === "ученик"
                        ? "linear-gradient(135deg, #7C5CFC, #4A8CFF)"
                        : u.login === "учитель"
                        ? "linear-gradient(135deg, #2ECC8A, #4A8CFF)"
                        : "linear-gradient(135deg, #FF6B35, #FF4D8B)",
                  }}
                >
                  {u.initials}
                </div>
                <div className="text-[10px] font-medium text-app-text truncate">{u.login}</div>
                <div className="text-[9px] text-app-text-dim truncate">
                  {u.login === "ученик" ? "Ученик" : u.login === "учитель" ? "Учитель" : "Admin"}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom safe area */}
      <div className="h-8" />
    </div>
  );
}
