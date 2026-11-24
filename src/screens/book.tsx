import { useEffect, useRef } from "react";
import { useLocation } from "@tanstack/react-router";
import { MapPin } from "lucide-react";
import { siteConfig } from "@/data/siteConfig";
import {
  accessOptions,
  appointmentTypes,
  assessmentOption,
  contactMethods,
  services,
  sizeOptions,
  structureOptions,
  terrainOptions,
  vegetationOptions,
  type CustomerType,
} from "@/data/content";
import { formatLongDate, slotStartHour, TIME_SLOTS } from "@/lib/format";
import { useApp, type BookingDraft } from "@/lib/store";
import { ScreenContainer, useGo } from "@/components/native/chrome";
import { Button, Card, Group, ListItem, SectionHeader } from "@/components/native/ui";
import { CheckRow, Chip, Input, PhoneInput, SegmentedControl, Stepper, Switch, TextArea } from "@/components/native/forms";
import { Badge, DatePicker, PhotoUploader, StepIndicator, SuccessMark, TimeSlotGrid, TimeWheel } from "@/components/native/widgets";
import { useUI } from "@/components/native/overlays";
import { serviceById } from "@/data/content";

const STEPS = ["Service", "Property", "Photos", "Schedule", "Contact", "Review"];

function useBookQuery() {
  const { searchStr } = useLocation();
  const params = new URLSearchParams(searchStr);
  const step = Math.min(6, Math.max(1, Number(params.get("step") || 1)));
  return {
    step,
    pushed: params.get("pushed") === "1",
    service: params.get("service") || "",
    type: params.get("type") || "",
    fromReview: params.get("fromReview") === "1",
  };
}

function href(step: number, extra: Record<string, string>) {
  const params = new URLSearchParams({ step: String(step), ...extra });
  return `/book?${params.toString()}`;
}

