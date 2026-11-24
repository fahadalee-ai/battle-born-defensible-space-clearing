import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { siteConfig } from "@/data/siteConfig";
import type { CustomerType } from "@/data/content";
import { addDaysISO, refCode, todayISO, uid } from "@/lib/format";

export type User = {
  id: string;
  name: string;
  email: string;
  phone: string;
  password: string;
  customerType: CustomerType;
  company?: string;
  roleTitle?: string;
};

export type Property = {
  id: string;
  userId: string;
  label: string;
  address: string;
  size: string;
  notes: string;
};

export type AppointmentStatus = "Pending" | "Confirmed" | "In Progress" | "Completed" | "Cancelled";

export type Appointment = {
  id: string;
  userId: string;
  ref: string;
  services: string[];
  customerType: CustomerType;
  address: string;
  size: string;
  terrain: string;
  vegetation: string;
  access: string;
  structures: string[];
  lots: number;
  notes: string;
  urgent: boolean;
  photos: string[];
  date: string;
  timeSlot: string;
  startTime: string;
  appointmentType: string;
  contactName: string;
  phone: string;
  email: string;
  contactMethod: string;
  company: string;
  roleTitle: string;
  status: AppointmentStatus;
  cancelReason?: string;
  quoteId?: string;
  createdAt: string;
};

export type Quote = {
  id: string;
  userId: string;
  appointmentId?: string;
  services: string[];
  address: string;
  status: "Pending" | "Ready" | "Accepted" | "Changes Requested" | "Declined";
  notes: string;
  changeNote?: string;
  lines: { label: string; detail: string }[];
  createdAt: string;
};

export type Review = {
  id: string;
  userId: string;
  appointmentId?: string;
  stars: number;
  text: string;
  photos: string[];
  createdAt: string;
};

export type Notice = {
  id: string;
  userId: string;
  title: string;
  body: string;
  day: string;
  read: boolean;
  appointmentId?: string;
};

export type BookingDraft = {
  services: string[];
  customerType: CustomerType;
  address: string;
  size: string;
  terrain: string;
  vegetation: string;
  access: string;
  structures: string[];
  lots: number;
  notes: string;
  urgent: boolean;
  photos: string[];
  date: string;
  timeSlot: string;
  startTime: string;
  appointmentType: string;
  name: string;
  phone: string;
  email: string;
  contactMethod: string;
  company: string;
  roleTitle: string;
  consent: boolean;
};

export type Prefs = {
  appearance: "light" | "dark" | "system";
  language: "en" | "es";
  push: boolean;
  email: boolean;
  sms: boolean;
  reminders: boolean;
};

type PendingReg = Omit<User, "id">;

type State = {
  users: User[];
  sessionId: string | null;
  onboarded: boolean;
  prefs: Prefs;
  properties: Property[];
  appointments: Appointment[];
  quotes: Quote[];
  reviews: Review[];
  notices: Notice[];
  draft: BookingDraft;
  checklist: Record<string, boolean>;
  welcome: boolean;
  guestGate: boolean;
  returnTo: string;
  sessionExpired: boolean;
};

const KEY = "bbdsc.v1";

const demoUser: User = {
  id: "user-jordan",
  name: "Jordan Hale",
  email: siteConfig.demo.email,
  phone: "7755550148",
  password: siteConfig.demo.password,
  customerType: "Residential",
};

export function emptyDraft(partial?: Partial<BookingDraft>): BookingDraft {
  return {
    services: [],
    customerType: "Residential",
    address: "",
    size: "",
    terrain: "",
    vegetation: "",
    access: "",
    structures: [],
    lots: 1,
    notes: "",
    urgent: false,
    photos: [],
    date: "",
    timeSlot: "",
    startTime: "",
    appointmentType: "On-site Assessment",
    name: "",
    phone: "",
    email: "",
    contactMethod: "Phone",
    company: "",
    roleTitle: "",
    consent: false,
    ...partial,
  };
}

