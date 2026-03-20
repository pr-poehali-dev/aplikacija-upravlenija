import { useState, useEffect } from "react";
import Icon from "@/components/ui/icon";

const EVENTS = [
  {
    id: 1,
    title: "Олимпиада по математике",
    date: "22 марта",
    time: "10:00",
    place: "Каб. 305",
    category: "Олимпиада",
    color: "gradient-violet",
    accent: "#7C5CFC",
    participants: 24,
    maxParticipants: 30,
    registered: false,
    emoji: "🏆",
  },
  {
    id: 2,
    title: "Театральная постановка",
    date: "25 марта",
    time: "15:00",
    place: "Актовый зал",
    category: "Творчество",
    color: "gradient-orange",
    accent: "#FF6B35",
    participants: 18,
    maxParticipants: 20,
    registered: true,
    emoji: "🎭",
  },
  {
    id: 3,
    title: "Турнир по шахматам",
    date: "27 марта",
    time: "14:00",
    place: "Библиотека",
    category: "Спорт",
    color: "gradient-green",
    accent: "#2ECC8A",
    participants: 12,
    maxParticipants: 16,
    registered: false,
    emoji: "♟️",
  },
  {
    id: 4,
    title: "Кружок робототехники",
    date: "29 марта",
    time: "16:00",
    place: "Каб. 112",
    category: "Технологии",
    color: "gradient-pink",
    accent: "#FF4D8B",
    participants: 8,
    maxParticipants: 12,
    registered: false,
    emoji: "🤖",
  },
];

const SCHEDULE = [
  { day: "Пн", date: "18", events: ["Хор", "Рисование"], colors: ["#7C5CFC", "#FF6B35"] },
  { day: "Вт", date: "19", events: ["Робототехника"], colors: ["#FF4D8B"] },
  { day: "Ср", date: "20", events: ["Шахматы", "Танцы"], colors: ["#2ECC8A", "#7C5CFC"], today: true },
  { day: "Чт", date: "21", events: ["Театр"], colors: ["#FF6B35"] },
  { day: "Пт", date: "22", events: ["Олимпиада"], colors: ["#4A8CFF"] },
  { day: "Сб", date: "23", events: [], colors: [] },
  { day: "Вс", date: "24", events: [], colors: [] },
];

const ANNOUNCEMENTS = [
  {
    id: 1,
    title: "Запись на олимпиаду открыта!",
    text: "Успейте зарегистрироваться на межшкольную олимпиаду по математике. Осталось 6 мест.",
    time: "2 мин назад",
    type: "urgent",
    read: false,
    icon: "Megaphone",
    color: "#7C5CFC",
  },
  {
    id: 2,
    title: "Итоги конкурса рисунков",
    text: "Поздравляем победителей! Результаты опубликованы на стенде в холле школы.",
    time: "1 час назад",
    type: "success",
    read: false,
    icon: "Award",
    color: "#2ECC8A",
  },
  {
    id: 3,
    title: "Перенос занятия по театру",
    text: "Занятие в пятницу переносится с 15:00 на 16:30. Место остаётся прежним.",
    time: "3 часа назад",
    type: "info",
    read: true,
    icon: "Calendar",
    color: "#FF6B35",
  },
  {
    id: 4,
    title: "Новый кружок по программированию",
    text: "С апреля открывается кружок по Python для учеников 7-9 классов. Запись уже идёт!",
    time: "Вчера",
    type: "new",
    read: true,
    icon: "Code",
    color: "#4A8CFF",
  },
];

type Tab = "events" | "schedule" | "announcements";

