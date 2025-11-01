"use client";

import { upload } from "@vercel/blob/client";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";

interface Ad {
    _id: string;
    title: string;
    imageUrl: string;
    link: string;
    position: string;
    status: "active" | "inactive";
    clicks: number;
    impressions: number;
    createdAt: string;
    updatedAt: string;
}

interface Stats {
    active: number;
    inactive: number;
    total: number;
}

export default function AdsManagement() {
    const [ads, setAds] = useState<Ad[]>([]);
    const [stats, setStats] = useState<Stats>({ active: 0, inactive: 0, total: 0 });
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<"all" | "active" | "inactive">("active");
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    // Form states
    const [showForm, setShowForm] = useState(false);
    const [editingAd, setEditingAd] = useState<Ad | null>(null);
    const [formData, setFormData] = useState({
        title: "",
        imageUrl: "",
        link: "",
        position: "sidebar",
        status: "active" as "active" | "inactive",
    });
    const [uploading, setUploading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const fetchAds = useCallback(async () => {
        try {
            setLoading(true);
            const response = await fetch(`/api/v1/ads?status=${filter}&page=${page}&limit=20`);
            if (response.ok) {
                const data = await response.json();
                setAds(data.ads);
                setStats(data.stats);
                setTotalPages(data.pagination.totalPages);
            }
        } catch (error) {
            console.error("Failed to fetch ads:", error);
        } finally {
            setLoading(false);
        }
    }, [filter, page]);

    useEffect(() => {
        fetchAds();
    }, [fetchAds]);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate file type
        if (!file.type.startsWith("image/")) {
            alert("Please upload an image file");
            return;
        }

        // Validate file size (max 4MB)
        if (file.size > 4 * 1024 * 1024) {
            alert("File size must be less than 4MB");
            return;
        }

        try {
            setUploading(true);
            const newBlob = await upload(file.name, file, {
                access: "public",
                handleUploadUrl: "/api/upload",
            });

            setFormData({ ...formData, imageUrl: newBlob.url });
        } catch (error) {
            console.error("Upload failed:", error);
            alert("Failed to upload image");
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.title || !formData.imageUrl) {
            alert("Title and image are required");
            return;
        }

        try {
            setSubmitting(true);

            if (editingAd) {
                // Update existing ad
                const response = await fetch("/api/v1/ads", {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ _id: editingAd._id, ...formData }),
                });

                if (response.ok) {
                    alert("Ad updated successfully");
                    resetForm();
                    fetchAds();
                } else {
                    alert("Failed to update ad");
                }
            } else {
                // Create new ad
                const response = await fetch("/api/v1/ads", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(formData),
                });

                if (response.ok) {
                    alert("Ad created successfully");
                    resetForm();
                    fetchAds();
                } else {
                    alert("Failed to create ad");
                }
            }
        } catch (error) {
            console.error("Error submitting ad:", error);
            alert("An error occurred");
        } finally {
            setSubmitting(false);
        }
    };

    const handleEdit = (ad: Ad) => {
        setEditingAd(ad);
        setFormData({
            title: ad.title,
            imageUrl: ad.imageUrl,
            link: ad.link,
            position: ad.position,
            status: ad.status,
        });
        setShowForm(true);
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this ad?")) return;

        try {
            const response = await fetch(`/api/v1/ads?id=${id}`, {
                method: "DELETE",
            });

            if (response.ok) {
                alert("Ad deleted successfully");
                fetchAds();
            } else {
                alert("Failed to delete ad");
            }
        } catch (error) {
            console.error("Error deleting ad:", error);
            alert("An error occurred");
        }
    };

    const resetForm = () => {
        setFormData({
            title: "",
            imageUrl: "",
            link: "",
            position: "sidebar",
            status: "active",
        });
        setEditingAd(null);
        setShowForm(false);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    };

    return (
        <div className="h-full overflow-y-auto p-6 bg-gray-50">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-6 flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">Ads Management</h1>
                        <p className="text-gray-600">Create and manage advertisements</p>
                    </div>
                    <button
                        onClick={() => setShowForm(!showForm)}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-semibold"
                    >
                        {showForm ? "Cancel" : "+ Create New Ad"}
                    </button>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    <div className="bg-white rounded-lg shadow p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Total Ads</p>
                                <p className="text-3xl font-bold text-gray-900 mt-2">{stats.total}</p>
                            </div>
                            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Active</p>
                                <p className="text-3xl font-bold text-green-600 mt-2">{stats.active}</p>
                            </div>
                            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Inactive</p>
                                <p className="text-3xl font-bold text-gray-600 mt-2">{stats.inactive}</p>
                            </div>
                            <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                                <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Create/Edit Form */}
                {showForm && (
                    <div className="bg-white rounded-lg shadow mb-6 p-6">
                        <h2 className="text-xl font-bold text-gray-900 mb-4">
                            {editingAd ? "Edit Ad" : "Create New Ad"}
                        </h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* Title */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Ad Title *
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="e.g., Creative Commons Banner"
                                        required
                                    />
                                </div>

                                {/* Link */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Link URL (optional)
                                    </label>
                                    <input
                                        type="url"
                                        value={formData.link}
                                        onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="https://example.com"
                                    />
                                </div>

                                {/* Position */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Position
                                    </label>
                                    <select
                                        value={formData.position}
                                        onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="sidebar">Sidebar</option>
                                        <option value="content">Within Content</option>
                                        <option value="bottom">Bottom</option>
                                    </select>
                                </div>

                                {/* Status */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Status
                                    </label>
                                    <select
                                        value={formData.status}
                                        onChange={(e) => setFormData({ ...formData, status: e.target.value as "active" | "inactive" })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="active">Active</option>
                                        <option value="inactive">Inactive</option>
                                    </select>
                                </div>
                            </div>

                            {/* Image Upload */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Ad Image * (Max 4MB)
                                </label>
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                {uploading && (
                                    <p className="mt-2 text-sm text-blue-600">Uploading image...</p>
                                )}
                                {formData.imageUrl && (
                                    <div className="mt-4">
                                        <p className="text-sm text-gray-600 mb-2">Preview:</p>
                                        <div className="relative max-w-xs h-48">
                                            <Image
                                                src={formData.imageUrl}
                                                alt="Ad preview"
                                                width={300}
                                                height={192}
                                                className="rounded border border-gray-300 object-contain"
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Submit Buttons */}
                            <div className="flex gap-3 pt-4">
                                <button
                                    type="submit"
                                    disabled={submitting || uploading || !formData.imageUrl}
                                    className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-semibold"
                                >
                                    {submitting ? "Saving..." : editingAd ? "Update Ad" : "Create Ad"}
                                </button>
                                <button
                                    type="button"
                                    onClick={resetForm}
                                    className="px-6 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors font-semibold"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {/* Filters */}
                <div className="bg-white rounded-lg shadow mb-6 p-4">
                    <div className="flex items-center gap-4">
                        <span className="text-sm font-medium text-gray-700">Filter:</span>
                        <button
                            onClick={() => { setFilter("active"); setPage(1); }}
                            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${filter === "active"
                                ? "bg-blue-600 text-white"
                                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                }`}
                        >
                            Active ({stats.active})
                        </button>
                        <button
                            onClick={() => { setFilter("all"); setPage(1); }}
                            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${filter === "all"
                                ? "bg-blue-600 text-white"
                                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                }`}
                        >
                            All ({stats.total})
                        </button>
                        <button
                            onClick={() => { setFilter("inactive"); setPage(1); }}
                            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${filter === "inactive"
                                ? "bg-blue-600 text-white"
                                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                }`}
                        >
                            Inactive ({stats.inactive})
                        </button>
                    </div>
                </div>

                {/* Ads List */}
                <div className="bg-white rounded-lg shadow overflow-hidden">
                    {loading ? (
                        <div className="text-center py-12">
                            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                            <p className="mt-2 text-gray-600">Loading ads...</p>
                        </div>
                    ) : ads.length === 0 ? (
                        <div className="text-center py-12">
                            <p className="text-gray-600">No ads found</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Preview
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Title
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Position
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Status
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Impressions
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Clicks
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Created
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {ads.map((ad) => (
                                        <tr key={ad._id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="relative h-12 w-20">
                                                    <Image
                                                        src={ad.imageUrl}
                                                        alt={ad.title}
                                                        fill
                                                        className="object-cover rounded"
                                                    />
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-medium text-gray-900">{ad.title}</div>
                                                {ad.link && (
                                                    <div className="text-xs text-blue-600 truncate max-w-xs">
                                                        {ad.link}
                                                    </div>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-purple-100 text-purple-800">
                                                    {ad.position}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${ad.status === "active"
                                                    ? "bg-green-100 text-green-800"
                                                    : "bg-gray-100 text-gray-800"
                                                    }`}>
                                                    {ad.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {ad.impressions.toLocaleString()}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {ad.clicks.toLocaleString()}
                                                {ad.impressions > 0 && (
                                                    <span className="ml-1 text-xs text-gray-400">
                                                        ({((ad.clicks / ad.impressions) * 100).toFixed(1)}%)
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {formatDate(ad.createdAt)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                                                <button
                                                    onClick={() => handleEdit(ad)}
                                                    className="text-blue-600 hover:text-blue-900"
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(ad._id)}
                                                    className="text-red-600 hover:text-red-900"
                                                >
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>

                            {/* Pagination */}
                            {totalPages > 1 && (
                                <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                                    <div className="flex-1 flex justify-between sm:hidden">
                                        <button
                                            onClick={() => setPage(p => Math.max(1, p - 1))}
                                            disabled={page === 1}
                                            className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            Previous
                                        </button>
                                        <button
                                            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                                            disabled={page === totalPages}
                                            className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            Next
                                        </button>
                                    </div>
                                    <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                                        <div>
                                            <p className="text-sm text-gray-700">
                                                Page <span className="font-medium">{page}</span> of{" "}
                                                <span className="font-medium">{totalPages}</span>
                                            </p>
                                        </div>
                                        <div>
                                            <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                                                <button
                                                    onClick={() => setPage(p => Math.max(1, p - 1))}
                                                    disabled={page === 1}
                                                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                                >
                                                    Previous
                                                </button>
                                                <button
                                                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                                                    disabled={page === totalPages}
                                                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                                >
                                                    Next
                                                </button>
                                            </nav>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
