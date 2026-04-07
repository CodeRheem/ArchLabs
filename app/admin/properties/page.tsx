"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AdminSidebar from "@/components/AdminSidebar";

type Property = {
  id: string;
  title: string;
  type: string;
  price: number;
  location: string;
  bedrooms: number;
  bathrooms: number;
  area: number;
  coverImage: string;
  description: string;
  status: "available" | "sold";
  featured: boolean;
  createdAt: string;
};

const emptyForm = {
  title: "",
  type: "apartment",
  price: "",
  location: "",
  bedrooms: "",
  bathrooms: "",
  area: "",
  coverImage: "",
  description: "",
  status: "available",
  featured: false,
};

export default function AdminPropertiesPage() {
  const router = useRouter();
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchProperties();
  }, []);

  async function fetchProperties() {
    try {
      const res = await fetch("/api/properties/all");
      if (res.status === 401) return router.push("/admin/login");
      const data = await res.json();
      setProperties(Array.isArray(data) ? data : []);
    } catch {
      setError("Failed to load properties.");
    } finally {
      setLoading(false);
    }
  }

  function handleEdit(property: Property) {
    setEditingId(property.id);
    setForm({
      title: property.title,
      type: property.type,
      price: String(property.price),
      location: property.location,
      bedrooms: String(property.bedrooms),
      bathrooms: String(property.bathrooms),
      area: String(property.area),
      coverImage: property.coverImage,
      description: property.description,
      status: property.status,
      featured: property.featured,
    });
    setShowForm(true);
  }

  function handleAddNew() {
    setEditingId(null);
    setForm(emptyForm);
    setShowForm(true);
  }

  // Validation function
  function validateForm(): string | null {
    if (!form.title.trim()) return "Title is required";
    if (!form.location.trim()) return "Location is required";
    if (!form.description.trim()) return "Description is required";
    if (!form.coverImage.trim()) return "Cover image URL is required";
    
    const price = parseFloat(form.price);
    if (isNaN(price) || price <= 0) return "Price must be a positive number";
    
    const bedrooms = parseInt(form.bedrooms);
    if (isNaN(bedrooms) || bedrooms < 0) return "Bedrooms must be a non-negative number";
    
    const bathrooms = parseInt(form.bathrooms);
    if (isNaN(bathrooms) || bathrooms < 0) return "Bathrooms must be a non-negative number";
    
    const area = parseFloat(form.area);
    if (isNaN(area) || area <= 0) return "Area must be a positive number";
    
    return null;
  }

  async function handleSubmit() {
    setError("");

    // Validate form first
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setSubmitting(true);

    const payload = {
      title: form.title.trim(),
      type: form.type,
      price: parseFloat(form.price),
      location: form.location.trim(),
      bedrooms: parseInt(form.bedrooms),
      bathrooms: parseInt(form.bathrooms),
      area: parseFloat(form.area),
      coverImage: form.coverImage.trim(),
      description: form.description.trim(),
      status: form.status,
      featured: form.featured,
    };

    try {
      const res = await fetch(
        editingId ? `/api/properties/${editingId}` : "/api/properties",
        {
          method: editingId ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      if (!res.ok) {
        try {
          const data = await res.json();
          setError(data.error || data.message || "Something went wrong.");
        } catch {
          setError(`Error: ${res.status} ${res.statusText}`);
        }
        return;
      }

      setShowForm(false);
      setEditingId(null);
      setForm(emptyForm);
      fetchProperties();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Request failed.");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this property? This cannot be undone.")) return;
    
    setDeleting(id);
    try {
      const res = await fetch(`/api/properties/${id}`, { method: "DELETE" });
      if (!res.ok) {
        setError("Failed to delete property.");
      } else {
        fetchProperties();
      }
    } catch {
      setError("Failed to delete property.");
    } finally {
      setDeleting(null);
    }
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      <AdminSidebar />

      <main className="flex-1 p-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Properties</h1>
          <button
            onClick={handleAddNew}
            className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 transition"
          >
            + Add Property
          </button>
        </div>

        {error && (
          <div className="bg-red-100 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {/* Form */}
        {showForm && (
          <div className="bg-white rounded-xl shadow p-6 mb-8">
            <h2 className="text-lg font-semibold mb-4">
              {editingId ? "Edit Property" : "New Property"}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Title */}
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full border rounded px-3 py-2 text-sm"
                  placeholder="e.g. Luxury 3-Bedroom Apartment"
                />
              </div>

              {/* Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                <select
                  value={form.type}
                  onChange={(e) => setForm({ ...form, type: e.target.value })}
                  className="w-full border rounded px-3 py-2 text-sm"
                >
                  <option value="apartment">Apartment</option>
                  <option value="house">House</option>
                  <option value="villa">Villa</option>
                  <option value="duplex">Duplex</option>
                  <option value="penthouse">Penthouse</option>
                  <option value="commercial">Commercial</option>
                  <option value="land">Land</option>
                </select>
              </div>

              {/* Price */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Price (₦) *</label>
                <input
                  type="number"
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                  className="w-full border rounded px-3 py-2 text-sm"
                  placeholder="e.g. 45000000"
                  min="0"
                  step="0.01"
                />
              </div>

              {/* Location */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Location *</label>
                <input
                  type="text"
                  value={form.location}
                  onChange={(e) => setForm({ ...form, location: e.target.value })}
                  className="w-full border rounded px-3 py-2 text-sm"
                  placeholder="e.g. Lekki, Lagos"
                />
              </div>

              {/* Area */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Area (sqm) *</label>
                <input
                  type="number"
                  value={form.area}
                  onChange={(e) => setForm({ ...form, area: e.target.value })}
                  className="w-full border rounded px-3 py-2 text-sm"
                  placeholder="e.g. 250"
                  min="0"
                  step="0.01"
                />
              </div>

              {/* Bedrooms */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Bedrooms *</label>
                <input
                  type="number"
                  value={form.bedrooms}
                  onChange={(e) => setForm({ ...form, bedrooms: e.target.value })}
                  className="w-full border rounded px-3 py-2 text-sm"
                  placeholder="e.g. 3"
                  min="0"
                  max="50"
                />
              </div>

              {/* Bathrooms */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Bathrooms *</label>
                <input
                  type="number"
                  value={form.bathrooms}
                  onChange={(e) => setForm({ ...form, bathrooms: e.target.value })}
                  className="w-full border rounded px-3 py-2 text-sm"
                  placeholder="e.g. 2"
                  min="0"
                  max="50"
                />
              </div>

              {/* Cover Image */}
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Cover Image URL *</label>
                <input
                  type="text"
                  value={form.coverImage}
                  onChange={(e) => setForm({ ...form, coverImage: e.target.value })}
                  className="w-full border rounded px-3 py-2 text-sm"
                  placeholder="https://..."
                />
              </div>

              {/* Description */}
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full border rounded px-3 py-2 text-sm"
                  rows={4}
                  placeholder="Describe the property..."
                />
              </div>

              {/* Status */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value as "available" | "sold" })}
                  className="w-full border rounded px-3 py-2 text-sm"
                >
                  <option value="available">Available</option>
                  <option value="sold">Sold</option>
                </select>
              </div>

              {/* Featured */}
              <div className="flex items-center gap-2 mt-6">
                <input
                  type="checkbox"
                  id="featured"
                  checked={form.featured}
                  onChange={(e) => setForm({ ...form, featured: e.target.checked })}
                  className="w-4 h-4"
                />
                <label htmlFor="featured" className="text-sm font-medium text-gray-700">
                  Featured on homepage
                </label>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 mt-6">
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="bg-black text-white px-5 py-2 rounded hover:bg-gray-800 transition disabled:opacity-50"
              >
                {submitting ? "Saving..." : editingId ? "Update Property" : "Create Property"}
              </button>
              <button
                onClick={() => { setShowForm(false); setEditingId(null); setForm(emptyForm); setError(""); }}
                className="border px-5 py-2 rounded hover:bg-gray-50 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Table */}
        <div className="bg-white rounded-xl shadow overflow-hidden">
          {loading ? (
            <div className="p-8 text-center text-gray-500">Loading properties...</div>
          ) : properties.length === 0 ? (
            <div className="p-8 text-center text-gray-500">No properties yet. Add your first one!</div>
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Title</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Type</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Location</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Price</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Status</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Featured</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {properties.map((property) => (
                  <tr key={property.id} className="border-b hover:bg-gray-50 transition">
                    <td className="px-4 py-3 font-medium text-gray-800">{property.title}</td>
                    <td className="px-4 py-3 text-gray-600 capitalize">{property.type}</td>
                    <td className="px-4 py-3 text-gray-600">{property.location}</td>
                    <td className="px-4 py-3 text-gray-600">
                      ₦{property.price.toLocaleString()}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        property.status === "available"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}>
                        {property.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {property.featured ? (
                        <span className="text-yellow-500 font-medium">⭐ Yes</span>
                      ) : (
                        <span className="text-gray-400">No</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(property)}
                          className="text-blue-600 hover:underline text-sm"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(property.id)}
                          disabled={deleting === property.id}
                          className="text-red-500 hover:underline text-sm disabled:opacity-50"
                        >
                          {deleting === property.id ? "Deleting..." : "Delete"}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </main>
    </div>
  );
}