export default function Index() {
  const [activeTab, setActiveTab] = useState<Tab>("events");
  const [events, setEvents] = useState(EVENTS);
  const [announcements, setAnnouncements] = useState(ANNOUNCEMENTS);
  const [notifVisible, setNotifVisible] = useState(false);
  const [bellRing, setBellRing] = useState(false);
  const [registeredEvent, setRegisteredEvent] = useState<number | null>(null);
  const [selectedDay, setSelectedDay] = useState(2);
  const [mounted, setMounted] = useState(false);

  const unreadCount = announcements.filter((a) => !a.read).length;

  useEffect(() => {
    setMounted(true);
    const timer = setInterval(() => {
      setBellRing(true);
      setTimeout(() => setBellRing(false), 1100);
    }, 8000);
    return () => clearInterval(timer);
  }, []);

  const handleRegister = (id: number) => {
    setEvents((prev) =>
      prev.map((e) =>
        e.id === id
          ? { ...e, registered: !e.registered, participants: e.registered ? e.participants - 1 : e.participants + 1 }
          : e
      )
    );
    setRegisteredEvent(id);
    setTimeout(() => setRegisteredEvent(null), 2000);
  };

  const handleReadAnnouncement = (id: number) => {
    setAnnouncements((prev) =>
      prev.map((a) => (a.id === id ? { ...a, read: true } : a))
    );
  };

  const handleNotifBell = () => {
    setNotifVisible((v) => !v);
    setBellRing(true);
    setTimeout(() => setBellRing(false), 1100);
  };

  return (
    <div className="min-h-screen bg-app-bg font-golos noise-bg overflow-x-hidden">
      {/* Ambient blobs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute -top-40 -left-40 w-96 h-96 rounded-full opacity-10 animate-float"
          style={{ background: "radial-gradient(circle, #7C5CFC, transparent)" }}
        />
        <div
          className="absolute top-1/2 -right-32 w-72 h-72 rounded-full opacity-8 animate-float"
          style={{ background: "radial-gradient(circle, #4A8CFF, transparent)", animationDelay: "1.5s" }}
        />
        <div
          className="absolute -bottom-20 left-1/3 w-64 h-64 rounded-full opacity-8 animate-float"
          style={{ background: "radial-gradient(circle, #FF4D8B, transparent)", animationDelay: "3s" }}
        />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 glass px-4 py-3">
        <div className="flex items-center justify-between max-w-lg mx-auto">
          <div>
            <div className="text-xs text-app-text-muted tracking-widest uppercase font-medium">Школа №47</div>
            <div className="text-lg font-bold gradient-text-violet">ВнеКласс</div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleNotifBell}
              className="relative w-10 h-10 rounded-2xl bg-app-card border border-app-border flex items-center justify-center transition-all hover:border-app-violet"
            >
              <span className={bellRing ? "animate-bell-ring inline-block" : "inline-block"}>
                <Icon name="Bell" size={18} className="text-app-text-muted" />
              </span>
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full gradient-violet flex items-center justify-center text-[10px] font-bold text-white animate-pulse-dot">
                  {unreadCount}
                </span>
              )}
            </button>

            <div className="w-9 h-9 rounded-2xl gradient-violet flex items-center justify-center text-sm font-bold text-white">
              АС
            </div>
          </div>
        </div>

        {/* Notification dropdown */}
        {notifVisible && (
          <div className="absolute top-16 right-4 w-80 bg-app-card border border-app-border rounded-3xl shadow-2xl overflow-hidden animate-scale-in z-50">
            <div className="px-4 py-3 border-b border-app-border">
              <div className="font-semibold text-sm">Уведомления</div>
            </div>
            {announcements.filter((a) => !a.read).map((a) => (
              <div
                key={a.id}
                className="px-4 py-3 border-b border-app-border last:border-0 hover:bg-app-surface transition-colors cursor-pointer"
                onClick={() => {
                  handleReadAnnouncement(a.id);
                  setNotifVisible(false);
                  setActiveTab("announcements");
                }}
              >
                <div className="flex gap-3 items-start">
                  <div
                    className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: `${a.color}20` }}
                  >
                    <Icon name={a.icon} fallback="Bell" size={14} style={{ color: a.color }} />
                  </div>
                  <div>
                    <div className="text-xs font-semibold">{a.title}</div>
                    <div className="text-[11px] text-app-text-muted mt-0.5 line-clamp-2">{a.text}</div>
                  </div>
                </div>
              </div>
            ))}
            {unreadCount === 0 && (
              <div className="px-4 py-6 text-center text-app-text-muted text-sm">Всё прочитано ✓</div>
            )}
          </div>
        )}
      </header>

      {/* Main content */}
      <main className="max-w-lg mx-auto px-4 pb-28 pt-4">

        {/* Events Tab */}
        {activeTab === "events" && (
          <div>
            <div className={`mb-5 ${mounted ? "animate-fade-in" : "opacity-0"}`}>
              <h1 className="text-2xl font-bold mb-1">Мероприятия</h1>
              <p className="text-app-text-muted text-sm">Ближайшие события в школе</p>
            </div>

            {/* Stats row */}
            <div className={`grid grid-cols-3 gap-3 mb-5 ${mounted ? "animate-fade-in stagger-1" : "opacity-0"}`}>
              {[
                { label: "Записан", value: events.filter((e) => e.registered).length, color: "#7C5CFC" },
                { label: "Открыто", value: events.length, color: "#2ECC8A" },
                { label: "Мест осталось", value: events.reduce((s, e) => s + (e.maxParticipants - e.participants), 0), color: "#FF6B35" },
              ].map((stat) => (
                <div key={stat.label} className="bg-app-card border border-app-border rounded-2xl p-3 text-center">
                  <div className="text-xl font-bold" style={{ color: stat.color }}>{stat.value}</div>
                  <div className="text-[11px] text-app-text-muted mt-0.5">{stat.label}</div>
                </div>
              ))}
            </div>

            {/* Events list */}
            <div className="space-y-3">
              {events.map((event, i) => (
                <div
                  key={event.id}
                  className={`bg-app-card border border-app-border rounded-3xl overflow-hidden card-hover ${mounted ? "animate-fade-in" : "opacity-0"}`}
                  style={{ animationDelay: `${0.05 * (i + 2)}s` }}
                >
                  <div className={`h-1.5 w-full ${event.color}`} />
                  <div className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-11 h-11 rounded-2xl flex items-center justify-center text-2xl"
                          style={{ background: `${event.accent}18` }}
                        >
                          {event.emoji}
                        </div>
                        <div>
                          <div className="font-semibold text-sm leading-tight">{event.title}</div>
                          <div className="text-xs text-app-text-muted mt-0.5">{event.category}</div>
                        </div>
                      </div>
                      {event.registered && (
                        <span
                          className="text-[10px] font-semibold px-2 py-1 rounded-full border"
                          style={{ color: "#2ECC8A", borderColor: "#2ECC8A30", backgroundColor: "#2ECC8A10" }}
                        >
                          Записан
                        </span>
                      )}
                    </div>

                    <div className="flex flex-wrap gap-2 mb-3">
                      {[
                        { icon: "Calendar", text: event.date },
                        { icon: "Clock", text: event.time },
                        { icon: "MapPin", text: event.place },
                      ].map(({ icon, text }) => (
                        <div key={icon} className="flex items-center gap-1.5 bg-app-surface rounded-xl px-2.5 py-1.5">
                          <Icon name={icon} fallback="Circle" size={12} className="text-app-text-muted" />
                          <span className="text-xs text-app-text-muted">{text}</span>
                        </div>
                      ))}
                    </div>

                    <div className="mb-3">
                      <div className="flex justify-between text-[11px] text-app-text-muted mb-1.5">
                        <span>Участники</span>
                        <span><span className="text-app-text font-medium">{event.participants}</span>/{event.maxParticipants}</span>
                      </div>
                      <div className="h-1.5 bg-app-surface rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${event.color} transition-all duration-700`}
                          style={{ width: `${(event.participants / event.maxParticipants) * 100}%` }}
                        />
                      </div>
                    </div>

                    <button
                      onClick={() => handleRegister(event.id)}
                      className={`w-full py-2.5 rounded-2xl text-sm font-semibold transition-all duration-200 ${
                        registeredEvent === event.id ? "scale-95" : ""
                      } ${
                        event.registered
                          ? "bg-app-surface text-app-text-muted border border-app-border hover:border-red-500/50 hover:text-red-400"
                          : `${event.color} text-white hover:opacity-90`
                      }`}
                    >
                      {registeredEvent === event.id
                        ? event.registered
                          ? "✓ Вы записаны!"
                          : "Запись отменена"
                        : event.registered
                        ? "Отменить запись"
                        : "Записаться"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Schedule Tab */}
        {activeTab === "schedule" && (
          <div>
            <div className={`mb-5 ${mounted ? "animate-fade-in" : "opacity-0"}`}>
              <h1 className="text-2xl font-bold mb-1">Расписание</h1>
              <p className="text-app-text-muted text-sm">Март 2026</p>
            </div>

            <div className={`flex gap-2 mb-6 ${mounted ? "animate-fade-in stagger-1" : "opacity-0"}`}>
              {SCHEDULE.map((day, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedDay(i)}
                  className={`flex-1 flex flex-col items-center gap-1.5 py-3 rounded-2xl transition-all duration-200 ${
                    selectedDay === i
                      ? "gradient-violet text-white shadow-lg scale-105"
                      : day.today
                      ? "bg-app-card border-2 text-app-text"
                      : "bg-app-card border border-app-border text-app-text-muted"
                  }`}
                  style={day.today && selectedDay !== i ? { borderColor: "rgba(124,92,252,0.5)" } : {}}
                >
                  <span className="text-[10px] font-medium uppercase tracking-wide">{day.day}</span>
                  <span className="text-base font-bold">{day.date}</span>
                  {day.events.length > 0 && (
                    <div className="flex gap-0.5">
                      {day.colors.slice(0, 2).map((c, ci) => (
                        <div key={ci} className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: selectedDay === i ? "white" : c }} />
                      ))}
                    </div>
                  )}
                </button>
              ))}
            </div>

            <div className={`${mounted ? "animate-scale-in" : "opacity-0"}`}>
              <div className="flex items-center justify-between mb-3">
                <div className="font-semibold">
                  {SCHEDULE[selectedDay].day}, {SCHEDULE[selectedDay].date} марта
                </div>
                {SCHEDULE[selectedDay].today && (
                  <span className="text-xs px-2.5 py-1 rounded-full gradient-violet text-white font-medium">
                    Сегодня
                  </span>
                )}
              </div>

              {SCHEDULE[selectedDay].events.length === 0 ? (
                <div className="bg-app-card border border-app-border rounded-3xl p-8 text-center">
                  <div className="text-4xl mb-3">🎉</div>
                  <div className="font-semibold text-app-text-muted">Занятий нет</div>
                  <div className="text-xs text-app-text-dim mt-1">Свободный день!</div>
                </div>
              ) : (
                <div className="space-y-3">
                  {SCHEDULE[selectedDay].events.map((ev, i) => (
                    <div
                      key={i}
                      className="bg-app-card border border-app-border rounded-3xl p-4 flex items-center gap-4 card-hover animate-fade-in"
                      style={{ animationDelay: `${i * 0.1}s` }}
                    >
                      <div
                        className="w-1 h-14 rounded-full flex-shrink-0"
                        style={{ backgroundColor: SCHEDULE[selectedDay].colors[i] }}
                      />
                      <div className="flex-1">
                        <div className="font-semibold text-sm">{ev}</div>
                        <div className="text-xs text-app-text-muted mt-0.5">15:00 — 16:30</div>
                      </div>
                      <div
                        className="w-10 h-10 rounded-2xl flex items-center justify-center"
                        style={{ backgroundColor: `${SCHEDULE[selectedDay].colors[i]}18` }}
                      >
                        <Icon name="ChevronRight" size={16} style={{ color: SCHEDULE[selectedDay].colors[i] }} />
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="mt-6">
                <div className="text-xs font-semibold text-app-text-muted mb-3 uppercase tracking-widest">На этой неделе</div>
                <div className="space-y-2">
                  {SCHEDULE.filter((d) => d.events.length > 0).map((day, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-3 py-2.5 px-3 rounded-2xl hover:bg-app-card transition-colors cursor-pointer"
                      onClick={() => setSelectedDay(SCHEDULE.indexOf(day))}
                    >
                      <div className="text-xs font-medium text-app-text-muted w-6">{day.day}</div>
                      <div className="flex gap-1.5 flex-1 flex-wrap">
                        {day.events.map((ev, ei) => (
                          <span
                            key={ei}
                            className="text-xs px-2 py-0.5 rounded-lg"
                            style={{ backgroundColor: `${day.colors[ei]}20`, color: day.colors[ei] }}
                          >
                            {ev}
                          </span>
                        ))}
                      </div>
                      <div className="flex gap-1">
                        {day.colors.map((c, ci) => (
                          <div key={ci} className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: c }} />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Announcements Tab */}
        {activeTab === "announcements" && (
          <div>
            <div className={`flex items-center justify-between mb-5 ${mounted ? "animate-fade-in" : "opacity-0"}`}>
              <div>
                <h1 className="text-2xl font-bold mb-1">Объявления</h1>
                <p className="text-app-text-muted text-sm">
                  {unreadCount > 0 ? `${unreadCount} непрочитанных` : "Всё прочитано"}
                </p>
              </div>
              {unreadCount > 0 && (
                <button
                  onClick={() => setAnnouncements((prev) => prev.map((a) => ({ ...a, read: true })))}
                  className="text-xs font-medium px-3 py-1.5 rounded-xl transition-colors"
                  style={{ color: "#9B7FFF", backgroundColor: "rgba(124,92,252,0.1)" }}
                >
                  Прочитать все
                </button>
              )}
            </div>

            <div className="space-y-3">
              {announcements.map((ann, i) => (
                <div
                  key={ann.id}
                  onClick={() => handleReadAnnouncement(ann.id)}
                  className={`bg-app-card rounded-3xl p-4 cursor-pointer transition-all duration-300 card-hover border ${mounted ? "animate-fade-in" : "opacity-0"} ${ann.read ? "opacity-70" : ""}`}
                  style={{
                    animationDelay: `${i * 0.07}s`,
                    borderColor: !ann.read ? `${ann.color}40` : "rgba(42,47,74,1)",
                    boxShadow: !ann.read ? `0 0 0 1px ${ann.color}20` : undefined,
                  }}
                >
                  <div className="flex gap-3">
                    <div
                      className="w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: `${ann.color}18` }}
                    >
                      <Icon name={ann.icon} fallback="Bell" size={18} style={{ color: ann.color }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <div className="font-semibold text-sm leading-tight">{ann.title}</div>
                        {!ann.read && (
                          <div className="w-2 h-2 rounded-full flex-shrink-0 mt-1 animate-pulse-dot" style={{ backgroundColor: ann.color }} />
                        )}
                      </div>
                      <p className="text-xs text-app-text-muted leading-relaxed mb-2">{ann.text}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] text-app-text-dim">{ann.time}</span>
                        {!ann.read && (
                          <span
                            className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                            style={{ color: ann.color, backgroundColor: `${ann.color}15` }}
                          >
                            Новое
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div
              className={`mt-5 rounded-3xl p-5 relative overflow-hidden ${mounted ? "animate-fade-in stagger-5" : "opacity-0"}`}
              style={{
                background: "linear-gradient(135deg, rgba(124,92,252,0.2) 0%, rgba(74,140,255,0.2) 100%)",
                border: "1px solid rgba(124,92,252,0.3)",
              }}
            >
              <div className="absolute top-3 right-3 opacity-10 text-6xl select-none">🔔</div>
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-2xl gradient-violet flex items-center justify-center flex-shrink-0 animate-glow">
                  <Icon name="BellRing" size={18} className="text-white" />
                </div>
                <div>
                  <div className="font-semibold text-sm mb-1">Push-уведомления</div>
                  <div className="text-xs text-app-text-muted mb-3">
                    Получайте мгновенные уведомления о новых мероприятиях и объявлениях
                  </div>
                  <button className="gradient-violet text-white text-xs font-semibold px-4 py-2 rounded-xl hover:opacity-90 transition-opacity">
                    Включить уведомления
  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 glass border-t border-app-border">
        <div className="max-w-lg mx-auto px-4 py-2 flex items-center justify-around">
          {[
            { tab: "events" as Tab, icon: "Sparkles", label: "Мероприятия" },
            { tab: "schedule" as Tab, icon: "CalendarDays", label: "Расписание" },
            { tab: "announcements" as Tab, icon: "Megaphone", label: "Объявления" },
          ].map(({ tab, icon, label }) => {
            const isActive = activeTab === tab;
            const isAnn = tab === "announcements";
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex flex-col items-center gap-1 py-1.5 px-4 rounded-2xl transition-all duration-200 relative ${isActive ? "scale-105" : ""}`}
              >
                <div className="relative">
                  <Icon
                    name={icon}
                    fallback="Circle"
                    size={22}
                    style={isActive ? { color: "#9B7FFF" } : { color: "#5A6080" }}
                  />
                  {isAnn && unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full gradient-orange flex items-center justify-center text-[9px] font-bold text-white">
                      {unreadCount}
                    </span>
                  )}
                </div>
                <span
                  className="text-[10px] font-medium transition-colors"
                  style={isActive ? {} : { color: "#5A6080" }}
                >
                  {isActive ? <span className="gradient-text-violet">{label}</span> : label}
                </span>
                {isActive && (
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full gradient-violet" />
                )}
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}