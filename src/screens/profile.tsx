import { useState, type ReactNode } from "react";
import { Bell, CalendarDays, CircleHelp, FileText, Info, Languages, Lock, LogOut, Map, MapPin, MessageSquare, Shield, Star, SunMoon, Trash2, UserRound } from "lucide-react";
import { siteConfig } from "@/data/siteConfig";
import { images } from "@/data/images";
import { sizeOptions, type CustomerType } from "@/data/content";
import { useApp } from "@/lib/store";
import { useContact } from "@/lib/useContact";
import { Logo, ScreenContainer, useGo } from "@/components/native/chrome";
import { Avatar, Badge, EmptyState } from "@/components/native/widgets";
import { Button, Group, ListItem, SectionHeader } from "@/components/native/ui";
import { Input, PhoneInput, SegmentedControl, Select, Switch, TextArea } from "@/components/native/forms";
import { Sheet, useUI } from "@/components/native/overlays";

function Well({ children, tone }: { children: ReactNode; tone?: "danger" }) {
  return <span className={`icon-well ${tone || ""}`}>{children}</span>;
}

export function ProfileScreen() {
  const app = useApp();
  const go = useGo();
  const ui = useUI();
  const [appearance, setAppearance] = useState(false);
  const user = app.user;
  const appearanceLabel = app.prefs.appearance[0].toUpperCase() + app.prefs.appearance.slice(1);
  const stats = [
    { n: app.myAppointments.length, label: "Visits", to: "/appointments" },
    { n: app.myQuotes.length, label: "Quotes", to: "/quotes" },
    { n: app.myProperties.length, label: "Places", to: "/profile/properties" },
  ];
  return (
    <ScreenContainer title="Profile" large tab>
      <div className="stack">
        <div className="profile-card">
          <Avatar name={user?.name || "Guest"} size={72} />
          <div className="profile-id">
            <h1 className="title-2">{user?.name || "Guest"}</h1>
            <p className="footnote">{user?.email || "Browsing without an account"}</p>
            {user ? <Badge tone="green">{user.customerType}</Badge> : null}
          </div>
        </div>
        <div className="stat-row">
          {stats.map((item) => (
            <button key={item.label} type="button" className="stat press" onClick={() => go.push(item.to)}>
              <span className="stat-n">{item.n}</span>
              <span className="stat-l">{item.label}</span>
            </button>
          ))}
        </div>
        {!user ? (
          <div className="guest-card">
            <p className="headline">Keep bookings on this device</p>
            <p className="guest-copy">Create an account to save properties, quotes, and visit history.</p>
            <Button variant="light" onClick={() => go.push("/register")}>Create Account</Button>
            <Button variant="tinted" onClick={() => go.push("/login")}>Log In</Button>
          </div>
        ) : null}
        <SectionHeader title="Account" group />
        <Group>
          <ListItem title="Edit Profile" icon={<Well><UserRound size={16} /></Well>} chevron onPress={() => go.push("/profile/edit")} />
          <ListItem title="My Properties" icon={<Well><MapPin size={16} /></Well>} chevron onPress={() => go.push("/profile/properties")} />
          <ListItem title="Change Password" icon={<Well><Lock size={16} /></Well>} chevron onPress={() => go.push("/profile/password")} />
        </Group>
        <SectionHeader title="Activity" group />
        <Group>
          <ListItem title="My Appointments" icon={<Well><CalendarDays size={16} /></Well>} chevron onPress={() => go.push("/appointments")} />
          <ListItem title="My Quotes" icon={<Well><FileText size={16} /></Well>} chevron onPress={() => go.push("/quotes")} />
          <ListItem title="My Reviews" icon={<Well><Star size={16} /></Well>} chevron onPress={() => go.push("/reviews")} />
        </Group>
        <SectionHeader title="Preferences" group />
        <Group>
          <ListItem title="Notifications" icon={<Well><Bell size={16} /></Well>} chevron onPress={() => go.push("/settings/notifications")} />
          <ListItem title="Language" icon={<Well><Languages size={16} /></Well>} detail={app.prefs.language === "es" ? "Español" : "English"} chevron onPress={() => go.push("/profile/language")} />
          <ListItem title="Appearance" icon={<Well><SunMoon size={16} /></Well>} detail={appearanceLabel} chevron onPress={() => setAppearance(true)} />
        </Group>
        <SectionHeader title="Support" group />
        <Group>
          <ListItem title="Contact Us" icon={<Well><MessageSquare size={16} /></Well>} chevron onPress={() => go.push("/contact")} />
          <ListItem title="FAQs" icon={<Well><CircleHelp size={16} /></Well>} chevron onPress={() => go.push("/faqs")} />
          <ListItem title="Fire Safety Guide" icon={<Well><Shield size={16} /></Well>} chevron onPress={() => go.push("/guide")} />
        </Group>
        <SectionHeader title="About" group />
        <Group>
          <ListItem title="About Us" icon={<Well><Info size={16} /></Well>} chevron onPress={() => go.push("/about")} />
          <ListItem title="Service Areas" icon={<Well><Map size={16} /></Well>} chevron onPress={() => go.push("/areas")} />
          <ListItem title="Terms of Service" icon={<Well><FileText size={16} /></Well>} chevron onPress={() => go.push("/terms")} />
          <ListItem title="Privacy Policy" icon={<Well><Lock size={16} /></Well>} chevron onPress={() => go.push("/privacy")} />
        </Group>
        {user ? (
          <Group>
            <ListItem title="Log Out" icon={<Well tone="danger"><LogOut size={16} /></Well>} destructive onPress={() => ui.alert({
              title: "Log out?",
              message: "You can log back in on this device. Your draft stays here.",
              actions: [
                { label: "Cancel", style: "cancel" },
                { label: "Log Out", style: "destructive", onPress: () => { app.logout(); go.replace("/login"); } },
              ],
            })} />
            <ListItem title="Delete Account" icon={<Well tone="danger"><Trash2 size={16} /></Well>} destructive onPress={() => ui.alert({
              title: "Delete your account?",
              message: "Appointments and quotes saved on this device for this account will be removed.",
              actions: [
                { label: "Cancel", style: "cancel" },
                { label: "Delete Account", style: "destructive", onPress: () => { app.deleteAccount(); go.replace("/login"); } },
              ],
            })} />
          </Group>
        ) : null}
      </div>
      <Sheet open={appearance} onClose={() => setAppearance(false)} title="Appearance">
        <Group>
          {(["Light", "Dark", "System"] as const).map((label) => {
            const id = label.toLowerCase() as "light" | "dark" | "system";
            return (
              <button key={id} type="button" className="row" onClick={() => { app.setPrefs({ appearance: id }); setAppearance(false); }}>
                <span className="row-title">{label}</span>
                {app.prefs.appearance === id ? <Badge tone="green">On</Badge> : null}
              </button>
            );
          })}
        </Group>
      </Sheet>
    </ScreenContainer>
  );
}

