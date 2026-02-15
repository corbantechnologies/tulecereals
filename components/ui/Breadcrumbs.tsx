"use client";

import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export default function Breadcrumbs({ items }: { items: BreadcrumbItem[] }) {
  return (
    <nav className="flex mb-6 text-sm text-muted-foreground animate-in fade-in slide-in-from-left-2 duration-300">
      <Link
        href="/"
        className="flex items-center hover:text-primary transition-colors"
      >
        <Home className="w-4 h-4 mr-1" />
        Home
      </Link>
      {items.map((item, index) => (
        <div key={index} className="flex items-center">
          <ChevronRight className="w-4 h-4 mx-2 text-muted-foreground/50" />
          {item.href ? (
            <Link
              href={item.href}
              className="hover:text-primary transition-colors font-medium text-foreground/80 hover:text-foreground"
            >
              {item.label}
            </Link>
          ) : (
            <span className="font-semibold text-primary">{item.label}</span>
          )}
        </div>
      ))}
    </nav>
  );
}
