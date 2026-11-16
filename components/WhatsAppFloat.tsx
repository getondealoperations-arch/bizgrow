"use client";
import { usePathname } from "next/navigation";
import { MessageCircle } from "lucide-react";
import { waLink } from "@/lib/site";

// NEXT_PUBLIC_WHATSAPP is inlined at build time, so waLink works on the client.
export default function WhatsAppFloat() {
  const path = usePathname();
  if (path.startsWith("/admin")) return null;
  const msg = path.startsWith("/services/")
    ? `Hello Bizgrow Solutions, I'd like to enquire about your ${path.split("/")[2].replace(/-/g, " ")} service.`
    : "Hello Bizgrow Solutions, I'd like to discuss growing my business.";
  const href = waLink(msg);
  if (!href) return null; // hidden until a WhatsApp number is configured
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" aria-label="Chat on WhatsApp"
      className="wa-float fixed bottom-4 right-4 z-40 flex h-12 w-12 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition hover:scale-105 sm:bottom-5 sm:right-5 sm:h-14 sm:w-14">
      <MessageCircle className="h-6 w-6 sm:h-7 sm:w-7" />
    </a>
  );
}
