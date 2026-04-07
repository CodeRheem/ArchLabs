"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AdminSidebar from "@/components/AdminSidebar";

type Article = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  coverImage: string;
  author: string;
  status: "draft" | "published";
  createdAt: string;
};

const emptyForm = {
  title: "",
  excerpt: "",
  content: "",
  coverImage: "",
  author: "",
  status: "draft" as "draft" | "published",
};

export default function AdminArticlesPage() {
  const router = useRouter();
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    fetchArticles();
  }, []);

  async function fetchArticles() {
    try {
      const res = await fetch("/api/articles/all");
      if (res.status === 401) return router.push("/admin/login");
      const data = await res.json();
      setArticles(Array.isArray(data) ? data : []);
    } catch {
      setError("Failed to load articles.");
    } finally {
      setLoading(false);
    }
  }

  function handleEdit(article: Article) {
    setEditingId(article.id);
    setForm({
      title: article.title,
      excerpt: article.excerpt,
      content: article.content,
      coverImage: article.coverImage,
      author: article.author,
      status: article.status,
    });
    setShowForm(true);
    setImageError(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handleAddNew() {
    setEditingId(null);
    setForm(emptyForm);
    setShowForm(true);
    setImageError(false);
  }

  // Validation function
  function validateForm(): string | null {
    if (!form.title.trim()) return "Title is required";
    if (!form.author.trim()) return "Author is required";
    if (!form.content.trim()) return "Content is required";
    if (!form.excerpt.trim()) return "Excerpt is required";
    if (!form.coverImage.trim()) return "Cover image URL is required";
    
    if (form.excerpt.length < 10) return "Excerpt must be at least 10 characters";
    if (form.content.length < 50) return "Content must be at least 50 characters";
    
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

    if (imageError) {
      setError("Cover image URL is invalid. Please check the URL.");
      return;
    }

    setSubmitting(true);

    const payload = {
      title: form.title.trim(),
      excerpt: form.excerpt.trim(),
      content: form.content.trim(),
      author: form.author.trim(),
      coverImage: form.coverImage.trim(),
      status: form.status,
    };

    try {
      const res = await fetch(
        editingId ? `/api/articles/${editingId}` : "/api/articles",
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
      setImageError(false);
      fetchArticles();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Request failed.");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this article? This cannot be undone.")) return;

    setDeleting(id);
    try {
      const res = await fetch(`/api/articles/${id}`, { method: "DELETE" });
      if (!res.ok) {
        setError("Failed to delete article.");
      } else {
        fetchArticles();
      }
    } catch {
      setError("Failed to delete article.");
    } finally {
      setDeleting(null);
    }
  }

  async function handleToggleStatus(article: Article) {
    const newStatus = article.status === "published" ? "draft" : "published";
    try {
      const res = await fetch(`/api/articles/${article.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) {
        setError("Failed to update status.");
      } else {
        fetchArticles();
      }
    } catch {
      setError("Failed to update status.");
    }
  }

  function formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleDateString("en-NG", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      <AdminSidebar />

      <main className="flex-1 p-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Articles</h1>
            <p className="text-sm text-gray-500 mt-1">
              {articles.length} total · {articles.filter((a) => a.status === "published").length} published
            </p>
          </div>
          <button
            onClick={handleAddNew}
            className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 transition"
          >
            + New Article
          </button>
        </div>

        {error && (
          <div className="bg-red-100 text-red-700 px-4 py-3 rounded mb-4 flex justify-between items-center">
            <span>{error}</span>
            <button onClick={() => setError("")} className="text-red-500 hover:text-red-700 font-bold">
              ✕
            </button>
          </div>
        )}

        {/* Form */}
        {showForm && (
          <div className="bg-white rounded-xl shadow p-6 mb-8">
            <h2 className="text-lg font-semibold mb-4 text-gray-800">
              {editingId ? "✏️ Edit Article" : "📝 New Article"}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Title */}
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
                  placeholder="e.g. The Future of Sustainable Architecture"
                />
              </div>

              {/* Author */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Author <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={form.author}
                  onChange={(e) => setForm({ ...form, author: e.target.value })}
                  className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
                  placeholder="e.g. Chidi Okonkwo"
                />
              </div>

              {/* Status */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  value={form.status}
                  onChange={(e) =>
                    setForm({ ...form, status: e.target.value as "draft" | "published" })
                  }
                  className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                </select>
              </div>

              {/* Cover Image */}
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Cover Image URL <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={form.coverImage}
                  onChange={(e) => {
                    setForm({ ...form, coverImage: e.target.value });
                    setImageError(false);
                  }}
                  className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
                  placeholder="https://..."
                />
                {form.coverImage && !imageError && (
                  <img
                    src={form.coverImage}
                    alt="Cover preview"
                    className="mt-2 h-32 w-full object-cover rounded border"
                    onError={() => setImageError(true)}
                  />
                )}
                {imageError && (
                  <div className="mt-2 p-3 bg-yellow-50 border border-yellow-200 rounded text-sm text-yellow-700">
                    ⚠️ Could not load image preview. Check if the URL is correct.
                  </div>
                )}
              </div>

              {/* Excerpt */}
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Excerpt <span className="text-red-500">*</span>{" "}
                  <span className="text-gray-400 font-normal">(short summary shown on listing page)</span>
                </label>
                <textarea
                  value={form.excerpt}
                  onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
                  className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
                  rows={2}
                  placeholder="A short compelling summary of the article..."
                />
                <p className="text-xs text-gray-400 mt-1">{form.excerpt.length} characters</p>
              </div>

              {/* Content */}
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Content <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={form.content}
                  onChange={(e) => setForm({ ...form, content: e.target.value })}
                  className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black font-mono"
                  rows={12}
                  placeholder="Write your full article content here..."
                />
                <p className="text-xs text-gray-400 mt-1">
                  {form.content.length} characters · ~{Math.ceil(form.content.split(" ").length / 200)} min read
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 mt-6">
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="bg-black text-white px-5 py-2 rounded hover:bg-gray-800 transition disabled:opacity-50"
              >
                {submitting ? "Saving..." : editingId ? "Update Article" : "Create Article"}
              </button>
              <button
                onClick={() => {
                  setShowForm(false);
                  setEditingId(null);
                  setForm(emptyForm);
                  setError("");
                  setImageError(false);
                }}
                className="border px-5 py-2 rounded hover:bg-gray-50 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Articles Table */}
        <div className="bg-white rounded-xl shadow overflow-hidden">
          {loading ? (
            <div className="p-8 text-center text-gray-500">Loading articles...</div>
          ) : articles.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              No articles yet.{" "}
              <button onClick={handleAddNew} className="text-black underline">
                Write your first one!
              </button>
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Title</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Author</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Status</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Date</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {articles.map((article) => (
                  <tr key={article.id} className="border-b hover:bg-gray-50 transition">
                    <td className="px-4 py-3">
                      <div className="font-medium text-gray-800">{article.title}</div>
                      {article.excerpt && (
                        <div className="text-gray-400 text-xs mt-0.5 truncate max-w-xs">
                          {article.excerpt}
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3 text-gray-600">{article.author}</td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => handleToggleStatus(article)}
                        disabled={deleting === article.id}
                        className={`px-2 py-1 rounded-full text-xs font-medium transition disabled:opacity-50 ${
                          article.status === "published"
                            ? "bg-green-100 text-green-700 hover:bg-green-200"
                            : "bg-yellow-100 text-yellow-700 hover:bg-yellow-200"
                        }`}
                        title="Click to toggle status"
                      >
                        {article.status === "published" ? "✅ Published" : "🟡 Draft"}
                      </button>
                    </td>
                    <td className="px-4 py-3 text-gray-500">{formatDate(article.createdAt)}</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(article)}
                          disabled={deleting === article.id}
                          className="text-blue-600 hover:underline disabled:opacity-50"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(article.id)}
                          disabled={deleting === article.id}
                          className="text-red-500 hover:underline disabled:opacity-50"
                        >
                          {deleting === article.id ? "Deleting..." : "Delete"}
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
