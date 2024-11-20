export default function AddEvent() {
  const Breadcrumb = () => (
    <div className="mb-5 text-sm text-gray-600 flex items-center space-x-2">
      <span className="hover:text-blue-500 cursor-pointer transition-colors duration-200">
        Home
      </span>
      <span className="text-gray-400">/</span>
      <span className="font-semibold text-gray-700">Registration</span>
      <span className="text-gray-400">/</span>
      <span className="font-semibold text-gray-700">Add Event</span>
    </div>
  );

  const Header = () => (
    <div className="flex justify-between items-center mb-5">
      <h1 className="text-2xl font-bold text-gray-800">Add Events Page</h1>
    </div>
  );

  return (
    <div className={"flex font-sans"}>
      <div className="flex-grow p-5">
        <Breadcrumb />
        <Header />
      </div>
    </div>
  );
}