function seed(): Pick<State, "appointments" | "quotes" | "notices" | "properties"> {
  const upcoming = addDaysISO(6);
  const later = addDaysISO(18);
  const done = addDaysISO(-20);
  const cancelled = addDaysISO(-4);
  const quoteId = "quote-seed";
  const appointments: Appointment[] = [
    {
      id: "apt-upcoming",
      userId: demoUser.id,
      ref: "BB-104428",
      services: ["defensible"],
      customerType: "Residential",
      address: "1200 Foothill Road, Sample City, NV",
      size: "1–5 acres",
      terrain: "Moderate slope",
      vegetation: "Mixed",
      access: "Driveway",
      structures: ["Home", "Garage"],
      lots: 1,
      notes: "Sample appointment. Gate is on the north side.",
      urgent: false,
      photos: [],
      date: upcoming,
      timeSlot: "Morning",
      startTime: "9:00 AM",
      appointmentType: "On-site Assessment",
      contactName: demoUser.name,
      phone: demoUser.phone,
      email: demoUser.email,
      contactMethod: "Phone",
      company: "",
      roleTitle: "",
      status: "Confirmed",
      quoteId,
      createdAt: todayISO(),
    },
    {
      id: "apt-pending",
      userId: demoUser.id,
      ref: "BB-229110",
      services: ["mastication"],
      customerType: "Residential",
      address: "45 Sagebrush Lane, Sample City, NV",
      size: "5–20 acres",
      terrain: "Flat",
      vegetation: "Brush",
      access: "Road",
      structures: ["Home", "Barn"],
      lots: 1,
      notes: "Sample request waiting for a crew time.",
      urgent: true,
      photos: [],
      date: later,
      timeSlot: "Afternoon",
      startTime: "2:00 PM",
      appointmentType: "On-site Assessment",
      contactName: demoUser.name,
      phone: demoUser.phone,
      email: demoUser.email,
      contactMethod: "Text",
      company: "",
      roleTitle: "",
      status: "Pending",
      createdAt: todayISO(),
    },
    {
      id: "apt-done",
      userId: demoUser.id,
      ref: "BB-883201",
      services: ["thinning"],
      customerType: "Residential",
      address: "12 Greenbelt Court, Sample City, NV",
      size: "Under 1 acre",
      terrain: "Steep",
      vegetation: "Trees",
      access: "Gate",
      structures: ["Home"],
      lots: 1,
      notes: "Sample completed visit.",
      urgent: false,
      photos: [],
      date: done,
      timeSlot: "Midday",
      startTime: "11:00 AM",
      appointmentType: "On-site Assessment",
      contactName: demoUser.name,
      phone: demoUser.phone,
      email: demoUser.email,
      contactMethod: "Email",
      company: "",
      roleTitle: "",
      status: "Completed",
      createdAt: done,
    },
    {
      id: "apt-cancel",
      userId: demoUser.id,
      ref: "BB-550019",
      services: ["land"],
      customerType: "Residential",
      address: "800 Industrial Way, Sample City, NV",
      size: "1–5 acres",
      terrain: "Flat",
      vegetation: "Brush",
      access: "Road",
      structures: ["Shop"],
      lots: 1,
      notes: "",
      urgent: false,
      photos: [],
      date: cancelled,
      timeSlot: "Morning",
      startTime: "8:00 AM",
      appointmentType: "Phone Call",
      contactName: demoUser.name,
      phone: demoUser.phone,
      email: demoUser.email,
      contactMethod: "Phone",
      company: "",
      roleTitle: "",
      status: "Cancelled",
      cancelReason: "Schedule conflict",
      createdAt: cancelled,
    },
  ];
  const quotes: Quote[] = [
    {
      id: quoteId,
      userId: demoUser.id,
      appointmentId: "apt-upcoming",
      services: ["defensible"],
      address: "1200 Foothill Road, Sample City, NV",
      status: "Ready",
      notes: "Sample quote for demonstration. Amounts are not listed until a real estimate is written.",
      lines: [
        { label: "On-site assessment", detail: "Included" },
        { label: "Defensible space clearing", detail: "Priced after the site visit" },
        { label: "Debris handling", detail: "Chip or haul-off, confirmed on site" },
      ],
      createdAt: todayISO(),
    },
  ];
  const notices: Notice[] = [
    {
      id: "n1",
      userId: demoUser.id,
      title: "Assessment confirmed",
      body: "Your foothill visit is on the calendar. We will call if access changes.",
      day: "Today",
      read: false,
      appointmentId: "apt-upcoming",
    },
    {
      id: "n2",
      userId: demoUser.id,
      title: "Sample quote ready",
      body: "A sample quote is attached to your upcoming visit. Real prices are set after the assessment.",
      day: "Today",
      read: false,
      appointmentId: "apt-upcoming",
    },
    {
      id: "n3",
      userId: demoUser.id,
      title: "Seasonal reminder",
      body: "Walk gutters and the first five feet before the windy part of the year.",
      day: "Earlier",
      read: true,
    },
  ];
  const properties: Property[] = [
    {
      id: "prop-1",
      userId: demoUser.id,
      label: "Home",
      address: "1200 Foothill Road, Sample City, NV",
      size: "1–5 acres",
      notes: "Sample property. North gate.",
    },
  ];
  return { appointments, quotes, notices, properties };
}

