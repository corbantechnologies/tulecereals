"use client";

import { Mail, Phone, MapPin, Send } from "lucide-react";
import { useState } from "react";

export default function ContactPage() {
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitted(true);
        // Add logic to handle form submission
    };

    return (
        <main className="min-h-screen bg-background pt-24 pb-16">
            <div className="container mx-auto px-6">
                <div className="grid lg:grid-cols-2 gap-16">
                    {/* Contact Info */}
                    <div>
                        <span className="text-primary font-medium tracking-widest uppercase text-sm mb-4 block">Get In Touch</span>
                        <h1 className="text-4xl md:text-5xl font-serif text-foreground mb-6">We'd Love to Hear From You</h1>
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
                                    <p className="text-foreground/60">hello@tulecereals.com</p>
                                    <p className="text-foreground/60">support@tulecereals.com</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 rounded-full bg-secondary/20 flex items-center justify-center flex-shrink-0">
                                    <Phone className="w-5 h-5 text-primary" />
                                </div>
                                <div>
                                    <h3 className="font-serif text-lg text-foreground mb-1">Phone</h3>
                                    <p className="text-foreground/60">+1 (555) 123-4567</p>
                                    <p className="text-foreground/60">Mon-Fri 9am-6pm EST</p>
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

                    {/* Contact Form */}
                    <div className="bg-white p-8 md:p-10 rounded-sm shadow-sm border border-secondary/20">
                        {submitted ? (
                            <div className="h-full flex flex-col items-center justify-center text-center py-20">
                                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
                                    <Send className="w-8 h-8 text-green-600" />
                                </div>
                                <h3 className="text-2xl font-serif text-foreground mb-2">Message Sent!</h3>
                                <p className="text-foreground/60">Thank you for reaching out. We'll get back to you shortly.</p>
                                <button
                                    onClick={() => setSubmitted(false)}
                                    className="mt-8 text-primary hover:text-primary/80 font-medium"
                                >
                                    Send another message
                                </button>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label htmlFor="firstName" className="text-sm font-medium text-foreground">First Name</label>
                                        <input
                                            type="text"
                                            id="firstName"
                                            required
                                            className="w-full px-4 py-3 rounded-sm border border-secondary bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                                            placeholder="Jane"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label htmlFor="lastName" className="text-sm font-medium text-foreground">Last Name</label>
                                        <input
                                            type="text"
                                            id="lastName"
                                            required
                                            className="w-full px-4 py-3 rounded-sm border border-secondary bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                                            placeholder="Doe"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label htmlFor="email" className="text-sm font-medium text-foreground">Email</label>
                                    <input
                                        type="email"
                                        id="email"
                                        required
                                        className="w-full px-4 py-3 rounded-sm border border-secondary bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                                        placeholder="jane@example.com"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label htmlFor="message" className="text-sm font-medium text-foreground">Message</label>
                                    <textarea
                                        id="message"
                                        required
                                        rows={5}
                                        className="w-full px-4 py-3 rounded-sm border border-secondary bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none"
                                        placeholder="How can we help you?"
                                    ></textarea>
                                </div>

                                <button
                                    type="submit"
                                    className="w-full bg-primary text-primary-foreground font-medium py-3 px-6 rounded-sm hover:bg-primary/90 transition-colors shadow-sm"
                                >
                                    Send Message
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </main>
    );
}
