import { images } from "@/data/images";
import { siteConfig } from "@/data/siteConfig";

export type Audience = "Residential" | "Commercial" | "HOA";
export type CustomerType = "Residential" | "Business" | "HOA";

export type Service = {
  id: string;
  name: string;
  benefit: string;
  summary: string;
  summaries: Record<"All" | Audience, string>;
  audiences: Audience[];
  image: string;
  alt: string;
  intro: string;
  what: string;
  included: string[];
  idealFor: string[];
  process: string[];
  equipment: string;
  timeline: string;
  faqs: { q: string; a: string }[];
  projectIds: string[];
};

const pricing = siteConfig.pricingNote;

export const services: Service[] = [
  {
    id: "defensible",
    name: "Defensible Space Clearing",
    benefit: "Buffer zones that give a structure a fighting chance.",
    summary: "Remove and reduce flammable vegetation in the zones around a building.",
    summaries: {
      All: "Remove and reduce flammable vegetation in the zones around a building.",
      Residential: "Open the ground around your home so embers and flame have less to catch.",
      Commercial: "Create a workable buffer around shops, yards, and equipment.",
      HOA: "Treat shared edges so fuel does not run from lot to lot.",
    },
    audiences: ["Residential", "Commercial", "HOA"],
    image: images.serviceDefensible,
    alt: "A foothill home with a cleared defensible zone and limbed pines",
    intro:
      "Defensible space is the managed area around a structure. We reduce hazardous fuel so fire has less to burn and crews have room to work.",
    what: "We create buffer zones by removing and reducing flammable vegetation. The work follows the common zone concept: the immediate zone (0–5 ft), the intermediate zone (5–30 ft), and the extended zone (30–100 ft). Exact distances and plant rules depend on your fire district. We note what we see and you confirm the local standard before work starts.",
    included: [
      "Walk of the structure and the surrounding fuel",
      "Immediate zone cleanup of leaves, needles, and debris against the building",
      "Intermediate zone brush reduction and limbing where it matters",
      "Extended zone thinning of continuous fuel, as access allows",
      "Chipping or haul-off, agreed before the crew starts",
      "A final walkthrough of what was cleared and what was kept",
    ],
    idealFor: [
      "Homes in brush, pine, or sage",
      "Outbuildings, shops, and barns near wildland fuel",
      "Shared edges between homes and open space",
    ],
    process: [
      "Walk the property and mark plants that should stay.",
      "Clear by zone, starting closest to the structure.",
      "Chip or haul debris as agreed.",
      "Walk the finished zones with you.",
    ],
    equipment:
      "Crews use chainsaws, hand tools, a chipper when access allows, and trucks. Everyone on site wears a hard hat, eye and hearing protection, and high-visibility clothing.",
    timeline: "Many home lots are completed in one to three crew days after the start date. Larger or steeper sites take longer. Your estimate confirms a range.",
    faqs: [
      {
        q: "Will you remove every tree?",
        a: "No. The goal is to break up fuel, not to clear a healthy landscape to bare dirt beyond the immediate zone. We review what stays before cutting.",
      },
      {
        q: "Does this guarantee I will pass an inspection?",
        a: "No. Requirements differ by community. We work to the zones you confirm with your local fire authority. Keep their checklist with the quote.",
      },
      {
        q: "What happens to the debris?",
        a: "Chipping on site or haul-off. The choice is on your estimate, because access and volume change the work.",
      },
    ],
    projectIds: ["residential", "hoa"],
  },
  {
    id: "mastication",
    name: "Mastication",
    benefit: "Fast fuel reduction on acreage, with mulch left in place.",
    summary: "A forestry mulcher grinds brush and small trees into a protective mulch layer.",
    summaries: {
      All: "A forestry mulcher grinds brush and small trees into a protective mulch layer.",
      Residential: "Useful on larger home parcels where hand crews would move too slowly.",
      Commercial: "Opens overgrown yards and fuel breaks around a business quickly.",
      HOA: "Covers long greenbelts and common acreage in fewer visits.",
    },
    audiences: ["Residential", "Commercial", "HOA"],
    image: images.serviceMastication,
    alt: "A forestry mulcher grinding brush into wood-chip mulch",
    intro:
      "Mastication is mechanical grinding. A forestry mulcher turns brush and small trees into mulch, which reduces fuel and leaves a layer on the soil.",
    what: "The machine grinds standing brush and small-diameter trees where the ground will support it. It is fast on large acreage, leaves a mulch layer that helps cover bare soil, and lowers the fuel that can carry a flame. It is not the right tool against a house, on a steep cut, or among plants you want to keep.",
    included: [
      "Review of access, slope, and what must stay",
      "Grinding of brush and small trees in the agreed area",
      "Mulch left in place unless you ask for a different finish",
      "A fuel break or acreage pass, mapped with you first",
    ],
    idealFor: [
      "Rural lots and larger acreage",
      "HOA open space and fuel breaks",
      "Overgrown fields where hand work would be too slow",
    ],
    process: [
      "Confirm machine access, gates, and hazards.",
      "Walk the keep-trees and the work edge.",
      "Mulch the agreed area.",
      "Review the finished ground with you.",
    ],
    equipment:
      "A forestry mulcher on a tracked or wheeled carrier, plus a ground guide. Hand crews follow where the machine must stop. Spark-aware work practices and PPE are required on every shift.",
    timeline: "Open acreage often moves in one to five crew days. Rock, slope, and density change the pace. Your estimate includes a range, not a fixed day count.",
    faqs: [
      {
        q: "Will the mulch stop a wildfire?",
        a: "Mulch reduces fine fuel and covers soil. It is not a fireproof barrier. It is one part of a managed property.",
      },
      {
        q: "Can the machine work next to the house?",
        a: "Usually no. Close work, steep cuts, and tight trees are hand thinning. We say so on the assessment.",
      },
      {
        q: "Do you haul the chips away?",
        a: "The standard finish leaves the mulch. Haul-off is a separate line on the estimate when you want it.",
      },
    ],
    projectIds: ["hillside", "rural"],
  },
  {
    id: "land",
    name: "Land Clearing",
    benefit: "Open an overgrown lot for safety, access, or the next use.",
    summary: "Full clearing of overgrown ground, including debris handling.",
    summaries: {
      All: "Full clearing of overgrown ground, including debris handling.",
      Residential: "Open a lot that has closed in around a home or a future building pad.",
      Commercial: "Clear yards, storage areas, and access around a working property.",
      HOA: "Open common ground that has become a continuous fuel bed.",
    },
    audiences: ["Residential", "Commercial", "HOA"],
    image: images.serviceLand,
    alt: "A newly cleared rural lot with staged branches and an open access path",
    intro:
      "Land clearing removes overgrown vegetation so a property can be used safely. That includes lots prepared for work, and the roads and driveways that reach them.",
    what: "We clear brush, small trees, and downed material from an agreed area. Debris is chipped, piled, or hauled. This is broader than defensible space: the goal is an open, usable piece of ground, not only a buffer around a building.",
    included: [
      "Edge and area marked before cutting",
      "Clearing of brush and agreed small trees",
      "Debris piled, chipped, or hauled",
      "Access path or driveway corridor when that is part of the job",
    ],
    idealFor: [
      "Overgrown lots",
      "Construction prep where vegetation must be removed first",
      "Driveways and access roads closed in by brush",
    ],
    process: [
      "Mark the clearing limits and anything to protect.",
      "Take down vegetation in a controlled order.",
      "Process debris.",
      "Leave the edges clean enough to see the next step.",
    ],
    equipment:
      "Mulcher, chainsaws, and hand tools depending on the timber and the access. Trucks for haul-off when that is on the estimate. The same PPE rules apply.",
    timeline: "A small lot may be a day or two. Acreage and haul-off add time. The estimate states a range after we see the site.",
    faqs: [
      {
        q: "Do you pull stumps?",
        a: "Stump removal is not assumed. If you need stumps out, we say whether that is in scope or a different crew.",
      },
      {
        q: "Can you clear up to the property line?",
        a: "Only where you confirm the line. We do not guess a boundary.",
      },
      {
        q: "Is clearing the same as defensible space?",
        a: "No. Clearing opens ground. Defensible space is zoned work around a structure. Many properties need some of both.",
      },
    ],
    projectIds: ["commercial", "driveway"],
  },
  {
    id: "thinning",
    name: "Hand Thinning",
    benefit: "Precise cutting where a machine should not go.",
    summary: "Selective thinning with saws and hand tools on slopes and near structures.",
    summaries: {
      All: "Selective thinning with saws and hand tools on slopes and near structures.",
      Residential: "The right choice tight to a house, deck, or fence.",
      Commercial: "Detail work around buildings after the machine work stops.",
      HOA: "Trail edges, steep common ground, and pockets between homes.",
    },
    audiences: ["Residential", "Commercial", "HOA"],
    image: images.serviceThinning,
    alt: "Selectively thinned pines on a rocky slope with limbed trunks",
    intro:
      "Hand thinning is selective. Crews cut by hand where machines cannot reach or should not operate: steep slopes, near structures, and places where some plants must stay.",
    what: "Trained crews thin vegetation with chainsaws and hand tools. The work includes limbing and ladder-fuel removal so fire is less likely to climb from the ground into the canopy. Debris can be chipped or hauled. We mark keep-trees before the saws start.",
    included: [
      "Marking of trees and shrubs to keep",
      "Selective removal and spacing",
      "Limbing and ladder-fuel cuts",
      "Chipping or haul-off as agreed",
      "Cleanup of the work area",
    ],
    idealFor: [
      "Steep or rocky ground",
      "The first 30 feet around a structure",
      "Sensitive edges, fences, and utilities",
    ],
    process: [
      "Walk and mark the keep-plants.",
      "Cut, limb, and buck in small sections.",
      "Chip or carry debris out.",
      "Check the spacing with you.",
    ],
    equipment:
      "Chainsaws, polesaws, loppers, and a chipper when the hose or the truck can reach. No masticator in the tight zone. Full PPE, including chaps for sawyers.",
    timeline: "Hand work is slower than mastication. Many home sites take one to three crew days. Dense slopes take longer. The estimate gives a range.",
    faqs: [
      {
        q: "Why not just use the mulcher?",
        a: "Machines are fast and blunt. Next to a house, on a steep cut, or among trees you want to save, hand work is the safer tool.",
      },
      {
        q: "Do you prune ornamentals?",
        a: "We limb for fuel, not for a landscape prune. If a plant should be shaped for looks, say so and we will tell you if it is in scope.",
      },
      {
        q: "Can you work in a backyard with a gate?",
        a: "Often yes, if the gate and the path are safe for crew and equipment. Photos help us judge that before the visit.",
      },
    ],
    projectIds: ["residential", "hillside"],
  },
  {
    id: "hardening",
    name: "Home Hardening",
    benefit: "Fewer places for embers to enter the building.",
    summary: "Assessment and agreed work that reduces ember and flame exposure on the structure.",
    summaries: {
      All: "Assessment and agreed work that reduces ember and flame exposure on the structure.",
      Residential: "Vents, gutters, and the first few feet around the home you live in.",
      Commercial: "The same ember paths on a shop, office, or outbuilding.",
      HOA: "Clubhouses and shared buildings, plus a checklist the board can keep.",
    },
    audiences: ["Residential", "Commercial", "HOA"],
    image: images.serviceHardening,
    alt: "Ember-resistant vent mesh, clean gutters, and a gravel strip along a home foundation",
    intro:
      "Home hardening reduces the ways embers and flame can take a building. We assess, recommend, and complete the service items you confirm.",
    what: "This is the structure, not the hillside. We look at ember-resistant vent screening, gutter and roof debris, the non-combustible zone at the foundation, gaps where a deck or fence meets the building, and a written checklist. We do not claim a home is fireproof. We do the items you approve, and we leave the rest as recommendations for you or another trade.",
    included: [
      "Walk of vents, eaves, gutters, decks, and fence connections",
      "Written hardening checklist you can keep",
      "Vent screening where you approve the work",
      "Gutter and roof-debris cleanup where you approve the work",
      "Recommendations for a non-combustible strip, deck gaps, and fence gaps",
    ],
    idealFor: [
      "Homes already planning defensible space",
      "Buildings with debris in gutters or open foundation vents",
      "Boards that want a building checklist, not only brush work",
    ],
    process: [
      "Inspect the ember paths and photograph what we find.",
      "Separate work we can do from items for another trade.",
      "Complete the approved items.",
      "Leave the checklist with you.",
    ],
    equipment:
      "Hand tools, fine metal mesh for approved vents, and ladders where the roof edge is safe to reach. We do not replace roofs or rebuild decks unless that item is separately agreed.",
    timeline: "The assessment is a single visit. Approved items such as vent screening and gutter cleaning are scheduled after you accept them. The estimate separates the visit from the work.",
    faqs: [
      {
        q: "Will you replace my roof?",
        a: "No. We can point out debris and vulnerable details. Roof replacement is a different trade. We will say so plainly.",
      },
      {
        q: "Are mesh and gutter cleaning included automatically?",
        a: "The assessment is included in the visit. Mesh, gutter cleaning, and similar tasks are service items you confirm on the estimate.",
      },
      {
        q: "Does hardening replace defensible space?",
        a: "No. Embers still land in brush against the wall. Most properties need both the building and the zones around it.",
      },
    ],
    projectIds: ["residential", "hoa"],
  },
];

