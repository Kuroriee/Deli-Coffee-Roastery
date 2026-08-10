import { useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { authApi } from "../lib/api";
import { useAuth } from "../context/AuthContext";

const AuthCallback = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { setUser } = useAuth();
  const hasProcessed = useRef(false);

  useEffect(() => {
    if (hasProcessed.current) return;
    hasProcessed.current = true;

    const hash = location.hash || "";
    const match = hash.match(/session_id=([^&]+)/);
    if (!match) {
      navigate("/login?error=missing_session");
      return;
    }
    const sessionId = decodeURIComponent(match[1]);

    (async () => {
      try {
        const res = await authApi.session(sessionId);
        // clear the fragment so refresh won't reprocess
        window.history.replaceState(null, "", window.location.pathname);
        setUser(res.user);
        navigate("/admin", { replace: true, state: { user: res.user } });
      } catch (e) {
        const detail =
          e?.response?.data?.detail || "Gagal login. Coba ulangi.";
        navigate(`/login?error=${encodeURIComponent(detail)}`, { replace: true });
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F6EFE4]">
      <div className="text-center">
        <div className="h-12 w-12 mx-auto mb-4 border-4 border-[#1B7A43] border-t-transparent rounded-full animate-spin" />
        <div className="font-serif-warm text-xl text-[#3B2412]">Memverifikasi login…</div>
        <div className="text-sm text-[#3B2412]/60 mt-1">Sebentar ya</div>
      </div>
    </div>
  );
};

export default AuthCallback;
