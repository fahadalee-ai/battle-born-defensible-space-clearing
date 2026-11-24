import { useRef, useState } from "react";
import { useLocation } from "@tanstack/react-router";
import { images } from "@/data/images";
import { cancelReasons, serviceById, services, sizeOptions, type CustomerType } from "@/data/content";
import { siteConfig } from "@/data/siteConfig";
import { formatLongDate, formatPhone } from "@/lib/format";
import { useContact } from "@/lib/useContact";
import { useApp, type Appointment, type AppointmentStatus } from "@/lib/store";
import { ScreenContainer, useGo } from "@/components/native/chrome";
import { Button, Card, Group, ListItem, SectionHeader } from "@/components/native/ui";
import { Badge, DatePicker, EmptyState, PhotoUploader, RatingStars, TimeSlotGrid, TimeWheel } from "@/components/native/widgets";
import { Chip, Input, PhoneInput, SegmentedControl, TextArea } from "@/components/native/forms";
import { ActionSheet, Sheet, useUI } from "@/components/native/overlays";
import { TIME_SLOTS } from "@/lib/format";

function tone(status: AppointmentStatus): "neutral" | "green" | "red" | "tint" {
  if (status === "Cancelled") return "red";
  if (status === "Pending") return "tint";
  if (status === "Completed" || status === "Confirmed" || status === "In Progress") return "green";
  return "neutral";
}

const filters = ["Upcoming", "Completed", "Cancelled"] as const;

export function AppointmentsScreen() {
  const app = useApp();
  const go = useGo();
  const [filter, setFilter] = useState<(typeof filters)[number]>("Upcoming");
  const items = app.myAppointments.filter((a) => {
    if (filter === "Completed") return a.status === "Completed";
    if (filter === "Cancelled") return a.status === "Cancelled";
    return a.status === "Pending" || a.status === "Confirmed" || a.status === "In Progress";
  });
  return (
    <ScreenContainer title="Appointments" large tab onRefresh={async () => { await new Promise((r) => setTimeout(r, 400)); }}>
      <div className="stack">
        <SegmentedControl value={filter} options={[...filters]} onChange={(v) => setFilter(v as (typeof filters)[number])} />
        {items.length === 0 ? (
          <EmptyState
            image={images.emptyAppointments}
            alt="Illustration of an empty calendar"
            title={`No ${filter.toLowerCase()} appointments`}
            body="When you book an assessment, it will be listed here."
            action={<Button onClick={() => go.push("/book?pushed=1")}>Book Free Assessment</Button>}
          />
        ) : (
          items.map((item) => <AppointmentRow key={item.id} item={item} />)
        )}
      </div>
    </ScreenContainer>
  );
}

function AppointmentRow({ item }: { item: Appointment }) {
  const go = useGo();
  const [x, setX] = useState(0);
  const start = useRef(0);
  const names = item.services.map((id) => serviceById(id)?.name || "Assessment").join(", ");
  return (
    <div className="swipe-clip card" style={{ padding: 0 }}>
      <div className="swipe-actions">
        <button type="button" className="resched" onClick={() => go.push(`/appointments/${item.id}?sheet=reschedule`)}>Reschedule</button>
        <button type="button" className="cancel" onClick={() => go.push(`/appointments/${item.id}?sheet=cancel`)}>Cancel</button>
      </div>
      <button
        type="button"
        className="row press"
        style={{ background: "var(--card)", transform: `translateX(${x}px)`, position: "relative" }}
        onClick={() => { if (Math.abs(x) < 8) go.push(`/appointments/${item.id}`); }}
        onTouchStart={(e) => { start.current = e.touches[0].clientX; }}
        onTouchMove={(e) => setX(Math.max(-160, Math.min(0, e.touches[0].clientX - start.current)))}
        onTouchEnd={() => setX(x < -60 ? -160 : 0)}
      >
        <span className="row-text">
          <span className="row-title strong">{names}</span>
          <span className="row-sub">{formatLongDate(item.date)} · {item.startTime || item.timeSlot}</span>
          <span className="row-sub">{item.address}</span>
        </span>
        <Badge tone={tone(item.status)}>{item.status}</Badge>
      </button>
    </div>
  );
}

const timeline = ["Requested", "Confirmed", "Crew Assigned", "In Progress", "Completed"];

function doneCount(status: AppointmentStatus) {
  if (status === "Pending") return 1;
  if (status === "Confirmed") return 3;
  if (status === "In Progress") return 4;
  if (status === "Completed") return 5;
  return 1;
}

