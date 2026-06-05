import { createClient } from "@sanity/client";
import { config } from "dotenv";
import { randomUUID } from "node:crypto";

config({ path: ".env.local" });
config();

type SanityDoc = {
  _id: string;
  _type: string;
  [key: string]: unknown;
};

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2025-01-01";
const token = process.env.SANITY_API_WRITE_TOKEN;

if (!projectId) throw new Error("NEXT_PUBLIC_SANITY_PROJECT_ID is required.");
if (!token) throw new Error("SANITY_API_WRITE_TOKEN is required. Never expose it with NEXT_PUBLIC_.");

const client = createClient({
  apiVersion,
  dataset,
  projectId,
  token,
  useCdn: false,
});

function slug(current: string) {
  return { _type: "slug", current };
}

function span(text: string, marks: string[] = []) {
  return { _key: randomUUID(), _type: "span", marks, text };
}

function block(text: string, style = "normal") {
  return {
    _key: randomUUID(),
    _type: "block",
    children: [span(text)],
    markDefs: [],
    style,
  };
}

function linkBlock(parts: Array<string | { href: string; text: string }>, style = "normal") {
  const markDefs: Array<{ _key: string; _type: string; href: string }> = [];
  const children = parts.map((part) => {
    if (typeof part === "string") return span(part);
    const key = randomUUID();
    markDefs.push({ _key: key, _type: "link", href: part.href });
    return span(part.text, [key]);
  });

  return { _key: randomUUID(), _type: "block", children, markDefs, style };
}

function listItem(text: string) {
  return { ...block(text), level: 1, listItem: "bullet" };
}

function ref(_ref: string) {
  return { _ref, _type: "reference" };
}

function youtubeBlock(url: string, title: string, caption: string, placement = "wide") {
  return {
    _key: randomUUID(),
    _type: "youtubeVideoBlock",
    caption,
    placement,
    title,
    url,
  };
}

function faq(items: Array<{ answer: string; question: string }>) {
  return {
    _key: randomUUID(),
    _type: "faqBlock",
    items: items.map((item) => ({
      _key: randomUUID(),
      _type: "faqItem",
      ...item,
    })),
  };
}

async function upsert(doc: SanityDoc) {
  await client.createOrReplace(doc);
  console.log(`Seeded ${doc._type}: ${doc._id}`);
}

const authorId = "seed-author-seniorsstuck-editorial";
const basicsCategoryId = "seed-category-online-income-basics";
const implementationCategoryId = "seed-category-implementation";
const safetyCategoryId = "seed-category-online-safety";

const author: SanityDoc = {
  _id: authorId,
  _type: "author",
  bio: "The SeniorsStuck editorial team helps older adults turn online-business overwhelm into simple, repeatable implementation steps.",
  name: "SeniorsStuck Editorial Team",
  role: "Online Income Guidance for Seniors",
  slug: slug("seniorsstuck-editorial-team"),
};

const categories: SanityDoc[] = [
  {
    _id: basicsCategoryId,
    _type: "category",
    description: "Plain-English guides for seniors who want to understand online income without hype or jargon.",
    slug: slug("online-income-basics"),
    title: "Online Income Basics",
  },
  {
    _id: implementationCategoryId,
    _type: "category",
    description: "Step-by-step help for turning ideas, tools, and offers into real finished pages and systems.",
    slug: slug("implementation"),
    title: "Implementation",
  },
  {
    _id: safetyCategoryId,
    _type: "category",
    description: "Practical checks for choosing freelancers, tools, and online opportunities with more confidence.",
    slug: slug("online-safety"),
    title: "Online Safety",
  },
];

