"use client";

import React, { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { X } from "lucide-react";

interface VendorModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  maxWidth?: string;
}

export default function VendorModal({
  isOpen,
  onClose,
  title,
  children,
  maxWidth = "max-w-md",
}: VendorModalProps) {
  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/25 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto w-full">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel
                className={`w-full ${maxWidth} transform overflow-hidden rounded-md bg-white p-6 text-left align-middle shadow-xl transition-all border border-secondary/20`}
              >
                <div className="flex items-center justify-between mb-6 border-b border-secondary/10 pb-4">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-serif font-medium leading-6 text-foreground"
                  >
                    {title}
                  </Dialog.Title>
                  <button
                    type="button"
                    className="rounded-full p-1 text-foreground/50 hover:bg-secondary/10 hover:text-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-primary"
                    onClick={onClose}
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <div className="mt-2 text-sm text-foreground/80">
                  {children}
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
