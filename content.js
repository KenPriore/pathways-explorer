// Four scenarios for legal work through 2040. Copy revised 2026-11-21.
window.PATHWAYS = {
  years: [2026, 2030, 2035, 2040],
  axes: ["Tech layer", "Transformation driver", "Trust and authority"],
  worlds: [
    {
      id: 1, name: "Big Tech Enterprise", role: "CLO becomes COO",
      tone: "var(--blue)", ink: "var(--white)", track: "#aecbff",
      labels: ["Integrated", "Enterprise-led", "Algorithm-led"],
      premise: "Legal judgment moves inside the enterprise platforms that already run the business.",
      summary: "Thousands of agents check decisions inside the platforms the company already runs, and the COO owns that operating layer. A smaller, senior legal team writes the rules and thresholds, handles the exceptions, and answers for the judgment the system applies.",
      promise: "Problems get caught at the source. Agents flag risk while the business acts, give the same answer every time, and stop some issues before they reach a lawyer or a court.",
      danger: "Judgment built into software is hard to see, challenge, or escalate. One bad default repeats across every decision the system touches. The scenario calls this “false discretion”: a system that appears to exercise judgment while it runs a rule no one has examined lately. As legal's reach grows, its independence has to grow with it.",
      quote: "Risk becomes visible and continuous instead of episodic and late.",
      story: {
        now: "Legal work runs inside the enterprise platforms that already run the business. Thousands of agents check decisions as they happen, and the COO owns that operating layer. A smaller, more senior legal team writes the rules, handles the exceptions, and answers for the judgment the system applies.",
        path: "From 2026, CEOs and CFOs pushed for legal work that was cheaper, faster, and easier to see. The platforms that ran sales, HR, finance, and operations added legal capability by building, buying, or partnering. Legal teams turned their know-how into agents, playbooks, and escalation paths. Routine legal work moved into the platform.",
        diff: "Today a lawyer reviews a contract or a claim after the business asks. In this world the review happens inside the decision, and routine questions never reach a lawyer."
      },
      timeline: [
        ["Pressure meets the enterprise stack", "CEOs and CFOs want legal work that is cheaper, faster, and easier to see.", "The platforms that already run sales, service, HR, finance, and operations make legal their obvious next addition."],
        ["Platforms absorb legal capability", "Incumbent platforms add, acquire, or partner for legal capability.", "Legal teams turn their know-how into agents, playbooks, controls, and escalation paths, placed at the moment a business decision gets made."],
        ["The legal team gets smaller and more senior", "Routine legal work now runs inside the platform.", "Lawyers supervise, handle exceptions, and govern the judgment the system applies to every decision."],
        ["A product launch runs through embedded legal", "Agents review the claims, supplier terms, customer agreements, privacy, and regulatory obligations as the work happens.", "A marketing claim that crosses a threshold is rewritten before publication. The COO owns the operating layer. The GC owns the rules, the thresholds, and the judgment inside them."]
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
      id: 2, name: "The App Store for Law", role: "GC as conductor",
      tone: "var(--yellow)", ink: "var(--ink)", track: "#f0c919",
      labels: ["Fragmented", "Enterprise-led", "Algorithm-led"],
      premise: "No single platform wins. In-house legal runs a market of specialist tools and providers.",
      summary: "Specialist tools and providers do the work, each on one problem, and no single company owns the whole stack. The GC holds the budget and the institutional knowledge, and sets the access, privilege, security, and interoperability standards that let many tools act as one system. Inside those standards, the tools make the routine calls.",
      promise: "The GC decides how work moves across providers and who is trusted to do it. In-house legal keeps its own seat, and no single platform holds the company captive.",
      danger: "The network can grow too complex to govern. Many tools help only if the GC can see across them, coordinate them, and change providers when one falls short.",
      story: {
        now: "No single platform won. Specialist tools and providers each handle one kind of problem, and in-house legal runs the market they form. The GC holds the budget and the institutional knowledge, and sets the access, privilege, security, and interoperability standards every tool has to meet. Inside those standards, the tools make the routine calls.",
        path: "Cost and speed pressure produced a large market of narrow tools, each good at one task. The hard problem moved from finding capability to coordinating it. Data portability and shared standards let providers work together, and in-house legal found that its own matter history, playbooks, and data gave it control over the market.",
        diff: "Today legal departments buy from firms and vendors one relationship at a time. In this world the GC runs a system of many providers and decides which tools, firms, and agents are trusted to act."
      },
      timeline: [
        ["Specialist tools multiply", "Cost and speed pressure produces a large market of narrow tools, each good at one task.", "The hard problem moves from finding capability to coordinating it."],
        ["Shared standards make variety manageable", "Data portability and common standards let providers work together.", "In-house legal sees that its own matter history, playbooks, data, and institutional memory give it control over the market."],
        ["The Chief Legal Strategist emerges", "One interface makes a market of specialist apps feel like a single system.", "The GC answers for the standards and evidence that decide which tools, firms, and agents are trusted to act."],
        ["In-house legal runs the system", "Privilege, confidentiality, regulatory risk, and board accountability keep legal a distinct function.", "The GC’s team writes the rules and standards under which every provider’s tools make their calls."]
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
      premise: "Law firms and their tech partners build and run most of the legal operating infrastructure.",
      summary: "Firm-run systems do most of the work, on data and platforms the firms control. The in-house team still sets risk appetite and handles exceptions. It buys speed and scale from the firms. What the firm’s system decides usually stands.",
      promise: "Clients get lower cost, higher output, and more predictable service from firms that already carry client trust, privilege practices, and specialist expertise.",
      danger: "The more knowledge and operating capability the firms hold, the harder it gets to switch firms or bring work in-house. A matter can close efficiently and still leave an unjust result for the people affected.",
      quote: "The dependency on Big Law grows as the firms hold the key to the data and the operating systems.",
      story: {
        now: "Law firms and their tech partners build and run most of the legal operating infrastructure. Firm-run systems do most of the work, on data and platforms the firms control. The in-house team sets risk appetite, handles exceptions, and buys speed and scale from the firms. What the firm’s system decides usually stands.",
        path: "Pressure to raise output and cut cost pushed leading firms to take control of the delivery layer, through acquisitions, in-house builds, and partnerships. Firm investments, frontier-model partnerships, and specialist acquisitions became infrastructure. Commodity work approached zero marginal cost, and senior counsel became the scarce, premium tier.",
        diff: "A firm sells its lawyers’ time now, and the company runs its own systems. By 2040 the firm sells the output of a system it owns, and switching firms or bringing work in-house gets harder every year."
      },
      timeline: [
        ["Firms treat technology as the product", "Pressure to raise output and cut cost pushes leading firms to buy, build, and partner for control of the delivery layer.", "Technology moves from overhead to the center of how firms deliver service."],
        ["Partnerships become infrastructure", "Major firm investments, frontier-model partnerships, and specialist acquisitions become part of how firms deliver legal work.", "Clients increasingly receive legal work produced inside firm-controlled systems."],
        ["The work pyramid is repriced", "Commodity work approaches zero marginal cost. Agent-supported work gets cheaper as playbooks encode expertise.", "Strategy and senior counsel become the scarce, premium tier."],
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
      premise: "Integrated systems handle routine legal work. Qualified people can stop and change consequential decisions.",
      summary: "Integrated systems link companies, providers, courts, and regulators, and most routine legal work is faster, cheaper, and automated. After breaches, trust failures, and public backlash, no one hands the machine full authority. A broader licensed workforce, inside and outside the company, can challenge and override the system where judgment and legitimacy are at stake. How far that authority reaches stays contested.",
      promise: "Embedded systems bring legal help to more people. Qualified humans stay accountable where fairness, fiduciary duty, and legitimacy are at stake.",
      danger: "Human review turns ceremonial when reviewers lack the power to change results. Protecting human judgment can also harden into protectionism that keeps useful tools and lower-cost legal help out of reach. The goal is a wider profession than the one of 2026, able to govern machine-led law.",
      quote: "A qualified human remains responsible for knowing when to take the wheel.",
      story: {
        now: "Integrated systems link companies, providers, courts, and regulators, and they do most routine legal work. The difference is who can overrule them: a broader licensed workforce, inside and outside the company, holds the authority to challenge and change consequential decisions. How far that authority reaches is still contested.",
        path: "The warnings came early: sanctions for AI-invented citations, a law school restricting AI in core legal reasoning, states licensing paraprofessionals. Then repeated failures by AI agents, breaches, and public backlash pushed institutions to require human reviewers with the power to change a result. Professional bodies licensed specialists, legal engineers, and certified reviewers so that review could scale.",
        diff: "Human review can still mean a signature at the end of the process. By 2040 a reviewer needs expertise, access to the system’s reasoning, and the power to change the result, and knowing when to step in is a premium skill."
      },
      timeline: [
        ["Warnings accumulate", "Early signals include sanctions for AI-invented citations, a law school restricting AI in core legal reasoning, and states licensing paraprofessionals for defined services.", "Each one draws a line where a qualified person has to stay involved."],
        ["Trust failures trigger backlash", "Repeated failures by AI agents push institutions to require human accountability that means something.", "A reviewer now needs expertise, access to the system’s reasoning, and the authority to change what it would do."],
        ["A broader workforce makes review scalable", "Professional bodies license specialists, translators, legal engineers, and certified reviewers.", "Knowing when to intervene becomes a premium skill."],
        ["Humans challenge a machine-cleared launch", "A board delays a product launch after its legal system cleared it.", "The GC brings in an in-house leader, a regulatory partner, and a licensed consumer-protection specialist. They challenge an assumption that hid a risk to a vulnerable group. The system was right on its own terms. The humans were responsible for the terms."]
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
