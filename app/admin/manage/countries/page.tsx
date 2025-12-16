"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import RichTextEditor from "@/components/ui/rich-text-editor";
import { Trash2, Edit2 } from "lucide-react";

interface Country {
  _id: string;
  name: "";
  title: "";
  flag: "";
  description: "";
  tag: "";
  image: "";
}

export default function ManageCountries() {
  const [countries, setCountries] = useState<Country[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    title: "",
    flag: "",
    description: "",
    tag: "",
    image: "",
  });

  useEffect(() => {
    fetchCountries();
  }, []);

  const fetchCountries = async () => {
    try {
      const res = await fetch("/api/admin/countries");
      const data = await res.json();
      setCountries(data);
    } catch (error) {
      console.error("Error fetching countries:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await fetch(`/api/admin/countries/${editingId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
      } else {
        await fetch("/api/admin/countries", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
      }
      fetchCountries();
      setFormData({
        name: "",
        title: "",
        flag: "",
        description: "",
        tag: "",
        image: "",
      });
      setEditingId(null);
    } catch (error) {
      console.error("Error saving country:", error);
    }
  };

  const handleEdit = (country: Country) => {
    setFormData(country);
    setEditingId(country._id);
  };

  const handleDelete = async (id: string) => {
    try {
      await fetch(`/api/admin/countries/${id}`, { method: "DELETE" });
      fetchCountries();
    } catch (error) {
      console.error("Error deleting country:", error);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Manage Countries</h1>
        <p className="text-gray-600 mt-2">
          Add, edit, or delete destination countries
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>
            {editingId ? "Edit Country" : "Add New Country"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              placeholder="Country Name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="w-full px-4 py-2 border rounded-lg"
              required
            />
            <input
              type="text"
              placeholder="Title"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              className="w-full px-4 py-2 border rounded-lg"
              required
            />
            <input
              type="text"
              placeholder="Flag Emoji"
              value={formData.flag}
              onChange={(e) =>
                setFormData({ ...formData, flag: e.target.value })
              }
              className="w-full px-4 py-2 border rounded-lg"
              required
            />
            <div>
              <label className="block text-sm font-medium mb-2">Description</label>
              <RichTextEditor
                value={formData.description}
                onChange={(value) =>
                  setFormData({ ...formData, description: value })
                }
                placeholder="Country description (supports Markdown formatting)..."
                minHeight={200}
              />
            </div>
            <input
              type="text"
              placeholder="Image URL"
              value={formData.image}
              onChange={(e) =>
                setFormData({ ...formData, image: e.target.value })
              }
              className="w-full px-4 py-2 border rounded-lg"
              required
            />
            <input
              type="text"
              placeholder="Tags (comma separated) Example: popular, affordable"
              value={formData.tag}
              onChange={(e) =>
                setFormData({ ...formData, tag: e.target.value })
              }
              className="w-full px-4 py-2 border rounded-lg"
              
            />
            <div className="flex gap-2">
              <Button type="submit" className="bg-purple-600 text-white">
                {editingId ? "Update Country" : "Add Country"}
              </Button>
              {editingId && (
                <Button
                  type="button"
                  onClick={() => {
                    setEditingId(null);
                    setFormData({
                      name: "",
                      title: "",
                      flag: "",
                      description: "",
                      tag: "",
                      image: "",
                    });
                  }}
                  className="bg-gray-600 text-white"
                >
                  Cancel
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>

      <div className="grid gap-4">
        {countries.map((country) => (
          <Card key={country._id}>
            <CardContent className="pt-6">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <span className="text-4xl">{country.flag}</span>
                  <div>
                    <h3 className="font-semibold text-lg">{country.name}</h3>
                    <p className="text-gray-600 text-sm">{country.image}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={() => handleEdit(country)}
                    className="bg-blue-600 text-white p-2"
                    size="sm"
                  >
                    <Edit2 size={16} />
                  </Button>
                  <Button
                    onClick={() => handleDelete(country._id)}
                    className="bg-red-600 text-white p-2"
                    size="sm"
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
