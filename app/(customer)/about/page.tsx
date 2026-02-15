"use client";

import Image from "next/image";

export default function AboutPage() {
    return (
        <main className="min-h-screen bg-background">
            {/* Hero Section */}
            <section className="relative h-[400px] flex items-center justify-center bg-secondary/20 overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <Image src="/images/hero.svg" alt="Field of grains" fill className="object-cover opacity-50" />
                </div>
                <div className="relative z-10 text-center px-4">
                    <h1 className="text-4xl md:text-6xl font-serif text-foreground mb-4">Our Story</h1>
                    <p className="text-lg text-foreground/80 max-w-2xl mx-auto">
                        Cultivating goodness from the earth to your bowl.
                    </p>
                </div>
            </section>

            {/* Content Section */}
            <section className="py-16 md:py-24">
                <div className="container mx-auto px-6">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div className="order-2 md:order-1">
                            <div className="relative aspect-square bg-secondary/30 rounded-full overflow-hidden">
                                {/* Placeholder for story image */}
                                <div className="absolute inset-0 flex items-center justify-center text-primary/40 font-serif text-9xl italic">T</div>
                            </div>
                        </div>
                        <div className="order-1 md:order-2">
                            <h2 className="text-3xl font-serif text-foreground mb-6">Rooted in Nature</h2>
                            <div className="space-y-4 text-foreground/70 leading-relaxed">
                                <p>
                                    Tule Cereals began with a simple belief: breakfast should be the most wholesome meal of the day.
                                    Founded in 2026, we set out to reconnect people with the natural energy of whole grains.
                                </p>
                                <p>
                                    We partner directly with farmers who share our commitment to sustainable agriculture.
                                    Every grain is selected for its nutritional value and flavor character.
                                    We don't just sell cereals; we deliver the harvest of the season.
                                </p>
                                <p>
                                    From ancient grains like teff and millet to classic oats and barley, our collection
                                    is a tribute to the diversity of the earth&apos;s bounty.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}
