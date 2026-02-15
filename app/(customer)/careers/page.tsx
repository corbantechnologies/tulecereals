"use client";

import Link from "next/link";
import { ArrowRight, MapPin, Clock } from "lucide-react";

export default function CareersPage() {
    return (
        <main className="min-h-screen bg-background pt-24 pb-16">
            <div className="container mx-auto px-6">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <span className="text-primary font-medium tracking-widest uppercase text-sm mb-4 block">Join Our Team</span>
                    <h1 className="text-4xl md:text-5xl font-serif text-foreground mb-6">Grow With Us</h1>
                    <p className="text-foreground/70 text-lg leading-relaxed">
                        We are always looking for passionate individuals who share our love for wholesome food
                        and sustainable living. Help us bring the harvest to the world.
                    </p>
                </div>

                <div className="grid gap-6 max-w-4xl mx-auto">
                    {/* Job Listing 1 */}
                    <div className="bg-white p-8 rounded-sm border border-secondary/20 hover:border-primary/30 transition-all flex flex-col md:flex-row justify-between items-start md:items-center gap-6 group">
                        <div>
                            <h3 className="text-xl font-serif font-bold text-foreground mb-2 group-hover:text-primary transition-colors">Digital Marketing Manager</h3>
                            <div className="flex flex-wrap gap-4 text-sm text-foreground/60">
                                <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> Remote / New York</span>
                                <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> Full-time</span>
                            </div>
                        </div>
                        <Link href="#" className="px-6 py-2 border border-foreground/10 rounded-full text-foreground/80 hover:bg-primary hover:text-white hover:border-primary transition-all flex items-center gap-2">
                            Apply Now <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>

                    {/* Job Listing 2 */}
                    <div className="bg-white p-8 rounded-sm border border-secondary/20 hover:border-primary/30 transition-all flex flex-col md:flex-row justify-between items-start md:items-center gap-6 group">
                        <div>
                            <h3 className="text-xl font-serif font-bold text-foreground mb-2 group-hover:text-primary transition-colors">Supply Chain Coordinator</h3>
                            <div className="flex flex-wrap gap-4 text-sm text-foreground/60">
                                <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> Chicago, IL</span>
                                <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> Full-time</span>
                            </div>
                        </div>
                        <Link href="#" className="px-6 py-2 border border-foreground/10 rounded-full text-foreground/80 hover:bg-primary hover:text-white hover:border-primary transition-all flex items-center gap-2">
                            Apply Now <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>

                    {/* Job Listing 3 */}
                    <div className="bg-white p-8 rounded-sm border border-secondary/20 hover:border-primary/30 transition-all flex flex-col md:flex-row justify-between items-start md:items-center gap-6 group">
                        <div>
                            <h3 className="text-xl font-serif font-bold text-foreground mb-2 group-hover:text-primary transition-colors">Customer Experience Specialist</h3>
                            <div className="flex flex-wrap gap-4 text-sm text-foreground/60">
                                <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> Remote</span>
                                <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> Part-time</span>
                            </div>
                        </div>
                        <Link href="#" className="px-6 py-2 border border-foreground/10 rounded-full text-foreground/80 hover:bg-primary hover:text-white hover:border-primary transition-all flex items-center gap-2">
                            Apply Now <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>
                </div>
            </div>
        </main>
    );
}
