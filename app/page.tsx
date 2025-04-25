'use client';

import { useRouter } from 'next/navigation';

export default function HomePage() {
  const router = useRouter();

  const handleSelectRole = (role: 'volunteers' | 'admin') => {
    router.push(`/${role}`);
  };

  return (
    <div className="flex flex-col items-center justify-center h-full w-full p-8">
      <h1 className="text-4xl font-bold mb-6 text-center">Welcome to KIDSU</h1>
      <p className="text-lg mb-10 text-center text-gray-600">
        Please select your role to continue:
      </p>

      <div className="flex flex-col sm:flex-row gap-6">
        <button
          onClick={() => handleSelectRole('volunteers')}
          className="bg-[#09111e] text-white px-6 py-4 rounded-2xl shadow hover:bg-[#0a1b26] transition"
        >
          Continue as Volunteer
        </button>

        <button
          onClick={() => handleSelectRole('admin')}
          className="bg-[#09111e] text-white px-6 py-4 rounded-2xl shadow hover:bg-[#0a1b26] transition"
        >
          Continue as Admin
        </button>
      </div>
    </div>
  );
}
