

const Breadcrumb = () => (
    <div className="mb-5 text-sm text-gray-600 flex items-center space-x-2">
      <span className="hover:text-blue-500 cursor-pointer transition-colors duration-200">
        Home
      </span>
      <span className="text-gray-400">/</span>
      <span className="font-semibold text-gray-700">Checkin : Checkout</span>
    </div>
  );

export default function Checkinout() {
    return (
        
      <div>
        <Breadcrumb />
        <h1 className="text-2xl font-semibold text-gray-800">Check-In/Out</h1>
        <button className="bg-blue-500 text-white rounded-sm p-1">
        Check-In
      </button>
      <button className="bg-blue-500 text-white rounded-sm p-1">
        Check-Out
      </button>
      </div>
    );
  }
  