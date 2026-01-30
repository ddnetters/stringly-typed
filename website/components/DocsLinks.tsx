const docs = [
  {
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
      </svg>
    ),
    title: "Installation",
    description: "Setup, local dev, Docker",
    href: "https://github.com/ddnetters/stringly-typed/blob/main/docs/installation.md",
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
      </svg>
    ),
    title: "Configuration",
    description: "All options explained",
    href: "https://github.com/ddnetters/stringly-typed/blob/main/docs/configuration.md",
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    title: "Checkers",
    description: "brand_style, char_count, custom",
    href: "https://github.com/ddnetters/stringly-typed/blob/main/docs/checkers.md",
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
      </svg>
    ),
    title: "Deciders",
    description: "threshold, noCritical, custom",
    href: "https://github.com/ddnetters/stringly-typed/blob/main/docs/deciders.md",
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
      </svg>
    ),
    title: "Examples",
    description: "Real-world scenarios",
    href: "https://github.com/ddnetters/stringly-typed/blob/main/docs/examples.md",
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    ),
    title: "API Reference",
    description: "TypeScript interfaces",
    href: "https://github.com/ddnetters/stringly-typed/blob/main/docs/api.md",
  },
];

export default function DocsLinks() {
  return (
    <section className="px-6 py-20 bg-[var(--warm-cream)]">
      <div className="max-w-4xl mx-auto">
        {/* Section Header */}
        <h2 className="font-[family-name:var(--font-righteous)] text-3xl md:text-4xl text-[var(--chocolate-brown)] text-center mb-4">
          Explore the Docs
        </h2>
        <p className="text-center text-[var(--chocolate-brown)] opacity-70 mb-10">
          Everything you need to customize Stringly-Typed for your workflow.
        </p>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {docs.map((doc) => (
            <a
              key={doc.title}
              href={doc.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-start gap-4 p-4 rounded-lg border border-transparent hover:border-[var(--chocolate-brown)] hover:bg-white transition-all"
            >
              <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-[var(--mustard-gold)] bg-opacity-20 flex items-center justify-center text-[var(--mustard-gold)] group-hover:bg-[var(--burnt-sienna)] group-hover:text-white transition-colors">
                {doc.icon}
              </div>
              <div>
                <h3 className="font-semibold text-[var(--chocolate-brown)] group-hover:text-[var(--burnt-sienna)] transition-colors">
                  {doc.title}
                </h3>
                <p className="text-sm text-[var(--chocolate-brown)] opacity-60">
                  {doc.description}
                </p>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
