import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const revalidate = 60; // ISR: Revalidate every 60 seconds

type Project = Awaited<ReturnType<typeof prisma.project.findMany>>;
type Property = Awaited<ReturnType<typeof prisma.property.findMany>>;
type Article = Awaited<ReturnType<typeof prisma.article.findMany>>;

export default async function HomePage() {
  let featuredProjects: Project = [];
  let featuredProperties: Property = [];
  let latestArticles: Article = [];
  let error: string | null = null;

  try {
    // Fetch featured content from DB
    const [projects, properties, articles] = await Promise.all([
      prisma.project.findMany({
        where: { featured: true, status: "published" },
        orderBy: { createdAt: "desc" },
        take: 3,
      }).catch(err => {
        console.error("Project fetch error:", err);
        return [];
      }),
      prisma.property.findMany({
        where: { featured: true, status: "available" },
        orderBy: { createdAt: "desc" },
        take: 3,
      }).catch(err => {
        console.error("Property fetch error:", err);
        return [];
      }),
      prisma.article.findMany({
        where: { status: "published" },
        orderBy: { createdAt: "desc" },
        take: 3,
      }).catch(err => {
        console.error("Article fetch error:", err);
        return [];
      }),
    ]);

    featuredProjects = projects || [];
    featuredProperties = properties || [];
    latestArticles = articles || [];
  } catch (err) {
    console.error("Error fetching homepage data:", err);
    error = "Failed to load some content. Please try refreshing.";
  }

  return (
    <main className="min-h-screen bg-white text-gray-900">
      {/* ── NAVBAR ── */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-5 bg-black/30 backdrop-blur-md">
        <Link href="/" className="text-white text-xl font-bold tracking-widest uppercase">
          ArchLabs
        </Link>
        <div className="flex items-center gap-8 text-sm text-white/90">
          <Link href="/projects" className="hover:text-white transition">
            Projects
          </Link>
          <Link href="/properties" className="hover:text-white transition">
            Properties
          </Link>
          <Link href="/articles" className="hover:text-white transition">
            Articles
          </Link>
          <Link
            href="/contact"
            className="bg-white text-black px-4 py-2 rounded hover:bg-gray-100 transition font-medium"
          >
            Contact Us
          </Link>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section className="relative h-screen w-full overflow-hidden bg-cover bg-center" style={{
        backgroundImage: "url('https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=1920&q=80')"
      }}>
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black/55 z-[1]" />

        {/* Hero Content */}
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-center text-white px-6">
          <p className="text-sm uppercase tracking-[0.3em] text-white/70 mb-4">
            Architecture & Real Estate
          </p>
          <h1 className="text-5xl md:text-7xl font-bold leading-tight max-w-4xl mb-6">
            Designing Spaces,{" "}
            <span className="italic font-light">Defining Lives</span>
          </h1>
          <p className="text-lg text-white/80 max-w-xl mb-10">
            We craft architectural masterpieces and premium real estate properties
            that inspire, endure, and elevate the way you live.
          </p>
          <div className="flex gap-4">
            <Link
              href="/projects"
              className="bg-white text-black px-7 py-3 rounded font-semibold hover:bg-gray-100 transition"
            >
              View Projects
            </Link>
            <Link
              href="/properties"
              className="border border-white text-white px-7 py-3 rounded font-semibold hover:bg-white/10 transition"
            >
              Browse Properties
            </Link>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/50 text-xs">
          <span className="uppercase tracking-widest">Scroll</span>
          <div className="w-px h-10 bg-white/30 animate-pulse" />
        </div>
      </section>

      {/* ── STATS BAR ── */}
      <section className="bg-black text-white py-8 px-8">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[
            { value: "120+", label: "Projects Completed" },
            { value: "15+", label: "Years Experience" },
            { value: "80+", label: "Happy Clients" },
            { value: "12", label: "Awards Won" },
          ].map((stat) => (
            <div key={stat.label}>
              <div className="text-3xl font-bold">{stat.value}</div>
              <div className="text-sm text-white/60 mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── FEATURED PROJECTS ── */}
      <section className="py-24 px-8 max-w-7xl mx-auto">
        <div className="flex justify-between items-end mb-12">
          <div>
            <p className="text-sm uppercase tracking-widest text-gray-400 mb-2">Our Work</p>
            <h2 className="text-4xl font-bold">Featured Projects</h2>
          </div>
          <Link
            href="/projects"
            className="text-sm font-medium underline underline-offset-4 hover:text-gray-600 transition"
          >
            View All →
          </Link>
        </div>

        {featuredProjects.length === 0 ? (
          <p className="text-gray-400 text-center py-12">No featured projects yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredProjects.map((project) => (
              <Link
                key={project.id}
                href={`/projects/${project.slug}`}
                className="group block overflow-hidden rounded-xl"
              >
                <div className="relative h-72 overflow-hidden bg-gray-100">
                  {project.coverImage && (
                    <img
                      src={project.coverImage}
                      alt={project.title || "Project image"}
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition duration-500"
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                      }}
                    />
                  )}
                  {!project.coverImage && (
                    <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                      No Image
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition" />
                  <div className="absolute bottom-4 left-4 text-white">
                    <p className="text-xs uppercase tracking-widest text-white/70">
                      {project.category || "Uncategorized"}
                    </p>
                    <h3 className="text-lg font-semibold">{project.title}</h3>
                  </div>
                </div>
                <div className="py-4">
                  <p className="text-sm text-gray-500">
                    {project.location || "Location TBA"} · {project.year || "Year TBA"}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* ── DIVIDER BANNER ── */}
      <section className="relative py-28 px-8 overflow-hidden bg-cover bg-center" style={{
        backgroundImage: "url('https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1920&q=80')"
      }}>
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/60 z-[1]" />
        {/* Content */}
        <div className="relative z-10 max-w-3xl mx-auto text-center text-white">
          <p className="text-sm uppercase tracking-[0.3em] text-white/60 mb-4">
            Premium Real Estate
          </p>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Your Dream Property Starts Here
          </h2>
          <p className="text-white/75 text-lg mb-8">
            From luxury villas to modern apartments, we have premium properties
            tailored to your lifestyle and budget.
          </p>
          <Link
            href="/properties"
            className="bg-white text-black px-8 py-3 rounded font-semibold hover:bg-gray-100 transition"
          >
            Explore Properties
          </Link>
        </div>
      </section>

      {/* ── FEATURED PROPERTIES ── */}
      <section className="py-24 px-8 max-w-7xl mx-auto">
        <div className="flex justify-between items-end mb-12">
          <div>
            <p className="text-sm uppercase tracking-widest text-gray-400 mb-2">
              Real Estate
            </p>
            <h2 className="text-4xl font-bold">Featured Properties</h2>
          </div>
          <Link
            href="/properties"
            className="text-sm font-medium underline underline-offset-4 hover:text-gray-600 transition"
          >
            View All →
          </Link>
        </div>

        {featuredProperties.length === 0 ? (
          <p className="text-gray-400 text-center py-12">No featured properties yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredProperties.map((property) => (
              <Link
                key={property.id}
                href={`/properties/${property.id}`}
                className="group block rounded-xl overflow-hidden border hover:shadow-lg transition"
              >
                <div className="relative h-56 overflow-hidden bg-gray-100">
                  {property.coverImage && (
                    <img
                      src={property.coverImage}
                      alt={property.title || "Property image"}
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition duration-500"
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                      }}
                    />
                  )}
                  {!property.coverImage && (
                    <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                      No Image
                    </div>
                  )}
                  <div className="absolute top-3 left-3 bg-black text-white text-xs px-2 py-1 rounded capitalize">
                    {property.type || "Type"}
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-gray-800 mb-1">{property.title}</h3>
                  <p className="text-sm text-gray-500 mb-3">
                    📍 {property.location || "Location TBA"}
                  </p>
                  <div className="flex gap-4 text-xs text-gray-500 mb-3">
                    <span>🛏 {property.bedrooms ?? 0} Beds</span>
                    <span>🚿 {property.bathrooms ?? 0} Baths</span>
                    <span>📐 {property.area ?? 0} sqm</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-gray-900">
                      ₦{(property.price ?? 0).toLocaleString()}
                    </span>
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                      {property.status === "available" ? "Available" : "Sold"}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* ── LATEST ARTICLES ── */}
      <section className="py-24 px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-end mb-12">
            <div>
              <p className="text-sm uppercase tracking-widest text-gray-400 mb-2">
                Blog
              </p>
              <h2 className="text-4xl font-bold">Latest Articles</h2>
            </div>
            <Link
              href="/articles"
              className="text-sm font-medium underline underline-offset-4 hover:text-gray-600 transition"
            >
              View All →
            </Link>
          </div>

          {latestArticles.length === 0 ? (
            <p className="text-gray-400 text-center py-12">No articles yet.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {latestArticles.map((article) => (
                <Link
                  key={article.id}
                  href={`/articles/${article.slug}`}
                  className="group block bg-white rounded-xl overflow-hidden hover:shadow-lg transition"
                >
                  {article.coverImage && (
                    <div className="h-48 overflow-hidden bg-gray-100">
                      <img
                        src={article.coverImage}
                        alt={article.title || "Article image"}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                        onError={(e) => {
                          e.currentTarget.style.display = "none";
                        }}
                      />
                    </div>
                  )}
                  <div className="p-5">
                    <p className="text-xs text-gray-400 mb-2">
                      By {article.author || "Unknown"} ·{" "}
                      {new Date(article.createdAt).toLocaleDateString("en-US", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </p>
                    <h3 className="font-semibold text-gray-800 mb-2 group-hover:underline">
                      {article.title}
                    </h3>
                    {article.excerpt && (
                      <p className="text-sm text-gray-500 line-clamp-2">
                        {article.excerpt}
                      </p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── CONTACT CTA ── */}
      <section className="py-24 px-8 bg-black text-white text-center">
        <p className="text-sm uppercase tracking-widest text-white/50 mb-4">
          Get In Touch
        </p>
        <h2 className="text-4xl md:text-5xl font-bold mb-6 max-w-2xl mx-auto">
          Have a Project in Mind?
        </h2>
        <p className="text-white/70 max-w-md mx-auto mb-10">
          Let's talk about your vision. Whether it's a new build, renovation, or
          property investment — we're here to help.
        </p>
        <Link
          href="/contact"
          className="bg-white text-black px-8 py-3 rounded font-semibold hover:bg-gray-100 transition"
        >
          Start a Conversation
        </Link>
      </section>

      {/* ── FOOTER ── */}
      <footer className="bg-gray-950 text-white/50 text-sm py-8 px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <span className="text-white font-bold tracking-widest uppercase">ArchLabs</span>
          <div className="flex gap-6">
            <Link href="/projects" className="hover:text-white transition">
              Projects
            </Link>
            <Link href="/properties" className="hover:text-white transition">
              Properties
            </Link>
            <Link href="/articles" className="hover:text-white transition">
              Articles
            </Link>
            <Link href="/contact" className="hover:text-white transition">
              Contact
            </Link>
          </div>
          <span>© {new Date().getFullYear()} ArchLabs. All rights reserved.</span>
        </div>
      </footer>
    </main>
  );
}
