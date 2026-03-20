import { useState, useEffect } from "react";
import Icon from "@/components/ui/icon";

interface User {
  name: string;
  role: string;
  roleType: "student" | "teacher" | "admin";
  initials: string;
  className?: string;
}

interface LoginPageProps {
  onLogin: (user: User) => void;
}

type Screen = "login" | "register";
type RoleType = "student" | "teacher" | "admin";

const ROLES: { value: RoleType; label: string; desc: string; emoji: string; color: string }[] = [
  { value: "student", label: "Ученик", desc: "Запись на мероприятия", emoji: "🎒", color: "#7C5CFC" },
  { value: "teacher", label: "Учитель", desc: "Управление кружками", emoji: "📚", color: "#2ECC8A" },
  { value: "admin", label: "Администратор", desc: "Полный доступ", emoji: "⚙️", color: "#FF6B35" },
];

// Local storage key for registered users
const STORAGE_KEY = "vneclass_users";

interface StoredUser {
  login: string;
  password: string;
  name: string;
  roleType: RoleType;
  className?: string;
}

function getUsers(): StoredUser[] {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  } catch {
    return [];
  }
}

function saveUser(user: StoredUser) {
  const users = getUsers();
  users.push(user);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
}

function makeInitials(name: string) {
  return name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() || "")
    .join("");
}

function makeRoleLabel(roleType: RoleType, className?: string) {
  if (roleType === "student") return `Ученик${className ? ` · ${className}` : ""}`;
  if (roleType === "teacher") return "Учитель · Куратор";
  return "Администратор";
}

type ActiveField = "login" | "password" | "name" | "class" | "confirmPassword" | null;

