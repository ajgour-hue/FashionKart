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

    return (
        <div className="relative" ref={menuRef}>
            <button
                onClick={() => setOpen(!open)}
                className="w-9 h-9 rounded-full bg-neutral-100 flex items-center justify-center hover:bg-neutral-200 transition"
            >
                <i className="ri-user-3-line text-lg text-neutral-600"></i>
            </button>

            {open && (
                <div className="absolute right-0 mt-2 w-56 py-2 rounded-xl bg-white border border-neutral-200 shadow-lg z-50">

                    <div className="px-4 py-3 border-b border-neutral-100">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center shrink-0">
                                <i className="ri-user-3-line text-lg text-neutral-500"></i>
                            </div>
                            <div className="min-w-0">
                                <p className="text-sm font-medium text-neutral-900 truncate">
                                    {user?.fullname}
                                </p>
                                <p className="text-xs text-neutral-500 truncate">
                                    {user?.email}
                                </p>
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={onLogout}
                        className="w-full flex items-center gap-2 text-left px-4 py-2.5 mt-1 text-sm text-neutral-600 hover:bg-neutral-50 hover:text-black transition"
                    >
                        <i className="ri-logout-box-r-line text-base"></i>
                        Logout
                    </button>
                </div>
            )}
        </div>
    );
};

export default ProfileMenu;