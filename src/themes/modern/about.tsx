import React from "react";

const ModernAboutPage = () => {
  return (
    <div className="min-h-screen theme-bg">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          {/* Modern Hero Section */}
          <header className="text-center mb-20 relative">
            <div className="absolute inset-0 theme-bg-muted opacity-30 rounded-3xl transform -rotate-1"></div>
            <div className="relative z-10 py-16">
              <div className="inline-block theme-bg-primary px-6 py-2 rounded-full text-sm font-medium mb-6">
                🚀 Modern Healthcare
              </div>
              <h1 className="text-5xl md:text-6xl font-bold theme-text-primary mb-6">
                Redefining
                <span className="theme-text-secondary block">Healthcare</span>
              </h1>
              <p className="text-xl theme-text-muted max-w-3xl mx-auto leading-relaxed">
                We're not just another healthcare platform. We're the future of
                personalized, AI-driven health management designed for the
                digital age.
              </p>
            </div>
          </header>

          {/* Mission with Modern Cards */}
          <section className="mb-20">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-4xl font-bold theme-text-primary mb-6">
                  Our Vision
                </h2>
                <p className="text-lg theme-text-muted leading-relaxed mb-6">
                  Healthcare shouldn't be complicated, expensive, or impersonal.
                  We're building an intelligent ecosystem that adapts to your
                  life, learns from your patterns, and delivers exactly what you
                  need, when you need it.
                </p>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 theme-bg-primary rounded-full"></div>
                    <span className="theme-text-muted">
                      AI-powered personalization
                    </span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 theme-bg-secondary rounded-full"></div>
                    <span className="theme-text-muted">
                      Seamless digital experience
                    </span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 theme-bg-primary rounded-full"></div>
                    <span className="theme-text-muted">
                      Predictive health insights
                    </span>
                  </div>
                </div>
              </div>
              <div className="relative">
                <div className="theme-bg-muted rounded-3xl p-12 relative overflow-hidden">
                  <div className="absolute top-4 right-4 theme-text-secondary text-6xl opacity-20">
                    💡
                  </div>
                  <div className="relative z-10">
                    <div className="text-3xl theme-text-primary font-bold mb-4">
                      50M+
                    </div>
                    <div className="theme-text-muted">
                      Data points analyzed daily
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Modern Values Grid */}
          <section className="mb-20">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold theme-text-primary mb-4">
                Built on Modern Principles
              </h2>
              <p className="text-lg theme-text-muted max-w-2xl mx-auto">
                Our core values drive every feature, every interaction, and
                every innovation.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="group">
                <div className="theme-bg-muted p-8 rounded-2xl hover:shadow-xl transition-all duration-300 hover:-translate-y-2 h-full">
                  <div className="w-16 h-16 theme-bg-primary rounded-xl mb-6 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <span className="text-2xl">⚡</span>
                  </div>
                  <h3 className="text-xl font-bold theme-text-primary mb-3">
                    Speed
                  </h3>
                  <p className="theme-text-muted">
                    Lightning-fast responses because your health can't wait.
                  </p>
                </div>
              </div>

              <div className="group">
                <div className="theme-bg-muted p-8 rounded-2xl hover:shadow-xl transition-all duration-300 hover:-translate-y-2 h-full">
                  <div className="w-16 h-16 theme-bg-secondary rounded-xl mb-6 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <span className="text-2xl">🧠</span>
                  </div>
                  <h3 className="text-xl font-bold theme-text-primary mb-3">
                    Intelligence
                  </h3>
                  <p className="theme-text-muted">
                    Smart algorithms that learn and adapt to your unique needs.
                  </p>
                </div>
              </div>

              <div className="group">
                <div className="theme-bg-muted p-8 rounded-2xl hover:shadow-xl transition-all duration-300 hover:-translate-y-2 h-full">
                  <div className="w-16 h-16 theme-bg-primary rounded-xl mb-6 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <span className="text-2xl">🔮</span>
                  </div>
                  <h3 className="text-xl font-bold theme-text-primary mb-3">
                    Prediction
                  </h3>
                  <p className="theme-text-muted">
                    Anticipate health needs before they become problems.
                  </p>
                </div>
              </div>

              <div className="group">
                <div className="theme-bg-muted p-8 rounded-2xl hover:shadow-xl transition-all duration-300 hover:-translate-y-2 h-full">
                  <div className="w-16 h-16 theme-bg-secondary rounded-xl mb-6 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <span className="text-2xl">🌐</span>
                  </div>
                  <h3 className="text-xl font-bold theme-text-primary mb-3">
                    Connected
                  </h3>
                  <p className="theme-text-muted">
                    Seamlessly integrated with your digital ecosystem.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Tech Stack Showcase */}
          <section className="mb-20 theme-bg-secondary rounded-3xl p-12">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">
                Powered by Tomorrow's Technology
              </h2>
              <p className="text-lg opacity-90">
                We leverage cutting-edge tech to deliver unparalleled healthcare
                experiences.
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-3xl mb-2">🤖</div>
                <div className="font-semibold">AI/ML</div>
              </div>
              <div>
                <div className="text-3xl mb-2">☁️</div>
                <div className="font-semibold">Cloud Native</div>
              </div>
              <div>
                <div className="text-3xl mb-2">🔐</div>
                <div className="font-semibold">Blockchain</div>
              </div>
              <div>
                <div className="text-3xl mb-2">📱</div>
                <div className="font-semibold">Mobile First</div>
              </div>
            </div>
          </section>

          {/* Modern CTA */}
          <section className="text-center">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-4xl font-bold theme-text-primary mb-6">
                Ready to Experience the Future?
              </h2>
              <p className="text-xl theme-text-muted mb-8">
                Join thousands of forward-thinking individuals who've already
                made the switch.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="theme-bg-primary px-8 py-4 rounded-xl font-bold text-lg hover:scale-105 transition-transform shadow-lg">
                  Get Started →
                </button>
                <button className="theme-border border-2 px-8 py-4 rounded-xl font-bold text-lg theme-text-primary hover:theme-bg-muted transition-colors">
                  Schedule Demo
                </button>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default ModernAboutPage;