export function BookScreen() {
  const app = useApp();
  const go = useGo();
  const ui = useUI();
  const q = useBookQuery();
  const draft = app.draft;
  const seeded = useRef(false);
  useEffect(() => {
    if (seeded.current) return;
    seeded.current = true;
    const patch: Partial<BookingDraft> = {};
    if (q.service && !draft.services.includes(q.service)) patch.services = Array.from(new Set([...draft.services, q.service]));
    if (q.type === "Residential" || q.type === "Business" || q.type === "HOA") patch.customerType = q.type;
    if (app.user) {
      if (!draft.name) patch.name = app.user.name;
      if (!draft.email) patch.email = app.user.email;
      if (!draft.phone) patch.phone = app.user.phone;
      if (!draft.customerType) patch.customerType = app.user.customerType;
    }
    if (Object.keys(patch).length) app.setDraft(patch);
  }, [app, draft, q.service, q.type]);

  const extra = {
    ...(q.pushed ? { pushed: "1" } : {}),
    ...(q.service ? { service: q.service } : {}),
    ...(q.type ? { type: q.type } : {}),
  };
  const goStep = (step: number, fromReview = false) => {
    const params = { ...extra, ...(fromReview ? { fromReview: "1" } : {}) };
    go.push(href(step, params));
  };
  const back = () => {
    if (q.step > 1) go.back("/book");
    else if (q.pushed) go.back("/home");
  };

  const next = () => {
    if (q.fromReview) {
      go.back("/book");
      return;
    }
    if (q.step < 6) goStep(q.step + 1);
    else {
      const appt = app.confirmBooking();
      if (appt) {
        ui.notify(siteConfig.shortName, `${appt.ref} requested. We'll confirm your time shortly.`);
        go.replace(`/book/success?id=${appt.id}`);
      }
    }
  };

  const suggestions = siteConfig.sampleAddresses.filter((a) => draft.address.length > 1 && a.toLowerCase().includes(draft.address.toLowerCase()) && a !== draft.address);

  return (
    <ScreenContainer
      title="Book"
      large={q.step === 1 && !q.pushed}
      tab={q.step === 1 && !q.pushed}
      back={q.step > 1 || q.pushed}
      onBack={back}
      footer={<Button variant={q.step === 6 ? "urgent" : "primary"} onClick={next}>{q.fromReview ? "Save" : q.step === 6 ? "Confirm Booking" : "Continue"}</Button>}
    >
      <div className="stack">
        <StepIndicator steps={STEPS} current={q.step} />
        {q.step === 1 ? <StepService draft={draft} onChange={(services) => app.setDraft({ services })} /> : null}
        {q.step === 2 ? (
          <div className="gap12">
            <SegmentedControl label="Customer type" value={draft.customerType} options={["Residential", "Business", "HOA"]} onChange={(v) => app.setDraft({ customerType: v as CustomerType })} />
            <Input label="Property address" value={draft.address} onChange={(address) => app.setDraft({ address })} placeholder="Street, city" icon={<MapPin size={18} />} />
            <div className="spread">
              <button type="button" className="btn text" style={{ width: "auto" }} onClick={() => void ui.askPermission("location").then((ok) => ui.toast(ok ? "Location noted" : "Location skipped", ok ? "Add the street address so the crew can find the property." : "You can type the address instead."))}>Use my location</button>
            </div>
            {suggestions.length ? (
              <div className="suggest">
                {suggestions.map((address) => (
                  <button key={address} type="button" className="row" onClick={() => app.setDraft({ address })}>
                    <span className="row-text"><span className="row-title">{address}</span><span className="row-sub">Sample suggestion</span></span>
                  </button>
                ))}
              </div>
            ) : null}
            <SectionHeader title="Approximate size" group />
            <div className="chips">{sizeOptions.map((option) => <Chip key={option} selected={draft.size === option} onClick={() => app.setDraft({ size: option })}>{option}</Chip>)}</div>
            <SectionHeader title="Terrain" group />
            <div className="chips">{terrainOptions.map((option) => <Chip key={option} selected={draft.terrain === option} onClick={() => app.setDraft({ terrain: option })}>{option}</Chip>)}</div>
            <SectionHeader title="Vegetation" group />
            <div className="chips">{vegetationOptions.map((option) => <Chip key={option} selected={draft.vegetation === option} onClick={() => app.setDraft({ vegetation: option })}>{option}</Chip>)}</div>
            <SectionHeader title="Access" group />
            <div className="chips">{accessOptions.map((option) => <Chip key={option} selected={draft.access === option} onClick={() => app.setDraft({ access: option })}>{option}</Chip>)}</div>
            <SectionHeader title="Structures" group />
            <Group>
              {structureOptions.map((option) => (
                <CheckRow
                  key={option}
                  checked={draft.structures.includes(option)}
                  label={option}
                  onChange={(on) => app.setDraft({ structures: on ? [...draft.structures, option] : draft.structures.filter((s) => s !== option) })}
                />
              ))}
            </Group>
            {draft.customerType !== "Residential" ? (
              <Card><Stepper label="Lots or parcels" value={draft.lots} onChange={(lots) => app.setDraft({ lots })} /></Card>
            ) : null}
          </div>
        ) : null}
        {q.step === 3 ? (
          <div className="gap12">
            <p className="body">Add up to six photos so we can see access and fuel before the visit. Photos stay on this device.</p>
            <PhotoUploader photos={draft.photos} onChange={(photos) => app.setDraft({ photos })} />
            <TextArea label="Notes" value={draft.notes} onChange={(notes) => app.setDraft({ notes })} placeholder="Gates, pets, hazards, or what you want protected." />
            <Card>
              <div className="spread">
                <div>
                  <div className="headline" style={{ color: draft.urgent ? "var(--accent-ink)" : "inherit" }}>Urgent / fire-risk concern</div>
                  <p className="footnote">Flags this request so we review it first. It does not guarantee a same-day visit.</p>
                </div>
                <Switch checked={draft.urgent} label="Urgent fire-risk concern" onChange={(urgent) => app.setDraft({ urgent })} />
              </div>
            </Card>
          </div>
        ) : null}
        {q.step === 4 ? (
          <div className="gap12">
            <DatePicker value={draft.date} onChange={(date) => app.setDraft({ date })} />
            <SectionHeader title="Time of day" group />
            <TimeSlotGrid value={draft.timeSlot} onChange={(timeSlot) => app.setDraft({ timeSlot, startTime: TIME_SLOTS.find((s) => s.id === timeSlot)?.times[0] || "" })} />
            <TimeWheel slot={draft.timeSlot} value={draft.startTime} onChange={(startTime) => app.setDraft({ startTime })} />
            <SegmentedControl label="Appointment type" value={draft.appointmentType} options={[...appointmentTypes]} onChange={(appointmentType) => app.setDraft({ appointmentType })} />
            <p className="footnote">Sundays and published blocked dates cannot be selected.</p>
          </div>
        ) : null}
        {q.step === 5 ? (
          <div className="gap12">
            <Input label="Name" value={draft.name} onChange={(name) => app.setDraft({ name })} autoComplete="name" />
            <PhoneInput value={draft.phone} onChange={(phone) => app.setDraft({ phone })} />
            <Input label="Email" value={draft.email} onChange={(email) => app.setDraft({ email })} type="email" inputMode="email" autoComplete="email" />
            <SegmentedControl label="Preferred contact" value={draft.contactMethod} options={[...contactMethods]} onChange={(contactMethod) => app.setDraft({ contactMethod })} />
            {draft.customerType !== "Residential" ? (
              <>
                <Input label={draft.customerType === "HOA" ? "HOA name" : "Company name"} value={draft.company} onChange={(company) => app.setDraft({ company })} />
                <Input label="Your role" value={draft.roleTitle} onChange={(roleTitle) => app.setDraft({ roleTitle })} placeholder="Owner, manager, board member" />
              </>
            ) : null}
          </div>
        ) : null}
        {q.step === 6 ? (
          <div className="gap12">
            <ReviewBlock title="Services" detail={draft.services.map((id) => (id === "assessment" ? assessmentOption.name : serviceById(id)?.name || id)).join(", ") || "—"} onEdit={() => goStep(1, true)} />
            <ReviewBlock title="Property" detail={`${draft.customerType} · ${draft.address}\n${draft.size} · ${draft.terrain} · ${draft.vegetation} · ${draft.access}`} onEdit={() => goStep(2, true)} />
            <ReviewBlock title="Notes" detail={draft.urgent ? `Urgent. ${draft.notes || "No notes."}` : draft.notes || "No notes"} onEdit={() => goStep(3, true)} />
            <ReviewBlock title="Schedule" detail={`${draft.date ? formatLongDate(draft.date) : "—"} · ${draft.startTime || draft.timeSlot} · ${draft.appointmentType}`} onEdit={() => goStep(4, true)} />
            <ReviewBlock title="Contact" detail={`${draft.name}\n${draft.phone} · ${draft.email}\n${draft.contactMethod}${draft.company ? `\n${draft.company}` : ""}`} onEdit={() => goStep(5, true)} />
            <Group>
              <CheckRow checked={draft.consent} onChange={(consent) => app.setDraft({ consent })} label="I agree to be contacted about this request and accept the Terms." />
            </Group>
            <button type="button" className="btn text" onClick={() => go.push("/terms")}>Read Terms</button>
            {draft.services.length && q.step === 1 ? null : (
              <button type="button" className="btn text" onClick={() => { app.resetDraft(); go.replace("/book"); }}>Start over</button>
            )}
          </div>
        ) : null}
        {q.step === 1 && (draft.services.length > 0 || draft.address) ? (
          <button type="button" className="btn text" onClick={() => { app.resetDraft(); }}>Start over</button>
        ) : null}
      </div>
    </ScreenContainer>
  );
}