export const assessmentOption = {
  id: "assessment",
  name: "Not sure, I need an assessment",
  benefit: "A free on-site look when you do not know which service fits.",
  summary: "We walk the property, explain the work, and follow up with a clear quote.",
};

export type Project = {
  id: string;
  title: string;
  tags: string[];
  service: string;
  propertyType: string;
  story: string;
  before: string;
  after: string;
  beforeAlt: string;
  afterAlt: string;
};

export const projects: Project[] = [
  {
    id: "residential",
    title: "Foothill home lot",
    tags: ["Residential", "Hand Thinning"],
    service: "Defensible Space Clearing",
    propertyType: "Residential",
    story:
      "Sample project — replace with a real job. Brush and dry grass were pulled back from the walls, lower limbs were raised, and the driveway apron was opened so the house could be seen from the road.",
    before: images.baResidentialBefore,
    after: images.baResidentialAfter,
    beforeAlt: "Overgrown brush crowding a foothill house before clearing",
    afterAlt: "The same foothill house with a cleared defensible zone",
  },
  {
    id: "commercial",
    title: "Rural shop yard",
    tags: ["Commercial", "Land Clearing"],
    service: "Land Clearing",
    propertyType: "Commercial",
    story:
      "Sample project — replace with a real job. Continuous brush was cleared from a shop wall and fence so the yard could be walked and the building was no longer tied into the fuel.",
    before: images.baCommercialBefore,
    after: images.baCommercialAfter,
    beforeAlt: "A commercial shop hidden by tall brush before clearing",
    afterAlt: "The same shop with an open gravel apron after clearing",
  },
  {
    id: "hoa",
    title: "Neighborhood greenbelt",
    tags: ["HOA", "Hand Thinning"],
    service: "Defensible Space Clearing",
    propertyType: "HOA",
    story:
      "Sample project — replace with a real job. A connected band of brush between fences was thinned into separated shrubs and an open path, so fuel no longer ran unbroken behind the homes.",
    before: images.baHoaBefore,
    after: images.baHoaAfter,
    beforeAlt: "A thick HOA greenbelt connecting fences before thinning",
    afterAlt: "The same greenbelt thinned with a clear walking path",
  },
  {
    id: "hillside",
    title: "Steep hillside",
    tags: ["Residential", "Mastication", "Hand Thinning"],
    service: "Mastication",
    propertyType: "Residential",
    story:
      "Sample project — replace with a real job. Dense brush on a slope above a roof was ground into mulch where the machine could work, and the remaining trees were spaced and limbed.",
    before: images.baHillsideBefore,
    after: images.baHillsideAfter,
    beforeAlt: "A steep hillside of dense brush above a home before mastication",
    afterAlt: "The same hillside with mulch and spaced, limbed trees",
  },
  {
    id: "rural",
    title: "Rural acreage",
    tags: ["Residential", "Mastication"],
    service: "Mastication",
    propertyType: "Residential",
    story:
      "Sample project — replace with a real job. Sage and juniper that had closed a dirt track were mulched into a passable access route, with trees left where they were not part of the fuel bed.",
    before: images.baRuralBefore,
    after: images.baRuralAfter,
    beforeAlt: "Rural acreage with brush covering a dirt track",
    afterAlt: "The same acreage with a cleared access track and mulch",
  },
  {
    id: "driveway",
    title: "Driveway clearance",
    tags: ["Residential", "Land Clearing"],
    service: "Land Clearing",
    propertyType: "Residential",
    story:
      "Sample project — replace with a real job. Limbs and brush were cleared along a narrow drive so the road was open and the house was visible, with a fuel break on both shoulders.",
    before: images.baDrivewayBefore,
    after: images.baDrivewayAfter,
    beforeAlt: "A driveway closed in by brush and low branches",
    afterAlt: "The same driveway opened with cleared shoulders",
  },
];

