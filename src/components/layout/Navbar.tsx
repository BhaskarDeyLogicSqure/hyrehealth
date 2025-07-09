import Image from "next/image";
import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="border-b bg-white/80 backdrop-blur">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Brand */}
          <div className="flex items-center space-x-2">
            <Image
              src="/logo.png"
              alt="Hyre Health Logo"
              width={100}
              height={100}
              className="object-contain"
            />
          </div>
          {/* Nav Links */}
          <div className="flex items-center space-x-2">
            <Link
              href="#how-it-works"
              className="text-sm font-medium text-brand-charcoal px-3 py-2 hover:text-brand-dark-blue"
            >
              How It Works
            </Link>
            <Link
              href="#features"
              className="text-sm font-medium text-brand-charcoal px-3 py-2 hover:text-brand-dark-blue"
            >
              Features
            </Link>
            <Link href="#get-started">
              <button className="bg-brand-dark-blue text-white font-semibold px-4 py-2 rounded-md hover:bg-brand-dark-blue/90">
                Get Started
              </button>
            </Link>
            <Link href="/auth/login">
              <button className="border border-brand-gold text-brand-gold font-semibold px-4 py-2 rounded-md hover:bg-brand-gold/10 ml-2">
                Login as Admin
              </button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
