import { useEffect, useRef, useState, type ReactNode } from "react";
import { siteConfig } from "@/data/siteConfig";
import { onboardingSlides } from "@/data/content";
import type { CustomerType } from "@/data/content";
import { useApp } from "@/lib/store";
import { Logo, ScreenContainer, useGo } from "@/components/native/chrome";
import { Button } from "@/components/native/ui";
import { CheckRow, Input, PhoneInput, SegmentedControl } from "@/components/native/forms";
import { Photo } from "@/components/native/widgets";

export function SplashScreen() {
  const go = useGo();
  useEffect(() => {
    const t = window.setTimeout(() => go.replace("/onboarding"), 2500);
    return () => window.clearTimeout(t);
  }, [go]);
  return (
    <ScreenContainer tone="brand" chrome={false} overlay statusLight>
      <div className="splash-wrap">
        <div className="splash-center">
          <Logo width={220} className="splash-logo" />
          <p className="splash-tag">{siteConfig.tagline}</p>
        </div>
        <div className="splash-loader"><div className="spinner" aria-label="Loading" /></div>
      </div>
    </ScreenContainer>
  );
}

export function OnboardingScreen() {
  const app = useApp();
  const go = useGo();
  const [index, setIndex] = useState(0);
  const startX = useRef(0);
  const last = index === onboardingSlides.length - 1;
  const finish = (to: string) => {
    app.markOnboarded();
    go.replace(to);
  };
  return (
    <ScreenContainer title="Welcome" chrome={false} overlay statusLight>
      <div className="onb">
        {!last ? (
          <button type="button" className="skip" style={{ top: "calc(var(--status-h) + 8px)" }} onClick={() => finish("/login")}>
            Skip
          </button>
        ) : null}
        <div
          className="onb-track"
          style={{ transform: `translateX(-${index * 100}%)` }}
          onTouchStart={(e) => { startX.current = e.touches[0].clientX; }}
          onTouchEnd={(e) => {
            const dx = e.changedTouches[0].clientX - startX.current;
            if (dx < -50) setIndex((n) => Math.min(onboardingSlides.length - 1, n + 1));
            if (dx > 50) setIndex((n) => Math.max(0, n - 1));
          }}
        >
          {onboardingSlides.map((slide) => (
            <section className="onb-slide" key={slide.title}>
              <div className="onb-photo">
                <Photo src={slide.image} alt={slide.alt} ratio="auto" eager className="" />
              </div>
              <div className="onb-copy">
                <h1>{slide.title}</h1>
                <p>{slide.body}</p>
              </div>
            </section>
          ))}
        </div>
        <div className="onb-dock">
          <div className="dots" aria-label="Onboarding progress">
            {onboardingSlides.map((slide, i) => (
              <button key={slide.title} type="button" className={i === index ? "on" : ""} aria-label={`Slide ${i + 1}`} onClick={() => setIndex(i)} />
            ))}
          </div>
          {last ? (
            <Button onClick={() => finish("/login")}>Get Started</Button>
          ) : (
            <Button onClick={() => setIndex((n) => n + 1)}>Next</Button>
          )}
        </div>
      </div>
    </ScreenContainer>
  );
}

function AuthShell({
  title,
  headline,
  subtitle,
  onBack,
  footer,
  children,
}: {
  title: string;
  headline?: string;
  subtitle: string;
  onBack: () => void;
  footer?: ReactNode;
  children: ReactNode;
}) {
  return (
    <ScreenContainer title={title} showNavTitle={false} back onBack={onBack} footer={footer} tone="brand" statusLight>
      <div className="auth">
        <div className="auth-brand">
          <Logo width={104} />
          <p className="auth-kicker">{siteConfig.shortName}</p>
        </div>
        <div className="auth-intro">
          <h1>{headline || title}</h1>
          <p>{subtitle}</p>
        </div>
        <div className="auth-form">{children}</div>
      </div>
    </ScreenContainer>
  );
}

export function WelcomeScreen() {
  const go = useGo();
  return (
    <AuthShell title="Welcome" headline="Protect what matters" subtitle={siteConfig.tagline} onBack={() => go.replace("/onboarding")}>
      <Button onClick={() => go.push("/register")}>Create Account</Button>
      <Button variant="tinted" onClick={() => go.push("/login")}>Log In</Button>
      <LegalLinks />
    </AuthShell>
  );
}

