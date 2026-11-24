import { CalendarDays, CalendarPlus, FileText, Mail, MapPin, MessageSquare, Navigation, Phone, Shield, Users, Building2, House } from "lucide-react";
import { siteConfig } from "@/data/siteConfig";
import { howItWorks, projects, services, testimonials, whyItMatters, audiences } from "@/data/content";
import { images } from "@/data/images";
import { formatDate } from "@/lib/format";
import { useApp } from "@/lib/store";
import { useContact } from "@/lib/useContact";
import { Logo, NotifyButton, ScreenContainer, useGo } from "@/components/native/chrome";
import { Button, Card, SectionHeader } from "@/components/native/ui";
import { Badge, EmptyState, Photo, ProjectCard, RatingStars, ServiceCard, StepIndicator } from "@/components/native/widgets";
import { serviceById } from "@/data/content";

export function HomeScreen() {
  const app = useApp();
  const go = useGo();
  const contact = useContact();
  const name = app.user?.name.split(" ")[0];
  const upcoming = app.myAppointments
    .filter((a) => a.status === "Pending" || a.status === "Confirmed" || a.status === "In Progress")
    .sort((a, b) => a.date.localeCompare(b.date))[0];
  return (
    <ScreenContainer
      title={name ? `Hello, ${name}` : "Hello"}
      large
      tab
      onRefresh={async () => {
        await new Promise((r) => setTimeout(r, 500));
      }}
      right={
        <span style={{ display: "flex", alignItems: "center" }}>
          <Logo width={36} className="small-logo" />
          <NotifyButton count={app.unread} onPress={() => go.push("/notifications")} />
        </span>
      }
    >
      <div className="stack">
        <Card className="hero">
          <Photo src={images.onboardingHome} alt="A cleared foothill home surrounded by a defensible zone at golden hour" ratio="auto" eager />
          <div className="hero-copy">
            <h2>{siteConfig.tagline}</h2>
            <Button variant="urgent" onClick={() => go.push("/book?pushed=1&service=assessment")}>Book Free Assessment</Button>
            <Button variant="light" onClick={() => contact("call")}>Call Us</Button>
          </div>
        </Card>

        <div className="grid2">
          {[
            { icon: <CalendarPlus size={24} strokeWidth={1.75} />, label: "Book Appointment", to: "/book?pushed=1" },
            { icon: <FileText size={24} strokeWidth={1.75} />, label: "Get a Quote", to: "/quote" },
            { icon: <CalendarDays size={24} strokeWidth={1.75} />, label: "My Appointments", to: "/appointments" },
            { icon: <Shield size={24} strokeWidth={1.75} />, label: "Fire Safety Tips", to: "/guide" },
          ].map((item) => (
            <button key={item.label} type="button" className="card quick press" onClick={() => go.push(item.to)}>
              <span style={{ color: "var(--brand-ink)" }}>{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </div>

        <section className="gap12">
          <SectionHeader title="Our Services" action="See all" onAction={() => go.push("/services")} />
          <div className="hscroll">
            {services.map((service) => (
              <ServiceCard key={service.id} image={service.image} alt={service.alt} name={service.name} benefit={service.benefit} onPress={() => go.push(`/services/${service.id}`)} />
            ))}
          </div>
        </section>

        <section className="gap12">
          <SectionHeader title="Who We Serve" />
          {audiences.map((item) => (
            <Card key={item.id} onPress={() => go.push(`/serve/${item.id}`)}>
              <div className="spread">
                <strong className="headline">{item.title}</strong>
                {item.id === "residential" ? <House size={20} color="var(--brand-ink)" /> : item.id === "business" ? <Building2 size={20} color="var(--brand-ink)" /> : <Users size={20} color="var(--brand-ink)" />}
              </div>
              <p className="subhead muted" style={{ margin: "8px 0 0" }}>{item.benefit}</p>
            </Card>
          ))}
        </section>

        <section className="gap12">
          <SectionHeader title="Why Defensible Space Matters" />
          {whyItMatters.map((item) => (
            <Card key={item.title}>
              <h3 className="headline">{item.title}</h3>
              <p className="subhead muted" style={{ margin: "6px 0 0" }}>{item.body}</p>
            </Card>
          ))}
        </section>

        <section className="gap12">
          <SectionHeader title="How It Works" />
          <Card>
            <StepIndicator steps={howItWorks.map((s) => s.title)} current={1} />
            <div className="gap12" style={{ marginTop: 16 }}>
              {howItWorks.map((step) => (
                <p key={step.title} className="subhead" style={{ margin: 0 }}><strong>{step.title}. </strong><span className="muted">{step.detail}</span></p>
              ))}
            </div>
          </Card>
        </section>

        <section className="gap12">
          <SectionHeader title="Recent Projects" action="See all" onAction={() => go.push("/projects")} />
          <div className="hscroll">
            {projects.slice(0, 4).map((project) => (
              <ProjectCard
                key={project.id}
                before={project.before}
                after={project.after}
                beforeAlt={project.beforeAlt}
                afterAlt={project.afterAlt}
                title={project.title}
                meta="Sample project"
                onPress={() => go.push(`/projects/${project.id}`)}
              />
            ))}
          </div>
        </section>

        <Card className="banner">
          <h3 className="headline" style={{ color: "var(--accent-ink)" }}>Seasonal fire readiness</h3>
          <p className="subhead" style={{ margin: 0 }}>Late summer and fall are when fine fuels dry out. Walk your zones before the windy season.</p>
          <Button variant="urgent" onClick={() => go.push("/checklist")}>View Checklist</Button>
        </Card>

        <section className="gap12">
          <SectionHeader title="What clients say" />
          <div className="hscroll">
            {testimonials.map((item) => (
              <article key={item.id} className="card" style={{ width: 280 }}>
                <Badge tone="tint">Sample</Badge>
                <div style={{ marginTop: 8 }}><RatingStars value={item.stars} /></div>
                <p className="subhead" style={{ margin: "8px 0" }}>{item.text}</p>
                <p className="footnote">{item.name} · {item.place}</p>
              </article>
            ))}
          </div>
          <p className="footnote">Sample content. Replace with verified client reviews.</p>
        </section>

        <section className="gap12">
          <SectionHeader title="Upcoming" />
          {upcoming ? (
            <Card onPress={() => go.push(`/appointments/${upcoming.id}`)}>
              <div className="spread">
                <strong className="headline">{formatDate(upcoming.date)}</strong>
                <Badge tone={upcoming.status === "Pending" ? "tint" : "green"}>{upcoming.status}</Badge>
              </div>
              <p className="subhead" style={{ margin: "8px 0 0" }}>{upcoming.services.map((id) => serviceById(id)?.name || "Assessment").join(", ")}</p>
              <p className="footnote">{upcoming.startTime || upcoming.timeSlot} · {upcoming.address}</p>
              <p className="footnote" style={{ color: "var(--brand-ink)", fontWeight: 600, marginTop: 8 }}>View details</p>
            </Card>
          ) : (
            <EmptyState
              image={images.emptyAppointments}
              alt="Illustration of an empty calendar and a pine"
              title="No appointment yet"
              body="Book a free assessment and it will show up here."
              action={<Button onClick={() => go.push("/book?pushed=1")}>Book Free Assessment</Button>}
            />
          )}
        </section>

        <section className="gap12">
          <SectionHeader title="Contact" />
          <div className="contact-strip">
            <button type="button" onClick={() => contact("call")}><Phone size={22} strokeWidth={1.75} />Call</button>
            <button type="button" onClick={() => contact("text")}><MessageSquare size={22} strokeWidth={1.75} />Text</button>
            <button type="button" onClick={() => contact("email")}><Mail size={22} strokeWidth={1.75} />Email</button>
            <button type="button" onClick={() => contact("directions")}><Navigation size={22} strokeWidth={1.75} />Directions</button>
          </div>
          <p className="footnote" style={{ display: "flex", gap: 6 }}><MapPin size={14} /> {siteConfig.cityLine}</p>
        </section>
      </div>
    </ScreenContainer>
  );
}
