import Layout from "../components/Layout";
import ContactForm from "../components/ContactForm";

const HomePage = () => {
  return (
    <Layout>
      <section className="relative text-center flex flex-col items-center justify-center min-h-screen overflow-hidden">
        {/* Brand flamingo background */}
        <picture className="pointer-events-none select-none absolute top-10 left-1/2 -translate-x-1/2 z-0">
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
            className="btn-primary hover-lift inline-block w-full sm:w-auto"
          >
            Get Started
          </a>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-16 mb-10 left-1/2 -translate-x-1/2">
          <button
            onClick={() =>
              document
                .getElementById("content")
                ?.scrollIntoView({ behavior: "smooth" })
            }
            aria-label="Scroll to content"
            className="flex items-center justify-center w-12 h-12 text-brand text-3xl animate-bounce cursor-pointer hover:text-accent transition-colors duration-300 focus:outline-none bg-brand/10 rounded-full border border-accent/30 hover:border-brand/50 hover:bg-brand/50"
          >
            ↓
          </button>
        </div>
      </section>

      {/* Feature highlights */}
      <div className="-mx-[calc(50vw-50%)]">
        <section
          id="content"
          className="py-16 bg-gradient-to-b from-white to-gray-50 dark:from-surface dark:to-surface"
        >
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-extrabold  dark:text-white text-center mb-12">
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
                  className="bg-white dark:bg-gray-800 dark:border-2 dark:border-gray-700 rounded-lg p-6 text-center shadow group hover:shadow-xl transition-shadow"
                >
                  <img
                    src="/logo/learningoo-128.png"
                    alt="flamingo icon"
                    className="h-16 w-16 mx-auto mb-4 transform group-hover:scale-105 transition-transform"
                  />
                  <h3 className="text-xl font-bold mb-2 text-brand">
                    {f.title}
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300 text-sm">
                    {f.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>

      {/* Numbers & Social Proof */}
      <div className="-mx-[calc(50vw-50%)]">
        <section className="w-screen bg-gradient-to-br from-brand/5 via-white to-accent-purple/5 dark:from-brand/20 dark:via-gray-900 dark:to-gray-800 text-center space-y-16 py-16 px-6 sm:px-12 lg:px-20">
          <h2 className="text-3xl sm:text-4xl  dark:text-white mt-15 font-extrabold">
            Join a growing <span className="text-brand">community</span>
          </h2>
          <div className="stats-grid p-10 text-gray-800 dark:text-gray-200">
            {[
              { value: "12k+", label: "Creators" },
              { value: "150k+", label: "Students" },
              { value: "2.3M", label: "Lessons watched" },
              { value: "98%", label: "Positive feedback" },
            ].map((s) => (
              <div
                key={s.label}
                className="stat-item hover-lift bg-white dark:bg-gray-800 rounded-xl card-spacing shadow"
              >
                <p className="stat-value">{s.value}</p>
                <p className="stat-label">{s.label}</p>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Call to action for instructors */}
      <div className="-mx-[calc(50vw-50%)]">
        <section className="py-24 lg:py-32 bg-gradient-to-r from-brand/10 to-transparent dark:from-brand/20 px-6 sm:px-12 lg:px-20">
          <div className="w-full flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex-1 space-y-4">
              <h3 className="text-2xl sm:text-3xl dark:text-white font-bold">
                Ready to share your knowledge?
              </h3>
              <p className="text-gray-700 dark:text-gray-300 max-w-md">
                Publish your first course today and turn your passion into
                recurring income. Our drag-and-drop builder and transparent
                revenue share make it easy.
              </p>
            </div>
            <a
              href="/signup"
              className="btn-primary hover-lift inline-block w-full md:w-auto md:mr-10"
            >
              Become an Instructor
            </a>
          </div>
        </section>
      </div>

      <ContactForm />
    </Layout>
  );
};

export default HomePage;