export function EditProfileScreen() {
  const app = useApp();
  const ui = useUI();
  const user = app.user;
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [type, setType] = useState<CustomerType>(user?.customerType || "Residential");
  const [company, setCompany] = useState(user?.company || "");
  const go = useGo();
  if (!user) return <ScreenContainer title="Edit Profile" back><div className="stack"><Button onClick={() => go.push("/login")}>Log in to edit a profile.</Button></div></ScreenContainer>;
  return (
    <ScreenContainer title="Edit Profile" back footer={<Button onClick={() => {
      app.updateUser({ name: name.trim(), email: email.trim(), phone, customerType: type, company });
      ui.toast("Profile saved");
    }}>Save</Button>}>
      <div className="stack">
        <div className="center"><Avatar name={name || user.name} size={88} /></div>
        <Input label="Full name" value={name} onChange={setName} />
        <Input label="Email" value={email} onChange={setEmail} type="email" inputMode="email" />
        <PhoneInput value={phone} onChange={setPhone} />
        <SegmentedControl label="Customer type" value={type} options={["Residential", "Business", "HOA"]} onChange={(v) => setType(v as CustomerType)} />
        {type !== "Residential" ? <Input label={type === "HOA" ? "HOA name" : "Company"} value={company} onChange={setCompany} /> : null}
      </div>
    </ScreenContainer>
  );
}

export function PasswordScreen() {
  const app = useApp();
  const ui = useUI();
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  return (
    <ScreenContainer title="Change Password" back footer={<Button onClick={() => {
      app.changePassword(current, next || confirm);
      ui.toast("Password updated");
      setCurrent(""); setNext(""); setConfirm("");
    }}>Update password</Button>}>
      <div className="stack">
        <Input label="Current password" value={current} onChange={setCurrent} secure />
        <Input label="New password" value={next} onChange={setNext} secure />
        <Input label="Confirm new password" value={confirm} onChange={setConfirm} secure />
      </div>
    </ScreenContainer>
  );
}

export function PropertiesScreen() {
  const app = useApp();
  const go = useGo();
  return (
    <ScreenContainer title="My Properties" large back>
      <div className="stack">
        {app.myProperties.length === 0 ? (
          <EmptyState image={images.emptyProjects} alt="Illustration of empty frames" title="No properties saved" body="Add an address so booking can start from a known place." action={<Button onClick={() => go.push("/profile/property/new")}>Add property</Button>} />
        ) : (
          <Group>
            {app.myProperties.map((property) => (
              <ListItem key={property.id} title={property.label} subtitle={property.address} chevron onPress={() => go.push(`/profile/property/${property.id}`)} />
            ))}
          </Group>
        )}
        {app.myProperties.length ? <Button onClick={() => go.push("/profile/property/new")}>Add property</Button> : null}
      </div>
    </ScreenContainer>
  );
}

