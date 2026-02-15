"use client";

import { useState, useMemo } from "react";
import { PickupStation } from "@/services/pickupstations";
import { formatCurrency } from "@/components/dashboard/utils";
import { MapPin, Search, Check, Clock } from "lucide-react";

interface PickupStationSelectorProps {
  stations: PickupStation[];
  selectedStationCode: string;
  onSelect: (code: string) => void;
  isLoading: boolean;
}

export default function PickupStationSelector({
  stations,
  selectedStationCode,
  onSelect,
  isLoading,
}: PickupStationSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredStations = useMemo(() => {
    if (!searchQuery) return stations;
    const lowerQuery = searchQuery.toLowerCase();
    return stations.filter(
      (s) =>
        s.name.toLowerCase().includes(lowerQuery) ||
        s.location.toLowerCase().includes(lowerQuery) ||
        s.city.toLowerCase().includes(lowerQuery),
    );
  }, [stations, searchQuery]);

  const selectedStation = stations.find(
    (s) => s.station_code === selectedStationCode,
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
        } ${!selectedStation ? "text-muted-foreground" : "text-foreground"}`}
      >
        <MapPin
          className={`w-5 h-5 ${selectedStation ? "text-primary" : ""}`}
        />
        <div className="flex-1">
          {selectedStation ? (
            <div>
              <div className="font-medium text-foreground">
                {selectedStation.name}
              </div>
              <div className="text-sm text-muted-foreground">
                {selectedStation.location}, {selectedStation.city}
              </div>
            </div>
          ) : (
            <span>
              {isLoading ? "Loading stations..." : "Select a Pickup Station"}
            </span>
          )}
        </div>
        {selectedStation && (
          <div className="text-right hidden sm:block">
            <div className="text-sm font-medium text-primary">
              {formatCurrency(
                parseFloat(selectedStation.cost_to_customer),
                selectedStation.shop_details?.currency || "KES",
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
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search by name, location, or city..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-secondary/10 border-transparent rounded-sm focus:bg-background focus:ring-1 focus:ring-primary outline-none transition-all text-sm"
                autoFocus
              />
            </div>
          </div>

          {/* List */}
          <div className="overflow-y-auto flex-1 p-1">
            {filteredStations.length === 0 ? (
              <div className="p-4 text-center text-sm text-muted-foreground">
                No stations found.
              </div>
            ) : (
              filteredStations.map((station) => (
                <button
                  key={station.station_code}
                  onClick={() => {
                    onSelect(station.station_code);
                    setIsOpen(false);
                    setSearchQuery("");
                  }}
                  className={`w-full text-left p-3 rounded-sm flex items-start gap-3 transition-colors ${
                    selectedStationCode === station.station_code
                      ? "bg-primary/5"
                      : "hover:bg-secondary/10"
                  }`}
                >
                  <div
                    className={`mt-0.5 w-4 h-4 border rounded-full flex items-center justify-center ${
                      selectedStationCode === station.station_code
                        ? "border-primary"
                        : "border-muted-foreground"
                    }`}
                  >
                    {selectedStationCode === station.station_code && (
                      <div className="w-2 h-2 bg-primary rounded-full" />
                    )}
                  </div>

                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <span className="font-medium text-sm text-foreground">
                        {station.name}
                      </span>
                      <span className="text-sm font-medium text-primary">
                        {formatCurrency(
                          parseFloat(station.cost_to_customer),
                          station.shop_details?.currency || "KES",
                        )}
                      </span>
                    </div>
                    <div className="text-xs text-muted-foreground mt-0.5">
                      {station.location}, {station.city}
                    </div>
                    {station.estimated_delivery_days > 0 && (
                      <div className="flex items-center gap-1 mt-1.5 text-xs text-muted-foreground">
                        <Clock className="w-3 h-3" />
                        <span>
                          Available in {station.estimated_delivery_days} day(s)
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
      {selectedStation && (
        <div className="mt-3 p-4 bg-secondary/5 rounded-sm border border-border/50 text-sm">
          <div className="flex justify-between items-center mb-2">
            <span className="text-muted-foreground">Delivery Cost:</span>
            <span className="font-medium">
              {formatCurrency(
                parseFloat(selectedStation.cost_to_customer),
                selectedStation.shop_details?.currency || "KES",
              )}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Estimated Delivery:</span>
            <span className="font-medium">
              {selectedStation.estimated_delivery_days > 0
                ? `${selectedStation.estimated_delivery_days} Day(s)`
                : "Standard Delivery"}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
