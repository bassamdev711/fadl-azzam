"use client";

import { usePathname } from "next/navigation";
import type { ComponentProps } from "react";
import Navbar from "@/components/Navbar";

type PublicNavbarProps = ComponentProps<typeof Navbar>;

export default function PublicNavbar(props: PublicNavbarProps) {
  const pathname = usePathname();

  if (pathname === "/admin" || pathname.startsWith("/admin/")) {
    return null;
  }

  return <Navbar {...props} />;
}
