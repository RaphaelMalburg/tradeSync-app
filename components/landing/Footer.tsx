import Link from "next/link";
import { Twitter, Github } from "lucide-react";
import Image from "next/image"; // Import Image component

export function Footer() {
  const footerSections = [
    {
      title: "Product",
      links: [
        { label: "Features", href: "#features" },
        { label: "Store", href: "/store" },
        { label: "Analytics", href: "#analytics" },
        { label: "AI Insights", href: "#ai-insights" },
        { label: "Pricing", href: "/pricing" },
      ],
    },
    {
      title: "Company",
      links: [
        { label: "About", href: "/about" },
        { label: "Contact", href: "/contact" },
      ],
    },
    {
      title: "Resources",
      links: [
        { label: "Documentation", href: "/docs" },
        { label: "API", href: "/api" },
        { label: "Support", href: "/support" },
        { label: "Terms", href: "/terms" },
      ],
    },
    {
      title: "Legal",
      links: [
        { label: "Privacy", href: "/privacy" },
        { label: "Terms", href: "/terms" },
        { label: "Cookie Policy", href: "/cookies" },
        { label: "Licenses", href: "/licenses" },
      ],
    },
  ];

  return (
    <footer className="bg-background py-10">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Brand Section */}
        <div className="col-span-2">
          <Link href="/" className="flex items-center gap-2 mb-4">
            <Image src="/trade-tracker-logo.png" alt="Trader Tracker Logo" width={55} height={55} className="mr-2" />
            <span className="font-bold text-xl bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">Trader Tracker</span>
          </Link>
          <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">Advanced trading journal and analysis tool powered by AI, helping traders make data-driven decisions.</p>
          <div className="flex space-x-4">
            <Link href="https://twitter.com" className="text-gray-600 hover:text-blue-500 dark:text-gray-400 dark:hover:text-blue-400">
              <Twitter className="h-5 w-5" />
            </Link>
            <Link href="https://github.com" className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">
              <Github className="h-5 w-5" />
            </Link>
          </div>
        </div>

        {/* Links Sections */}
        {footerSections.map((section) => (
          <div key={section.title}>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">{section.title}</h3>
            <ul className="space-y-3">
              {section.links.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 text-sm transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </footer>
  );
}
