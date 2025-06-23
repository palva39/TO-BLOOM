import React from "react";
import { useAuth } from "../hooks/useAuth";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "../components/ui/button";

export default function UserProfile() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  // Fetch latest user data on mount and when location changes
  const [profile, setProfile] = React.useState(user);
  React.useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await fetch("/api/auth/me", { credentials: "include" });
        const data = await res.json();
        console.log("[DEBUG] /api/auth/me response", data);
        if (data.user) setProfile(data.user);
      } catch (e) {
        console.error("[ERROR] Fetch profile failed", e);
      }
    }
    fetchProfile();
  }, [location.pathname]);
  if (!profile) {
    return (
      <div className="text-center text-gray-400 py-10">Cargando perfil...</div>
    );
  }

  return (
    <div className="max-w-lg mx-auto p-8 bg-white rounded-xl shadow-lg mt-10">
      <h1 className="text-3xl font-bold mb-6 text-center text-pink-600">
        Mi Perfil
      </h1>
      <div className="flex flex-col items-center mb-8">
        <img
          src={profile.avatar_url || "/default-female-avatar.png"}
          alt="avatar"
          className="w-32 h-32 rounded-full object-cover border-4 border-pink-200 shadow-lg ring-4 ring-pink-100 hover:ring-pink-300 transition duration-200 mb-3"
        />
        <Button
          onClick={() => navigate("/profile")}
          className="border-2 border-pink-200 text-pink-700 bg-pink-50 hover:bg-pink-100 hover:border-pink-300 shadow-sm rounded-full px-5 py-2 font-semibold transition-all duration-200 flex items-center gap-2"
        >
          Editar Perfil
        </Button>
      </div>
      <div className="mb-6">
        <h2 className="font-semibold text-purple-700 mb-1">
          Descripción corta
        </h2>
        <p className="text-gray-700 bg-pink-50 rounded-full px-4 py-2 shadow-sm inline-block">
          {profile.description || (
            <span className="italic text-gray-400">Sin descripción.</span>
          )}
        </p>
      </div>
      <div className="mb-6">
        <h2 className="font-semibold text-purple-700 mb-1">Bio</h2>
        <p className="text-gray-700 bg-pink-50 rounded-xl px-4 py-2 shadow-sm">
          {profile.bio || (
            <span className="italic text-gray-400">No bio yet.</span>
          )}
        </p>
      </div>
      <div className="mb-6">
        <h2 className="font-semibold text-purple-700 mb-1">Palabras clave</h2>
        <div className="flex flex-wrap gap-2">
          {profile.preferencias &&
          Array.isArray(JSON.parse(profile.preferencias)) &&
          JSON.parse(profile.preferencias).length > 0 ? (
            JSON.parse(profile.preferencias).map((kw: string) => (
              <span
                key={kw}
                className="bg-pink-200 text-pink-800 px-3 py-1 rounded-full text-xs flex items-center shadow-sm border border-pink-300"
              >
                {kw}
              </span>
            ))
          ) : (
            <span className="italic text-gray-400">No keywords yet.</span>
          )}
        </div>
      </div>
    </div>
  );
}