export const audiences: {
  id: "residential" | "business" | "hoa";
  title: string;
  customerType: CustomerType;
  benefit: string;
  image: string;
  alt: string;
  intro: string;
  needs: string[];
  points: string[];
}[] = [
  {
    id: "residential",
    title: "Residential",
    customerType: "Residential",
    benefit: "Protect the home you live in, on a schedule that respects the household.",
    image: images.baResidentialAfter,
    alt: "A cleared residential home in the Nevada foothills",
    intro:
      "Homeowners ask us to make the first zones around the house understandable and finished. We walk it with you, say what should stay, and leave the property tidy.",
    needs: [
      "Brush against walls, decks, and fences",
      "Limbs that ladder into the roof",
      "A driveway that has grown shut",
      "A clear list you can share with an insurer or a fire district",
    ],
    points: [
      "Work is sequenced from the house outward.",
      "We confirm access, pets, and gates before the crew arrives.",
      "Debris handling is chosen with you, not assumed.",
    ],
  },
  {
    id: "business",
    title: "Businesses",
    customerType: "Business",
    benefit: "Keep buildings, yards, and access clear without guessing at the work.",
    image: images.baCommercialAfter,
    alt: "A commercial shop yard after brush was cleared from the building",
    intro:
      "Commercial properties need the same fuel break as a home, plus room for people and vehicles to move. We plan the work so the business can stay open.",
    needs: [
      "Yards and storage areas grown into the fence line",
      "Access for deliveries and emergency vehicles",
      "Shops and outbuildings tied into brush",
      "A written scope a manager can approve",
    ],
    points: [
      "We schedule around operating hours when you tell us what those are.",
      "The estimate names the area, the debris plan, and what is not included.",
      "A site contact can meet the crew if you will not be there.",
    ],
  },
  {
    id: "hoa",
    title: "HOAs",
    customerType: "HOA",
    benefit: "Community-wide fuel work, multi-lot scheduling, and paperwork the board can file.",
    image: images.baHoaAfter,
    alt: "An HOA greenbelt after thinning, with an open path between homes",
    intro:
      "Associations need a plan that covers common ground and the edges between homes. We schedule multiple areas in one program and document what was done.",
    needs: [
      "Greenbelts that connect fuel from lot to lot",
      "A repeatable schedule, not a one-time scramble",
      "Notes a board can attach to a compliance file",
      "One contact for several work areas",
    ],
    points: [
      "Multi-lot and common-area visits can be booked as one request.",
      "We provide a simple record of areas treated and the date. Your fire district decides what else a file needs.",
      "The assessment can start with the board, then expand to priority lots.",
    ],
  },
];

