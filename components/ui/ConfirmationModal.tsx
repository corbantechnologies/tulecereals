"use client";

import React from "react";
import { AlertTriangle, Loader2 } from "lucide-react";

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  isLoading?: boolean;
  variant?: "danger" | "warning" | "info";
}

export default function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  isLoading = false,
  variant = "danger",
}: ConfirmationModalProps) {
  if (!isOpen) return null;

  const variantStyles = {
    danger: "bg-red-600 hover:bg-red-700 text-white",
    warning: "bg-amber-600 hover:bg-amber-700 text-white",
    info: "bg-primary hover:bg-primary/90 text-primary-foreground",
  };

  const iconStyles = {
    danger: "text-red-600 bg-red-50",
    warning: "text-amber-600 bg-amber-50",
    info: "text-primary bg-primary/10",
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 cursor-default">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/40 backdrop-blur-[2px] animate-in fade-in duration-300" 
        onClick={onClose}
      />
      
      {/* Modal Panel */}
      <div 
        className="relative bg-white w-full max-w-md rounded-xl shadow-2xl overflow-hidden animate-in zoom-in-95 fade-in duration-200 border border-secondary/20"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          <div className="flex items-start gap-4">
            <div className={`p-3 rounded-full flex-shrink-0 ${iconStyles[variant]}`}>
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-serif font-medium text-foreground mb-2">
                {title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {message}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-secondary/5 px-6 py-4 flex flex-col-reverse sm:flex-row sm:justify-end gap-3 border-t border-secondary/10">
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="flex-1 sm:flex-none inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-foreground/70 hover:text-foreground hover:bg-secondary/10 rounded-lg transition-colors disabled:opacity-50"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className={`flex-1 sm:flex-none inline-flex items-center justify-center px-6 py-2 text-sm font-medium rounded-lg shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 ${variantStyles[variant]}`}
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin text-white" />}
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
