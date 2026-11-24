import { useMemo, useState } from "react";
import { siteConfig } from "@/data/siteConfig";
import { articleBySlug, articles, checklist, faqs, projectById, projects } from "@/data/content";
import { images } from "@/data/images";
import { useApp } from "@/lib/store";
import { ScreenContainer, useGo } from "@/components/native/chrome";
import { Button, Card, Group, ListItem, SectionHeader } from "@/components/native/ui";
import { BeforeAfter, EmptyState, Photo, ProgressRing } from "@/components/native/widgets";
import { CheckRow, Chip, SearchBar } from "@/components/native/forms";
import { ChevronDown } from "lucide-react";

const filters = ["All", "Residential", "Commercial", "HOA", "Mastication", "Hand Thinning", "Land Clearing"];

export function ProjectsScreen() {
  const go = useGo();
  const [filter, setFilter] = useState("All");
  const list = projects.filter((p) => filter === "All" || p.tags.includes(filter));
  return (
    <ScreenContainer title="Projects" large back>
      <div className="stack">
        <div className="chips">
          {filters.map((item) => <Chip key={item} selected={filter === item} onClick={() => setFilter(item)}>{item}</Chip>)}
        </div>
        {list.length === 0 ? (
          <EmptyState image={images.emptyProjects} alt="Illustration of empty photo frames" title="No projects in this filter" body="Try another filter, or book a similar scope and we will add real jobs here." />
        ) : list.map((project) => (
          <Card key={project.id}>
            <BeforeAfter before={project.before} after={project.after} beforeAlt={project.beforeAlt} afterAlt={project.afterAlt} />
            <button type="button" className="row press" onClick={() => go.push(`/projects/${project.id}`)}>
              <span className="row-text">
                <span className="row-title strong">{project.title}</span>
                <span className="row-sub">Sample project · {project.service}</span>
              </span>
            </button>
          </Card>
        ))}
      </div>
    </ScreenContainer>
  );
}

export function ProjectDetailScreen({ id }: { id: string }) {
  const project = projectById(id);
  const go = useGo();
  if (!project) return <ScreenContainer title="Project" back><div className="stack"><p className="body">That project is not in the sample gallery.</p></div></ScreenContainer>;
  return (
    <ScreenContainer title={project.title} back footer={<Button onClick={() => go.push(`/book?pushed=1&service=${serviceId(project.service)}`)}>Book a Similar Project</Button>}>
      <div className="stack">
        <BeforeAfter before={project.before} after={project.after} beforeAlt={project.beforeAlt} afterAlt={project.afterAlt} />
        <p className="footnote">Sample project — replace with real job photos and notes.</p>
        <Group>
          <ListItem title="Service" detail={project.service} />
          <ListItem title="Property" detail={project.propertyType} />
        </Group>
        <p className="body selectable">{project.story}</p>
      </div>
    </ScreenContainer>
  );
}

function serviceId(name: string) {
  if (name.includes("Mastication")) return "mastication";
  if (name.includes("Land")) return "land";
  if (name.includes("Hand")) return "thinning";
  if (name.includes("Harden")) return "hardening";
  return "defensible";
}

export function GuideScreen() {
  const go = useGo();
  return (
    <ScreenContainer title="Fire Safety Guide" large back>
      <div className="stack">
        <p className="body">Plain-language guidance. Your local fire district’s rules win if they differ.</p>
        <Group>
          {articles.map((article) => (
            <ListItem key={article.slug} title={article.title} chevron image={article.image} imageAlt={article.alt} onPress={() => go.push(`/guide/${article.slug}`)} />
          ))}
          <ListItem title="Seasonal checklist" chevron onPress={() => go.push("/checklist")} />
          <ListItem title="FAQs" chevron onPress={() => go.push("/faqs")} />
        </Group>
      </div>
    </ScreenContainer>
  );
}

export function ArticleScreen({ slug }: { slug: string }) {
  const article = articleBySlug(slug);
  if (!article) return <ScreenContainer title="Guide" back><div className="stack"><p className="body">That article is not available.</p></div></ScreenContainer>;
  return (
    <ScreenContainer title={article.title} back>
      <Photo src={article.image} alt={article.alt} ratio="16 / 9" />
      <div className="stack prose selectable">
        <h1 className="title-2">{article.title}</h1>
        {article.paras.map((para) => <p key={para.slice(0, 24)}>{para}</p>)}
      </div>
    </ScreenContainer>
  );
}

