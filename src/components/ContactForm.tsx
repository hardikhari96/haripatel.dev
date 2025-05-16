
import React, { useState } from "react";
import { toast } from "@/hooks/use-toast";

const ContactForm = () => {
  const [pending, setPending] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      toast({ title: "Error", description: "All fields are required.", duration: 2000 });
      return;
    }
    setPending(true);
    setTimeout(() => {
      setPending(false);
      setForm({ name: "", email: "", message: "" });
      toast({ title: "Success", description: "Message sent!", duration: 2000 });
    }, 1200);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-xl mx-auto animate-fade-in">
      <div>
        <label className="block font-medium mb-1" htmlFor="name">
          Name
        </label>
        <input
          id="name"
          name="name"
          className="w-full border border-gray-300 rounded px-3 py-2 outline-none focus:border-primary font-inter"
          autoComplete="off"
          value={form.name}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label className="block font-medium mb-1" htmlFor="email">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          className="w-full border border-gray-300 rounded px-3 py-2 outline-none focus:border-primary font-inter"
          autoComplete="off"
          value={form.email}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label className="block font-medium mb-1" htmlFor="message">
          Message
        </label>
        <textarea
          id="message"
          name="message"
          rows={5}
          className="w-full border border-gray-300 rounded px-3 py-2 outline-none focus:border-primary font-inter"
          value={form.message}
          onChange={handleChange}
          required
        />
      </div>
      <button
        type="submit"
        disabled={pending}
        className="bg-primary text-white px-5 py-2 rounded font-semibold hover:bg-primary/90 transition-colors focus:outline-none font-inter"
      >
        {pending ? "Sending..." : "Send Message"}
      </button>
    </form>
  );
};

export default ContactForm;