export function AppointmentDetailScreen({ id }: { id: string }) {
  const app = useApp();
  const go = useGo();
  const ui = useUI();
  const contact = useContact();
  const { searchStr } = useLocation();
  const sheet = new URLSearchParams(searchStr).get("sheet");
  const item = app.myAppointments.find((a) => a.id === id) || app.appointments.find((a) => a.id === id);
  const [reason, setReason] = useState(cancelReasons[0]);
  const [menu, setMenu] = useState(false);
  const [date, setDate] = useState(item?.date || "");
  const [slot, setSlot] = useState(item?.timeSlot || "");
  const [time, setTime] = useState(item?.startTime || "");
  if (!item || item.userId !== app.user?.id) {
    return (
      <ScreenContainer title="Appointment" back>
        <EmptyState image={images.emptyAppointments} alt="Empty calendar" title="Appointment not available" body="Log in with the account that booked it, or book a new visit." action={<Button onClick={() => go.push("/login")}>Log In</Button>} />
      </ScreenContainer>
    );
  }
  const quote = app.quotes.find((q) => q.id === item.quoteId);
  const count = doneCount(item.status);
  return (
    <ScreenContainer
      title={item.ref}
      back
      right={<button type="button" className="btn text" style={{ width: "auto" }} onClick={() => setMenu(true)}>More</button>}
    >
      <div className="stack">
        <div className="spread">
          <h1 className="title-3">{item.services.map((sid) => serviceById(sid)?.name || "Assessment").join(", ")}</h1>
          <Badge tone={tone(item.status)}>{item.status}</Badge>
        </div>
        {item.status === "Cancelled" ? <Card className="banner"><p className="body" style={{ margin: 0 }}>Cancelled{item.cancelReason ? `: ${item.cancelReason}` : "."}</p></Card> : (
          <div className="timeline">
            {timeline.map((label, index) => (
              <div key={label} className={`tl ${index < count ? "done" : ""}`}>
                <div className="rail"><span className="dot" />{index < timeline.length - 1 ? <span className="line" /> : null}</div>
                <div style={{ paddingBottom: 12 }}>
                  <div className="headline">{label}</div>
                  {index === 0 ? <div className="footnote">Requested {item.createdAt}</div> : null}
                </div>
              </div>
            ))}
          </div>
        )}
        <SectionHeader title="Property" group />
        <Group>
          <ListItem title={item.address} subtitle={`${item.size} · ${item.terrain} · ${item.vegetation}`} />
          <ListItem title="Access" detail={item.access} />
          <ListItem title="Structures" detail={item.structures.join(", ") || "—"} />
          <ListItem title={item.appointmentType} subtitle={`${formatLongDate(item.date)} · ${item.startTime || item.timeSlot}`} />
        </Group>
        {item.notes ? <Card><h2 className="headline">Notes</h2><p className="subhead">{item.notes}</p>{item.urgent ? <Badge tone="red">Urgent</Badge> : null}</Card> : null}
        {item.photos.length ? (
          <div className="photos">{item.photos.map((src, i) => <img key={i} src={src} alt={`Property photo ${i + 1}`} style={{ width: "100%", aspectRatio: "1", objectFit: "cover", borderRadius: 12 }} />)}</div>
        ) : null}
        <Card>
          <h2 className="headline">Crew contact</h2>
          <p className="subhead">[Crew lead — client to confirm]</p>
          <p className="footnote">Field lead · {siteConfig.phoneDisplay}</p>
        </Card>
        {quote ? (
          <Card>
            <div className="spread"><h2 className="headline">Quote</h2><Badge tone={quote.status === "Ready" ? "green" : "tint"}>{quote.status}</Badge></div>
            <p className="footnote">{quote.notes}</p>
            <Button variant="tinted" onClick={() => go.push(`/quotes/${quote.id}`)}>View quote</Button>
          </Card>
        ) : null}
        <div className="grid2">
          <Button variant="tinted" onClick={() => go.push(`/appointments/${item.id}?sheet=reschedule`)}>Reschedule</Button>
          <Button variant="text" onClick={() => go.push(`/appointments/${item.id}?sheet=cancel`)}>Cancel</Button>
          <Button variant="tinted" onClick={() => contact("call")}>Call</Button>
          <Button variant="tinted" onClick={() => contact("text")}>Message</Button>
        </div>
        <Button variant="tinted" onClick={() => contact("directions", item.address)}>Get Directions</Button>
        {item.status === "Completed" ? <Button onClick={() => go.push(`/review?appointmentId=${item.id}`)}>Leave a Review</Button> : null}
      </div>
      <Sheet open={sheet === "reschedule"} onClose={() => go.replace(`/appointments/${item.id}`)} title="Reschedule">
        <div className="gap12">
          <DatePicker value={date} onChange={setDate} />
          <TimeSlotGrid value={slot} onChange={(next) => { setSlot(next); setTime(TIME_SLOTS.find((s) => s.id === next)?.times[0] || ""); }} />
          <TimeWheel slot={slot} value={time} onChange={setTime} />
          <Button onClick={() => {
            app.reschedule(item.id, date, slot, time);
            ui.toast("Rescheduled", "Your request was updated.");
            go.replace(`/appointments/${item.id}`);
          }}>Save new time</Button>
        </div>
      </Sheet>
      <Sheet open={sheet === "cancel"} onClose={() => go.replace(`/appointments/${item.id}`)} title="Cancel appointment">
        <div className="gap12">
          <Group>
            {cancelReasons.map((option) => (
              <button key={option} type="button" className="row" onClick={() => setReason(option)}>
                <span className="row-text"><span className="row-title">{option}</span></span>
                {reason === option ? <Badge tone="green">Selected</Badge> : null}
              </button>
            ))}
          </Group>
          <Button variant="urgent" onClick={() => {
            ui.alert({
              title: "Cancel this appointment?",
              message: "The crew will be released from this time. You can book again later.",
              actions: [
                { label: "Keep", style: "cancel" },
                { label: "Cancel Appointment", style: "destructive", onPress: () => { app.cancelAppointment(item.id, reason); ui.toast("Cancelled"); go.replace("/appointments"); } },
              ],
            });
          }}>Continue</Button>
        </div>
      </Sheet>
      <ActionSheet
        open={menu}
        onClose={() => setMenu(false)}
        actions={[
          { label: "Reschedule", onPress: () => go.push(`/appointments/${item.id}?sheet=reschedule`) },
          { label: "Get Directions", onPress: () => contact("directions", item.address) },
          { label: "Cancel Appointment", destructive: true, onPress: () => go.push(`/appointments/${item.id}?sheet=cancel`) },
        ]}
      />
    </ScreenContainer>
  );
}

