
import React from "react";

const links = [
  { label: "Home", href: "#home" },
  { label: "Projects", href: "#projects" },
  { label: "Skills", href: "#skills" },
  { label: "Contact", href: "#contact" },
];

const Navbar = () => (
  <nav className="sticky top-0 left-0 w-full bg-white z-10 border-b border-gray-100 font-inter">
    <div className="container mx-auto flex justify-between items-center py-3">
      <span className="text-lg font-bold tracking-tight">Harikrushna Patel</span>
      <ul className="flex gap-6">
        {links.map((link) => (
          <li key={link.label}>
            <a
              href={link.href}
              className="text-gray-700 hover:text-primary font-semibold transition-colors duration-200"
            >
              {link.label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  </nav>
);

export default Navbar;
