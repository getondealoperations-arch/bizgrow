// Single source of truth for brand, navigation, services and industries.
// Anything not supplied in the brief is a PLACEHOLDER (see lib/site.ts).

export const brand = {
  name: "Bizgrow Solutions",
  tagline: "Turning Business Potential Into Growth.",
  positioning: "A Complete Business Growth Partner for Businesses That Want to Move Forward.",
};

export const nav = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About Us" },
  { href: "/services", label: "Our Services" },
  { href: "/industries", label: "Industries" },
  { href: "/our-approach", label: "Our Approach" },
  { href: "/insights", label: "Insights" },
  { href: "/contact", label: "Contact Us" },
];

export type Service = {
  slug: string;
  name: string;
  icon: string;
  short: string;
  intro: string;
  includes: string[];
  cta: string;
};

export const services: Service[] = [
  {
    slug: "business-development",
    name: "Business Development",
    icon: "Handshake",
    short: "Identify new opportunities, build relationships and shape growth strategy.",
    intro: "We help businesses identify new opportunities, establish relationships and develop growth strategies.",
    includes: ["Business development strategy", "New business opportunity identification", "Client acquisition", "Business networking", "Revenue channel development", "Business expansion planning"],
    cta: "Discuss Your Business",
  },
  {
    slug: "lead-generation",
    name: "Lead Generation",
    icon: "Target",
    short: "Find and acquire relevant prospects for B2B and B2C.",
    intro: "We help businesses identify and acquire relevant prospects and turn them into a healthy sales pipeline.",
    includes: ["B2B and B2C lead generation", "Target audience research", "Prospect database development", "Lead qualification", "Sales pipeline development", "Lead funnel optimization"],
    cta: "Generate More Leads",
  },
  {
    slug: "sales-revenue-growth",
    name: "Sales & Revenue Growth",
    icon: "TrendingUp",
    short: "Improve sales performance and unlock new revenue opportunities.",
    intro: "We help companies improve sales performance and uncover revenue opportunities.",
    includes: ["Sales strategy development", "Sales funnel creation", "Customer acquisition", "Sales team development", "Conversion optimization", "Sales process improvement"],
    cta: "Improve Your Sales",
  },
  {
    slug: "digital-marketing",
    name: "Digital Marketing",
    icon: "Megaphone",
    short: "Strengthen your online presence and acquire customers.",
    intro: "We help brands improve their online presence and acquire customers through measurable digital channels.",
    includes: ["Meta advertising", "Google advertising", "Performance marketing", "Social media management", "SEO", "Content marketing", "Landing page optimization", "Campaign management"],
    cta: "Get Marketing Consultation",
  },
  {
    slug: "strategic-partnerships",
    name: "Strategic Partnerships",
    icon: "Network",
    short: "Identify and develop meaningful business partnerships.",
    intro: "We help businesses identify and develop partnerships that open new markets and channels.",
    includes: ["Corporate partnerships", "Brand collaborations", "Distribution partnerships", "Strategic alliances", "Channel partnerships", "Business networking"],
    cta: "Explore Partnerships",
  },
  {
    slug: "market-research-expansion",
    name: "Market Research & Expansion",
    icon: "Globe2",
    short: "Spot market opportunities and plan expansion with evidence.",
    intro: "We help businesses identify market opportunities and plan expansion.",
    includes: ["Market research", "Competitor analysis", "Customer research", "Market entry strategy", "Geographic expansion", "Business opportunity analysis"],
    cta: "Plan Your Expansion",
  },
  {
    slug: "brand-development",
    name: "Brand Development",
    icon: "Sparkles",
    short: "Build a stronger, clearer market identity.",
    intro: "We help businesses create a stronger market identity.",
    includes: ["Brand positioning", "Brand strategy", "Brand communication", "Marketing strategy", "Brand visibility", "Customer engagement"],
    cta: "Build Your Brand",
  },
  {
    slug: "business-consulting",
    name: "Business Consulting",
    icon: "Compass",
    short: "Structured guidance for planning and operational improvement.",
    intro: "We provide structured guidance for business planning and operational improvement.",
    includes: ["Business strategy", "Growth planning", "Business model evaluation", "Operational improvement", "Market positioning", "Business performance assessment"],
    cta: "Talk to a Consultant",
  },
];

export type Industry = {
  slug: string;
  name: string;
  icon: string;
  home?: string; // label used on the homepage card, when different
  overview: string;
  challenges: string[];
  solutions: string[]; // service slugs
  opportunities: string[];
};

