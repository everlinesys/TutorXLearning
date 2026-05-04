import { useState } from "react";
import {
  MdNotifications,
  MdSearch,
  MdPerson,
  MdLogout,
  MdMenu,
  MdWallet,
} from "react-icons/md";
import api from "../../shared/api";
import { useNavigate } from "react-router-dom";
import { getUser, logout } from "../../shared/auth";
import { useBranding } from "../../shared/hooks/useBranding";
export default function TeacherHeader({ onMenuClick }) {
  const brand = useBranding();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const user = getUser();
  const [walletOpen, setWalletOpen] = useState(false);
  const [walletData, setWalletData] = useState(null);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };
  async function openWallet() {
    try {
      const res = await api.get("/teacher/dashboard/wallet");
      setWalletData(res.data);
      setWalletOpen(true);
      setOpen(false); // close dropdown
    } catch {
      alert("Failed to load wallet");
    }
  }
  return (
    <header className="h-16 bg-white border-b flex items-center justify-between px-4 md:px-6 shadow-sm">

      {/* ⭐ LEFT SIDE */}
      <div className="flex items-center gap-3">

        {/* MOBILE HAMBURGER */}
        <button
          onClick={onMenuClick}
          className="md:hidden p-2 rounded hover:bg-gray-100"
          style={{ background: brand.colors.accent, borderRadius: 4, color: brand.colors.primary }}
        >
          <MdMenu size={24} />
        </button>

        <h1 className="text-sm md:text-lg font-semibold text-gray-800 flex items-center gap-2" style={{ fontSize: 20 }}>
        <img src="/logo.png" alt="Logo" className="h-8 w-auto" /> Teacher
         {/* {brand.siteName?.toUpperCase() + " Teacher" || "ELearn Teacher"} */}
        </h1>
      </div>

      {/* ⭐ RIGHT SIDE */}
      <div className="flex items-center gap-4 md:gap-6 relative">

        {/* SEARCH */}
        {/* <div className="hidden md:flex items-center bg-gray-100 px-3 py-2 rounded-lg">
          <MdSearch size={18} className="text-gray-500" />
          <input
            type="text"
            placeholder="Search..."
            className="bg-transparent outline-none ml-2 text-sm"
          />
        </div> */}

        {/* NOTIFICATIONS */}
        {/* <button className="relative">
          <MdNotifications size={22} />
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-1.5 rounded-full">
            3
          </span>
        </button> */}

        {/* PROFILE */}
        <div className="relative">
          <button
            onClick={() => setOpen(!open)}
            className="flex items-center gap-2"
            style={{ background: brand.colors.accent, borderRadius: 4, color: brand.colors.primary }}
          >
            <MdPerson size={22} />
            <span className="hidden sm:inline text-sm font-medium">
              {user?.name || "Admin"}
            </span>
          </button>

          {open && (
            <div className="absolute right-0 mt-3 w-44 bg-white border rounded-lg shadow-lg z-50 text-gray-700">
              <button

                className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm"
              >
                Profile
              </button>

              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm flex items-center gap-2"
              >
                <MdLogout size={18} />
                Logout
              </button><button
                onClick={openWallet}
                className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm flex items-center gap-2"
              >
                <MdWallet size={18} />
                Wallet
              </button>
            </div>
          )}
        </div>

      </div>
      {walletOpen && walletData && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 text-gray-800">

            <h3 className="text-xl font-bold mb-4">
              {walletData.name}'s Wallet
            </h3>

            {/* BALANCE */}
            <div className="bg-gray-100 p-4 rounded-xl mb-4">
              <div className="text-sm text-gray-500">Current Balance</div>
              <div className="text-2xl font-bold text-green-600">
                ₹{walletData.balance}
              </div>
            </div>

            {/* SUMMARY */}
            <div className="text-sm space-y-1 mb-4">
              <div>Classes: {walletData.totalClasses}</div>
              <div>Hours: {walletData.totalHours.toFixed(2)}</div>
              <div>Rate: ₹{walletData.rate}/hr</div>
            </div>

            {/* HISTORY */}
            <div className="max-h-40 overflow-y-auto border-t pt-3">
              <div className="font-semibold mb-2 text-sm">Payment History</div>

              {walletData.history?.length === 0 && (
                <div className="text-xs text-gray-500">No payouts yet</div>
              )}

              {walletData.history?.map((h) => (
                <div key={h.id} className="text-sm flex justify-between py-1">
                  <span>
                    {new Date(h.createdAt).toLocaleDateString()}
                  </span>
                  <span className="font-semibold text-green-600">
                    ₹{h.amount}
                  </span>
                </div>
              ))}
            </div>

            {/* ACTION */}
            <button
              onClick={() => setWalletOpen(false)}
              className="mt-4 w-full py-2 bg-gray-200 rounded-lg"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
