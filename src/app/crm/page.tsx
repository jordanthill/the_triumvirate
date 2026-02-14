"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface Contact {
  id: string;
  name: string;
  email: string;
  company: string;
  phone: string;
  status: "lead" | "active" | "inactive";
  notes: string;
  createdAt: string;
  lastContact: string;
}

export default function CRMPage() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    phone: "",
    status: "lead" as const,
    notes: "",
  });

  // Load contacts from localStorage
  useEffect(() => {
    const stored = localStorage.getItem("triumvirate-crm-contacts");
    if (stored) {
      setContacts(JSON.parse(stored));
    }
  }, []);

  // Save contacts to localStorage
  useEffect(() => {
    if (contacts.length > 0) {
      localStorage.setItem("triumvirate-crm-contacts", JSON.stringify(contacts));
    }
  }, [contacts]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const now = new Date().toISOString();

    if (editingId) {
      setContacts(
        contacts.map((c) =>
          c.id === editingId
            ? { ...c, ...formData, lastContact: now }
            : c
        )
      );
      setEditingId(null);
    } else {
      const newContact: Contact = {
        id: Date.now().toString(),
        ...formData,
        createdAt: now,
        lastContact: now,
      };
      setContacts([newContact, ...contacts]);
    }

    setFormData({
      name: "",
      email: "",
      company: "",
      phone: "",
      status: "lead",
      notes: "",
    });
    setIsAdding(false);
  };

  const handleEdit = (contact: Contact) => {
    setFormData({
      name: contact.name,
      email: contact.email,
      company: contact.company,
      phone: contact.phone,
      status: contact.status,
      notes: contact.notes,
    });
    setEditingId(contact.id);
    setIsAdding(true);
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this contact?")) {
      setContacts(contacts.filter((c) => c.id !== id));
    }
  };

  const updateLastContact = (id: string) => {
    setContacts(
      contacts.map((c) =>
        c.id === id ? { ...c, lastContact: new Date().toISOString() } : c
      )
    );
  };

  const filteredContacts = contacts
    .filter((c) => filterStatus === "all" || c.status === filterStatus)
    .filter(
      (c) =>
        c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.company.toLowerCase().includes(searchTerm.toLowerCase())
    );

  const stats = {
    total: contacts.length,
    leads: contacts.filter((c) => c.status === "lead").length,
    active: contacts.filter((c) => c.status === "active").length,
    inactive: contacts.filter((c) => c.status === "inactive").length,
  };

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <Link
              href="/"
              className="text-sm text-gray-500 hover:text-gray-300 transition-colors mb-2 inline-block"
            >
              ← Back to Home
            </Link>
            <h1 className="text-4xl font-bold text-white">CRM</h1>
            <p className="text-gray-500 mt-1">
              Manage your contacts and relationships
            </p>
          </div>
          <button
            onClick={() => {
              setIsAdding(!isAdding);
              setEditingId(null);
              setFormData({
                name: "",
                email: "",
                company: "",
                phone: "",
                status: "lead",
                notes: "",
              });
            }}
            className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-medium transition-colors"
          >
            {isAdding ? "Cancel" : "+ Add Contact"}
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl glass">
            <div className="text-2xl font-bold text-white">{stats.total}</div>
            <div className="text-sm text-gray-500">Total Contacts</div>
          </div>
          <div className="p-4 rounded-xl glass">
            <div className="text-2xl font-bold text-yellow-400">{stats.leads}</div>
            <div className="text-sm text-gray-500">Leads</div>
          </div>
          <div className="p-4 rounded-xl glass">
            <div className="text-2xl font-bold text-green-400">{stats.active}</div>
            <div className="text-sm text-gray-500">Active</div>
          </div>
          <div className="p-4 rounded-xl glass">
            <div className="text-2xl font-bold text-gray-400">{stats.inactive}</div>
            <div className="text-sm text-gray-500">Inactive</div>
          </div>
        </div>

        {/* Add/Edit Form */}
        {isAdding && (
          <div className="p-6 rounded-xl glass">
            <h2 className="text-xl font-semibold text-white mb-4">
              {editingId ? "Edit Contact" : "Add New Contact"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Name *"
                  required
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500"
                />
                <input
                  type="email"
                  placeholder="Email *"
                  required
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500"
                />
                <input
                  type="text"
                  placeholder="Company"
                  value={formData.company}
                  onChange={(e) =>
                    setFormData({ ...formData, company: e.target.value })
                  }
                  className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500"
                />
                <input
                  type="tel"
                  placeholder="Phone"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500"
                />
                <select
                  value={formData.status}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      status: e.target.value as "lead" | "active" | "inactive",
                    })
                  }
                  className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none focus:border-indigo-500"
                >
                  <option value="lead">Lead</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
              <textarea
                placeholder="Notes"
                value={formData.notes}
                onChange={(e) =>
                  setFormData({ ...formData, notes: e.target.value })
                }
                rows={3}
                className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500"
              />
              <button
                type="submit"
                className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-medium transition-colors"
              >
                {editingId ? "Update Contact" : "Add Contact"}
              </button>
            </form>
          </div>
        )}

        {/* Filters and Search */}
        <div className="flex flex-col sm:flex-row gap-4">
          <input
            type="text"
            placeholder="Search contacts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500"
          />
          <div className="flex gap-2">
            {["all", "lead", "active", "inactive"].map((status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filterStatus === status
                    ? "bg-indigo-600 text-white"
                    : "glass text-gray-400 hover:text-white"
                }`}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Contacts List */}
        <div className="space-y-3">
          {filteredContacts.length === 0 ? (
            <div className="text-center py-12 glass rounded-xl">
              <p className="text-gray-500">
                {contacts.length === 0
                  ? "No contacts yet. Add your first contact to get started!"
                  : "No contacts match your filters."}
              </p>
            </div>
          ) : (
            filteredContacts.map((contact) => (
              <div
                key={contact.id}
                className="p-4 rounded-xl glass glass-hover transition-all"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-3">
                      <h3 className="text-lg font-semibold text-white">
                        {contact.name}
                      </h3>
                      <span
                        className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                          contact.status === "lead"
                            ? "bg-yellow-500/20 text-yellow-400"
                            : contact.status === "active"
                            ? "bg-green-500/20 text-green-400"
                            : "bg-gray-500/20 text-gray-400"
                        }`}
                      >
                        {contact.status}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-400">
                      {contact.email && (
                        <span className="flex items-center gap-1">
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                            />
                          </svg>
                          {contact.email}
                        </span>
                      )}
                      {contact.company && (
                        <span className="flex items-center gap-1">
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                            />
                          </svg>
                          {contact.company}
                        </span>
                      )}
                      {contact.phone && (
                        <span className="flex items-center gap-1">
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                            />
                          </svg>
                          {contact.phone}
                        </span>
                      )}
                    </div>
                    {contact.notes && (
                      <p className="text-sm text-gray-500 mt-2">
                        {contact.notes}
                      </p>
                    )}
                    <p className="text-xs text-gray-600 mt-2">
                      Last contact:{" "}
                      {new Date(contact.lastContact).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateLastContact(contact.id)}
                      className="p-2 rounded-lg glass glass-hover text-green-400 hover:text-green-300 transition-colors"
                      title="Mark as contacted"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </button>
                    <button
                      onClick={() => handleEdit(contact)}
                      className="p-2 rounded-lg glass glass-hover text-blue-400 hover:text-blue-300 transition-colors"
                      title="Edit"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                        />
                      </svg>
                    </button>
                    <button
                      onClick={() => handleDelete(contact.id)}
                      className="p-2 rounded-lg glass glass-hover text-red-400 hover:text-red-300 transition-colors"
                      title="Delete"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
