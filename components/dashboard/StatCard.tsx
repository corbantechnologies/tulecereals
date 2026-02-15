import React from "react";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  loading?: boolean;
}

const StatCard = ({ title, value, icon: Icon, loading }: StatCardProps) => (
  <div className="bg-white border border-secondary/30 p-6 rounded-sm shadow-sm flex items-start justify-between group hover:border-primary/50 transition-all duration-300">
    <div>
      <p className="text-[10px] uppercase tracking-widest text-primary mb-1 font-medium">
        {title}
      </p>
      {loading ? (
        <div className="h-8 w-16 bg-secondary/20 animate-pulse rounded-sm mt-1" />
      ) : (
        <h3 className="text-3xl font-serif text-foreground">{value}</h3>
      )}
    </div>
    <div className="p-2 bg-secondary/10 rounded-full group-hover:bg-primary/10 transition-colors">
      <Icon className="w-5 h-5 text-primary" />
    </div>
  </div>
);

export default StatCard;
