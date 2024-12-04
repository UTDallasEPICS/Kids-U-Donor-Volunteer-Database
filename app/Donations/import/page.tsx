"use client";
import { useState } from "react";

export default function ImportPage() {
  const [file, setFile] = useState<File | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!file) return;

    const formData = new FormData();
    formData.append("csv", file);

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/csv`, {
      method: "POST",
      body: formData,
    });

    const result = await response.json();
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="file" accept=".csv" onChange={(e) => setFile(e.target.files?.[0] || null)} />
      <button type="submit">Upload</button>
    </form>
  );
}
