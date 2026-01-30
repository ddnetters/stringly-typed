export default function WhyWeBuiltThis() {
  return (
    <section className="px-6 py-20 bg-[#E8DFD5]">
      <div className="max-w-3xl mx-auto">
        <div className="relative">
          {/* Quote mark */}
          <div className="absolute -top-4 -left-2 text-6xl text-[var(--deep-burgundy)] opacity-20 font-serif">
            &ldquo;
          </div>

          {/* Quote content */}
          <blockquote className="pl-6 border-l-4 border-[var(--deep-burgundy)]">
            <p className="font-[family-name:var(--font-source-serif)] text-xl md:text-2xl text-[var(--chocolate-brown)] leading-relaxed italic">
              We got tired of shipping copy that didn&apos;t match our style guide.
              Manual reviews were slow and inconsistent. So we automated the whole thing.
            </p>
          </blockquote>

          {/* Attribution */}
          <div className="mt-6 pl-6 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[var(--chocolate-brown)] flex items-center justify-center text-[var(--warm-cream)] font-bold text-sm">
              DN
            </div>
            <div>
              <p className="font-semibold text-[var(--chocolate-brown)]">ddnetters</p>
              <p className="text-sm text-[var(--chocolate-brown)] opacity-60">Creator of Stringly-Typed</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
