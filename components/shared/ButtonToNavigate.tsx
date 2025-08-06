'use client';
import { Navigation } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";


interface ButtonNavigateProps {
  className?: string;
  id?: string;
  url: string;
  children: React.ReactNode;
  icon?: React.ReactNode;
}

export const ButtonNavigate = ({ className, id, url, children, icon }: ButtonNavigateProps) => {
  return (
    <Link
      id={id}
      href={url}
      className={cn(
        "button-styles-main",
        className
      )}
    >
      {icon ? icon : <Navigation />}

      <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
        {children}
      </span>
    </Link>
  );
};