export function ChecklistScreen() {
  const app = useApp();
  const done = checklist.filter((item) => app.checklist[item.id]).length;
  return (
    <ScreenContainer title="Readiness Checklist" back>
      <div className="stack">
        <Card>
          <div className="spread">
            <div>
              <h1 className="title-3">Your progress</h1>
              <p className="footnote">Saved on this device. This is a reminder, not an inspection.</p>
            </div>
            <ProgressRing value={done} total={checklist.length} />
          </div>
        </Card>
        {["Immediate", "Intermediate", "Extended", "Season"].map((zone) => (
          <div key={zone} className="gap12">
            <SectionHeader title={zone} group />
            <Group>
              {checklist.filter((item) => item.zone === zone).map((item) => (
                <CheckRow key={item.id} checked={Boolean(app.checklist[item.id])} label={item.text} onChange={() => app.toggleCheck(item.id)} />
              ))}
            </Group>
          </div>
        ))}
      </div>
    </ScreenContainer>
  );
}

export function FaqScreen() {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState<string | null>(null);
  const list = useMemo(() => faqs.filter((faq) => `${faq.q} ${faq.a}`.toLowerCase().includes(query.trim().toLowerCase())), [query]);
  return (
    <ScreenContainer title="FAQs" large back>
      <div className="stack">
        <SearchBar value={query} onChange={setQuery} placeholder="Search questions" />
        <Group>
          {list.map((faq) => (
            <div key={faq.q}>
              <button type="button" className="row press" aria-expanded={open === faq.q} onClick={() => setOpen(open === faq.q ? null : faq.q)}>
                <span className="row-text"><span className="row-title">{faq.q}</span></span>
                <ChevronDown size={18} style={{ transform: open === faq.q ? "rotate(180deg)" : undefined }} />
              </button>
              {open === faq.q ? <p className="subhead faq-a selectable">{faq.a}</p> : null}
            </div>
          ))}
        </Group>
        {list.length === 0 ? <p className="body muted">No questions match that search.</p> : null}
      </div>
    </ScreenContainer>
  );
}

export function TermsScreen() {
  return (
    <ScreenContainer title="Terms of Service" back>
      <div className="stack prose selectable">
        <p className="footnote">Sample policy for demonstration. Client to confirm with counsel before publication.</p>
        <h1 className="title-2">Terms of Service</h1>
        <p>These terms describe how {siteConfig.businessName} offers appointments through this app. They are a placeholder, not legal advice.</p>
        <h2>Appointments</h2>
        <p>A booking request is not a confirmed job. We confirm the date after we review access, weather, and crew availability. The assessment visit is free. Work after that is priced in a separate estimate.</p>
        <h2>Your information</h2>
        <p>In this demo, your account, photos, and requests stay on this device. A production app must say where data is stored and who can see it.</p>
        <h2>Property access</h2>
        <p>You confirm that you have authority to request work at the address you enter, and that you will point out hazards, pets, gates, and plants that must stay.</p>
        <h2>No guarantee of compliance</h2>
        <p>Defensible space rules are local. Completing work with us does not by itself satisfy an insurer or a fire district. Confirm their standard before work starts.</p>
      </div>
    </ScreenContainer>
  );
}

export function PrivacyScreen() {
  return (
    <ScreenContainer title="Privacy Policy" back>
      <div className="stack prose selectable">
        <p className="footnote">Sample policy for demonstration. Client to confirm with counsel before publication.</p>
        <h1 className="title-2">Privacy Policy</h1>
        <p>This demo stores your profile, appointment drafts, photos, and checklist on this device only. It does not send them to a server.</p>
        <h2>What a live app should explain</h2>
        <ul>
          <li>What account and property details are collected.</li>
          <li>Whether photos leave the phone.</li>
          <li>How long records are kept.</li>
          <li>How to request deletion.</li>
        </ul>
        <p>Until the client publishes a real policy, treat everything in this app as sample handling, not a commitment.</p>
        <p>Contact for privacy questions: {siteConfig.email}.</p>
      </div>
    </ScreenContainer>
  );
}