export function QuoteDetailScreen({ id }: { id: string }) {
  const app = useApp();
  const go = useGo();
  const ui = useUI();
  const [note, setNote] = useState("");
  const quote = app.myQuotes.find((q) => q.id === id);
  if (!quote) return <ScreenContainer title="Quote" back><div className="stack"><p className="body">That quote is not on this device.</p></div></ScreenContainer>;
  return (
    <ScreenContainer title="Quote" back footer={
      quote.status === "Ready" ? (
        <>
          <Button onClick={() => { app.setQuoteStatus(quote.id, "Accepted"); ui.toast("Quote accepted"); }}>Accept</Button>
          <Button variant="text" onClick={() => app.setQuoteStatus(quote.id, "Declined")}>Decline</Button>
        </>
      ) : undefined
    }>
      <div className="stack">
        <div className="spread"><h1 className="title-2">Estimate</h1><Badge tone="tint">{quote.status}</Badge></div>
        <p className="footnote">Sample quote. {siteConfig.pricingNote}</p>
        <p className="footnote">Validity: {siteConfig.quoteValidityNote}</p>
        <Group>
          {quote.lines.map((line) => <ListItem key={line.label} title={line.label} detail={line.detail} />)}
        </Group>
        <Card><h2 className="headline">Notes</h2><p className="subhead">{quote.notes}</p></Card>
        {quote.status === "Ready" ? (
          <>
            <TextArea label="Request changes" value={note} onChange={setNote} placeholder="Tell us what to adjust." />
            <Button variant="tinted" onClick={() => { app.setQuoteStatus(quote.id, "Changes Requested", note); ui.toast("Request sent"); }}>Request Changes</Button>
          </>
        ) : null}
        {quote.changeNote ? <p className="footnote">Your note: {quote.changeNote}</p> : null}
        <Button variant="text" onClick={() => go.back()}>Back</Button>
      </div>
    </ScreenContainer>
  );
}