export const industries: Industry[] = [
  {
    slug: "startups", name: "Startups & Emerging Businesses", home: "Startups & Entrepreneurs", icon: "Rocket",
    overview: "Early-stage businesses need to find their first customers, validate their market and build repeatable growth with limited resources.",
    challenges: ["Finding the first paying customers", "Unclear market positioning", "Limited marketing and sales capacity"],
    solutions: ["business-development", "lead-generation", "brand-development", "business-consulting"],
    opportunities: ["Faster customer acquisition", "Strategic partnerships that extend reach", "A clear, scalable growth roadmap"],
  },
  {
    slug: "retail-ecommerce", name: "Retail & E-commerce", home: "Retail & E-commerce", icon: "ShoppingBag",
    overview: "Retail and e-commerce brands compete on visibility, conversion and customer loyalty across online and offline channels.",
    challenges: ["Rising customer acquisition costs", "Low conversion on traffic", "Standing out in crowded categories"],
    solutions: ["digital-marketing", "sales-revenue-growth", "brand-development", "lead-generation"],
    opportunities: ["Better return on ad spend", "New sales channels and distribution", "Stronger repeat-purchase engagement"],
  },
  {
    slug: "manufacturing", name: "Manufacturing", home: "Manufacturing & Industrial", icon: "Factory",
    overview: "Manufacturers need consistent B2B demand, dealer and distributor networks and access to new markets.",
    challenges: ["Dependence on a few buyers", "Building distributor and channel networks", "Reaching new geographies"],
    solutions: ["lead-generation", "strategic-partnerships", "market-research-expansion", "business-development"],
    opportunities: ["Diversified B2B pipeline", "Distribution partnerships", "Export and regional expansion"],
  },
  {
    slug: "healthcare", name: "Healthcare", home: "Healthcare & Wellness", icon: "HeartPulse",
    overview: "Healthcare and wellness providers need to build trust, visibility and a steady flow of relevant enquiries.",
    challenges: ["Building patient and client trust online", "Local visibility", "Converting enquiries into appointments"],
    solutions: ["digital-marketing", "lead-generation", "brand-development", "business-consulting"],
    opportunities: ["Stronger local presence", "Qualified appointment enquiries", "Referral and partner networks"],
  },
  {
    slug: "real-estate", name: "Real Estate", home: "Real Estate & Infrastructure", icon: "Building2",
    overview: "Real estate and infrastructure businesses depend on a qualified, continuous pipeline of buyers, investors and partners.",
    challenges: ["Lead quality and follow-up speed", "Long sales cycles", "Differentiating projects"],
    solutions: ["lead-generation", "digital-marketing", "sales-revenue-growth", "strategic-partnerships"],
    opportunities: ["Qualified buyer and investor pipeline", "Channel-partner networks", "Higher site-visit-to-sale conversion"],
  },
  {
    slug: "hospitality", name: "Hospitality", home: "Hospitality & Tourism", icon: "ConciergeBell",
    overview: "Hospitality businesses grow through direct bookings, reputation and partnerships.",
    challenges: ["Dependence on third-party platforms", "Seasonal demand", "Building guest loyalty"],
    solutions: ["digital-marketing", "brand-development", "strategic-partnerships", "sales-revenue-growth"],
    opportunities: ["More direct bookings", "Corporate and event partnerships", "Year-round demand planning"],
  },
  {
    slug: "education", name: "Education", home: "Education & Training", icon: "GraduationCap",
    overview: "Educational institutions and training providers need steady, qualified admissions and enrolment enquiries.",
    challenges: ["Seasonal admission cycles", "Competing for parent and student attention", "Slow enquiry follow-up"],
    solutions: ["lead-generation", "digital-marketing", "brand-development", "business-consulting"],
    opportunities: ["Predictable enquiry flow", "Stronger institutional brand", "Industry and corporate tie-ups"],
  },
  {
    slug: "technology", name: "Technology", home: "Technology & IT", icon: "Cpu",
    overview: "Technology and IT companies need to reach the right buyers, explain complex offerings and shorten sales cycles.",
    challenges: ["Reaching decision-makers", "Communicating complex value", "Long B2B sales cycles"],
    solutions: ["lead-generation", "business-development", "strategic-partnerships", "sales-revenue-growth"],
    opportunities: ["Account-based outreach", "Channel and reseller partnerships", "Clearer go-to-market"],
  },
  {
    slug: "financial-professional-services", name: "Financial & Professional Services", home: "Professional Services", icon: "Briefcase",
    overview: "Firms selling expertise grow through credibility, referrals and a consistent pipeline of qualified clients.",
    challenges: ["Standing out on expertise", "Over-reliance on referrals", "Proving value before engagement"],
    solutions: ["brand-development", "lead-generation", "business-development", "digital-marketing"],
    opportunities: ["Authority-led content and positioning", "Structured client acquisition", "New service lines"],
  },
  {
    slug: "food-beverage", name: "Food & Beverage", icon: "UtensilsCrossed",
    overview: "Food and beverage brands grow through visibility, distribution and customer loyalty.",
    challenges: ["Building distribution", "Brand recall in crowded categories", "Margin pressure on aggregator platforms"],
    solutions: ["brand-development", "digital-marketing", "strategic-partnerships", "market-research-expansion"],
    opportunities: ["New retail and distribution channels", "Direct-to-consumer growth", "New city and region launches"],
  },
  {
    slug: "logistics-distribution", name: "Logistics & Distribution", icon: "Truck",
    overview: "Logistics and distribution businesses win through B2B relationships, reliability and network reach.",
    challenges: ["Winning contract customers", "Differentiating on service", "Expanding network coverage"],
    solutions: ["lead-generation", "business-development", "strategic-partnerships", "market-research-expansion"],
    opportunities: ["Enterprise account acquisition", "Partner network growth", "New lane and region opportunities"],
  },
  {
    slug: "travel-tourism", name: "Travel & Tourism", icon: "Plane",
    overview: "Travel and tourism operators need visibility, partnerships and efficient enquiry-to-booking conversion.",
    challenges: ["Seasonality", "Price-led competition", "Converting enquiries to bookings"],
    solutions: ["digital-marketing", "strategic-partnerships", "brand-development", "lead-generation"],
    opportunities: ["Direct booking growth", "Corporate and agent partnerships", "International enquiry channels"],
  },
  {
    slug: "corporate-enterprises", name: "Corporate Enterprises", icon: "Landmark",
    overview: "Established companies need new revenue streams, market entry and structured improvement of their growth engine.",
    challenges: ["Entering adjacent markets", "Modernising sales and marketing", "Aligning teams around growth targets"],
    solutions: ["business-consulting", "market-research-expansion", "strategic-partnerships", "sales-revenue-growth"],
    opportunities: ["New market and segment entry", "Partnership-led growth", "Measured sales-process improvement"],
  },
];

