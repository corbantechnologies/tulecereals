import Link from "next/link";

export default function Hero() {
    return (
        <section className="relative overflow-hidden bg-background py-20">
            <div className="container mx-auto px-4 md:px-6 h-full flex items-center justify-center relative z-20">
                <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
                    <span className="inline-block py-1 px-3 border border-secondary text-primary text-xs tracking-widest uppercase mb-6 rounded-sm bg-white/50 backdrop-blur-sm">
                        Fresh Harvest 2026
                    </span>
                    <h1 className="text-5xl md:text-7xl font-serif text-foreground leading-tight mb-6">
                        Start Your Day <br />
                        <span className="italic text-primary">The Natural Way</span>
                    </h1>
                    <p className="text-foreground/70 text-lg md:text-xl mb-10 max-w-2xl mx-auto leading-relaxed font-light">
                        Wholesome cereals and premium grains sourced from the finest farms.
                        Nourish your body with nature&apos;s best energy.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                            href="/shop"
                            className="px-8 py-4 bg-primary text-primary-foreground text-sm tracking-widest uppercase hover:bg-primary/90 transition-all shadow-md hover:shadow-lg rounded-sm"
                        >
                            Shop Collection
                        </Link>
                        <Link
                            href="/about"
                            className="px-8 py-4 bg-transparent border border-foreground/20 text-foreground text-sm tracking-widest uppercase hover:bg-foreground hover:text-white transition-all rounded-sm"
                        >
                            Our Story
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
}
