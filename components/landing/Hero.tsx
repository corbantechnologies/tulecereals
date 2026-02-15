import Image from "next/image";
import Link from "next/link";

export default function Hero() {
    return (
        <section className="relative overflow-hidden bg-background">
            <div className="container mx-auto px-6 py-12 md:py-24 flex flex-col md:flex-row items-center">

                {/* Text Content */}
                <div className="md:w-1/2 md:pr-12 text-center md:text-left z-10">
                    <span className="inline-block py-1 px-3 border border-secondary text-primary text-xs tracking-widest uppercase mb-6 rounded-sm">
                        Fresh Harvest 2026
                    </span>
                    <h1 className="text-4xl md:text-6xl font-serif text-foreground leading-tight mb-6">
                        Start Your Day <br />
                        <span className="italic text-primary">The Natural Way</span>
                    </h1>
                    <p className="text-foreground/70 text-lg mb-8 max-w-md mx-auto md:mx-0 leading-relaxed font-light">
                        Wholesome cereals and premium grains sourced from the finest farms.
                        Nourish your body with nature&apos;s best energy.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                        <Link
                            href="/shop"
                            className="px-8 py-3 bg-foreground text-background hover:bg-primary hover:text-white transition-all duration-300 font-medium"
                        >
                            Shop Collection
                        </Link>
                        <Link
                            href="/about"
                            className="px-8 py-3 bg-transparent border border-foreground text-foreground hover:border-primary hover:text-primary transition-all duration-300 font-medium"
                        >
                            Learn More
                        </Link>
                    </div>
                </div>

                {/* Image Content */}
                <div className="md:w-1/2 mt-12 md:mt-0 relative">
                    <div className="relative aspect-[4/3] w-full max-w-lg mx-auto">
                        {/* Decorative background element */}
                        <div className="absolute -top-4 -right-4 w-full h-full border-2 border-primary/30 z-0 hidden md:block" />

                        <div className="relative h-full w-full bg-secondary/20 z-10 overflow-hidden">
                            <Image
                                src="/images/hero.svg"
                                alt="Wholesome Cereals Collection"
                                fill
                                className="object-cover hover:scale-105 transition-transform duration-700"
                                priority
                            />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