export function PropertyScreen({ id }: { id: string }) {
  const app = useApp();
  const go = useGo();
  const ui = useUI();
  const existing = app.myProperties.find((p) => p.id === id);
  const [label, setLabel] = useState(existing?.label || "Home");
  const [address, setAddress] = useState(existing?.address || "");
  const [size, setSize] = useState(existing?.size || "");
  const [notes, setNotes] = useState(existing?.notes || "");
  return (
    <ScreenContainer title={existing ? "Edit Property" : "Add Property"} back footer={<Button onClick={() => {
      app.saveProperty({ id: existing?.id, label: label || "Property", address, size, notes });
      ui.toast("Property saved");
      go.back("/profile/properties");
    }}>Save property</Button>}>
      <div className="stack">
        <Input label="Label" value={label} onChange={setLabel} placeholder="Home, shop, lot 4" />
        <Input label="Address" value={address} onChange={setAddress} />
        <Select label="Approximate size" value={size} options={sizeOptions} onChange={setSize} />
        <TextArea label="Notes" value={notes} onChange={setNotes} placeholder="Gate, hazards, what to protect." />
        {existing ? <Button variant="destructive" onClick={() => { app.removeProperty(existing.id); go.back(); }}>Remove property</Button> : null}
      </div>
    </ScreenContainer>
  );
}

export function LanguageScreen() {
  const app = useApp();
  return (
    <ScreenContainer title="Language" back>
      <div className="stack">
        <Group>
          <button type="button" className="row" onClick={() => app.setPrefs({ language: "en" })}>
            <span className="row-title">English</span>
            {app.prefs.language === "en" ? <Badge tone="green">Selected</Badge> : null}
          </button>
          <button type="button" className="row" onClick={() => app.setPrefs({ language: "es" })}>
            <span className="row-text"><span className="row-title">Español</span><span className="row-sub">Copy not published yet. Client to confirm.</span></span>
            {app.prefs.language === "es" ? <Badge tone="green">Selected</Badge> : null}
          </button>
        </Group>
      </div>
    </ScreenContainer>
  );
}

export function NotificationSettingsScreen() {
  const app = useApp();
  const ui = useUI();
  const rows: { key: "push" | "email" | "sms" | "reminders"; label: string; detail: string }[] = [
    { key: "push", label: "Push notifications", detail: "Appointment and quote updates" },
    { key: "email", label: "Email", detail: "Copies of confirmations" },
    { key: "sms", label: "Text messages", detail: "Day-before reminders" },
    { key: "reminders", label: "Appointment reminders", detail: "A nudge the day before" },
  ];
  return (
    <ScreenContainer title="Notifications" back>
      <div className="stack">
        <Group>
          {rows.map((row) => (
            <div key={row.key} className="row">
              <span className="row-text"><span className="row-title">{row.label}</span><span className="row-sub">{row.detail}</span></span>
              <Switch checked={app.prefs[row.key]} label={row.label} onChange={(value) => {
                if (row.key === "push" && value) void ui.askPermission("notifications");
                app.setPrefs({ [row.key]: value });
              }} />
            </div>
          ))}
        </Group>
        <p className="footnote">This demo does not send real push, email, or text messages.</p>
      </div>
    </ScreenContainer>
  );
}

export function NotificationsScreen() {
  const app = useApp();
  const go = useGo();
  const groups = app.myNotices.reduce<Record<string, typeof app.myNotices>>((acc, notice) => {
    acc[notice.day] = acc[notice.day] || [];
    acc[notice.day].push(notice);
    return acc;
  }, {});
  return (
    <ScreenContainer title="Notifications" large back onRefresh={() => app.markAllRead()}>
      <div className="stack">
        {app.myNotices.length === 0 ? (
          <EmptyState image={images.emptyNotifications} alt="Illustration of a bell" title="You're caught up" body={app.user ? "Appointment updates will show up here." : "Log in to see updates for your account."} action={!app.user ? <Button onClick={() => go.push("/login")}>Log In</Button> : undefined} />
        ) : (
          Object.entries(groups).map(([day, items]) => (
            <div key={day} className="gap12">
              <SectionHeader title={day} group />
              <Group>
                {items.map((notice) => (
                  <ListItem
                    key={notice.id}
                    title={notice.title}
                    subtitle={notice.body}
                    badge={!notice.read ? <Badge tone="red">New</Badge> : undefined}
                    onPress={() => {
                      app.markRead(notice.id);
                      if (notice.appointmentId) go.push(`/appointments/${notice.appointmentId}`);
                    }}
                  />
                ))}
              </Group>
            </div>
          ))
        )}
        {app.myNotices.some((n) => !n.read) ? <Button variant="text" onClick={app.markAllRead}>Mark all read</Button> : null}
      </div>
    </ScreenContainer>
  );
}

