import { useEffect, useState, useCallback } from "react";
import { useLocation, Link } from "react-router-dom";
import { LogIn, ShieldCheck, Coffee } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const GOOGLE_CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID;

const LoginPage = () => {
  const { loginWithGoogle } = useAuth();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const [error, setError] = useState(params.get("error"));
  const [ready, setReady] = useState(false);
  const [tokenClient, setTokenClient] = useState(null);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.onload = () => {
      const client = window.google.accounts.oauth2.initTokenClient({
        client_id: GOOGLE_CLIENT_ID,
        scope: "openid email profile",
        callback: async (response) => {
          if (response.error) {
            setError("Login Google gagal atau dibatalkan.");
            return;
          }
          try {
            await loginWithGoogle(response.access_token);
          } catch (err) {
            setError(
              err?.response?.data?.detail ||
                "Login gagal. Pastikan email Anda terdaftar sebagai admin."
            );
          }
        },
      });
      setTokenClient(client);
      setReady(true);
    };
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, [loginWithGoogle]);

  const handleLoginClick = useCallback(() => {
    if (tokenClient) tokenClient.requestAccessToken();
  }, [tokenClient]);

  return (
    <div className="min-h-screen bg-[#F6EFE4] flex items-center justify-center px-5">
      <div className="max-w-md w-full bg-[#FBF6EC] rounded-3xl border border-[#3B2412]/10 p-8 shadow-xl">
        <div className="flex items-center gap-3">
          <span className="h-12 w-12 rounded-full bg-[#3B2412] text-[#F6EFE4] flex items-center justify-center">
            <Coffee className="h-6 w-6" />
          </span>
          <div>
            <div className="font-script text-3xl text-[#3B2412] leading-none">
              Deli Coffee<span className="text-[#C9A227]">*</span>
            </div>
            <div className="text-[10px] tracking-[0.25em] uppercase text-[#3B2412]/60">
              Admin Panel
            </div>
          </div>
        </div>

        <h1 className="font-serif-warm text-3xl text-[#3B2412] mt-6">
          Masuk ke Admin
        </h1>
        <p className="mt-2 text-sm text-[#3B2412]/75">
          Login menggunakan akun Google yang sudah terdaftar. Hanya email yang
          di-whitelist yang bisa mengakses admin panel.
        </p>

        {error && (
          <div className="mt-4 rounded-xl bg-[#7B1F32]/10 border border-[#7B1F32]/30 text-[#7B1F32] text-sm p-3">
            {error}
          </div>
        )}

        <button
          type="button"
          onClick={handleLoginClick}
          disabled={!ready}
          className="btn-primary w-full mt-6 rounded-full h-12 inline-flex items-center justify-center gap-2 font-semibold disabled:opacity-60"
        >
          <LogIn className="h-4 w-4" /> Login dengan Google
        </button>

        <div className="mt-6 flex items-start gap-2 text-xs text-[#3B2412]/70 bg-[#F6EFE4] rounded-xl p-3">
          <ShieldCheck className="h-4 w-4 text-[#1B7A43] mt-0.5" />
          <div>
            Login aman menggunakan Google OAuth. Session bertahan 7 hari dan
            bisa Anda logout kapan saja.
          </div>
        </div>

        <div className="mt-6 text-center">
          <Link to="/" className="text-xs text-[#3B2412]/60 hover:text-[#1B7A43]">
            ← Kembali ke website
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;