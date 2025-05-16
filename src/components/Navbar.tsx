
import React from "react";
import { Link, useLocation } from "react-router-dom";

const links = [
  { label: "Home", href: "/" },
  { label: "About", href: "#about" },
  { label: "Projects", href: "/projects" },
  { label: "Skills", href: "#skills" },
  { label: "Contact", href: "#contact" },
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
        <span className="text-lg font-bold tracking-tight">Harikrushna Patel</span>
        <ul className="flex gap-6">
          {links.map((link) => (
            <li key={link.label}>{renderLink(link)}</li>
          ))}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
