import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AuthWrapper = ({ children }: { children: React.ReactNode }) => {
    const navigate = useNavigate();

    useEffect(() => {
        const korisnik = localStorage.getItem("vukan");
        if (!korisnik && window.location.pathname !== '/login') {
            navigate("/login");
        }
    }, [navigate]);

    return <>{children}</>;
};

export default AuthWrapper;