export const testimonials = [
  {
    id: "t1",
    name: "Sample Client",
    place: "[Neighborhood — client to confirm]",
    stars: 5,
    text: "Sample review — replace with a verified client review. The crew walked the zones with us and left the edges tidy.",
  },
  {
    id: "t2",
    name: "Sample Client",
    place: "[Neighborhood — client to confirm]",
    stars: 5,
    text: "Sample review — replace with a verified client review. We understood the quote before any saw was started.",
  },
  {
    id: "t3",
    name: "Sample Board Member",
    place: "[HOA — client to confirm]",
    stars: 4,
    text: "Sample review — replace with a verified client review. The common-area work was sequenced so the path stayed open.",
  },
];

export const whyItMatters = [
  {
    title: "Reduces ember ignition risk",
    body: "Spacing, clean roofs, and clear ground give embers fewer places to catch next to a building.",
  },
  {
    title: "May help with insurance and local rules",
    body: "Many policies and fire codes ask for defensible space. Confirm the exact rules for your area. We do not promise a discount or a passing inspection.",
  },
];

export const howItWorks = [
  { title: "Book", detail: "Tell us about the property. It takes a few minutes." },
  { title: "Assess", detail: "We walk the site and explain the work in plain language." },
  { title: "Clear", detail: "The crew removes the hazardous fuel you approved." },
  { title: "Protect", detail: "You keep a cleaner perimeter and a record of the visit." },
];

