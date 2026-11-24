import { useMemo, useState } from "react";
import { Check, ChevronDown, ChevronRight } from "lucide-react";
import { siteConfig } from "@/data/siteConfig";
import { audiences, projects, serviceById, services } from "@/data/content";
import { ScreenContainer, useGo } from "@/components/native/chrome";
import { Button, Card, Group, ListItem, SectionHeader } from "@/components/native/ui";
import { Badge, BeforeAfter, Photo } from "@/components/native/widgets";
import { SearchBar } from "@/components/native/forms";

const FILTERS = ["All", "Residential", "Commercial", "HOA"] as const;

export function ServicesScreen() {
  const go = useGo();
  const [query, setQuery] = useState("");
  const [segment, setSegment] = useState<(typeof FILTERS)[number]>("All");
  const list = useMemo(() => {
    return services.filter((service) => {
      const text = `${service.name} ${service.summaries[segment]}`.toLowerCase();
      const matchesQuery = text.includes(query.trim().toLowerCase());
      const matchesSegment = segment === "All" || service.audiences.includes(segment);
      return matchesQuery && matchesSegment;
    });
  }, [query, segment]);
  const featured = !query.trim() && segment === "All" ? list[0] : null;
  const rest = featured ? list.slice(1) : list;
  return (
    <ScreenContainer title="Services" large tab>
      <div className="stack">
        <SearchBar value={query} onChange={setQuery} placeholder="Search services" />
        <div className="chip-row" role="tablist" aria-label="Service type">
          {FILTERS.map((item) => (
            <button
              key={item}
              type="button"
              role="tab"
              aria-selected={segment === item}
              className={`chip ${segment === item ? "on" : ""}`}
              onClick={() => setSegment(item)}
            >
              {item}
            </button>
          ))}
        </div>
        {featured ? (
          <button type="button" className="svc-hero press" onClick={() => go.push(`/services/${featured.id}`)}>
            <Photo src={featured.image} alt={featured.alt} ratio="16 / 10" eager />
            <span className="svc-hero-copy">
              <span className="svc-kicker">Most requested</span>
              <span className="svc-hero-title">{featured.name}</span>
              <span className="svc-hero-sub">{featured.summaries.All}</span>
            </span>
          </button>
        ) : null}
        <div className="svc-list">
          {rest.map((service) => (
            <button key={service.id} type="button" className="svc-tile press" onClick={() => go.push(`/services/${service.id}`)}>
              <Photo src={service.image} alt={service.alt} ratio="16 / 9" />
              <span className="svc-tile-copy">
                <span className="spread">
                  <span className="headline">{service.name}</span>
                  <ChevronRight size={18} strokeWidth={1.75} color="var(--brand-ink)" />
                </span>
                <span className="footnote">{service.summaries[segment]}</span>
                <span className="chips">
                  {service.audiences.map((audience) => <Badge key={audience} tone="green">{audience}</Badge>)}
                </span>
              </span>
            </button>
          ))}
        </div>
        {list.length === 0 ? <p className="body muted">No services match that search.</p> : null}
      </div>
    </ScreenContainer>
  );
}

