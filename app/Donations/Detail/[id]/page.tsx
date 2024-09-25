"use client";
import { useParams } from "next/navigation";

export default function DonationDetail() {
  const { id }: { id: string } = useParams();

  return (
    <div>
      <h1>{id}</h1>
    </div>
  );
}