export default function LoginPage({ onLogin }: LoginPageProps) {
  const [screen, setScreen] = useState<Screen>("login");
  const [mounted, setMounted] = useState(false);
  const [activeField, setActiveField] = useState<ActiveField>(null);

  // Login
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);

  // Register
  const [regName, setRegName] = useState("");
  const [regLogin, setRegLogin] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regConfirm, setRegConfirm] = useState("");
  const [regClass, setRegClass] = useState("");
  const [regRole, setRegRole] = useState<RoleType>("student");
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [regError, setRegError] = useState("");
  const [regLoading, setRegLoading] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    setLoginLoading(true);
    await new Promise((r) => setTimeout(r, 700));

    const users = getUsers();
    const found = users.find(
      (u) => u.login === login.toLowerCase().trim() && u.password === password
    );

    if (found) {
      onLogin({
        name: found.name,
        role: makeRoleLabel(found.roleType, found.className),
        roleType: found.roleType,
        initials: makeInitials(found.name),
        className: found.className,
      });
    } else {
      setLoginError("Неверный логин или пароль");
      setLoginLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegError("");

    if (!regName.trim() || regName.trim().split(" ").length < 2) {
      setRegError("Введите имя и фамилию");
      return;
    }
    if (regLogin.trim().length < 3) {
      setRegError("Логин должен быть не короче 3 символов");
      return;
    }
    if (regPassword.length < 4) {
      setRegError("Пароль должен быть не короче 4 символов");
      return;
    }
    if (regPassword !== regConfirm) {
      setRegError("Пароли не совпадают");
      return;
    }

    const users = getUsers();
    if (users.find((u) => u.login === regLogin.toLowerCase().trim())) {
      setRegError("Такой логин уже занят");
      return;
    }

    setRegLoading(true);
    await new Promise((r) => setTimeout(r, 700));

    const newUser: StoredUser = {
      login: regLogin.toLowerCase().trim(),
      password: regPassword,
      name: regName.trim(),
      roleType: regRole,
      className: regRole === "student" ? regClass : undefined,
    };
    saveUser(newUser);

    onLogin({
      name: newUser.name,
      role: makeRoleLabel(newUser.roleType, newUser.className),
      roleType: newUser.roleType,
      initials: makeInitials(newUser.name),
      className: newUser.className,
    });
  };

  const inputClass = (field: ActiveField) =>
    `relative flex items-center rounded-2xl border transition-all duration-200 ${
      activeField === field ? "bg-app-surface" : "border-app-border bg-app-surface"
    }`;

  const inputStyle = (field: ActiveField): React.CSSProperties =>
    activeField === field
      ? { borderColor: "#7C5CFC", boxShadow: "0 0 0 3px rgba(124,92,252,0.15)" }
      : {};

  return (
    <div className="min-h-screen bg-app-bg font-golos flex flex-col overflow-hidden relative">
      {/* Ambient blobs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-32 -left-32 w-80 h-80 rounded-full opacity-20 animate-float"
          style={{ background: "radial-gradient(circle, #7C5CFC, transparent)" }} />
        <div className="absolute top-1/3 -right-24 w-64 h-64 rounded-full opacity-15 animate-float"
          style={{ background: "radial-gradient(circle, #4A8CFF, transparent)", animationDelay: "2s" }} />
        <div className="absolute bottom-0 left-1/4 w-72 h-72 rounded-full opacity-10 animate-float"
          style={{ background: "radial-gradient(circle, #FF4D8B, transparent)", animationDelay: "4s" }} />
        <div className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(rgba(124,92,252,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(124,92,252,0.5) 1px, transparent 1px)`,
            backgroundSize: "40px 40px",
          }} />
      </div>

      {/* Logo */}
      <div className={`relative z-10 pt-12 pb-5 px-6 flex flex-col items-center transition-all duration-700 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-8"}`}>
        <div className="relative mb-4">
          <div className="w-18 h-18 w-[72px] h-[72px] rounded-3xl gradient-violet flex items-center justify-center animate-glow shadow-2xl"
            style={{ boxShadow: "0 0 40px rgba(124,92,252,0.4)" }}>
            <span className="text-3xl">🎓</span>
          </div>
          <div className="absolute inset-0 rounded-3xl border-2 scale-110" style={{ borderColor: "rgba(124,92,252,0.3)" }} />
          <div className="absolute inset-0 rounded-3xl border scale-125" style={{ borderColor: "rgba(124,92,252,0.15)" }} />
        </div>
        <h1 className="text-3xl font-bold gradient-text-violet mb-1">ВнеКласс</h1>
        <p className="text-app-text-muted text-sm text-center">Система управления внеклассной деятельностью</p>
      </div>

      {/* Tab switcher */}
      <div className={`relative z-10 px-5 mb-4 transition-all duration-700 delay-100 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
        <div className="flex bg-app-card border border-app-border rounded-2xl p-1">
          {(["login", "register"] as Screen[]).map((s) => (
            <button
              key={s}
              onClick={() => { setScreen(s); setLoginError(""); setRegError(""); }}
              className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                screen === s ? "gradient-violet text-white shadow" : "text-app-text-muted"
              }`}
            >
              {s === "login" ? "Вход" : "Регистрация"}
            </button>
          ))}
        </div>
      </div>

      {/* Card */}
      <div className="relative z-10 flex-1 px-5 overflow-y-auto">
        <div
          className={`bg-app-card border border-app-border rounded-4xl p-6 shadow-2xl transition-all duration-500 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
          style={{ boxShadow: "0 24px 80px rgba(0,0,0,0.4)" }}
        >

          {/* LOGIN */}
          {screen === "login" && (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <h2 className="text-xl font-bold mb-1">Добро пожаловать!</h2>
                <p className="text-app-text-muted text-sm">Войдите в свой аккаунт</p>
              </div>

              <div>
                <label className="text-xs font-medium text-app-text-muted uppercase tracking-wider mb-2 block">Логин</label>
                <div className={inputClass("login")} style={inputStyle("login")}>
                  <div className="pl-4"><Icon name="User" size={16} className="text-app-text-muted" /></div>
                  <input
                    type="text" value={login}
                    onChange={(e) => { setLogin(e.target.value); setLoginError(""); }}
                    onFocus={() => setActiveField("login")} onBlur={() => setActiveField(null)}
                    placeholder="Введите логин"
                    className="flex-1 bg-transparent px-3 py-3.5 text-sm text-app-text placeholder:text-app-text-dim outline-none"
                    autoComplete="username"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-app-text-muted uppercase tracking-wider mb-2 block">Пароль</label>
                <div className={inputClass("password")} style={inputStyle("password")}>
                  <div className="pl-4"><Icon name="Lock" size={16} className="text-app-text-muted" /></div>
                  <input
                    type={showPassword ? "text" : "password"} value={password}
                    onChange={(e) => { setPassword(e.target.value); setLoginError(""); }}
                    onFocus={() => setActiveField("password")} onBlur={() => setActiveField(null)}
                    placeholder="Введите пароль"
                    className="flex-1 bg-transparent px-3 py-3.5 text-sm text-app-text placeholder:text-app-text-dim outline-none"
                    autoComplete="current-password"
                  />
                  <button type="button" onClick={() => setShowPassword((v) => !v)} className="pr-4 text-app-text-dim hover:text-app-text-muted transition-colors">
                    <Icon name={showPassword ? "EyeOff" : "Eye"} size={16} />
                  </button>
                </div>
              </div>

              {loginError && (
                <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 rounded-2xl px-4 py-3 animate-fade-in">
                  <Icon name="AlertCircle" size={14} className="text-red-400 flex-shrink-0" />
                  <span className="text-xs text-red-400">{loginError}</span>
                </div>
              )}

              <button
                type="submit" disabled={loginLoading || !login || !password}
                className={`w-full py-4 rounded-2xl text-sm font-bold text-white transition-all duration-200 ${
                  loginLoading || !login || !password
                    ? "opacity-40 cursor-not-allowed bg-app-border"
                    : "gradient-violet hover:opacity-90 hover:scale-[1.02] active:scale-[0.98]"
                }`}
                style={!loginLoading && login && password ? { boxShadow: "0 8px 30px rgba(124,92,252,0.4)" } : {}}
              >
                {loginLoading ? (
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

              <p className="text-center text-xs text-app-text-dim pt-1">
                Нет аккаунта?{" "}
                <button type="button" onClick={() => setScreen("register")} className="font-semibold" style={{ color: "#9B7FFF" }}>
                  Зарегистрироваться
                </button>
              </p>
            </form>
          )}

          {/* REGISTER */}
          {screen === "register" && (
            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <h2 className="text-xl font-bold mb-1">Создать аккаунт</h2>
                <p className="text-app-text-muted text-sm">Заполните данные для регистрации</p>
              </div>

              {/* Role selector */}
              <div>
                <label className="text-xs font-medium text-app-text-muted uppercase tracking-wider mb-2 block">Роль</label>
                <div className="grid grid-cols-3 gap-2">
                  {ROLES.map((r) => (
                    <button
                      key={r.value} type="button"
                      onClick={() => setRegRole(r.value)}
                      className={`flex flex-col items-center gap-1.5 py-3 px-2 rounded-2xl border transition-all duration-200 ${
                        regRole === r.value ? "scale-[1.03]" : "border-app-border hover:border-app-border/80"
                      }`}
                      style={regRole === r.value ? { borderColor: r.color, backgroundColor: `${r.color}15`, boxShadow: `0 0 0 2px ${r.color}30` } : {}}
                    >
                      <span className="text-xl">{r.emoji}</span>
                      <span className="text-[11px] font-semibold" style={regRole === r.value ? { color: r.color } : { color: "#8B92B0" }}>{r.label}</span>
                      <span className="text-[9px] text-app-text-dim text-center leading-tight">{r.desc}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Name */}
              <div>
                <label className="text-xs font-medium text-app-text-muted uppercase tracking-wider mb-2 block">Имя и фамилия</label>
                <div className={inputClass("name")} style={inputStyle("name")}>
                  <div className="pl-4"><Icon name="UserRound" size={16} className="text-app-text-muted" /></div>
                  <input
                    type="text" value={regName}
                    onChange={(e) => { setRegName(e.target.value); setRegError(""); }}
                    onFocus={() => setActiveField("name")} onBlur={() => setActiveField(null)}
                    placeholder="Иван Иванов"
                    className="flex-1 bg-transparent px-3 py-3.5 text-sm text-app-text placeholder:text-app-text-dim outline-none"
                  />
                </div>
              </div>

              {/* Class (only for students) */}
              {regRole === "student" && (
                <div className="animate-fade-in">
                  <label className="text-xs font-medium text-app-text-muted uppercase tracking-wider mb-2 block">Класс</label>
                  <div className={inputClass("class")} style={inputStyle("class")}>
                    <div className="pl-4"><Icon name="BookOpen" size={16} className="text-app-text-muted" /></div>
                    <input
                      type="text" value={regClass}
                      onChange={(e) => setRegClass(e.target.value)}
                      onFocus={() => setActiveField("class")} onBlur={() => setActiveField(null)}
                      placeholder="Например: 9А"
                      className="flex-1 bg-transparent px-3 py-3.5 text-sm text-app-text placeholder:text-app-text-dim outline-none"
                    />
                  </div>
                </div>
              )}

              {/* Login */}
              <div>
                <label className="text-xs font-medium text-app-text-muted uppercase tracking-wider mb-2 block">Логин</label>
                <div className={inputClass("login")} style={inputStyle("login")}>
                  <div className="pl-4"><Icon name="AtSign" size={16} className="text-app-text-muted" /></div>
                  <input
                    type="text" value={regLogin}
                    onChange={(e) => { setRegLogin(e.target.value); setRegError(""); }}
                    onFocus={() => setActiveField("login")} onBlur={() => setActiveField(null)}
                    placeholder="Придумайте логин"
                    className="flex-1 bg-transparent px-3 py-3.5 text-sm text-app-text placeholder:text-app-text-dim outline-none"
                    autoComplete="username"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="text-xs font-medium text-app-text-muted uppercase tracking-wider mb-2 block">Пароль</label>
                <div className={inputClass("password")} style={inputStyle("password")}>
                  <div className="pl-4"><Icon name="Lock" size={16} className="text-app-text-muted" /></div>
                  <input
                    type={showRegPassword ? "text" : "password"} value={regPassword}
                    onChange={(e) => { setRegPassword(e.target.value); setRegError(""); }}
                    onFocus={() => setActiveField("password")} onBlur={() => setActiveField(null)}
                    placeholder="Минимум 4 символа"
                    className="flex-1 bg-transparent px-3 py-3.5 text-sm text-app-text placeholder:text-app-text-dim outline-none"
                    autoComplete="new-password"
                  />
                  <button type="button" onClick={() => setShowRegPassword((v) => !v)} className="pr-4 text-app-text-dim hover:text-app-text-muted transition-colors">
                    <Icon name={showRegPassword ? "EyeOff" : "Eye"} size={16} />
                  </button>
                </div>
              </div>

              {/* Confirm password */}
              <div>
                <label className="text-xs font-medium text-app-text-muted uppercase tracking-wider mb-2 block">Подтвердите пароль</label>
                <div className={inputClass("confirmPassword")} style={inputStyle("confirmPassword")}>
                  <div className="pl-4"><Icon name="ShieldCheck" size={16} className="text-app-text-muted" /></div>
                  <input
                    type={showRegPassword ? "text" : "password"} value={regConfirm}
                    onChange={(e) => { setRegConfirm(e.target.value); setRegError(""); }}
                    onFocus={() => setActiveField("confirmPassword")} onBlur={() => setActiveField(null)}
                    placeholder="Повторите пароль"
                    className="flex-1 bg-transparent px-3 py-3.5 text-sm text-app-text placeholder:text-app-text-dim outline-none"
                    autoComplete="new-password"
                  />
                  {regConfirm && (
                    <div className="pr-4">
                      <Icon
                        name={regConfirm === regPassword ? "CheckCircle" : "XCircle"}
                        size={16}
                        style={{ color: regConfirm === regPassword ? "#2ECC8A" : "#FF4D8B" }}
                      />
                    </div>
                  )}
                </div>
              </div>

              {regError && (
                <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 rounded-2xl px-4 py-3 animate-fade-in">
                  <Icon name="AlertCircle" size={14} className="text-red-400 flex-shrink-0" />
                  <span className="text-xs text-red-400">{regError}</span>
                </div>
              )}

              <button
                type="submit" disabled={regLoading}
                className={`w-full py-4 rounded-2xl text-sm font-bold text-white transition-all duration-200 ${
                  regLoading ? "opacity-40 cursor-not-allowed bg-app-border" : "gradient-violet hover:opacity-90 hover:scale-[1.02] active:scale-[0.98]"
                }`}
                style={!regLoading ? { boxShadow: "0 8px 30px rgba(124,92,252,0.4)" } : {}}
              >
                {regLoading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Создаём аккаунт...</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-2">
                    <span>Зарегистрироваться</span>
                    <Icon name="ArrowRight" size={16} />
                  </div>
                )}
              </button>

              <p className="text-center text-xs text-app-text-dim pt-1">
                Уже есть аккаунт?{" "}
                <button type="button" onClick={() => setScreen("login")} className="font-semibold" style={{ color: "#9B7FFF" }}>
                  Войти
                </button>
              </p>
            </form>
          )}
        </div>
      </div>

      <div className="h-8" />
    </div>
  );
}
