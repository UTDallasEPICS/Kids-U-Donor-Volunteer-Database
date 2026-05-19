
import OrientationList from "@/app/components/orientation/OrientationList";
export default function OrientationPage() {
  return (
    <main className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-4">
          <h1 className="text-2xl font-bold text-[#2f4b7c]">View Orientations</h1>
          <p className="text-sm text-gray-500">Manage scheduled volunteer orientations.</p>
        </div>
        <OrientationList />
      </div>
    </main>
  );
}