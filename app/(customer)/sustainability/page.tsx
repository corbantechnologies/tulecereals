"use client";

import { Leaf, Award, Recycle } from "lucide-react";

export default function SustainabilityPage() {
    return (
        <main className="min-h-screen bg-background pt-24 pb-16">
            <div className="container mx-auto px-6">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <span className="text-primary font-medium tracking-widest uppercase text-sm mb-4 block">Our Commitment</span>
                    <h1 className="text-4xl md:text-5xl font-serif text-foreground mb-6">Growing for Tomorrow</h1>
                    <p className="text-foreground/70 text-lg leading-relaxed">
                        At Tule Cereals, we believe that healthy food starts with a healthy planet.
                        We are dedicated to sustainable practices that nourish both our community and the earth.
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8 mb-20">
                    <Card
                        icon={<Leaf className="w-8 h-8 text-primary" />}
                        title="Regenerative Farming"
                        description="We support farmers who use techniques that improve soil health and increase biodiversity."
                    />
                    <Card
                        icon={<Recycle className="w-8 h-8 text-primary" />}
                        title="Eco-Friendly Packaging"
                        description="Our boxes are 100% recyclable and printed with vegetable-based inks. We are working towards zero-waste."
                    />
                    <Card
                        icon={<Award className="w-8 h-8 text-primary" />}
                        title="Ethical Sourcing"
                        description="Fair trade is non-negotiable. We ensure that every hand involved in our harvest is treated with dignity and respect."
                    />
                </div>

                <div className="bg-secondary/20 rounded-2xl p-8 md:p-12 text-center">
                    <h2 className="text-2xl font-serif text-foreground mb-4">Join Our Journey</h2>
                    <p className="text-foreground/70 max-w-2xl mx-auto mb-8">
                        Every purchase supports a network of small-scale farmers and contributes to our soil regeneration fund.
                    </p>
                </div>
            </div>
        </main>
    );
}

function Card({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
    return (
        <div className="bg-white p-8 rounded-sm shadow-sm border border-secondary/20 hover:border-primary/50 transition-colors">
            <div className="mb-6 bg-secondary/10 w-16 h-16 rounded-full flex items-center justify-center">
                {icon}
            </div>
            <h3 className="text-xl font-serif text-foreground mb-3">{title}</h3>
            <p className="text-foreground/60 leading-relaxed">{description}</p>
        </div>
    )
}