function initial(): State {
  const seeded = seed();
  return {
    users: [demoUser],
    sessionId: demoUser.id,
    onboarded: false,
    prefs: { appearance: "system", language: "en", push: true, email: true, sms: false, reminders: true },
    ...seeded,
    reviews: [],
    draft: emptyDraft(),
    checklist: {},
    welcome: false,
    guestGate: false,
    returnTo: "",
    sessionExpired: false,
  };
}

function claimGuest<T extends { userId: string }>(items: T[] | undefined, userId: string): T[] {
  return (items || []).map((item) => (item.userId === "guest" ? { ...item, userId } : item));
}

function withAccount(state: State): State {
  const users = state.users.some((u) => u.id === demoUser.id) ? state.users : [demoUser, ...state.users];
  const signedIn = Boolean(state.sessionId && users.some((u) => u.id === state.sessionId));
  const sessionId = signedIn && state.sessionId ? state.sessionId : demoUser.id;
  return {
    ...state,
    users,
    sessionId,
    guestGate: false,
    appointments: claimGuest(state.appointments, sessionId),
    quotes: claimGuest(state.quotes, sessionId),
    notices: claimGuest(state.notices, sessionId),
    properties: claimGuest(state.properties, sessionId),
    reviews: claimGuest(state.reviews, sessionId),
  };
}

function load(): State | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as State;
    if (!Array.isArray(parsed.users) || parsed.users.length === 0) parsed.users = [demoUser];
    parsed.draft = { ...emptyDraft(), ...parsed.draft };
    parsed.prefs = { ...initial().prefs, ...parsed.prefs };
    return withAccount(parsed);
  } catch {
    return null;
  }
}

type AppApi = State & {
  ready: boolean;
  user: User | null;
  theme: "light" | "dark";
  myAppointments: Appointment[];
  myQuotes: Quote[];
  myReviews: Review[];
  myProperties: Property[];
  myNotices: Notice[];
  unread: number;
  markOnboarded: () => void;
  login: (email: string, password: string) => { ok: true } | { ok: false; message: string };
  loginProvider: (provider: "apple" | "google") => void;
  register: (input: Omit<User, "id">) => { ok: true } | { ok: false; message: string };
  pending: PendingReg | null;
  verify: (code: string) => boolean;
  startReset: (email: string) => { ok: boolean; message: string };
  resetEmail: string;
  resetPassword: (password: string) => { ok: boolean; message: string };
  logout: () => void;
  deleteAccount: () => void;
  updateUser: (patch: Partial<User>) => void;
  changePassword: (current: string, next: string) => { ok: boolean; message: string };
  setPrefs: (patch: Partial<Prefs>) => void;
  saveProperty: (property: Omit<Property, "id" | "userId"> & { id?: string }) => void;
  removeProperty: (id: string) => void;
  setDraft: (patch: Partial<BookingDraft>) => void;
  resetDraft: () => void;
  confirmBooking: () => Appointment | null;
  cancelAppointment: (id: string, reason: string) => void;
  reschedule: (id: string, date: string, timeSlot: string, startTime: string) => void;
  setQuoteStatus: (id: string, status: Quote["status"], changeNote?: string) => void;
  addQuoteRequest: (input: { services: string[]; address: string; size: string; notes: string; photos: string[] }) => Quote | null;
  addReview: (input: { appointmentId?: string; stars: number; text: string; photos: string[] }) => void;
  markRead: (id: string) => void;
  markAllRead: () => void;
  toggleCheck: (id: string) => void;
  dismissWelcome: () => void;
  openGuestGate: (returnTo: string) => void;
  dismissGuestGate: () => void;
  dismissSession: () => void;
  consumeReturnTo: () => string;
};

