import { useNavigate } from "react-router-dom";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#fbf9f9] gap-8">
      <h1 className="text-8xl font-extrabold text-black">404</h1>
      <p className="text-xl text-gray-500">Page not found</p>
      <button
        onClick={() => navigate("/")}
        className="bg-black text-white px-8 py-3 border-2 border-black hover:bg-white hover:text-black transition-colors font-bold"
      >
        GO HOME
      </button>
    </div>
  );
}