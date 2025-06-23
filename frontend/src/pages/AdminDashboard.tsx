import React, { useState } from "react";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";

// Mock users and products for demo
const mockUsers = [
  {
    id: 1,
    email: "user1@example.com",
    username: "user1",
    rol: "user",
    bio: "Loves skincare.",
    avatar_url: "https://randomuser.me/api/portraits/women/1.jpg",
    keywords: ["wavy hair", "oily skin", "sensitive skin"],
  },
  {
    id: 2,
    email: "user2@example.com",
    username: "user2",
    rol: "user",
    bio: "Curly hair enthusiast.",
    avatar_url: "https://randomuser.me/api/portraits/men/2.jpg",
    keywords: ["curly hair", "dry scalp"],
  },
];
const mockProducts = [
  { id: 1, nombre: "Serum Vitamina C" },
  { id: 2, nombre: "Champú Nutritivo" },
  { id: 3, nombre: "Aceite de Argan Puro" },
  { id: 4, nombre: "Mascarilla Purificante" },
  { id: 5, nombre: "Protector Solar SPF 50" },
  { id: 6, nombre: "Crema Hidratante Facial" },
];

export default function AdminDashboard() {
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [selectedProduct, setSelectedProduct] = useState<string>("");
  const [recommendMsg, setRecommendMsg] = useState("");
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [newProduct, setNewProduct] = useState({
    nombre: "",
    descripcion: "",
    precio: "",
  });

  // Simulate admin check (replace with real auth check)
  const isAdmin = true;

  if (!isAdmin) return <div>Access denied. Admins only.</div>;

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-purple-800">
        Admin Dashboard
      </h1>
      <div className="flex gap-10">
        {/* User List */}
        <div className="w-1/3 bg-white rounded-lg shadow p-4">
          <h2 className="font-semibold mb-4 text-purple-700">Users</h2>
          <ul className="space-y-3">
            {mockUsers.map((user) => (
              <li key={user.id}>
                <Button
                  variant={selectedUser?.id === user.id ? "default" : "outline"}
                  className="w-full flex items-center gap-2"
                  onClick={() => setSelectedUser(user)}
                >
                  <img
                    src={user.avatar_url}
                    alt="avatar"
                    className="w-7 h-7 rounded-full object-cover border"
                  />
                  <span>{user.username}</span>
                </Button>
              </li>
            ))}
          </ul>
        </div>
        {/* User Profile & Recommend */}
        <div className="flex-1">
          {selectedUser ? (
            <div className="border rounded-lg p-6 bg-white shadow">
              <div className="flex items-center gap-4 mb-4">
                <img
                  src={selectedUser.avatar_url}
                  alt="avatar"
                  className="w-16 h-16 rounded-full object-cover border"
                />
                <div>
                  <h3 className="text-xl font-semibold">
                    {selectedUser.username}{" "}
                    <span className="text-gray-500 text-base">
                      ({selectedUser.email})
                    </span>
                  </h3>
                  <p className="text-sm text-gray-600 mb-1">
                    {selectedUser.bio}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {selectedUser.keywords?.map((kw: string) => (
                      <Badge key={kw} className="bg-purple-100 text-purple-700">
                        {kw}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
              <div className="mb-2">
                <label className="block mb-1 font-medium">
                  Recommend a product:
                </label>
                <select
                  className="border rounded px-2 py-1 w-full"
                  value={selectedProduct}
                  onChange={(e) => setSelectedProduct(e.target.value)}
                >
                  <option value="">Select product</option>
                  {mockProducts.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.nombre}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-2">
                <label className="block mb-1 font-medium">
                  Message (optional):
                </label>
                <textarea
                  className="border rounded w-full px-2 py-1"
                  rows={2}
                  value={recommendMsg}
                  onChange={(e) => setRecommendMsg(e.target.value)}
                />
              </div>
              <Button className="mt-2 w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                Send Recommendation
              </Button>
            </div>
          ) : (
            <div className="text-gray-500 text-center mt-16">
              Select a user to view profile and recommend products.
            </div>
          )}
          <div className="mt-10">
            <Button
              variant="secondary"
              onClick={() => setShowAddProduct((v) => !v)}
            >
              {showAddProduct ? "Cancel" : "Add New Product"}
            </Button>
            {showAddProduct && (
              <form
                className="mt-4 space-y-2 bg-white p-4 rounded-lg shadow"
                onSubmit={(e) => {
                  e.preventDefault(); /* handle add */
                }}
              >
                <input
                  className="border rounded px-2 py-1 w-full"
                  placeholder="Product Name"
                  value={newProduct.nombre}
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, nombre: e.target.value })
                  }
                  required
                />
                <textarea
                  className="border rounded px-2 py-1 w-full"
                  placeholder="Description"
                  value={newProduct.descripcion}
                  onChange={(e) =>
                    setNewProduct({
                      ...newProduct,
                      descripcion: e.target.value,
                    })
                  }
                />
                <input
                  className="border rounded px-2 py-1 w-full"
                  placeholder="Price"
                  type="number"
                  value={newProduct.precio}
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, precio: e.target.value })
                  }
                  required
                />
                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                >
                  Add Product
                </Button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
