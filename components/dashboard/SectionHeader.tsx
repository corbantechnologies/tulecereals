import React from "react";

interface SectionHeaderProps {
  title: string;
  description?: string;
}

const SectionHeader = ({ title, description }: SectionHeaderProps) => (
  <div className="mb-8">
    <h2 className="text-2xl font-serif text-foreground mb-1">{title}</h2>
    {description && <p className="text-sm text-foreground/60">{description}</p>}
  </div>
);

export default SectionHeader;
