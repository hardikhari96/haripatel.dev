
import React from "react";
import Navbar from "@/components/Navbar";
import { Mail, MapPin, Linkedin } from "lucide-react";
import ContactForm from "@/components/ContactForm";

const Contact = () => {
  return (
    <div className="font-inter min-h-screen bg-white">
      <Navbar />
      <section className="py-14 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-6 text-center">Contact</h2>
          <div className="mb-6 flex flex-col items-center text-gray-600 gap-1">
            <div className="flex items-center gap-1">
              <Mail size={16} />
              <span className="ml-1">mail@haripatel.dev</span>
            </div>
            <div className="flex items-center gap-1">
              <MapPin size={16} />
              <span className="ml-1">Ahmedabad, India</span>
            </div>
            <div className="flex items-center gap-1">
              <Linkedin size={16} />
              <a
                href="https://www.linkedin.com/in/iharipatel/"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-primary ml-1"
              >
                LinkedIn
              </a>
            </div>
          </div>
          <ContactForm />
        </div>
      </section>
    </div>
  );
};

export default Contact;
