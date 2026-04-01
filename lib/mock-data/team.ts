import type { TeamMember } from "@/types"

export const TEAM_MEMBERS: TeamMember[] = [
  {
    id: "team-001",
    name: "Natasha Brennan",
    role: "Co-Founder & CEO",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=NatashaBrennan",
    bio: "Natasha spent 10 years in retail merchandising at Williams-Sonoma and Nordstrom before co-founding the company in 2020. She's obsessed with the idea that online shopping should feel as curated and trustworthy as the best brick-and-mortar experience. When she's not working, she's hiking the Cascade Range or attempting to perfect her pour-over technique.",
    social: {
      twitter: "@natasha_brennan",
      linkedin: "linkedin.com/in/natasha-brennan",
    },
  },
  {
    id: "team-002",
    name: "Raj Kapoor",
    role: "Co-Founder & CTO",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=RajKapoor",
    bio: "Raj previously led engineering teams at Shopify and Stripe, where he built payment infrastructure used by millions of merchants. He founded the engineering organization here on two principles: systems should be fast and code should be kind to the next engineer who reads it. Outside work, he's a competitive cyclist and amateur astrophotographer.",
    social: {
      twitter: "@rajkapoor_dev",
      linkedin: "linkedin.com/in/raj-kapoor-tech",
    },
  },
  {
    id: "team-003",
    name: "Claire Beaumont",
    role: "Style Director",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=ClaireBeaumont",
    bio: "Claire brings 15 years of editorial experience from Vogue, Monocle, and a five-year stint as creative director for a sustainable fashion label in Copenhagen. She's responsible for every buying and curation decision — if a product is on the site, Claire has held it, worn it, or used it. She lives by the belief that great design respects both its user and the planet.",
    social: {
      twitter: "@claire_beaumont_style",
      linkedin: "linkedin.com/in/claire-beaumont",
    },
  },
  {
    id: "team-004",
    name: "Marcus Webb",
    role: "Head of Operations",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=MarcusWebb",
    bio: "Marcus oversees the supply chain, warehouse operations, and logistics network that gets orders from our shelves to your doorstep. Before joining us, he optimized fulfillment operations for a 200-SKU DTC brand and reduced average shipping time by 40%. He's a methodical problem-solver who believes that the unsexy back-of-house work is where customer experience is actually won or lost.",
    social: {
      linkedin: "linkedin.com/in/marcus-webb-ops",
    },
  },
  {
    id: "team-005",
    name: "Sophie Andersen",
    role: "Head of Sustainability",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=SophieAndersen",
    bio: "Sophie joined after completing her MSc in Environmental Management at Yale and three years consulting for B-Corp certification processes across the retail and apparel sectors. She holds every vendor to a rigorous environmental and social accountability framework she developed in-house — and she's not shy about turning away brands that can't meet the bar. Off the clock, she's a weekend cyclist and passionate sea kayaker.",
    social: {
      twitter: "@sophie_andersen_sustain",
      linkedin: "linkedin.com/in/sophie-andersen-esg",
    },
  },
  {
    id: "team-006",
    name: "Jordan Hayes",
    role: "Head of Content & Editorial",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=JordanHayes",
    bio: "Jordan ran the tech desk at a major consumer magazine for seven years before moving to branded content. At our company, Jordan oversees the editorial calendar, product review program, and the writing team responsible for guides, buying advice, and the brand blog. The goal is always to give customers genuinely useful information — not SEO-optimized noise.",
    social: {
      twitter: "@jordan_hayes_writes",
      linkedin: "linkedin.com/in/jordan-hayes-editorial",
    },
  },
  {
    id: "team-007",
    name: "Priya Mehta",
    role: "Head of Customer Experience",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=PriyaMehta",
    bio: "Priya has spent her entire career in customer-facing roles, starting on the shop floor of a London department store and most recently as VP of Customer Success at a mid-sized DTC brand. She built our support team from three people to twelve, and her philosophy is simple: every customer interaction is a chance to build genuine loyalty, not just resolve a ticket. She's also a certified yoga instructor and teaches classes on Saturday mornings.",
    social: {
      linkedin: "linkedin.com/in/priya-mehta-cx",
    },
  },
  {
    id: "team-008",
    name: "Daniel Osei",
    role: "Senior Product Designer",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=DanielOsei",
    bio: "Daniel designed digital products at IDEO and two San Francisco startups before joining us to build the best shopping experience in DTC commerce. He approaches every design decision from a place of deep user empathy — he's conducted over 200 customer interviews personally, and he keeps a library of every friction point a real customer has ever reported on our site. When he's not designing, he's probably at a record shop or working on his own furniture-making projects.",
    social: {
      twitter: "@daniel_osei_design",
      linkedin: "linkedin.com/in/daniel-osei-ux",
    },
  },
]

export const COMPANY_INFO = {
  name: "Curated Co.",
  tagline: "Made to Last. Built to Delight.",
  story: `Curated Co. was born out of a simple frustration: online shopping had become overwhelming. Thousands of mediocre products, algorithmically surfaced based on margin rather than merit, buried the truly excellent things beneath an avalanche of noise. In 2020, Natasha Brennan and Raj Kapoor set out to build something different — a store where every single product had been genuinely evaluated, held in someone's hands, and judged worthy of recommendation.

The first year was just the two of them working out of a spare bedroom in Seattle, personally testing 400 products and selecting 60 that met their bar. They shipped orders themselves on weekends. The business grew through word of mouth alone — no paid advertising in the first 18 months — because customers told their friends about a store where they could trust what they were buying. Today, Curated Co. has a team of 40 people across curation, operations, engineering, and customer experience, but the fundamental promise hasn't changed: if it's on the site, we'd buy it ourselves.`,
  mission:
    "To make it easy for people to find things worth owning — products built with genuine craft, designed to last, and sourced with respect for the people who make them and the planet we all share.",
  values: [
    "Radical honesty in every product description and recommendation",
    "Quality over quantity in everything we do and sell",
    "Sustainability as a non-negotiable, not a marketing claim",
    "Customer trust earned through consistency, not promotions",
    "Craft and care in every detail, from product to packaging to support",
  ],
  founded: "2020",
  employees: "40+",
  locations: ["Seattle, WA (HQ)", "Brooklyn, NY (Fulfillment)", "Portland, OR (Photography Studio)"],
}