export function QuotesScreen() {
  const app = useApp();
  const go = useGo();
  return (
    <ScreenContainer title="My Quotes" large back>
      <div className="stack">
        {app.myQuotes.length === 0 ? <p className="body muted">No quotes yet. Request one after you describe the property.</p> : (
          <Group>
            {app.myQuotes.map((quote) => (
              <ListItem key={quote.id} title={quote.address || "Quote request"} subtitle={quote.status} chevron onPress={() => go.push(`/quotes/${quote.id}`)} />
            ))}
          </Group>
        )}
      </div>
    </ScreenContainer>
  );
}

export function QuoteRequestScreen() {
  const app = useApp();
  const go = useGo();
  const ui = useUI();
  const { searchStr } = useLocation();
  const preset = new URLSearchParams(searchStr).get("service") || "";
  const [chosen, setChosen] = useState<string[]>(preset ? [preset] : []);
  const [type, setType] = useState<CustomerType>(app.user?.customerType || "Residential");
  const [address, setAddress] = useState("");
  const [size, setSize] = useState("");
  const [notes, setNotes] = useState("");
  const [photos, setPhotos] = useState<string[]>([]);
  const [phone, setPhone] = useState(app.user?.phone || "");
  const [email, setEmail] = useState(app.user?.email || "");
  const [done, setDone] = useState(false);
  if (done) {
    return (
      <ScreenContainer title="Quote requested" back onBack={() => go.replace("/home")}>
        <div className="stack">
          <h1 className="title-2">We have your request</h1>
          <p className="body">{siteConfig.responseTime}</p>
          <Button onClick={() => go.replace("/quotes")}>View quotes</Button>
        </div>
      </ScreenContainer>
    );
  }
  return (
    <ScreenContainer title="Get a Quote" back footer={<Button onClick={() => {
      app.addQuoteRequest({ services: chosen.length ? chosen : preset ? [preset] : [], address, size, notes: `${notes}\n${type} · ${formatPhone(phone)} · ${email}`, photos });
      setDone(true);
    }}>Submit request</Button>}>
      <div className="stack">
        <p className="body">Tell us what you need. {siteConfig.pricingNote}</p>
        <div className="chips">
          {services.map((service) => <Chip key={service.id} selected={chosen.includes(service.id)} onClick={() => setChosen((cur) => cur.includes(service.id) ? cur.filter((id) => id !== service.id) : [...cur, service.id])}>{service.name}</Chip>)}
        </div>
        <SegmentedControl value={type} options={["Residential", "Business", "HOA"]} onChange={(v) => setType(v as CustomerType)} />
        <Input label="Address" value={address} onChange={setAddress} />
        <div className="chips">{sizeOptions.map((option) => <Chip key={option} selected={size === option} onClick={() => setSize(option)}>{option}</Chip>)}</div>
        <PhotoUploader photos={photos} onChange={setPhotos} />
        <TextArea label="Notes" value={notes} onChange={setNotes} />
        <PhoneInput value={phone} onChange={setPhone} />
        <Input label="Email" value={email} onChange={setEmail} type="email" inputMode="email" />
      </div>
    </ScreenContainer>
  );
}

export function ReviewScreen() {
  const { searchStr } = useLocation();
  const appointmentId = new URLSearchParams(searchStr).get("appointmentId") || undefined;
  const app = useApp();
  const go = useGo();
  const ui = useUI();
  const [stars, setStars] = useState(0);
  const [text, setText] = useState("");
  const [photos, setPhotos] = useState<string[]>([]);
  return (
    <ScreenContainer title="Leave a Review" back footer={<Button onClick={() => {
      app.addReview({ appointmentId, stars, text, photos });
      ui.toast("Thank you", "Your review is saved on this device.");
      go.replace("/reviews");
    }}>Submit review</Button>}>
      <div className="stack">
        <p className="body">How was the visit? Reviews saved here are visible in your profile until a live review system is connected.</p>
        <RatingStars value={stars} onChange={setStars} />
        <TextArea label="Your review" value={text} onChange={setText} placeholder="What should the next customer know?" />
        <PhotoUploader photos={photos} onChange={setPhotos} max={3} />
      </div>
    </ScreenContainer>
  );
}

export function ReviewsScreen() {
  const app = useApp();
  return (
    <ScreenContainer title="My Reviews" large back>
      <div className="stack">
        {app.myReviews.length === 0 ? <p className="body muted">You have not left a review yet.</p> : app.myReviews.map((review) => (
          <Card key={review.id}>
            <RatingStars value={review.stars} />
            <p className="body">{review.text || "No written comment."}</p>
            <p className="footnote">{review.createdAt}</p>
          </Card>
        ))}
      </div>
    </ScreenContainer>
  );
}
