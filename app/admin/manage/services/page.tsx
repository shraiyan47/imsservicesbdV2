"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import RichTextEditor from "@/components/ui/rich-text-editor";
import { Trash2, Edit2, Plus } from "lucide-react";

interface Service {
  _id: string;
  title: string;
  description: string;
  icon: string;
}

export default function ManageServices() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    icon: "",
  });

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const res = await fetch("/api/admin/services");
      const data = await res.json();
      setServices(data);
    } catch (error) {
      console.error("Error fetching services:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await fetch(`/api/admin/services/${editingId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
      } else {
        await fetch("/api/admin/services", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
      }
      fetchServices();
      setFormData({ title: "", description: "", icon: "" });
      setEditingId(null);
    } catch (error) {
      console.error("Error saving service:", error);
    }
  };

  const handleEdit = (service: Service) => {
    setFormData(service);
    setEditingId(service._id);
  };

  const handleDelete = async (id: string) => {
    try {
      await fetch(`/api/admin/services/${id}`, { method: "DELETE" });
      fetchServices();
    } catch (error) {
      console.error("Error deleting service:", error);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Manage Services</h1>
        <p className="text-gray-600 mt-2">
          Add, edit, or delete services offered by IMS
        </p>
      </div>

      {/* Add/Edit Form */}
      <Card>
        <CardHeader>
          <CardTitle>
            {editingId ? "Edit Service" : "Add New Service"}
          </CardTitle>
          {/* <CardTitle>{ 'Add New Service'}</CardTitle> */}
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              placeholder="Service Title"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              className="w-full px-4 py-2 border rounded-lg"
              required
            />
            <div>
              <label className="block text-sm font-medium mb-2">Service Description *</label>
              <RichTextEditor
                value={formData.description}
                onChange={(value) =>
                  setFormData({ ...formData, description: value })
                }
                placeholder="Service description (supports Markdown formatting)..."
                minHeight={200}
              />
            </div>
            <input
              type="text"
              placeholder="Icon (emoji or name)"
              value={formData.icon}
              onChange={(e) =>
                setFormData({ ...formData, icon: e.target.value })
              }
              className="w-full px-4 py-2 border rounded-lg"
            />

            <div className="flex gap-2">
              <Button type="submit" className="bg-purple-600 text-white">
                {editingId ? "Update Service" : "Add Service"}
              </Button>
              {editingId && (
                <Button
                  type="button"
                  onClick={() => {
                    setEditingId(null);
                    setFormData({ title: "", description: "", icon: "" });
                  }}
                  className="bg-gray-600 text-white"
                >
                  Cancel
                </Button>
              )}
            </div>

            {/* <div className="flex gap-2">
              <Button type="submit" className="bg-purple-600 text-white">
                { 'Add Service'}
              </Button>
              
            </div> */}
          </form>
        </CardContent>
      </Card>

      {/* Services List */}
      <div className="grid gap-4">
        {services?.map((service) => (
          <Card key={service._id}>
            <CardContent className="pt-6">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-lg">{service.title}</h3>
                  <p className="text-gray-600 text-sm mt-1">
                    {service.description}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={() => handleEdit(service)}
                    className="bg-blue-600 text-white p-2"
                    size="sm"
                  >
                    <Edit2 size={16} />
                  </Button>
                  <Button
                    onClick={() => handleDelete(service._id)}
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
