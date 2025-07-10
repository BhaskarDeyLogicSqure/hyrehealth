import React from "react";

const DefaultAboutPage = () => {
  return (
    <div className="min-h-screen theme-bg">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <header className="text-center mb-16">
            <h1 className="text-4xl font-bold theme-text-primary mb-6">
              About Hyre Health - Default Theme
            </h1>
            <p className="text-xl theme-text-muted leading-relaxed">
              Dedicated to providing reliable health management solutions with
              traditional excellence.
            </p>
          </header>

          {/* Mission Section */}
          <section className="mb-16">
            <div className="theme-bg-muted p-8 rounded-lg theme-border border">
              <h2 className="text-2xl font-bold theme-text-primary mb-6">
                Our Mission
              </h2>
              <p className="theme-text-muted leading-relaxed text-lg">
                At Hyre Health, we are committed to making healthcare
                accessible, reliable, and effective for everyone. Our platform
                combines cutting-edge technology with proven medical practices
                to deliver comprehensive health management solutions that you
                can trust.
              </p>
            </div>
          </section>

          {/* Values Grid */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold theme-text-primary text-center mb-12">
              Our Core Values
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="theme-bg-muted p-6 rounded-lg">
                <div className="w-12 h-12 theme-bg-primary rounded-full mb-4 flex items-center justify-center">
                  <span className="text-xl">🛡️</span>
                </div>
                <h3 className="text-xl font-semibold theme-text-primary mb-3">
                  Trust & Security
                </h3>
                <p className="theme-text-muted">
                  Your health data is protected with the highest standards of
                  security and privacy.
                </p>
              </div>

              <div className="theme-bg-muted p-6 rounded-lg">
                <div className="w-12 h-12 theme-bg-secondary rounded-full mb-4 flex items-center justify-center">
                  <span className="text-xl">🎯</span>
                </div>
                <h3 className="text-xl font-semibold theme-text-primary mb-3">
                  Quality Care
                </h3>
                <p className="theme-text-muted">
                  We maintain the highest standards in all our health products
                  and services.
                </p>
              </div>

              <div className="theme-bg-muted p-6 rounded-lg">
                <div className="w-12 h-12 theme-bg-primary rounded-full mb-4 flex items-center justify-center">
                  <span className="text-xl">🤝</span>
                </div>
                <h3 className="text-xl font-semibold theme-text-primary mb-3">
                  Customer First
                </h3>
                <p className="theme-text-muted">
                  Every decision we make is centered around improving your
                  healthcare experience.
                </p>
              </div>

              <div className="theme-bg-muted p-6 rounded-lg">
                <div className="w-12 h-12 theme-bg-secondary rounded-full mb-4 flex items-center justify-center">
                  <span className="text-xl">🔬</span>
                </div>
                <h3 className="text-xl font-semibold theme-text-primary mb-3">
                  Innovation
                </h3>
                <p className="theme-text-muted">
                  We continuously innovate to bring you the most effective
                  health solutions.
                </p>
              </div>
            </div>
          </section>

          {/* Contact CTA */}
          <section className="text-center theme-bg-secondary p-8 rounded-lg">
            <h2 className="text-2xl font-bold mb-4">Get in Touch</h2>
            <p className="mb-6 theme-text-muted">
              Have questions? We're here to help you on your health journey.
            </p>
            <button className="theme-bg-primary px-8 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity">
              Contact Us
            </button>
          </section>
        </div>
      </div>
    </div>
  );
};

export default DefaultAboutPage;