function StepService({ draft, onChange }: { draft: BookingDraft; onChange: (services: string[]) => void }) {
  const toggle = (id: string) => onChange(draft.services.includes(id) ? draft.services.filter((s) => s !== id) : [...draft.services, id]);
  return (
    <div className="gap12">
      <p className="body">Choose every service you want priced. If you are unsure, start with a free assessment.</p>
      <button type="button" className={`card press ${draft.services.includes("assessment") ? "" : ""}`} style={{ outline: draft.services.includes("assessment") ? "2px solid var(--brand-ink)" : undefined }} onClick={() => toggle("assessment")}>
        <div className="spread">
          <strong className="headline">{assessmentOption.name}</strong>
          <Badge tone="red">Free</Badge>
        </div>
        <p className="subhead muted" style={{ margin: "6px 0 0" }}>{assessmentOption.benefit}</p>
      </button>
      {services.map((service) => (
        <button key={service.id} type="button" className="card press" style={{ outline: draft.services.includes(service.id) ? "2px solid var(--brand-ink)" : undefined, display: "flex", gap: 12, alignItems: "center" }} onClick={() => toggle(service.id)}>
          <img src={service.image} alt="" width={56} height={56} style={{ width: 56, height: 56, objectFit: "cover", borderRadius: 12 }} />
          <span className="row-text">
            <span className="row-title strong">{service.name}</span>
            <span className="row-sub">{service.benefit}</span>
          </span>
        </button>
      ))}
    </div>
  );
}

