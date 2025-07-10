import React from "react";

const ModernHomePage = () => {
  return (
    <div className="min-h-screen theme-bg">
      <div className="container mx-auto px-4 py-8">
        {/* Hero Section - Modern gradient style */}
        <section className="text-center mb-16 relative overflow-hidden">
          <div className="absolute inset-0 theme-bg-muted opacity-50 rounded-3xl"></div>
          <div className="relative z-10 py-20">
            <div className="inline-block theme-bg-primary px-4 py-2 rounded-full text-sm font-medium mb-6">
              ✨ Modern Experience
            </div>
            <h1 className="text-5xl md:text-6xl font-bold theme-text-primary mb-6 leading-tight">
              Hyre Health
              <span className="theme-text-secondary block">Reimagined</span>
            </h1>
            <p className="text-xl theme-text-muted max-w-3xl mx-auto mb-8">
              Experience the future of health management with our sleek, modern
              interface designed for the digital-first generation.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button className="theme-bg-primary px-8 py-4 rounded-xl font-semibold text-lg hover:scale-105 transition-transform shadow-lg">
                Start Your Journey
              </button>
              <button className="theme-border border-2 px-8 py-4 rounded-xl font-semibold text-lg theme-text-primary hover:theme-bg-muted transition-colors">
                Watch Demo
              </button>
            </div>
          </div>
        </section>

        {/* Features Grid - Modern cards */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold theme-text-primary text-center mb-12">
            Modern Features for Modern Lives
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="group p-8 theme-bg-muted rounded-2xl hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
              <div className="w-14 h-14 theme-bg-primary rounded-xl mb-6 flex items-center justify-center group-hover:scale-110 transition-transform">
                <span className="text-2xl">🚀</span>
              </div>
              <h3 className="text-xl font-bold theme-text-primary mb-3">
                Smart Automation
              </h3>
              <p className="theme-text-muted leading-relaxed">
                AI-powered health management that learns and adapts to your
                lifestyle.
              </p>
            </div>

            <div className="group p-8 theme-bg-muted rounded-2xl hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
              <div className="w-14 h-14 theme-bg-secondary rounded-xl mb-6 flex items-center justify-center group-hover:scale-110 transition-transform">
                <span className="text-2xl">⚡</span>
              </div>
              <h3 className="text-xl font-bold theme-text-primary mb-3">
                Lightning Fast
              </h3>
              <p className="theme-text-muted leading-relaxed">
                Optimized performance for instant access to your health data
                anywhere.
              </p>
            </div>

            <div className="group p-8 theme-bg-muted rounded-2xl hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
              <div className="w-14 h-14 theme-bg-primary rounded-xl mb-6 flex items-center justify-center group-hover:scale-110 transition-transform">
                <span className="text-2xl">🎯</span>
              </div>
              <h3 className="text-xl font-bold theme-text-primary mb-3">
                Personalized Insights
              </h3>
              <p className="theme-text-muted leading-relaxed">
                Data-driven recommendations tailored specifically to your health
                goals.
              </p>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="theme-bg-secondary rounded-3xl p-12 text-center mb-16">
          <h2 className="text-3xl font-bold mb-8">
            Trusted by Modern Healthcare
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <div className="text-4xl font-bold mb-2">50K+</div>
              <div className="text-sm opacity-80">Active Users</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">99.9%</div>
              <div className="text-sm opacity-80">Uptime</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">500+</div>
              <div className="text-sm opacity-80">Health Products</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">24/7</div>
              <div className="text-sm opacity-80">Support</div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="text-center">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl font-bold theme-text-primary mb-6">
              Ready for the Future?
            </h2>
            <p className="text-xl theme-text-muted mb-8">
              Join the modern health revolution today.
            </p>
            <button className="theme-bg-primary px-12 py-4 rounded-xl font-bold text-lg hover:scale-105 transition-transform shadow-xl">
              Get Started Now →
            </button>
          </div>
        </section>
      </div>
    </div>
  );
};

export default ModernHomePage;