function afterAuth(go: ReturnType<typeof useGo>, app: ReturnType<typeof useApp>) {
  const dest = app.consumeReturnTo() || "/home";
  go.replace(dest);
}

export function LoginScreen() {
  const app = useApp();
  const go = useGo();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const submit = () => {
    app.login(email, password);
    afterAuth(go, app);
  };
  return (
    <AuthShell
      title="Log In"
      headline="Welcome back"
      subtitle="Sign in to schedule an assessment and follow your appointments."
      onBack={() => go.replace("/onboarding")}
    >
      <Input label="Email or phone" value={email} onChange={setEmail} autoComplete="username" inputMode="email" placeholder="name@email.com" />
      <Input label="Password" value={password} onChange={setPassword} secure autoComplete="current-password" placeholder="Password" />
      <button type="button" className="btn text auth-link" onClick={() => go.push("/forgot")}>Forgot password?</button>
      <Button onClick={submit}>Log In</Button>
      <div className="auth-divider"><span>or</span></div>
      <ProviderButtons onDone={() => afterAuth(go, app)} />
      <p className="auth-switch">New here? <button type="button" onClick={() => go.push("/register")}>Create an account</button></p>
      <LegalLinks />
    </AuthShell>
  );
}

function LegalLinks() {
  const go = useGo();
  return (
    <p className="auth-legal">
      <button type="button" onClick={() => go.push("/terms")}>Terms</button>
      <span aria-hidden>·</span>
      <button type="button" onClick={() => go.push("/privacy")}>Privacy</button>
    </p>
  );
}

function ProviderButtons({ onDone }: { onDone: () => void }) {
  const app = useApp();
  return (
    <div className="auth-providers">
      <button type="button" className="btn block press provider apple" onClick={() => { app.loginProvider("apple"); onDone(); }}>
        <AppleMark /> Sign in with Apple
      </button>
      <button type="button" className="btn block press provider google" onClick={() => { app.loginProvider("google"); onDone(); }}>
        <GoogleMark /> Sign in with Google
      </button>
    </div>
  );
}

function AppleMark() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden>
      <path fill="currentColor" d="M13.4 9.5c0-1.8 1.5-2.7 1.5-2.7-.8-1.2-2.1-1.4-2.6-1.4-1.1-.1-2.1.6-2.7.6-.6 0-1.5-.6-2.5-.6-1.3 0-2.5.8-3.2 1.9-1.4 2.4-.4 5.9 1 7.8.6.9 1.4 2 2.4 1.9.9 0 1.3-.6 2.5-.6s1.5.6 2.5.6 1.6-.9 2.3-1.9c.7-1 1-2 1-2.1-.1 0-1.9-.7-1.9-2.5ZM12 4.3c.5-.6.9-1.5.8-2.3-.8 0-1.7.5-2.2 1.2-.5.6-.9 1.5-.8 2.3.9.1 1.7-.4 2.2-1.2Z" />
    </svg>
  );
}

function GoogleMark() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden>
      <path fill="#4285F4" d="M17.6 9.2c0-.6-.1-1.2-.2-1.8H9v3.4h4.8a4.1 4.1 0 0 1-1.8 2.7v2.2h2.9c1.7-1.6 2.7-3.9 2.7-6.5Z" />
      <path fill="#34A853" d="M9 18c2.4 0 4.5-.8 6-2.2l-2.9-2.2c-.8.6-1.9.9-3.1.9-2.4 0-4.4-1.6-5.1-3.8H.9v2.3A9 9 0 0 0 9 18Z" />
      <path fill="#FBBC05" d="M3.9 10.7a5.4 5.4 0 0 1 0-3.4V5H.9a9 9 0 0 0 0 8l3-2.3Z" />
      <path fill="#EA4335" d="M9 3.6c1.3 0 2.5.5 3.4 1.3l2.6-2.6A9 9 0 0 0 .9 5l3 2.3C4.6 5.2 6.6 3.6 9 3.6Z" />
    </svg>
  );
}

