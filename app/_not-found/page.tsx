"use client";

import Link from "next/link";
import { MoveLeft } from "lucide-react";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";

export default function NotFound() {
    return (
        <div className="min-h-screen bg-background flex flex-col">
            {/* Reusing Navbar for consistency */}
            <Navbar />

            <main className="flex-1 flex flex-col items-center justify-center text-center px-6 py-20 relative overflow-hidden">
                {/* Decorative Background Elements */}
                <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
                <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-secondary/10 rounded-full blur-3xl" />

                <div className="z-10 max-w-lg">
                    <p className="text-sm font-medium text-primary uppercase tracking-widest mb-4">
                        Error 404
                    </p>
                    <h1 className="text-4xl md:text-6xl font-serif text-foreground mb-6">
                        Beauty is everywhere... <br />
                        <span className="italic text-foreground/70 text-3xl md:text-5xl">except on this page.</span>
                    </h1>
                    <p className="text-foreground/60 text-lg mb-10 leading-relaxed">
                        The page you are looking for seems to have faded away or never existed.
                        Let's guide you back to where the glow is.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                        <Link
                            href="/"
                            className="px-8 py-3 bg-foreground text-background hover:bg-primary hover:text-white transition-all duration-300 font-medium rounded-sm flex items-center gap-2 group"
                        >
                            <MoveLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                            Back to Home
                        </Link>
                        <Link
                            href="/shop"
                            className="px-8 py-3 border border-secondary text-foreground hover:border-primary hover:text-primary transition-all duration-300 font-medium rounded-sm"
                        >
                            Browse Collection
                        </Link>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}