export function AboutScreen() {
  return (
    <ScreenContainer title="About Us" back>
      <div className="stack">
        <Logo width={160} className="auth-logo" />
        <h1 className="title-2 center">{siteConfig.businessName}</h1>
        <p className="body">{siteConfig.description}</p>
        <Card>
          <h2 className="headline">The name</h2>
          <p className="subhead">Battle Born is Nevada’s state motto. This company name honors that protective spirit. The full company story — client to confirm — belongs here.</p>
        </Card>
        <SectionHeader title="Values" group />
        <Group>
          {[
            ["Safety", "Crews work with PPE, a marked plan, and a stop-work habit around hazards."],
            ["Integrity", "The estimate says what is included and what is not."],
            ["Craftsmanship", "We cut what should go and protect what should stay."],
            ["Community", "Homes, businesses, and associations share the same fuel problem."],
          ].map(([title, body]) => <ListItem key={title} title={title} subtitle={body} />)}
        </Group>
        <div className="chips">
          <Badge tone="green"><Shield size={12} /> {siteConfig.licenseLabel}</Badge>
          <Badge tone="green">{siteConfig.insuranceLabel}</Badge>
        </div>
        <Card>
          <h2 className="headline">Equipment and crew</h2>
          <p className="subhead">Forestry mulchers for acreage, chippers where access allows, and hand crews with saws for slopes and the area next to structures. Crew names and license numbers — client to confirm.</p>
        </Card>
      </div>
    </ScreenContainer>
  );
}

export function AreasScreen() {
  return (
    <ScreenContainer title="Service Areas" back>
      <div className="stack">
        <div className="card map-card">
          <Photo src={images.onboardingHome} alt="Foothill landscape used as a stand-in until a service-area map is confirmed" ratio="16 / 9" />
          <div className="cap"><MapPin size={20} /><span>Boundaries — client to confirm</span></div>
        </div>
        <Group>
          {siteConfig.serviceAreas.map((area) => (
            <ListItem key={area.name} title={area.name} subtitle={area.places} icon={<MapPin size={18} color="var(--brand-ink)" />} />
          ))}
        </Group>
        <p className="footnote">Do not book from this list until the client replaces the placeholders with real counties and cities.</p>
      </div>
    </ScreenContainer>
  );
}

export function ContactScreen() {
  const contact = useContact();
  const ui = useUI();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState(false);
  return (
    <ScreenContainer title="Contact Us" back>
      <div className="stack">
        <div className="contact-strip">
          <button type="button" onClick={() => contact("call")}>Call</button>
          <button type="button" onClick={() => contact("text")}>Text</button>
          <button type="button" onClick={() => contact("email")}>Email</button>
          <button type="button" onClick={() => contact("directions")}>Map</button>
        </div>
        <Group>
          <ListItem title="Phone" detail={siteConfig.phoneDisplay} />
          <ListItem title="Email" detail={siteConfig.email} />
          <ListItem title="Address" subtitle={`${siteConfig.address}, ${siteConfig.cityLine}`} />
        </Group>
        <SectionHeader title="Hours" group />
        <Group>
          {siteConfig.hours.map((row) => <ListItem key={row.days} title={row.days} detail={row.time} />)}
        </Group>
        {error ? <Button onClick={() => setError(false)}>Retry</Button> : sent ? <Card><h2 className="headline">Message saved on this device</h2><p className="subhead">A live inbox is not connected yet. {siteConfig.responseTime}</p></Card> : (
          <div className="gap12">
            <Input label="Name" value={name} onChange={setName} />
            <Input label="Email" value={email} onChange={setEmail} type="email" inputMode="email" />
            <TextArea label="Message" value={message} onChange={setMessage} />
            <Button onClick={() => {
              setSent(true);
              ui.toast("Message noted");
            }}>Send</Button>
          </div>
        )}
        <SectionHeader title="Social" group />
        <Group>
          {siteConfig.socials.map((social) => (
            <ListItem key={social.name} title={social.name} subtitle={social.url || "Link — client to confirm"} onPress={() => social.url ? window.open(social.url, "_blank", "noopener") : ui.toast("Not published yet", `${social.name} link — client to confirm.`)} chevron />
          ))}
        </Group>
      </div>
    </ScreenContainer>
  );
}

export function ErrorFallback({ onRetry }: { onRetry: () => void }) {
  return (
    <ScreenContainer title="Something went wrong" back>
      <div className="stack">
        <h1 className="title-2">This screen didn't load</h1>
        <p className="body">Check the connection and try again. Your saved appointments stay on this device.</p>
        <Button onClick={onRetry}>Retry</Button>
      </div>
    </ScreenContainer>
  );
}