export const articles = [
  {
    slug: "zones",
    title: "Understanding the zones",
    image: images.safetyZones,
    alt: "A home with immediate, intermediate, and extended defensible zones visible from above",
    paras: [
      "Defensible space is usually described in three bands. Your fire district may name them differently or measure them differently. Use their guide when you have it.",
      "The immediate zone is the first 0–5 feet from the structure. This is where embers land in leaves, against vents, and under decks. Keep it as clear of combustible debris as you reasonably can.",
      "The intermediate zone is about 5–30 feet. Here the goal is spacing: shrubs that do not touch the walls, trees that are limbed up, and fuel that does not form a continuous path to the house.",
      "The extended zone is about 30–100 feet, or to the property line if that comes first. The work is lighter. Thin dense pockets so a flame cannot move easily through the canopy or the brush.",
      "Battle Born walks these bands with you and writes down what we recommend. We do not replace your local standard. If a rule conflicts with what you see here, follow the local rule.",
    ],
  },
  {
    slug: "seasonal",
    title: "Seasonal checklist",
    image: images.onboardingHome,
    alt: "A foothill home with a maintained defensible zone in warm evening light",
    paras: [
      "Fuel conditions change through the year. A property that looked open in spring can collect needles, weeds, and windfall by late summer.",
      "Before the dry, windy part of the year, walk the roof edge, the gutters, the first five feet, and the driveway. Look for anything that has grown back into a continuous line of fuel.",
      "After a wind event, check fences and decks. Debris collects there even when the yard looks fine from the street.",
      "The in-app checklist stores your progress on this device. It is a reminder, not an inspection report.",
    ],
  },
  {
    slug: "embers",
    title: "Ember-resistant home tips",
    image: images.safetyVents,
    alt: "A foundation vent covered with fine metal mesh",
    paras: [
      "Most home losses in wildfire start with embers, not a wall of flame. Small gaps matter.",
      "Foundation and attic vents should be screened with fine metal mesh. Torn screens and open vents are worth a note on your hardening checklist.",
      "Gutters full of needles are a common ember bed. Guards help only if they are actually clear. Look at the roof valleys too.",
      "A fence or deck that touches the wall can carry flame to the siding. A small non-combustible gap is a common recommendation. We will point it out. Rebuilding it may be a separate trade.",
      "Keep the first few feet at the foundation free of bark mulch, stored lumber, and firewood.",
    ],
  },
  {
    slug: "insurance",
    title: "Insurance and compliance tips",
    image: images.safetyGutters,
    alt: "Clean metal gutters with guards on a composition roof",
    paras: [
      "Insurers and fire districts often ask for photos and a description of the zones around a building. Requirements are local. We do not interpret your policy.",
      "Ask your agent or district which form they want before the crew arrives, so the assessment can match it.",
      "A completed job is not a certificate of compliance unless the authority that inspects your property says so. We can provide a simple record of the date, the area, and the work performed.",
      "Keep that record with your photos. If a standard changes, the record shows what was done and when.",
    ],
  },
];