const Ctx = createContext<AppApi | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<State>(initial);
  const [ready, setReady] = useState(false);
  const [pending, setPending] = useState<PendingReg | null>(null);
  const [resetEmail, setResetEmail] = useState("");
  const [systemTheme, setSystemTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    setSystemTheme(mq.matches ? "dark" : "light");
    const loaded = load();
    if (loaded) {
      setState({ ...loaded, sessionExpired: false, guestGate: false });
    }
    setReady(true);
    const onChange = () => setSystemTheme(mq.matches ? "dark" : "light");
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try {
      localStorage.setItem(KEY, JSON.stringify(state));
    } catch {
      const slim = {
        ...state,
        draft: { ...state.draft, photos: [] },
        appointments: state.appointments.map((a) => ({ ...a, photos: a.photos.slice(0, 2) })),
      };
      try {
        localStorage.setItem(KEY, JSON.stringify(slim));
      } catch {
        /* device storage is full */
      }
    }
  }, [ready, state]);

  const api = useMemo<AppApi>(() => {
    const user = state.users.find((u) => u.id === state.sessionId) ?? null;
    const theme = state.prefs.appearance === "system" ? systemTheme : state.prefs.appearance;
    const myAppointments = state.appointments.filter((a) => user && a.userId === user.id);
    const myQuotes = state.quotes.filter((q) => user && q.userId === user.id);
    const myReviews = state.reviews.filter((r) => user && r.userId === user.id);
    const myProperties = state.properties.filter((p) => user && p.userId === user.id);
    const myNotices = state.notices.filter((n) => user && n.userId === user.id);
    return {
      ...state,
      ready,
      user,
      theme,
      myAppointments,
      myQuotes,
      myReviews,
      myProperties,
      myNotices,
      unread: myNotices.filter((n) => !n.read).length,
      pending,
      resetEmail,
      markOnboarded: () => setState((s) => ({ ...s, onboarded: true })),
      login: (email, password) => {
        const found = state.users.find(
          (u) => u.email.toLowerCase() === email.trim().toLowerCase() && u.password === password,
        );
        if (!found) return { ok: false, message: "That email and password do not match." };
        setState((s) => withAccount({ ...s, sessionId: found.id, guestGate: false }));
        return { ok: true };
      },
      loginProvider: (provider) => {
        const email = provider === "apple" ? "riley.chen@example.com" : "sam.ortega@example.com";
        const name = provider === "apple" ? "Riley Chen" : "Sam Ortega";
        setState((s) => {
          let next = s.users.find((u) => u.email === email);
          const users = next
            ? s.users
            : [
                ...s.users,
                (next = {
                  id: uid("user"),
                  name,
                  email,
                  phone: "",
                  password: "",
                  customerType: "Residential",
                }),
              ];
          return withAccount({ ...s, users, sessionId: next!.id, guestGate: false });
        });
      },
      register: (input) => {
        if (state.users.some((u) => u.email.toLowerCase() === input.email.toLowerCase())) {
          return { ok: false, message: "An account with this email already exists." };
        }
        setPending(input);
        return { ok: true };
      },
      verify: (code) => {
        if (!pending || code !== siteConfig.demo.otp) return false;
        const user: User = { ...pending, id: uid("user") };
        setPending(null);
        setState((s) => withAccount({ ...s, users: [...s.users, user], sessionId: user.id, welcome: !s.returnTo, guestGate: false }));
        return true;
      },
      startReset: (email) => {
        const found = state.users.some((u) => u.email.toLowerCase() === email.trim().toLowerCase());
        setResetEmail(email.trim());
        return found
          ? { ok: true, message: "A reset step is ready on this device." }
          : { ok: true, message: "If an account exists for that email, you can set a new password next." };
      },
      resetPassword: (password) => {
        const email = resetEmail.trim().toLowerCase();
        const found = state.users.find((u) => u.email.toLowerCase() === email);
        if (!found) return { ok: false, message: "No account on this device uses that email." };
        setState((s) => ({
          ...s,
          users: s.users.map((u) => (u.id === found.id ? { ...u, password } : u)),
        }));
        return { ok: true, message: "Password updated." };
      },
      logout: () => setState((s) => ({ ...s, sessionId: null })),
      deleteAccount: () =>
        setState((s) => {
          if (!s.sessionId) return s;
          const id = s.sessionId;
          return {
            ...s,
            sessionId: null,
            users: s.users.filter((u) => u.id !== id),
            appointments: s.appointments.filter((a) => a.userId !== id),
            quotes: s.quotes.filter((q) => q.userId !== id),
            reviews: s.reviews.filter((r) => r.userId !== id),
            notices: s.notices.filter((n) => n.userId !== id),
            properties: s.properties.filter((p) => p.userId !== id),
          };
        }),
      updateUser: (patch) =>
        setState((s) => ({
          ...s,
          users: s.users.map((u) => (u.id === s.sessionId ? { ...u, ...patch } : u)),
        })),
      changePassword: (current, next) => {
        if (!user) return { ok: true, message: "Password updated." };
        setState((s) => ({
          ...s,
          users: s.users.map((u) => (u.id === user.id ? { ...u, password: next } : u)),
        }));
        return { ok: true, message: "Password updated." };
      },
      setPrefs: (patch) => setState((s) => ({ ...s, prefs: { ...s.prefs, ...patch } })),
      saveProperty: (property) =>
        setState((s) => {
          if (!s.sessionId) return s;
          if (property.id) {
            return {
              ...s,
              properties: s.properties.map((p) => (p.id === property.id ? { ...p, ...property, userId: s.sessionId! } : p)),
            };
          }
          return {
            ...s,
            properties: [...s.properties, { ...property, id: uid("prop"), userId: s.sessionId }],
          };
        }),
      removeProperty: (id) => setState((s) => ({ ...s, properties: s.properties.filter((p) => p.id !== id) })),
      setDraft: (patch) => setState((s) => ({ ...s, draft: { ...s.draft, ...patch } })),
      resetDraft: () => setState((s) => ({ ...s, draft: emptyDraft(user ? { customerType: user.customerType, name: user.name, email: user.email, phone: user.phone, company: user.company || "" } : {}) })),
      confirmBooking: () => {
        const d = state.draft;
        const userId = user?.id || demoUser.id;
        const appt: Appointment = {
          id: uid("apt"),
          userId,
          ref: refCode(),
          services: d.services,
          customerType: d.customerType,
          address: d.address,
          size: d.size,
          terrain: d.terrain,
          vegetation: d.vegetation,
          access: d.access,
          structures: d.structures,
          lots: d.lots,
          notes: d.notes,
          urgent: d.urgent,
          photos: d.photos,
          date: d.date,
          timeSlot: d.timeSlot,
          startTime: d.startTime,
          appointmentType: d.appointmentType,
          contactName: d.name || user?.name || "",
          phone: d.phone || user?.phone || "",
          email: d.email || user?.email || "",
          contactMethod: d.contactMethod,
          company: d.company,
          roleTitle: d.roleTitle,
          status: "Pending",
          createdAt: todayISO(),
        };
        const notice: Notice = {
          id: uid("n"),
          userId,
          title: "Request received",
          body: `${appt.ref} is pending. We will confirm your ${appt.appointmentType.toLowerCase()}.`,
          day: "Today",
          read: false,
          appointmentId: appt.id,
        };
        setState((s) => ({
          ...s,
          sessionId: s.sessionId || demoUser.id,
          users: s.users.some((u) => u.id === demoUser.id) ? s.users : [demoUser, ...s.users],
          guestGate: false,
          appointments: [appt, ...s.appointments],
          notices: [notice, ...s.notices],
          draft: emptyDraft(user ? { customerType: user.customerType, name: user.name, email: user.email, phone: user.phone } : {}),
        }));
        return appt;
      },
      cancelAppointment: (id, reason) =>
        setState((s) => ({
          ...s,
          appointments: s.appointments.map((a) => (a.id === id ? { ...a, status: "Cancelled", cancelReason: reason } : a)),
        })),
      reschedule: (id, date, timeSlot, startTime) =>
        setState((s) => ({
          ...s,
          appointments: s.appointments.map((a) =>
            a.id === id ? { ...a, date, timeSlot, startTime, status: a.status === "Cancelled" ? "Pending" : a.status } : a,
          ),
        })),
      setQuoteStatus: (id, status, changeNote) =>
        setState((s) => ({
          ...s,
          quotes: s.quotes.map((q) => (q.id === id ? { ...q, status, changeNote: changeNote ?? q.changeNote } : q)),
        })),
      addQuoteRequest: (input) => {
        const quote: Quote = {
          id: uid("quote"),
          userId: user?.id || demoUser.id,
          services: input.services,
          address: input.address,
          status: "Pending",
          notes: input.notes || "Quote request from the app.",
          lines: [
            { label: "On-site assessment", detail: "Included" },
            { label: "Requested work", detail: "Priced after the site visit" },
          ],
          createdAt: todayISO(),
        };
        setState((s) => ({
          ...s,
          sessionId: s.sessionId || demoUser.id,
          users: s.users.some((u) => u.id === demoUser.id) ? s.users : [demoUser, ...s.users],
          quotes: [quote, ...s.quotes],
        }));
        return quote;
      },
      addReview: (input) => {
        const review: Review = { id: uid("rev"), userId: user?.id || demoUser.id, createdAt: todayISO(), ...input };
        setState((s) => ({
          ...s,
          sessionId: s.sessionId || demoUser.id,
          users: s.users.some((u) => u.id === demoUser.id) ? s.users : [demoUser, ...s.users],
          reviews: [review, ...s.reviews],
        }));
      },
      markRead: (id) => setState((s) => ({ ...s, notices: s.notices.map((n) => (n.id === id ? { ...n, read: true } : n)) })),
      markAllRead: () =>
        setState((s) => ({
          ...s,
          notices: s.notices.map((n) => (n.userId === s.sessionId ? { ...n, read: true } : n)),
        })),
      toggleCheck: (id) => setState((s) => ({ ...s, checklist: { ...s.checklist, [id]: !s.checklist[id] } })),
      dismissWelcome: () => setState((s) => ({ ...s, welcome: false })),
      openGuestGate: (returnTo) => setState((s) => ({ ...s, guestGate: true, returnTo })),
      dismissGuestGate: () => setState((s) => ({ ...s, guestGate: false })),
      dismissSession: () => setState((s) => ({ ...s, sessionExpired: false })),
      consumeReturnTo: () => {
        const to = state.returnTo;
        setState((s) => ({ ...s, returnTo: "" }));
        return to;
      },
    };
  }, [pending, ready, resetEmail, state, systemTheme]);

  return <Ctx.Provider value={api}>{children}</Ctx.Provider>;
}

export function useApp() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useApp must be used inside AppProvider");
  return ctx;
}
