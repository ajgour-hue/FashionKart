import React, { useState, useRef, useEffect } from "react";

const ProfileMenu = ({ user, onLogout }) => {
    const [open, setOpen] = useState(false);
    const menuRef = useRef(null);

    // Outside click par dropdown close ho jaye
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (menuRef.current && !menuRef.current.contains(e.target)) {
                setOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Fullname se initials nikalna (e.g. "Rohan Sharma" -> "RS")
    const initials = user?.fullname
        ?.split(" ")
        .map((n) => n[0])
        .slice(0, 2)
        .join("")
        .toUpperCase();

    return (
        <div className="relative" ref={menuRef}>
            <button
                onClick={() => setOpen(!open)}
                className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-medium transition-opacity hover:opacity-80"
                style={{ backgroundColor: "#C9A96E", color: "#1b1c1a" }}
            >
                {initials}
            </button>

            {open && (
                <div
                    className="absolute right-0 mt-2 w-44 py-2 z-50"
                    style={{
                        backgroundColor: "#fbf9f6",
                        border: "1px solid #d0c5b5",
                        borderRadius: "4px",
                    }}
                >
                    <div
                        className="px-4 py-2 text-sm border-b"
                        style={{ color: "#1b1c1a", borderColor: "#d0c5b5" }}
                    >
                        {user?.fullname}
                    </div>
                    <button
                        onClick={onLogout}
                        className="w-full text-left px-4 py-2 text-sm hover:opacity-80 transition-opacity"
                        style={{ color: "#7A6E63" }}
                    >
                        Logout
                    </button>
                </div>
            )}
        </div>
    );
};

export default ProfileMenu;