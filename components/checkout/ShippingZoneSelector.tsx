"use client";

import { useState, useMemo } from "react";
import { ShippingZone } from "@/services/shippingzones";
import { formatCurrency } from "@/components/dashboard/utils";
import { Truck, Search, Check, Clock } from "lucide-react";

interface ShippingZoneSelectorProps {
  zones: ShippingZone[];
  selectedZoneCode: string;
  onSelect: (code: string) => void;
  isLoading: boolean;
}

export default function ShippingZoneSelector({
  zones,
  selectedZoneCode,
  onSelect,
  isLoading,
}: ShippingZoneSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredZones = useMemo(() => {
    if (!searchQuery) return zones;
    const lowerQuery = searchQuery.toLowerCase();
    return zones.filter(
      (z) =>
        z.name.toLowerCase().includes(lowerQuery) ||
        z.description.toLowerCase().includes(lowerQuery),
    );
  }, [zones, searchQuery]);

  const selectedZone = zones.find(
    (z) => z.zone_code === selectedZoneCode,
  );

  return (
    <div className="relative">
      {/* Selected State / Trigger */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full text-left p-4 rounded-md border transition-all flex items-center gap-3 ${
          isOpen
            ? "border-primary ring-1 ring-primary"
            : "border-input hover:border-primary/50"
        } ${!selectedZone ? "text-muted-foreground" : "text-foreground"}`}
      >
        <Truck
          className={`w-5 h-5 ${selectedZone ? "text-primary" : ""}`}
        />
        <div className="flex-1 text-sm">
          {selectedZone ? (
            <div>
              <div className="font-medium text-foreground">
                {selectedZone.name}
              </div>
              <div className="text-xs text-muted-foreground line-clamp-1">
                {selectedZone.description}
              </div>
            </div>
          ) : (
            <span>
              {isLoading ? "Loading zones..." : "Select a Shipping Zone"}
            </span>
          )}
        </div>
        {selectedZone && (
          <div className="text-right hidden sm:block">
            <div className="text-sm font-medium text-primary">
              {formatCurrency(
                parseFloat(selectedZone.delivery_cost),
                "KES",
              )}
            </div>
          </div>
        )}
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute z-10 mt-2 w-full bg-background border border-border rounded-md shadow-lg max-h-80 flex flex-col animate-in fade-in zoom-in-95 duration-200">
          {/* Search Bar */}
          <div className="p-3 border-b border-border sticky top-0 bg-background">
            <div className="relative border rounded-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search zones..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-secondary/10 border-transparent rounded-sm focus:bg-background focus:ring-1 focus:ring-primary outline-none transition-all text-sm"
                autoFocus
              />
            </div>
          </div>

          {/* List */}
          <div className="overflow-y-auto flex-1 p-1">
            {filteredZones.length === 0 ? (
              <div className="p-4 text-center text-sm text-muted-foreground">
                No shipping zones found.
              </div>
            ) : (
              filteredZones.map((zone) => (
                <button
                  key={zone.zone_code}
                  onClick={() => {
                    onSelect(zone.zone_code);
                    setIsOpen(false);
                    setSearchQuery("");
                  }}
                  className={`w-full text-left p-3 rounded-sm flex items-start gap-3 transition-colors ${
                    selectedZoneCode === zone.zone_code
                      ? "bg-primary/5"
                      : "hover:bg-secondary/10"
                  }`}
                >
                  <div
                    className={`mt-0.5 w-4 h-4 border rounded-full flex items-center justify-center ${
                      selectedZoneCode === zone.zone_code
                        ? "border-primary"
                        : "border-muted-foreground"
                    }`}
                  >
                    {selectedZoneCode === zone.zone_code && (
                      <div className="w-2 h-2 bg-primary rounded-full" />
                    )}
                  </div>

                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <span className="font-medium text-sm text-foreground">
                        {zone.name}
                      </span>
                      <span className="text-sm font-medium text-primary">
                        {formatCurrency(
                          parseFloat(zone.delivery_cost),
                          "KES",
                        )}
                      </span>
                    </div>
                    <div className="text-xs text-muted-foreground mt-0.5">
                      {zone.description}
                    </div>
                    {zone.estimated_delivery_days > 0 && (
                      <div className="flex items-center gap-1 mt-1.5 text-xs text-muted-foreground">
                        <Clock className="w-3 h-3" />
                        <span>
                          ETA: {zone.estimated_delivery_days} day(s)
                        </span>
                      </div>
                    )}
                  </div>
                </button>
              ))
            )}
          </div>
        </div>
      )}

      {/* Selected Details (Below) */}
      {selectedZone && (
        <div className="mt-3 p-4 bg-secondary/5 rounded-sm border border-border/50 text-sm">
          <div className="flex justify-between items-center mb-2">
            <span className="text-muted-foreground">Delivery Cost:</span>
            <span className="font-medium">
              {formatCurrency(
                parseFloat(selectedZone.delivery_cost),
                "KES",
              )}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Estimated Delivery:</span>
            <span className="font-medium">
              {selectedZone.estimated_delivery_days > 0
                ? `${selectedZone.estimated_delivery_days} Day(s)`
                : "Standard Shipping"}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