const posts: SanityDoc[] = [
  {
    _id: "seed-post-why-families-get-stuck-choosing-senior-care",
    _type: "post",
    author: ref(authorId),
    body: [
      block("A practical starting point for seniors who want online income", "h2"),
      block("A lot of seniors arrive at online income with the same quiet frustration: they are not lazy, they are not incapable, and they are not afraid of learning. They are tired of being sold complicated systems that assume everyone already knows the language of funnels, domains, lead magnets, payment processors, automation, and ads."),
      block("The truth is simpler. An online business does not begin with a perfect website. It begins with one clear offer, one clear person it helps, and one simple way for that person to take the next step. Everything else is support structure."),
      youtubeBlock(
        "https://youtu.be/BhMEVpV_VaI?si=zdVjcWe9aBFsFKER",
        "Online implementation breakthrough for seniors",
        "Watch this first if online income has felt like a wall of jargon. The goal is not to master every tool; it is to see the simple path underneath the noise.",
      ),
      block("Start with the problem you can explain without notes", "h2"),
      block("If you have worked in an office, raised a family, managed a home, served customers, taught, cared for others, repaired things, organized events, sold products, balanced books, supervised people, or solved practical problems for decades, you already have useful knowledge. The first mistake is believing that online income must come from a brand-new personality or a brand-new identity."),
      block("Instead, write down ten problems people have asked you about in real life. Not the grand problems. The ordinary ones. How to organize paperwork. How to prepare for a move. How to write a polite complaint. How to choose a reliable contractor. How to plan meals for one person. How to understand a phone bill. These ordinary problems are often easier to sell online than vague promises about success."),
      listItem("Who has this problem right now?"),
      listItem("What result would make them feel relieved?"),
      listItem("Could I explain the first three steps in plain English?"),
      listItem("Would someone pay for a shortcut, checklist, template, call, or done-for-you help?"),
      block("Choose a small offer before you choose tools", "h2"),
      block("The internet rewards clarity. A small, clear offer is easier to write, easier to sell, and easier to deliver than a giant idea. For example, 'I help retired teachers organize their pension and insurance documents into one printable binder' is stronger than 'I help people get organized.' One offer tells a visitor exactly what happens. The other asks the visitor to imagine the value for themselves."),
      block("A beginner-friendly offer can be a checklist, a digital guide, a one-hour consultation, a worksheet bundle, a mini-course, or a done-for-you service. The best first offer is not the one with the highest possible income. It is the one you can finish, explain, and improve after real feedback."),
      {
        _key: randomUUID(),
        _type: "quoteBlock",
        attribution: "SeniorsStuck implementation note",
        quote: "Do not build a castle before you know whether people want the front door. Build the door first.",
      },
      block("Use a one-page website as your first serious asset", "h2"),
      block("A one-page website can be enough for a first online-income project. It needs a headline that names the result, a short explanation of who it helps, a few proof or trust points, the offer details, a simple price or next-step button, and a way to contact or purchase. That is not a small thing. Done well, it is the foundation of the whole business."),
      block("This is where many people get stuck. They think they need a logo, brand colors, a large blog, social media accounts, an email sequence, and a fancy dashboard before they can show the offer. Those things can come later. The first page should help one visitor answer one question: 'Is this for me, and what do I do next?'"),
      block("A simple weekly routine", "h2"),
      listItem("Monday: improve the offer wording based on what people ask."),
      listItem("Tuesday: publish one helpful tip related to the offer."),
      listItem("Wednesday: reach out to five people or groups who already know the audience."),
      listItem("Thursday: improve the page, checkout, or contact form."),
      listItem("Friday: review what created replies, clicks, calls, or sales."),
      block("This routine is not glamorous. That is the point. Older adults often win online by being steady, specific, and trustworthy, not by chasing every trend. If the offer is useful and the page is clear, small improvements compound."),
      block("What to avoid in the beginning", "h2"),
      block("Avoid buying a stack of tools before you know your offer. Avoid pretending to be an expert in something you just learned last week. Avoid opportunities that hide the real work behind income screenshots. Avoid any plan that requires you to spend heavily on ads before you have spoken to real potential buyers."),
      block("The first goal is not to look like a large company. The first goal is to create one real result for one real person and then make that result easier to repeat."),
      faq([
        {
          question: "Can a senior really start with only one page?",
          answer: "Yes. A focused one-page offer is often better than a large unfinished website. It gives visitors a clear next step and gives you something concrete to improve.",
        },
        {
          question: "What if I am not technical?",
          answer: "Start with the business logic: audience, problem, offer, price, and next step. Technical help is easier to hire or learn once those pieces are clear.",
        },
        {
          question: "How long should I test an offer?",
          answer: "Give a simple offer at least a few weeks of steady outreach and improvement before deciding it failed. Most first drafts need clearer wording, not a brand-new business.",
        },
      ]),
      {
        _key: randomUUID(),
        _type: "ctaBlock",
        href: "/enough-is-enough",
        label: "See the Enough is Enough breakthrough",
        style: "primary",
      },
    ],
    category: ref(basicsCategoryId),
    excerpt: "A plain-English guide for seniors who want online income without getting buried in tools, jargon, or unfinished websites.",
    featured: true,
    publishedAt: "2026-06-01T15:00:00.000Z",
    seoDescription: "Learn a simple online-income starting point for seniors: one audience, one useful offer, one page, and a steady weekly routine.",
    seoTitle: "Online Income for Seniors: Start Simple and Actually Finish",
    slug: slug("online-income-for-seniors-start-simple-and-actually-finish"),
    status: "published",
    tags: ["online income", "seniors", "first offer", "simple website"],
    title: "Online Income for Seniors: Start Simple and Actually Finish",
  },
  {
    _id: "seed-post-how-to-spot-red-flags-before-hiring-a-caregiver",
    _type: "post",
    author: ref(authorId),
    body: [
      block("Why implementation gets seniors stuck", "h2"),
      block("Most online-business programs teach strategy as if strategy automatically turns into a finished asset. It does not. A person can understand the idea perfectly and still have no sales page, no checkout link, no email capture, no product delivery, and no working follow-up system."),
      block("Implementation is the bridge between 'I understand' and 'someone can buy this.' That bridge is where many seniors lose momentum because the steps are scattered across different tools and every tool uses its own language."),
      youtubeBlock(
        "https://youtube.com/shorts/SToMmxdpHS0?si=9Kocatw3xPZ-R6kL",
        "A quick SeniorsStuck implementation reminder",
        "A short reminder that finishing a simple online asset beats collecting another complicated strategy.",
      ),
      block("The five-piece implementation map", "h2"),
      block("A simple online offer usually needs five pieces. First, the offer promise. Second, a page that explains the offer. Third, a way to collect payment or inquiries. Fourth, a delivery method. Fifth, a follow-up routine. If any one of those pieces is missing, the business feels like it exists in your head but not in the world."),
      listItem("Offer promise: the concrete result the buyer wants."),
      listItem("Sales page: the plain-English explanation of who it is for, what they receive, and why it helps."),
      listItem("Checkout or inquiry: the button, form, calendar, or payment link that lets someone act."),
      listItem("Delivery: the email, download, call, portal, or service process that fulfills the promise."),
      listItem("Follow-up: the reminders and helpful messages that keep interested people from disappearing."),
      block("A finished simple system is more valuable than an impressive unfinished plan. If you can point to a page, click a button, receive a confirmation, and deliver the promised item, you are no longer merely thinking about online income. You have an asset."),
      block("Write the page like you are talking to one person", "h2"),
      block("The strongest beginner sales pages do not sound like corporate brochures. They sound like a helpful person explaining what happens next. Use short sections. Use familiar words. Name the frustration directly. Explain what the buyer gets. Explain who should not buy it. Make the next step visible more than once."),
      linkBlock([
        "For example, the SeniorsStuck ",
        { href: "/enough-is-enough", text: "Enough is Enough" },
        " offer is built around the moment when a senior is done collecting information and wants implementation help that is direct, practical, and easier to follow.",
      ]),
      block("The page does not need to convince everyone. It needs to help the right person feel recognized. That is a calmer goal and a more honest one."),
      block("Make editing easy for your future self", "h2"),
      block("A senior-friendly website should be easy to maintain after launch. Blog posts should have clear titles, excerpts, categories, and blocks. Video embeds should accept normal YouTube URLs. Buttons should use ordinary links. Images should have alt text. The editor should not require someone to touch code just to publish a practical update."),
      block("When you write a post, use a repeatable structure: problem, why it matters, simple steps, example, mistake to avoid, next action. This structure keeps long articles useful without becoming messy."),
      block("A one-day implementation checklist", "h2"),
      listItem("Write the offer in one sentence: I help [person] get [result] without [frustration]."),
      listItem("Draft the page headline and three supporting bullets."),
      listItem("Add one button that goes to checkout, a booking form, or a contact form."),
      listItem("Create the delivery file, calendar process, or service checklist."),
      listItem("Send the page to three trusted people and ask what is unclear."),
      block("Do not ask whether they like it. Ask what is unclear. Clear beats clever, especially for an audience that is already skeptical of online promises."),
      block("When to hire help", "h2"),
      block("Hiring help can be wise, but only after you know what you are asking for. If you hire someone to 'build my online business,' the project can become vague and expensive. If you hire someone to 'turn this offer and outline into a one-page sales page with checkout and a thank-you email,' the work becomes much easier to judge."),
      block("The better your instructions, the safer the project. Good freelancers can do better work when your goal is concrete. Bad freelancers have less room to hide behind confusing language."),
      faq([
        {
          question: "What is the first thing I should implement?",
          answer: "Implement the offer page and next-step button first. A simple page with a working action is the center of the system.",
        },
        {
          question: "Should I start with social media?",
          answer: "Social media can help, but it should point somewhere. Build the page or inquiry process first so attention has a destination.",
        },
        {
          question: "How do I know if a page is good enough to publish?",
          answer: "If the page clearly says who it helps, what they get, why it matters, and what to do next, it is good enough to start testing.",
        },
      ]),
      {
        _key: randomUUID(),
        _type: "productCardBlock",
        buttonLabel: "View the implementation program",
        description: "For seniors who want hands-on help turning an offer, page, and follow-up process into something real.",
        href: "/implementation-masters-program",
        title: "Implementation Masters Program",
      },
    ],
    category: ref(implementationCategoryId),
    excerpt: "A long-form implementation guide for seniors who understand the idea but need the page, checkout, delivery, and follow-up pieces finished.",
    featured: false,
    publishedAt: "2026-06-02T15:00:00.000Z",
    seoDescription: "Use this online-business implementation map for seniors to finish a simple offer page, checkout, delivery method, and follow-up routine.",
    seoTitle: "The Senior-Friendly Implementation Map for Online Business",
    slug: slug("the-senior-friendly-implementation-map-for-online-business"),
    status: "published",
    tags: ["implementation", "sales page", "online business", "senior entrepreneurs"],
    title: "The Senior-Friendly Implementation Map for Online Business",
  },
  {
    _id: "seed-post-simple-checklist-before-moving-parent-assisted-living",
    _type: "post",
    author: ref(authorId),
    body: [
      block("Why seniors need a freelancer safety checklist", "h2"),
      block("At some point, most online businesses need help. You may need a landing page, a checkout setup, email automation, a logo cleanup, a PDF design, or someone to connect the pieces. Good help can save months. Bad help can create confusion, missed deadlines, security risks, and expensive rework."),
      block("The goal is not to be suspicious of everyone. The goal is to slow the hiring process down enough that the right person becomes obvious and the wrong person has fewer places to hide."),
      block("Start with a finished description of the job", "h2"),
      block("Before you message a freelancer, write the job in plain English. Include the business goal, the exact deliverables, the tools involved, what you already have, what you do not have, and what finished means. If you cannot define finished, the freelancer cannot reliably deliver finished."),
      listItem("Bad request: I need an online business website."),
      listItem("Better request: I need a one-page sales page for a $47 digital guide, connected to checkout, with a thank-you page and delivery email."),
      listItem("Best request: I have the copy, product PDF, logo, colors, Stripe account, and domain. I need the page built, mobile checked, checkout tested, and the final login details documented."),
      block("A specific request protects both sides. It helps honest freelancers quote accurately and helps you compare proposals fairly."),
      youtubeBlock(
        "https://youtu.be/BhMEVpV_VaI?si=zdVjcWe9aBFsFKER",
        "SeniorsStuck implementation overview",
        "Use the full video as context before hiring: the clearer the implementation target, the easier it is to choose the right help.",
      ),
      youtubeBlock(
        "https://youtube.com/shorts/SToMmxdpHS0?si=9Kocatw3xPZ-R6kL",
        "Quick reminder before hiring online help",
        "A short reminder to hire for a finished outcome, not for vague online-business magic.",
      ),
      block("Red flags to watch for", "h2"),
      listItem("They promise income results but avoid explaining the work."),
      listItem("They pressure you to pay outside the platform before trust is established."),
      listItem("They ask for passwords instead of using safe collaborator access where possible."),
      listItem("They cannot describe milestones, review points, or what files you will own."),
      listItem("They dismiss your questions with jargon instead of answering plainly."),
      block("A professional does not need to make you feel small. They can explain tradeoffs in normal language. They can tell you what they need from you. They can say what is included and what is not included. They can document what they changed."),
      block("Protect access and ownership", "h2"),
      block("Use separate accounts when possible. Add collaborators instead of sharing your main password. Keep your domain, payment processor, email list, and website hosting in accounts you control. If someone builds pages for you, make sure you know where the files live and how to access them."),
      block("For payment tools, never casually send secret keys or banking access in a chat thread. If a developer needs technical credentials, ask what the credential does, whether there is a limited-access option, and whether it can be rotated after the job."),
      block("Use milestones, not hope", "h2"),
      block("A good project can be broken into milestones. For a sales page, milestone one might be page structure. Milestone two might be mobile styling. Milestone three might be checkout and thank-you flow. Milestone four might be final testing and handover notes. Each milestone should produce something you can see, click, or read."),
      block("This matters because vague progress is hard to evaluate. A freelancer can say 'almost done' for weeks. A milestone lets you ask, 'Can I see the checkout test?' or 'Can I review the mobile page?'"),
      block("What a proper handover should include", "h2"),
      listItem("The live page links and admin/editor links."),
      listItem("A short explanation of how to edit the blog, pages, prices, and buttons."),
      listItem("A list of accounts used and who owns them."),
      listItem("A test purchase or test form submission result."),
      listItem("Any known limits, renewal costs, or recommended next improvements."),
      block("The handover is part of the work. A senior-friendly project is not finished when the developer understands it. It is finished when the owner can use it without fear."),
      {
        _key: randomUUID(),
        _type: "quoteBlock",
        attribution: "SeniorsStuck freelancer rule",
        quote: "If the person building the system cannot explain it simply, the handover is not done yet.",
      },
      faq([
        {
          question: "Should I hire the cheapest freelancer?",
          answer: "Not automatically. Choose the clearest plan, strongest communication, and best proof of similar work. Cheap unclear work can become expensive later.",
        },
        {
          question: "Is it safe to give a freelancer access?",
          answer: "It can be, but use limited collaborator access where possible, avoid sharing financial secrets casually, and change or remove access after the project.",
        },
        {
          question: "What should I ask before paying?",
          answer: "Ask what is included, what is not included, what the milestones are, what you will own, and what the final handover will contain.",
        },
      ]),
      {
        _key: randomUUID(),
        _type: "ctaBlock",
        href: "/freelancer-detector-kit",
        label: "Review the Freelancer Detector Kit",
        style: "primary",
      },
    ],
    category: ref(safetyCategoryId),
    excerpt: "A senior-friendly checklist for hiring online help without losing control of your website, payment tools, files, or confidence.",
    featured: false,
    publishedAt: "2026-06-03T15:00:00.000Z",
    seoDescription: "Use this freelancer safety checklist before hiring help for a senior online business website, sales page, checkout, or automation.",
    seoTitle: "Freelancer Safety Checklist for Senior Online Business Owners",
    slug: slug("freelancer-safety-checklist-for-senior-online-business-owners"),
    status: "published",
    tags: ["freelancer safety", "online business", "website handover", "senior entrepreneurs"],
    title: "Freelancer Safety Checklist for Senior Online Business Owners",
  },
];

async function main() {
  await upsert(author);
  for (const category of categories) await upsert(category);
  for (const post of posts) await upsert(post);

  console.log("Sanity blog seed complete.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