export const checklist = [
  { id: "c1", zone: "Immediate", text: "Clear dry leaves, needles, and debris from the roof, valleys, and gutters." },
  { id: "c2", zone: "Immediate", text: "Move firewood, lumber, and trash bins away from the walls and deck." },
  { id: "c3", zone: "Immediate", text: "Look at foundation and attic vents. Note torn or missing metal mesh." },
  { id: "c4", zone: "Immediate", text: "Confirm nothing combustible is stored under the deck." },
  { id: "c5", zone: "Intermediate", text: "Trim shrubs so they do not touch siding, eaves, or fences that meet the house." },
  { id: "c6", zone: "Intermediate", text: "Limb trees so lower branches are well above the ground." },
  { id: "c7", zone: "Intermediate", text: "Break up continuous brush so fuel does not form a line to the building." },
  { id: "c8", zone: "Extended", text: "Thin dense pockets of small trees farther from the house." },
  { id: "c9", zone: "Extended", text: "Keep the driveway wide and high enough for an engine to pass." },
  { id: "c10", zone: "Season", text: "Walk the property again after wind, and before the driest part of the year." },
];

export const faqs = [
  {
    q: "Is the assessment free?",
    a: "Yes. The on-site assessment is free. Work is priced after we see the property. Pricing depends on acreage, terrain, and vegetation density.",
  },
  {
    q: "How soon can you visit?",
    a: "Choose a date in the app. We confirm the time after we review access and the crew schedule. Same-week visits depend on the season.",
  },
  {
    q: "Do I need to be there?",
    a: "For the assessment, yes if you can. If a manager or board contact will meet us, add them on the booking. Crews should not guess which plants stay.",
  },
  {
    q: "Are you licensed and insured?",
    a: `${siteConfig.licenseLabel}. ${siteConfig.insuranceLabel}. We will not state numbers until the client publishes them.`,
  },
  {
    q: "What areas do you serve?",
    a: "The service-area list in the app is a placeholder. Confirm the counties and cities with us before you book a distant property.",
  },
  {
    q: "Can you work on a steep lot?",
    a: "Often, with hand crews. If a machine cannot sit safely, we say so and price the hand work instead.",
  },
  {
    q: "Will this lower my insurance?",
    a: "We cannot promise that. Some insurers ask for defensible space. Your agent is the one who can speak to your policy.",
  },
  {
    q: "What if I am not sure which service I need?",
    a: "Choose “Not sure, I need an assessment.” That is the free visit. We will recommend the work after we see the site.",
  },
];