export const whyUs = [
  ["Customized Growth Strategies", "Plans shaped around your goals, market and stage, not a template."],
  ["Business-Focused Solutions", "Every activity is tied to a business outcome you care about."],
  ["Customer Acquisition Expertise", "Practical methods for finding, qualifying and winning customers."],
  ["Strategic Market Insights", "Decisions grounded in market, competitor and customer research."],
  ["Performance-Oriented Execution", "Clear activities, clear measures and regular reporting."],
  ["Long-Term Growth Approach", "We build repeatable growth, not one-off spikes."],
];

export const process = [
  ["Discover", "Understand the business, goals, challenges and requirements."],
  ["Strategize", "Identify opportunities and create a customized growth strategy."],
  ["Execute", "Implement the agreed business-development and marketing activities."],
  ["Optimize", "Measure performance, identify improvements and optimize the strategy."],
];

export const values = ["Integrity", "Innovation", "Commitment", "Transparency", "Performance", "Customer Success"];

export const blogCategories = ["Business Growth", "Sales & Marketing", "Lead Generation", "Entrepreneurship", "Market Research", "Business Strategy", "Business Expansion"];

export const industryOptions = industries.map((i) => i.name);
export const serviceOptions = services.map((s) => s.name);
export const businessStages = ["Idea / Pre-launch", "Startup (0–2 years)", "Growing (2–5 years)", "Established (5+ years)", "Enterprise"];
export const businessTypes = ["Product", "Service", "Manufacturing", "Retail / E-commerce", "B2B", "B2C", "Other"];
export const partnershipTypes = ["Corporate partnership", "Brand collaboration", "Distribution / channel", "Referral partner", "Other"];

export const statuses = [
  ["new", "New Lead"], ["contacted", "Contacted"], ["qualified", "Qualified"], ["meeting", "Meeting Scheduled"],
  ["proposal", "Proposal Sent"], ["negotiation", "Negotiation"], ["won", "Won"], ["lost", "Lost"],
] as const;
export type Status = (typeof statuses)[number][0];

export const faqs = [
  ["What does Bizgrow Solutions do?", "We are an independent business development and growth solutions company. We help businesses grow, acquire customers, improve sales and expand into new markets."],
  ["Which businesses do you work with?", "Startups, SMEs, established companies and entrepreneurs across many industries. We are not limited to one sector or one service."],
  ["What happens after I submit an enquiry?", "A member of our team reviews it, contacts you using your preferred method, and arranges a free consultation to understand your goals before proposing anything."],
  ["Is the first consultation free?", "Yes. The initial consultation is free and carries no obligation."],
  ["Do you work with international clients?", "Yes. We work with businesses in India and international markets."],
];
