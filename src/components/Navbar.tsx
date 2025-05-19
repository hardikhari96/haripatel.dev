import { Link, useLocation } from "react-router-dom";
import { Linkedin } from "lucide-react";

const links = [
  { label: "Home", href: "/" },
  { label: "Projects", href: "/projects" },
  { label: "Contact", href: "/contact" },
];

const Navbar = () => {
  const location = useLocation();

  // Determine if link is anchor or route
  const renderLink = (link: typeof links[0]) => {
    const isRoute = link.href.startsWith("/");
    if (isRoute) {
      return (
        <Link
          to={link.href}
          className={`text-gray-700 hover:text-primary font-semibold transition-colors duration-200 ${
            location.pathname === link.href ? "text-primary" : ""
          }`}
        >
          {link.label}
        </Link>
      );
    }
    return (
      <a
        href={link.href}
        className="text-gray-700 hover:text-primary font-semibold transition-colors duration-200"
      >
        {link.label}
      </a>
    );
  };

  return (
    <nav className="sticky top-0 left-0 w-full bg-white z-10 border-b border-gray-100 font-inter">
      <div className="container mx-auto flex justify-between items-center py-3">
        <div className="flex items-center gap-4">
          <span className="text-lg font-bold tracking-tight flex items-center gap-2">
            Harikrushna Patel
            <a
              href="https://www.linkedin.com/in/iharipatel/"
              target="_blank"
              rel="noopener noreferrer"
              className="ml-1 text-primary hover:text-primary/80"
              title="LinkedIn"
            >
              <Linkedin size={20} />
            </a>
          </span>
          <span className="text-xs text-gray-400">K8s Pod IP: 10.20.214.131 | Node IP: 203.60.1.78</span>
        </div>
        <ul className="flex gap-6">
          {links.map((link) => (
            <li key={link.label}>{renderLink(link)}</li>
          ))}
          <li>
            <a
              href="/cv-harikrushna-patel.pdf"
              download
              className="bg-primary text-white px-3 py-1 rounded hover:bg-primary/90 transition-colors font-semibold text-sm"
            >
              Download CV
            </a>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