export const cancelReasons = [
  "Schedule conflict",
  "No longer needed",
  "Booked a different time",
  "Access or weather concern",
  "Other",
];

export const structureOptions = ["Home", "Garage", "Shop", "Barn", "Fence", "Outbuilding", "Other"];
export const sizeOptions = ["Under 1 acre", "1–5 acres", "5–20 acres", "20+ acres", "Not sure"];
export const terrainOptions = ["Flat", "Moderate slope", "Steep"];
export const vegetationOptions = ["Brush", "Trees", "Mixed", "Grass"];
export const accessOptions = ["Gate", "Road", "Driveway"];
export const appointmentTypes = ["On-site Assessment", "Phone Call", "Video Call"] as const;
export const contactMethods = ["Phone", "Text", "Email"] as const;

export const onboardingSlides = [
  {
    image: images.onboardingHome,
    alt: "A Nevada foothill home with a wide cleared defensible zone at golden hour",
    title: "Protect Your Property from Wildfire",
    body: "Defensible space is your first line of defense. We clear hazardous fuel so your home has a fighting chance.",
  },
  {
    image: images.onboardingMastication,
    alt: "A forestry mulcher clearing dense brush while a crew in safety gear stands at a distance",
    title: "Professional Mastication and Land Clearing",
    body: "Heavy-duty equipment clears dense brush and small trees quickly, efficiently, and safely.",
  },
  {
    image: images.onboardingThinning,
    alt: "A crew member in a hard hat and high-visibility vest hand-thinning pine and sage",
    title: "Precision Hand Thinning",
    body: "Our trained crews thin vegetation by hand where machines cannot reach, protecting what should stay.",
  },
  {
    image: images.onboardingAssessment,
    alt: "A specialist with a tablet assessing brush, with a forest-green work truck behind them",
    title: "Book in Minutes",
    body: "Schedule a free property assessment, get a clear quote, and track your appointment right from your phone.",
  },
];

export function serviceById(id: string) {
  return services.find((s) => s.id === id);
}

export function projectById(id: string) {
  return projects.find((p) => p.id === id);
}

export function articleBySlug(slug: string) {
  return articles.find((a) => a.slug === slug);
}
