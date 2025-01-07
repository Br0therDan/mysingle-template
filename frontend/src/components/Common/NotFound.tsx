"use client";

import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center h-screen text-center gap-4">
      <h1 className="text-[6rem] font-bold text-primary leading-tight">404</h1>
      <p className="text-lg">Oops! Page not found.</p>
      <Button variant="outline" asChild>
        <Link to="/">Go back</Link>
      </Button>
    </div>
  );
}