function ReviewBlock({ title, detail, onEdit }: { title: string; detail: string; onEdit: () => void }) {
  return (
    <Group>
      <div className="row">
        <span className="row-text">
          <span className="row-sub">{title}</span>
          <span className="row-title" style={{ whiteSpace: "pre-wrap" }}>{detail}</span>
        </span>
        <button type="button" className="btn text small" onClick={onEdit}>Edit</button>
      </div>
    </Group>
  );
}

export function BookingSuccessScreen() {
  const { searchStr } = useLocation();
  const id = new URLSearchParams(searchStr).get("id") || "";
  const app = useApp();
  const go = useGo();
  const ui = useUI();
  const appt = app.appointments.find((a) => a.id === id);
  useEffect(() => {
    if (!appt) return;
    const seen = sessionStorage.getItem(`bb-success-${appt.id}`);
    if (seen) return;
    sessionStorage.setItem(`bb-success-${appt.id}`, "1");
    ui.notify(siteConfig.shortName, `Request ${appt.ref} is in. We'll confirm shortly.`);
  }, [appt, ui]);
  if (!appt) {
    return <ScreenContainer title="Booked" back onBack={() => go.replace("/home")}><div className="stack"><p className="body">That booking is no longer on this device.</p></div></ScreenContainer>;
  }
  const share = async () => {
    const text = `${siteConfig.businessName} appointment ${appt.ref} on ${formatLongDate(appt.date)} (${appt.startTime || appt.timeSlot}).`;
    if (navigator.share) {
      try { await navigator.share({ title: siteConfig.shortName, text }); return; } catch { /* dismissed */ }
    }
    await navigator.clipboard.writeText(text);
    ui.toast("Copied", "Appointment summary copied.");
  };
  const calendar = () => {
    const stamp = appt.date.replace(/-/g, "");
    const start = slotStartHour(appt.startTime || "9:00 AM");
    const ics = `BEGIN:VCALENDAR\nVERSION:2.0\nBEGIN:VEVENT\nDTSTART:${stamp}T${start}\nSUMMARY:${siteConfig.shortName} ${appt.appointmentType}\nLOCATION:${appt.address}\nDESCRIPTION:${appt.ref}\nEND:VEVENT\nEND:VCALENDAR`;
    const blob = new Blob([ics], { type: "text/calendar" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${appt.ref}.ics`;
    a.click();
    URL.revokeObjectURL(url);
  };
  return (
    <ScreenContainer title="Requested" back onBack={() => go.replace("/home")}>
      <div className="stack" style={{ alignItems: "center" }}>
        <SuccessMark />
        <h1 className="title-2 center">Request received</h1>
        <p className="body center">Reference <strong>{appt.ref}</strong>. We will confirm the time after we review access and the crew schedule.</p>
        <Card>
          <ListItem title={appt.services.map((sid) => serviceById(sid)?.name || "Assessment").join(", ")} subtitle={`${formatLongDate(appt.date)} · ${appt.startTime || appt.timeSlot}`} detail={appt.status} />
          <p className="footnote">{appt.address}</p>
        </Card>
        <div className="row-gap" style={{ width: "100%" }}>
          <Button variant="tinted" onClick={calendar}>Add to Calendar</Button>
          <Button variant="tinted" onClick={() => void share()}>Share</Button>
          <Button onClick={() => go.replace(`/appointments/${appt.id}`)}>View Appointment</Button>
          <Button variant="text" onClick={() => go.replace("/home")}>Back to Home</Button>
        </div>
      </div>
    </ScreenContainer>
  );
}
