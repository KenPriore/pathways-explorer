// Four scenarios for legal work through 2040. Copy revised 2026-11-21 (story pass: one job per field, traced to the Pathways book and deck).
window.PATHWAYS = {
  years: [2026, 2030, 2035, 2040],
  axes: ["Tech layer", "Transformation driver", "Trust and authority"],
  worlds: [
    {
      id: 1, name: "Big Tech Enterprise", role: "CLO becomes COO",
      tone: "var(--blue)", ink: "var(--white)", track: "#aecbff",
      labels: ["Integrated", "Enterprise-led", "Algorithm-led"],
      premise: "Legal moves inside the software that already runs the business, and the system answers routine legal questions before a lawyer sees them.",
      summary: "The COO owns that software and the legal agents working inside it. In-house legal owns the rules those agents follow and answers for what they decide. Legal stops being a standalone function and becomes a small senior team that may report to the COO or CTO. Watch whether legal keeps its independence as its reach across the company grows.",
      data: "The data stays with the company, inside its own platform. If the company fired the vendor, it would keep the playbooks and the workflows too.",
      compare: ["In-house legal, inside a platform the COO owns", "Owns the rules and thresholds, supervises the agents, handles exceptions", "Fewer, more senior lawyers than today", "With the company, inside its own platform"],
      promise: "Problems get caught at the source. Agents flag risk while the business acts, give the same answer every time, and stop some issues before they reach a lawyer or a court.",
      danger: "Judgment built into software is hard to see, challenge, or escalate. One bad default repeats across every decision the system touches. The scenario calls this “false discretion”: a system that appears to exercise judgment while it runs a rule no one has examined lately. And legal’s independence erodes as it sinks into the platform.",
      quote: "Risk becomes visible and continuous instead of episodic and late.",
      story: {
        now: "Legal sits inside the systems that run sales, HR, finance, procurement, and product. Thousands of legal agents work at the moment each business decision gets made. The legal department is smaller and more senior than it has ever been, and its lawyers spend their days supervising those agents and handling the cases they send up.",
        path: "In 2026 CEOs and CFOs were already pushing for legal work that was cheaper, faster, and easier to see. Some companies added legal as a module inside the platforms that already ran the business, such as Microsoft, Salesforce, ServiceNow, and Workday. Others bought legal tools good enough to cover most of what legal does. Either way the company owned and ran the layer, and IT got a bigger say in what legal bought. By 2030 in-house teams were turning what they knew into agents and playbooks with clear rules for when to escalate, and the routine work disappeared into the software.",
        diff: "Today the business brings legal a question and waits for the answer. By 2040 the check happens inside the decision itself, and most questions never become a request to a lawyer."
      },
      timeline: [
        ["Pressure meets the enterprise stack", "CEOs and CFOs want legal work that is cheaper, faster, and easier to see.", "The platforms that already run sales, service, HR, finance, and operations make legal their obvious next addition."],
        ["Platforms absorb legal capability", "Incumbent platforms add, acquire, or partner for legal capability.", "Legal teams turn their know-how into agents, playbooks, controls, and escalation paths, placed at the moment a business decision gets made."],
        ["The legal team gets smaller and more senior", "Routine legal work now runs inside the platform.", "Lawyers supervise, handle exceptions, and govern the judgment the system applies to every decision."],
        ["A product launch runs through embedded legal", "Agents review the claims, supplier terms, customer agreements, privacy, and regulatory obligations as the work happens.", "A marketing claim that crosses a threshold is rewritten before publication. The COO owns the software the work runs on. In-house legal owns the rules, the thresholds, and the judgment inside them."]
      ],
      headlines: ["Claude’s New Legal Plugin Could Threaten Dominance of Legal Tech’s AI Leaders · Law.com, Ella Sherman, February 3, 2026", "These Am Law Firms Lead the Way on AFAs. Here’s How AI and Data Collection Are Pushing More to Explore · Law.com, Andrew Maloney, August 26, 2026"],
      signals: [
        ["Microsoft Copilot embedded directly in Word and the Office stack."],
        ["Salesforce Agentforce, ServiceNow, and Workday put more enterprise work on platforms."],
        ["Big Tech’s entry into legal tech can shift valuations for established players.", "Law.com · summary"]
      ],
      evidence: [
        ["Big tech enters legal", "In 2026, Anthropic, Microsoft, OpenAI, Perplexity, Amazon, and Google Cloud each made moves into legal technology."],
        ["Pressure on pricing", "A Law.com survey of Am Law 200 firms charts the average and median share of firm revenue that comes from alternative fee arrangements."],
        ["Associates’ concerns", "A survey of midlevel Am Law 200 associates shows a rising share naming technology replacing humans as the biggest threat to associate jobs."]
      ]
    },
    {
      id: 2, name: "The App Store for Law", role: "In-house legal as conductor",
      tone: "var(--yellow)", ink: "var(--ink)", track: "#f0c919",
      labels: ["Fragmented", "Enterprise-led", "Algorithm-led"],
      premise: "No single platform wins. In-house legal picks the specialist tools, plays them off each other, and keeps rebuilding the set as the business changes.",
      summary: "Specialist tools, firms, and agents do the work, and no one company controls the market. In-house legal holds the budget and the company’s own legal knowledge, and sets the standards for access, privilege, security, and how the tools connect. Watch whether all that choice adds up to real control.",
      data: "The company owns its knowledge and can move it between tools. That is the source of its power.",
      compare: ["In-house legal, across many tools", "Designs the system, holds the budget, sets the standards", "A Chief Legal Strategist and people who can judge and connect the tools", "With the company, which can move it between tools"],
      promise: "Nimbleness. In-house legal brings in new tools and drops old ones as fast as the business changes. Its data, playbooks, and matter history move with it. Whoever governs that knowledge governs the market.",
      danger: "Choice can pass for control. The network can grow too tangled to govern, and legal has to keep proving that all those tools do what the business expects and change as it changes.",
      story: {
        now: "In-house legal works from one screen with many specialist apps beneath it, like a phone. Each app, firm, or agent handles one kind of legal problem, and the tools make the routine calls inside legal’s standards. In World 1 judgment runs through one platform the COO owns. Here it runs across many, and in-house legal holds the budget, sets the standards, and designs the system where the calls get made.",
        path: "The same pressure on cost and speed hit in 2026, but no one platform came out on top. A thousand narrow tools appeared, each good at one job, and the hard part became making them work together. The turning point came by 2030, when shared standards and data portability arrived. In-house legal saw that its real advantage was the knowledge its own work produced: its data, matter history, and playbooks. That knowledge could move from tool to tool, so legal could drop any vendor and keep everything that mattered.",
        diff: "Today a legal department buys from firms and vendors one relationship at a time. By 2040 in-house legal runs all of them as one system and sets the terms every provider has to meet."
      },
      timeline: [
        ["Specialist tools multiply", "Cost and speed pressure produces a large market of narrow tools, each good at one task.", "The hard problem moves from finding capability to coordinating it."],
        ["Shared standards make variety manageable", "Data portability and common standards let providers work together.", "In-house legal sees that its own matter history, playbooks, data, and institutional memory give it control over the market."],
        ["The Chief Legal Strategist emerges", "One interface makes a market of specialist apps feel like a single system.", "In-house legal answers for the standards and evidence that decide which tools, firms, and agents are trusted to act."],
        ["In-house legal runs the system", "Privilege, confidentiality, regulatory risk, and board accountability keep legal a distinct function.", "In-house legal writes the rules and standards under which every provider’s tools make their calls."]
      ],
      headlines: ["Thanks to AI, More Tasks Are Staying In-House · Law.com, Dan Roe, October 3, 2025"],
      signals: [
        ["AT&T Decided Small AI Pilots Weren’t Enough, So It Built an In-House Law Firm", "Law.com"],
        ["AI pushes legal toward the center of business strategy.", "Law.com · summary"]
      ],
      evidence: [
        ["How much firms invest", "A Law.com chart asks Am Law 200 firms what share of gross revenue they invested in AI in FY 2025. The largest response bucket is below 0.5%. Responses decline across higher investment bands through 4–5%."],
        ["What firms prioritize", "Commercial AI tools lead the chart, followed by training and upskilling, and data governance and security. It also tracks custom development for firms and clients, infrastructure, recruiting AI specialists, and other spending."]
      ]
    },
    {
      id: 3, name: "Big Law Owns the Stack", role: "Law firm–tech alliance",
      tone: "var(--rose)", ink: "var(--white)", track: "#ffb0c1",
      labels: ["Integrated", "Provider-led", "Algorithm-led"],
      premise: "Law firms and their tech partners build and run the systems that do most legal work, and the company depends on systems it does not own.",
      summary: "The firms hold the data and run the systems. The in-house team decides how much risk the company will accept and handles the exceptions, but what the firm’s system decides usually stands. Watch whether the company can still take its data, playbooks, and matter history to another firm. The easier that stays, the closer this world moves to the App Store.",
      data: "The data sits with the firm. Whether it can move to another firm is the open question. Data left is data lost.",
      compare: ["The law firm partner", "Sets risk limits, handles exceptions, translates for the firm, manages the relationship", "A few senior people in a small operating team", "With the firm; whether it can move is the open question"],
      promise: "Speed, scale, and lower cost from firms that built their own platforms. Global reach, elastic teams with lawyers still at the center, and best practice learned across many clients, which no single company can see. The firms already carry client trust, privilege practices, and specialist expertise.",
      danger: "Success hardens into dependency. Data left with the firm becomes control the company has lost. And a matter can close quickly and cleanly while no one asks whether closing it that way was right.",
      quote: "The dependency on Big Law grows as the firms hold the key to the data and the operating systems.",
      story: {
        now: "Most of the company’s legal work runs through one firm’s system, on data the firm keeps. Routine work costs close to nothing, work done with agents gets cheaper every year, and senior advice is the expensive part. The small in-house team sets risk limits, handles exceptions, translates what the company wants for the firm, and manages the relationship. The firm partner runs the system, more like a delivery business than an advice practice.",
        path: "In 2026, pressed to raise output and cut cost, leading firms made technology part of what they sell. They built their own AI, struck deals with frontier AI labs, and bought specialist vendors. In-house legal traded control for the speed, the scale, and the lower prices. Each year more of the data and know-how sat with the firms.",
        diff: "Today a firm sells its lawyers’ time, and the company runs its own systems. By 2040 the firm sells the output of a system it owns, and the in-house lawyers mostly set risk limits and manage the relationship."
      },
      timeline: [
        ["Firms treat technology as the product", "Pressure to raise output and cut cost pushes leading firms to buy, build, and partner for control of how legal work gets delivered.", "Technology moves from overhead to the center of how firms deliver service."],
        ["Partnerships become infrastructure", "Major firm investments, frontier-model partnerships, and specialist acquisitions become part of how firms deliver legal work.", "Clients increasingly receive legal work produced inside firm-controlled systems."],
        ["The work pyramid is repriced", "Commodity work approaches zero marginal cost. Agent-supported work gets cheaper as playbooks encode expertise.", "Strategy and senior counsel become the scarce, expensive tier."],
        ["The partner runs a delivery business", "A small in-house team is the senior human contact for infrastructure the company no longer owns.", "The law firm partner runs the combined system that delivers the work."]
      ],
      headlines: ["In Latest Slate of AI Partnerships, Law Firms Claim Benefits of Early Access and Collaboration · Law.com, Dan Roe, August 27, 2026"],
      signals: [
        ["Kirkland’s $500M AI Bet to Fuel Series of AI Rollouts, Partnerships", "Law.com"],
        ["Freshfields Strikes Anthropic Deal, Deploys Claude Firmwide", "Law.com"],
        ["AI and Data Collection Are Pushing More Firms to AFAs", "Law.com"],
        ["Forget Build vs. Buy: It’s All About Law Firm–Tech Partnerships", "Law.com"]
      ],
      evidence: [
        ["Big Law’s partnerships with tech", "Examples include A&O Shearman with Harvey, Freshfields with Google Cloud and with Anthropic, Debevoise with Legora, Sterne Kessler with Thomson Reuters, Kirkland with Palantir, Willkie with OpenAI, Scott+Scott with Advocacy AI, BakerHostetler with Clio, and a group of firms working with OpenAI."],
        ["Tech training and the work pyramid", "A Law.com survey shows summer associates rating their firms’ use of AI and advanced technology in training higher over time. The scenario sorts legal work into three tiers: scarce senior counsel, agent-supported work, and automated commodity work."]
      ]
    },
    {
      id: 4, name: "Hands on the Wheel", role: "Human judgment on top",
      tone: "var(--navy)", ink: "var(--white)", track: "#e4edf9",
      labels: ["Integrated", "Provider-led", "Human-led"],
      premise: "Connected systems do most routine legal work, and qualified people keep the power to stop the machine and change the result on the calls that matter most.",
      summary: "Outside providers build the systems that link companies, law firms, courts, and regulators. Licensed people inside and outside the company can challenge those systems and overrule them where fairness and public trust are on the line. People keep the last word, but only just. Watch whether they hold it in practice, or only put a human face on decisions the system already made.",
      data: "The data sits with the providers. In-house legal needs the contract right to see inside the systems and to challenge them.",
      compare: ["Providers run the systems; licensed people keep the last word", "Understands what’s inside the systems; challenges and overrules them", "Lawyers and licensed specialists, legal engineers, and reviewers, inside and outside the company", "With the providers; in-house legal needs the right to see inside and challenge"],
      promise: "Lawyers edit fewer documents and are responsible for more. Legal help built into everyday systems reaches more people, and qualified people answer for the calls where fairness, people’s livelihoods, a duty to act in someone else’s interest, or public trust are at stake.",
      danger: "Human review turns ceremonial when reviewers lack the power to change results. Protecting human judgment can also harden into protectionism that keeps useful tools and lower-cost legal help out of reach. The goal is a wider profession than the one of 2026, able to govern law that machines mostly run.",
      quote: "A qualified human remains responsible for knowing when to take the wheel.",
      story: {
        now: "Most legal work runs faster and cheaper than ever, and the system gets most of the way on its own. When a call touches fairness, someone’s job, a vulnerable group, or public trust, it goes to a person with the expertise, the access, and the authority to change it. That person might be an in-house lawyer, a firm partner, a licensed specialist, or a legal engineer.",
        path: "The warnings came in 2026. A federal court sanctioned lawyers for a filing built on AI-invented citations, a leading law school banned AI in core legal reasoning, and states such as Arizona, California, and Oregon began experimenting with who besides lawyers can offer legal help. By 2030 AI agents had failed again and again, and after the breaches and the public backlash, institutions decided a reviewer had to be able to change the result. Professional bodies then licensed a wider workforce so review could keep up.",
        diff: "Today “human review” can mean a signature at the end, and the main way into legal runs through law school and a firm. By 2040 a reviewer who can’t change the outcome doesn’t count. The profession has grown wider: licensed specialists, certified reviewers, and legal engineers whose title now carries a license. None of those routes has to start at law school."
      },
      timeline: [
        ["Warnings accumulate", "Early signals include sanctions for AI-invented citations, a law school restricting AI in core legal reasoning, and states licensing paraprofessionals for defined services.", "Each one draws a line where a qualified person has to stay involved."],
        ["Trust failures trigger backlash", "Repeated failures by AI agents push institutions to require human accountability that means something.", "A reviewer now needs expertise, access to the system’s reasoning, and the authority to change what it would do."],
        ["A broader workforce lets review keep up", "Professional bodies license specialists, translators, legal engineers, and certified reviewers.", "Knowing when to intervene becomes a scarce skill."],
        ["Humans challenge a machine-cleared launch", "A board delays a product launch after its legal system cleared it.", "In-house legal brings in a regulatory partner and a licensed consumer-protection specialist. They challenge an assumption that hid a risk to a vulnerable group. The system was right on its own terms. The humans were responsible for the terms."]
      ],
      headlines: ["Growing Fines Haven’t Stopped Lawyers from Filing AI-Fabricated Citations · Law.com"],
      signals: [
        ["Your Next Direct Reports May Be AI Agents", "Law.com"],
        ["Judge’s AI Error-Laden Ruling Faces Appellate Scrutiny", "Law.com"],
        ["“Every well-designed workflow is a conversation among lawyers about what good judgment looks like.”", "Law.com"],
        ["Akerman Taps Ex-Amazon Counsel for New AI Governance Role", "Law.com"]
      ]
    }
  ]
};
