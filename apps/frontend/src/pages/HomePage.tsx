import Layout from "../components/Layout";

const HomePage = () => {
  return (
    <Layout>
      <section className="relative text-center flex flex-col items-center justify-center min-h-screen overflow-hidden">
        {/* Brand flamingo background */}
        <picture className="pointer-events-none select-none absolute bottom-8 left-1/2 -translate-x-1/2 z-0">
          <source
            media="(min-width: 1024px)"
            srcSet="/logo/learningoo-1024.png"
          />
          <img
            src="/logo/learningoo-512.png"
            alt="Flamingo mascot"
            className="max-h-[75vh] w-auto opacity-20 dark:opacity-25"
          />
        </picture>
        <div className="relative z-10 px-4">
          <h1 className="text-5xl sm:text-6xl font-extrabold text-black dark:text-white mb-6 drop-shadow-md">
            Empower Your Knowledge with
            <span className="text-brand"> Learningoo</span>
          </h1>
          <p className="max-w-2xl mx-auto text-lg text-gray-700 dark:text-gray-300 mb-8">
            Create, manage and monetize your courses while providing students an
            engaging learning experience.
          </p>
          <a
            href="/signup"
            className="inline-block bg-brand hover:bg-brand-dark text-white px-8 py-3 rounded-lg font-semibold shadow-lg"
          >
            Get Started
          </a>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-16 left-1/2 -translate-x-1/2">
          <button
            onClick={() =>
              document
                .getElementById("content")
                ?.scrollIntoView({ behavior: "smooth" })
            }
            aria-label="Scroll to content"
            className="flex items-center justify-center w-12 h-12 text-brand text-3xl animate-bounce cursor-pointer hover:text-accent transition-colors duration-300 focus:outline-none bg-gray-800/50 rounded-full border border-accent/30 hover:border-brand/50"
          >
            ↓
          </button>
        </div>
      </section>

      {/* Feature highlights */}
      <section
        id="content"
        className="py-16 bg-gradient-to-b from-white to-gray-50 dark:from-surface dark:to-surface"
      >
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-extrabold text-center mb-12">
            Why creators love <span className="text-brand">Learningoo</span>
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Drag-and-Drop Builder",
                desc: "Assemble chapters, lessons, videos and quizzes in seconds – no coding needed.",
              },
              {
                title: "Monetisation Tools",
                desc: "Set prices, coupons, drip schedules and bundles to maximise revenue.",
              },
              {
                title: "Student Analytics",
                desc: "Track completion, engagement and revenue in real time.",
              },
            ].map((f, idx) => (
              <div
                key={idx}
                className="bg-white dark:bg-surface rounded-lg p-6 text-center shadow group hover:shadow-xl transition-shadow"
              >
                <img
                  src="/logo/learningoo-128.png"
                  alt="flamingo icon"
                  className="h-16 w-16 mx-auto mb-4 transform group-hover:scale-105 transition-transform"
                />
                <h3 className="text-xl font-bold mb-2 text-brand">{f.title}</h3>
                <p className="text-gray-700 dark:text-gray-300 text-sm">
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default HomePage;