export function ServiceDetailScreen({ id }: { id: string }) {
  const go = useGo();
  const service = serviceById(id);
  const [open, setOpen] = useState<string | null>(null);
  if (!service) {
    return (
      <ScreenContainer title="Service" back>
        <div className="stack"><p className="body">That service is not in the list.</p></div>
      </ScreenContainer>
    );
  }
  const gallery = projects.filter((p) => service.projectIds.includes(p.id));
  return (
    <ScreenContainer
      title={service.name}
      back
      footer={
        <>
          <Button onClick={() => go.push(`/book?pushed=1&service=${service.id}`)}>Book This Service</Button>
          <Button variant="text" onClick={() => go.push(`/quote?service=${service.id}`)}>Get a Quote</Button>
        </>
      }
    >
      <Photo src={service.image} alt={service.alt} ratio="16 / 9" eager />
      <div className="stack">
        <div className="gap12">
          <h1 className="title-2">{service.name}</h1>
          <p className="body">{service.intro}</p>
          <div className="chips">
            {service.audiences.map((a) => <Badge key={a} tone="green">{a}</Badge>)}
          </div>
        </div>
        <section className="gap12">
          <SectionHeader title="What It Is" group />
          <p className="body">{service.what}</p>
        </section>
        <section className="gap12">
          <SectionHeader title="What's Included" group />
          <Group>
            {service.included.map((item) => (
              <div key={item} className="row">
                <Check size={18} color="var(--brand-ink)" strokeWidth={1.75} />
                <span className="row-title">{item}</span>
              </div>
            ))}
          </Group>
        </section>
        <section className="gap12">
          <SectionHeader title="Ideal For" group />
          <Group>
            {service.idealFor.map((item) => <ListItem key={item} title={item} />)}
          </Group>
        </section>
        <section className="gap12">
          <SectionHeader title="How We Do It" group />
          <Group>
            {service.process.map((item, i) => <ListItem key={item} title={`${i + 1}. ${item}`} />)}
          </Group>
        </section>
        <Card>
          <h2 className="headline">Equipment and Safety</h2>
          <p className="subhead" style={{ marginTop: 8 }}>{service.equipment}</p>
        </Card>
        <Card>
          <h2 className="headline">Typical Timeline</h2>
          <p className="subhead" style={{ marginTop: 8 }}>{service.timeline}</p>
        </Card>
        <Card>
          <h2 className="headline">Pricing Info</h2>
          <p className="subhead" style={{ marginTop: 8 }}>{siteConfig.pricingNote}</p>
        </Card>
        <section className="gap12">
          <SectionHeader title="Before and After" group />
          {gallery.map((project) => (
            <Card key={project.id} className="" >
              <BeforeAfter before={project.before} after={project.after} beforeAlt={project.beforeAlt} afterAlt={project.afterAlt} />
              <p className="footnote" style={{ marginTop: 8 }}>Sample project · {project.title}</p>
            </Card>
          ))}
        </section>
        <section className="gap12">
          <SectionHeader title="FAQs" group />
          <Group>
            {service.faqs.map((faq) => (
              <div key={faq.q}>
                <button type="button" className="row press" onClick={() => setOpen(open === faq.q ? null : faq.q)} aria-expanded={open === faq.q}>
                  <span className="row-text"><span className="row-title strong">{faq.q}</span></span>
                  <ChevronDown size={18} style={{ transform: open === faq.q ? "rotate(180deg)" : undefined }} />
                </button>
                {open === faq.q ? <p className="subhead faq-a">{faq.a}</p> : null}
              </div>
            ))}
          </Group>
        </section>
      </div>
    </ScreenContainer>
  );
}

export function AudienceScreen({ id }: { id: string }) {
  const page = audiences.find((a) => a.id === id);
  const go = useGo();
  if (!page) {
    return <ScreenContainer title="Who we serve" back><div className="stack"><p className="body">That page is missing.</p></div></ScreenContainer>;
  }
  return (
    <ScreenContainer
      title={page.title}
      back
      footer={<Button onClick={() => go.push(`/book?pushed=1&type=${page.customerType}`)}>Book for {page.title}</Button>}
    >
      <Photo src={page.image} alt={page.alt} ratio="16 / 9" />
      <div className="stack">
        <p className="body">{page.intro}</p>
        <SectionHeader title="Typical needs" group />
        <Group>
          {page.needs.map((need) => <ListItem key={need} title={need} />)}
        </Group>
        <SectionHeader title="How we help" group />
        <Group>
          {page.points.map((point) => <ListItem key={point} title={point} />)}
        </Group>
      </div>
    </ScreenContainer>
  );
}
