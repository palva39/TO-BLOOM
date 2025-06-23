import { useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import api from "../lib/api";

export default function Profile() {
  const { user } = useAuth(); // Remove setUser for compatibility
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [avatar, setAvatar] = useState(user?.avatar_url || "");
  const [bio, setBio] = useState(user?.bio || "");
  const [description, setDescription] = useState(user?.description || "");
  const [keywords, setKeywords] = useState(
    user?.preferencias ? JSON.parse(user.preferencias) : []
  );
  const [newKeyword, setNewKeyword] = useState("");
  const suggestedKeywords = [
    "cabello liso",
    "cabello rizado",
    "cabello ondulado",
    "piel seca",
    "piel grasa",
    "piel mixta",
    "rostro sensible",
    "anti-edad",
    "hidratación",
    "brillo",
    "volumen",
    "acné",
    "manchas",
    "protección solar",
  ];

  // TODO: Add backend integration for saving profile

  const handleAddKeyword = () => {
    if (newKeyword && !keywords.includes(newKeyword)) {
      setKeywords([...keywords, newKeyword]);
      setNewKeyword("");
    }
  };
  const handleRemoveKeyword = (kw: string) => {
    setKeywords(keywords.filter((k: string) => k !== kw));
  };
  const handleSave = async () => {
    setLoading(true);
    setSuccess(false);
    console.log("[DEBUG] Saving profile", {
      avatar_url: avatar,
      bio,
      description,
      preferencias: JSON.stringify(keywords),
    });
    try {
      const res = await api.put("/auth/me", {
        avatar_url: avatar,
        bio,
        description,
        preferencias: JSON.stringify(keywords),
      });
      console.log("[DEBUG] Save response", res);
      setSuccess(true);
      navigate("/me"); // Redirect immediately after save
    } catch (e) {
      console.error("[ERROR] Save profile failed", e);
      // handle error (could add toast)
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white rounded-xl shadow-lg mt-10">
      <Button
        variant="outline"
        onClick={() => navigate("/dashboard")}
        className="mb-6 border-2 border-pink-200 text-pink-700 bg-pink-50 hover:bg-pink-100 hover:border-pink-300 shadow-sm rounded-full px-5 py-2 font-semibold transition-all duration-200 flex items-center gap-2"
      >
        ← Volver al Dashboard
      </Button>
      <h1 className="text-2xl font-bold mb-4 text-center text-purple-700">
        Mi Perfil
      </h1>
      <div className="flex flex-col items-center mb-6">
        <img
          src={avatar || "/default-female-avatar.png"}
          alt="avatar"
          className="w-24 h-24 rounded-full object-cover border-4 border-pink-200 shadow mb-2"
        />
        <Input
          type="url"
          placeholder="URL de tu foto de perfil"
          value={avatar}
          onChange={(e) => setAvatar(e.target.value)}
          className="mt-2 text-center border-pink-200 focus:border-pink-400 bg-pink-50 rounded-full shadow-sm"
        />
      </div>
      <div className="mb-4">
        <h2 className="font-semibold text-purple-700 mb-1">
          Descripción corta
        </h2>
        <Input
          type="text"
          className="border-pink-200 focus:border-pink-400 bg-pink-50 rounded-full shadow-sm"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Ej: Amante del skincare y el cabello saludable"
        />
      </div>
      <div className="mb-4">
        <h2 className="font-semibold text-purple-700 mb-1">Bio</h2>
        <p className="text-gray-700 mb-2">
          <textarea
            className="border rounded-xl w-full px-3 py-2 border-pink-200 focus:border-pink-400 bg-pink-50 shadow-sm"
            rows={3}
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Cuéntanos sobre tu piel, cabello, intereses..."
          />
        </p>
      </div>
      <div className="mb-4">
        <h2 className="font-semibold text-purple-700 mb-1">Palabras clave</h2>
        <div className="flex flex-wrap gap-2 mb-3">
          {suggestedKeywords.map((kw) => (
            <button
              key={kw}
              type="button"
              className={`px-3 py-1 rounded-full text-xs font-medium border transition shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-300 ${
                keywords.includes(kw)
                  ? "bg-pink-400 text-white border-pink-400 hover:bg-pink-500"
                  : "bg-pink-100 text-pink-700 border-pink-200 hover:bg-pink-200"
              }`}
              onClick={() => {
                if (!keywords.includes(kw)) setKeywords([...keywords, kw]);
              }}
            >
              {kw}
            </button>
          ))}
        </div>
        <div className="flex gap-2 mb-3">
          <Input
            value={newKeyword}
            onChange={(e) => setNewKeyword(e.target.value)}
            placeholder="ej. cabello rubio, piel sensible"
            className="border-pink-200 focus:border-pink-400 bg-pink-50 rounded-full shadow-sm"
          />
          <Button
            type="button"
            onClick={handleAddKeyword}
            className="bg-gradient-to-r from-pink-400 to-purple-400 text-white rounded-full shadow-sm hover:from-pink-500 hover:to-purple-500"
          >
            Añadir
          </Button>
        </div>
        <div className="flex flex-wrap gap-2">
          {keywords.length > 0 ? (
            keywords.map((kw: string) => (
              <span
                key={kw}
                className="bg-pink-200 text-pink-800 px-3 py-1 rounded-full text-xs flex items-center shadow-sm border border-pink-300"
              >
                {kw}
                <button
                  className="ml-2 text-red-400 hover:text-red-600 font-bold"
                  onClick={() => handleRemoveKeyword(kw)}
                  aria-label={`Eliminar ${kw}`}
                  type="button"
                >
                  ×
                </button>
              </span>
            ))
          ) : (
            <span className="italic text-gray-400">No keywords yet.</span>
          )}
        </div>
      </div>
      <Button
        className="w-full py-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white text-lg font-semibold rounded-full shadow-lg hover:from-pink-600 hover:to-purple-600 transition"
        onClick={async () => {
          setLoading(true);
          setSuccess(false);
          try {
            await api.put("/auth/me", {
              avatar_url: avatar,
              bio,
              description,
              preferencias: JSON.stringify(keywords),
            });
            setSuccess(true);
            navigate("/me"); // Redirect immediately after save
          } catch (e) {
            // handle error (could add toast)
          } finally {
            setLoading(false);
          }
        }}
        disabled={loading}
      >
        {loading ? "Guardando..." : success ? "¡Guardado!" : "Guardar Perfil"}
      </Button>
    </div>
  );
}
