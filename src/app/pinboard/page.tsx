import { Metadata } from "next";
import { Suspense } from "react";
import PinboardClient from "./pinboard-client";

export const metadata: Metadata = {
  title: "Pinboard — GigLog",
  description: "Concert photos for inspiration on GigLog",
};

export default function Page() {
  return (
    <Suspense>
      <PinboardClient />
    </Suspense>
  );
}
