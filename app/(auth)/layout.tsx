import React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col justify-center bg-background px-4 py-12 sm:px-6 lg:px-8">
      <div className="absolute top-6 left-6">
        <Button asChild variant="ghost" size="sm" className="text-xs text-muted-foreground">
          <Link href="/">
            <ArrowLeft className="mr-1.5 h-4 w-4" />
            Kembali ke Beranda
          </Link>
        </Button>
      </div>
      <div className="sm:mx-auto sm:w-full sm:max-w-md">{children}</div>
    </div>
  );
}
