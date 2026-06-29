import Link from "next/link";
import { Facebook, Instagram, Twitter, Linkedin } from "lucide-react";

export default function Footer() {
    return (
        <footer className="bg-secondary/30 pt-20 pb-10">
            <div className="container mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">

                    {/* Brand */}
                    <div>
                        <Link href="/" className="text-2xl font-serif font-bold text-foreground mb-6 block">
                            Tule Cereals
                        </Link>
                        <p className="text-foreground/70 mb-6 leading-relaxed">
                            Delivering nature&apos;s finest grains and cereals directly to your table.
                            Wholesome, fresh, and sustainably sourced.
                        </p>
                        <div className="flex gap-4">
                            <a href="#" className="p-2 bg-white rounded-full text-foreground hover:text-primary transition-colors shadow-sm">
                                <Instagram className="w-5 h-5" />
                            </a>
                            <a href="#" className="p-2 bg-white rounded-full text-foreground hover:text-primary transition-colors shadow-sm">
                                <Facebook className="w-5 h-5" />
                            </a>
                            <a href="#" className="p-2 bg-white rounded-full text-foreground hover:text-primary transition-colors shadow-sm">
                                <Twitter className="w-5 h-5" />
                            </a>
                        </div>
                    </div>

                    {/* Links */}
                    <div>
                        <h4 className="font-serif text-lg text-foreground mb-6">Shop</h4>
                        <ul className="space-y-4">
                            <li><Link href="/shop" className="text-foreground/70 hover:text-primary transition-colors">All Products</Link></li>
                            <li><Link href="/shop?category=grains" className="text-foreground/70 hover:text-primary transition-colors">Grains</Link></li>
                            <li><Link href="/shop?category=cereals" className="text-foreground/70 hover:text-primary transition-colors">Cereals</Link></li>
                        </ul>
                    </div>

                    {/* Links */}
                    <div>
                        <h4 className="font-serif text-lg text-foreground mb-6">Company</h4>
                        <ul className="space-y-4">
                            <li><Link href="/about" className="text-foreground/70 hover:text-primary transition-colors">Our Story</Link></li>
                             <li><Link href="/sustainability" className="text-foreground/70 hover:text-primary transition-colors">Sustainability</Link></li>
                            <li><Link href="/careers" className="text-foreground/70 hover:text-primary transition-colors">Careers</Link></li>
                            <li><Link href="/contact" className="text-foreground/70 hover:text-primary transition-colors">Contact Us</Link></li> 
                        </ul>
                    </div>

                    {/* Newsletter */}
                    <div>
                        <h4 className="font-serif text-lg text-foreground mb-6">Farm Fresh News</h4>
                        <p className="text-foreground/70 mb-4">
                            Subscribe to receive updates, access to exclusive deals, and more.
                        </p>
                        <form className="flex flex-col gap-3">
                            <input
                                type="email"
                                placeholder="Your email address"
                                className="px-4 py-3 bg-white border border-secondary focus:outline-none focus:border-primary w-full"
                            />
                            <button className="px-4 py-3 bg-foreground text-background hover:bg-primary hover:text-white transition-colors font-medium">
                                Subscribe
                            </button>
                        </form>
                    </div>
                </div>

                <div className="border-t border-secondary/50 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-foreground/60">
                    <p>© 2026 Tule Cereals. All rights reserved.</p>
                    <div className="flex gap-6 mt-4 md:mt-0">
                        <Link href="/privacy" className="hover:text-primary">Privacy Policy</Link>
                        <Link href="/terms" className="hover:text-primary">Terms of Service</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
