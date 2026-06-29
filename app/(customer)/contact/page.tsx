"use client";

import { Mail, Phone, MapPin, Send, Loader2, Lock } from "lucide-react";
import { useState } from "react";
import { saveContactMessage } from "@/hooks/contact/actions";
import Link from "next/link";

interface FormState {
  firstName: string;
  lastName: string;
  email: string;
  message: string;
}

export default function ContactPage() {
  // Replace this with your actual auth hook (e.g., useSession() from next-auth or useAuth() from Clerk)
  const isLoggedIn = false; // Toggle to true to test the form layout

  const [formData, setFormData] = useState<FormState>({
    firstName: "",
    lastName: "",
    email: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoggedIn) {
      setError("You must be logged in to perform this action.");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    const result = await saveContactMessage(formData);

    if (result.success) {
      setSubmitted(true);
      setFormData({ firstName: "", lastName: "", email: "", message: "" });
    } else {
      setError(result.error || "An unexpected error occurred.");
    }
    
    setIsSubmitting(false);
  };

  return (
    <main className="min-h-screen bg-background pt-24 pb-16">
      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16">
          {/* Contact Info Panel */}
          <div>
            <span className="text-primary font-medium tracking-widest uppercase text-sm mb-4 block">
              Get In Touch
            </span>
            <h1 className="text-4xl md:text-5xl font-serif text-foreground mb-6">
              We'd Love to Hear From You
            </h1>
            <p className="text-foreground/70 text-lg leading-relaxed mb-10">
              Calculated questions, partnership inquiries, or just want to say hello?
              Fill out the form or reach us via email or phone.
            </p>

            <div className="space-y-8">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-secondary/20 flex items-center justify-center flex-shrink-0">
                  <Mail className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-serif text-lg text-foreground mb-1">Email</h3>
                  <a href="mailto:hello@tulecereals.com" className="block text-foreground/60 hover:text-primary transition-colors">
                    hello@tulecereals.com
                  </a>
                  <a href="mailto:support@tulecereals.com" className="block text-foreground/60 hover:text-primary transition-colors">
                    support@tulecereals.com
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-secondary/20 flex items-center justify-center flex-shrink-0">
                  <Phone className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-serif text-lg text-foreground mb-1">Phone</h3>
                  <a href="tel:+15551234567" className="block text-foreground/60 hover:text-primary transition-colors">
                    +1 (555) 123-4567
                  </a>
                </div>
              </div>


              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-secondary/20 flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-serif text-lg text-foreground mb-1">Office</h3>
                  <p className="text-foreground/60">123 Harvest Lane</p>
                  <p className="text-foreground/60">Portland, OR 97204</p>
                </div>
              </div>
            </div>
          </div>

          {/* Form / Auth Guard State Container */}
          <div className="bg-white p-8 md:p-10 rounded-sm shadow-sm border border-secondary/20 flex flex-col justify-center min-h-[400px]">
            {!isLoggedIn ? (
              /* Unauthorized Guard View */
              <div className="text-center py-8 animate-in fade-in duration-300">
                <div className="w-14 h-14 bg-secondary/20 rounded-full flex items-center justify-center mx-auto mb-5">
                  <Lock className="w-6 h-6 text-foreground/70" />
                </div>
                <h3 className="text-xl font-serif text-foreground mb-2">
                  Authentication Required
                </h3>
                <p className="text-foreground/60 max-w-sm mx-auto mb-8 text-sm leading-relaxed">
                  To maintain data security and avoid automated spam, please sign in to your account to send us a direct message.
                </p>
                <Link
                  href="/login"
                  className="inline-block bg-primary text-primary-foreground font-medium py-3 px-8 rounded-sm hover:bg-primary/90 transition-colors shadow-sm text-sm"
                >
                  Sign In to Account
                </Link>
              </div>
            ) : submitted ? (
              /* Success State */
              <div className="text-center py-12 animate-in fade-in duration-300">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Send className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-2xl font-serif text-foreground mb-2">Message Sent!</h3>
                <p className="text-foreground/60 max-w-sm mx-auto text-sm">
                  Your entry has been securely stored. We'll review your query and respond shortly.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="mt-8 text-primary hover:text-primary/80 font-medium text-sm outline-none focus-visible:underline"
                >
                  Send another message
                </button>
              </div>
            ) : (
              /* Authenticated Form View */
              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <div className="p-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-sm">
                    {error}
                  </div>
                )}
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label htmlFor="firstName" className="text-sm font-medium text-foreground">
                      First Name
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      required
                      disabled={isSubmitting}
                      className="w-full px-4 py-3 rounded-sm border border-secondary bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all disabled:opacity-60"
                      placeholder="Jane"
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="lastName" className="text-sm font-medium text-foreground">
                      Last Name
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      required
                      disabled={isSubmitting}
                      className="w-full px-4 py-3 rounded-sm border border-secondary bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all disabled:opacity-60"
                      placeholder="Doe"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium text-foreground">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    disabled={isSubmitting}
                    className="w-full px-4 py-3 rounded-sm border border-secondary bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all disabled:opacity-60"
                    placeholder="jane@example.com"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="message" className="text-sm font-medium text-foreground">
                    Message
                  </label>
                  <textarea
                    id="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    disabled={isSubmitting}
                    rows={5}
                    className="w-full px-4 py-3 rounded-sm border border-secondary bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none disabled:opacity-60"
                    placeholder="How can we help you?"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-primary text-primary-foreground font-medium py-3 px-6 rounded-sm hover:bg-primary/90 transition-colors shadow-sm flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Saving Entry...
                    </>
                  ) : (
                    "Send Message"
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}