export function RegisterScreen() {
  const app = useApp();
  const go = useGo();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [customerType, setCustomerType] = useState<CustomerType>("Residential");
  const [terms, setTerms] = useState(false);
  const submit = () => {
    app.register({ name: name.trim(), email: email.trim(), phone, password, customerType });
    go.push("/verify");
  };
  return (
    <AuthShell
      title="Create Account"
      headline="Create your account"
      subtitle="Save your properties, quotes, and appointment updates on this phone."
      onBack={() => go.back("/login")}
      footer={<Button onClick={submit}>Create Account</Button>}
    >
      <p className="group-label">Contact</p>
      <Input label="Full name" value={name} onChange={setName} autoComplete="name" placeholder="Jordan Hale" />
      <Input label="Email" value={email} onChange={setEmail} type="email" inputMode="email" autoComplete="email" placeholder="name@email.com" />
      <PhoneInput value={phone} onChange={setPhone} />
      <Input label="Password" value={password} onChange={setPassword} secure autoComplete="new-password" placeholder="Create a password" />
      <Input label="Confirm password" value={confirm} onChange={setConfirm} secure autoComplete="new-password" placeholder="Repeat password" />
      <p className="group-label">This account is for</p>
      <SegmentedControl value={customerType === "Business" ? "Business" : customerType} options={["Residential", "Business", "HOA"]} onChange={(v) => setCustomerType(v as CustomerType)} />
      <div className="group">
        <CheckRow checked={terms} onChange={setTerms} label="I agree to the Terms and Privacy Policy" />
      </div>
    </AuthShell>
  );
}

export function VerifyScreen() {
  const app = useApp();
  const go = useGo();
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [left, setLeft] = useState(30);
  const refs = useRef<Array<HTMLInputElement | null>>([]);
  useEffect(() => {
    if (left <= 0) return;
    const t = window.setTimeout(() => setLeft((n) => n - 1), 1000);
    return () => window.clearTimeout(t);
  }, [left]);
  const setAt = (i: number, value: string) => {
    const digit = value.replace(/\D/g, "").slice(-1);
    const next = [...code];
    next[i] = digit;
    setCode(next);
    if (digit && refs.current[i + 1]) refs.current[i + 1]?.focus();
  };
  const submit = (value = code.join("")) => {
    if (!app.verify(value)) app.verify(siteConfig.demo.otp);
    go.replace(app.consumeReturnTo() || "/home");
  };
  return (
    <AuthShell
      title="Verify"
      headline="Enter your code"
      subtitle="Type the 6-digit code, or continue and we will finish setup on this device."
      onBack={() => go.back("/register")}
      footer={<Button onClick={() => submit()}>Verify</Button>}
    >
        <div className="otp" aria-label="6-digit code">
          {code.map((digit, i) => (
            <input
              key={i}
              ref={(el) => { refs.current[i] = el; }}
              inputMode="numeric"
              autoComplete={i === 0 ? "one-time-code" : "off"}
              maxLength={1}
              value={digit}
              aria-label={`Digit ${i + 1}`}
              onChange={(e) => setAt(i, e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Backspace" && !code[i] && refs.current[i - 1]) refs.current[i - 1]?.focus();
              }}
              onPaste={(e) => {
                const text = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
                if (!text) return;
                e.preventDefault();
                const next = text.split("");
                while (next.length < 6) next.push("");
                setCode(next);
                if (text.length === 6) submit(text);
              }}
            />
          ))}
        </div>
        <Button variant="text" onClick={() => setLeft(30)}>{left > 0 ? `Resend in ${left}s` : "Resend code"}</Button>
    </AuthShell>
  );
}

export function ForgotScreen() {
  const app = useApp();
  const go = useGo();
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);
  return (
    <AuthShell
      title="Forgot Password"
      headline="Reset your password"
      subtitle="Enter the email on your account. The next step stays on this device."
      onBack={() => go.back("/login")}
    >
      {done ? (
        <>
          <p className="auth-confirm">Your reset is ready. Choose a new password when you are ready.</p>
          <Button onClick={() => go.push("/reset")}>Set a new password</Button>
        </>
      ) : (
        <>
          <Input label="Email" value={email} onChange={setEmail} type="email" inputMode="email" />
          <Button onClick={() => { app.startReset(email); setDone(true); }}>Send reset</Button>
        </>
      )}
    </AuthShell>
  );
}

export function ResetScreen() {
  const app = useApp();
  const go = useGo();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  return (
    <AuthShell
      title="New Password"
      headline="Choose a new password"
      subtitle={app.resetEmail ? `This updates the password for ${app.resetEmail}.` : "This updates the password saved on this device."}
      onBack={() => go.back("/forgot")}
      footer={<Button onClick={() => { app.resetPassword(password || confirm); go.replace("/login"); }}>Update password</Button>}
    >
      <Input label="New password" value={password} onChange={setPassword} secure />
      <Input label="Confirm password" value={confirm} onChange={setConfirm} secure />
    </AuthShell>
  );
}
