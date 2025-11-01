'use client';

import { useSessionQuery } from '@/features/admin-panel/services/session-service';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface AuthorRequest {
  _id: string;
  name: string;
  email: string;
  requestedAt: string;
  approvalStatus: 'pending' | 'approved' | 'rejected';
  approvalNotes?: string;
}

export default function AuthorApprovals() {
  const router = useRouter();
  const { data: sessionResponse, isLoading: sessionLoading, isError } = useSessionQuery();
  const [authors, setAuthors] = useState<AuthorRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>('pending');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (!sessionLoading && !isError && sessionResponse?.session) {
      if (!sessionResponse.session.isRootUser) {
        router.replace('/dashboard');
      }
    }
  }, [sessionResponse, sessionLoading, isError, router]);

  useEffect(() => {
    const fetchAuthors = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/v1/author');
        const data = await response.json();

        // Filter and sort authors
        const authorsData = Array.isArray(data) ? data : data?.authors || data?.data || [];
        const filtered = authorsData
          .filter((author: AuthorRequest) => {
            const matchesStatus = filterStatus === 'all' || author.approvalStatus === filterStatus;
            const matchesSearch =
              author.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
              author.email.toLowerCase().includes(searchTerm.toLowerCase());
            return matchesStatus && matchesSearch;
          })
          .sort(
            (a: AuthorRequest, b: AuthorRequest) =>
              new Date(b.requestedAt).getTime() - new Date(a.requestedAt).getTime(),
          );

        setAuthors(filtered);
      } catch (error) {
        console.error('Error fetching authors:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAuthors();
  }, [filterStatus, searchTerm]);

  const handleApprove = async (id: string) => {
    try {
      const response = await fetch(`/api/v1/author/${id}/approve`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        cache: 'no-store',
        body: JSON.stringify({ action: 'approved' }),
      });

      if (response.ok) {
        // Refresh the list
        const updatedResponse = await fetch('/api/v1/author', { next: { revalidate: 10 } });
        const updatedData = await updatedResponse.json();
        const authorsData = Array.isArray(updatedData)
          ? updatedData
          : updatedData?.authors || updatedData?.data || [];
        setAuthors(
          authorsData.filter((author: AuthorRequest) => author.approvalStatus === filterStatus),
        );
      }
    } catch (error) {
      console.error('Error approving author:', error);
    }
  };

  const handleReject = async (id: string) => {
    const notes = prompt('Enter rejection reason (optional):');
    try {
      const response = await fetch(`/api/v1/author/${id}/approve`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        cache: 'no-store',
        body: JSON.stringify({ action: 'rejected', notes: notes || '' }),
      });

      if (response.ok) {
        // Refresh the list
        const updatedResponse = await fetch('/api/v1/author', { next: { revalidate: 10 } });
        const updatedData = await updatedResponse.json();
        const authorsData = Array.isArray(updatedData)
          ? updatedData
          : updatedData?.authors || updatedData?.data || [];
        setAuthors(
          authorsData.filter((author: AuthorRequest) => author.approvalStatus === filterStatus),
        );
      }
    } catch (error) {
      console.error('Error rejecting author:', error);
    }
  };

  if (sessionLoading || isError || !sessionResponse?.session) {
    return <div>Loading...</div>;
  }

  if (!sessionResponse.session.isRootUser) {
    return null;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Author Approvals</h1>

      <div className="flex justify-between items-center mb-4">
        <div className="flex gap-4">
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border p-2 rounded w-64"
          />

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="border p-2 rounded w-40"
          >
            <option value="all">All</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div>Loading...</div>
      ) : (
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 text-left">Name</th>
              <th className="p-2 text-left">Email</th>
              <th className="p-2 text-left">Requested</th>
              <th className="p-2 text-left">Status</th>
              <th className="p-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {authors.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-2 text-center">
                  No authors found
                </td>
              </tr>
            ) : (
              authors.map((author) => (
                <tr key={author._id} className="border-b">
                  <td className="p-2">{author.name}</td>
                  <td className="p-2">{author.email}</td>
                  <td className="p-2">{new Date(author.requestedAt).toLocaleString()}</td>
                  <td className="p-2">
                    <span
                      className={`px-2 py-1 rounded text-xs ${
                        author.approvalStatus === 'approved'
                          ? 'bg-green-100 text-green-800'
                          : author.approvalStatus === 'rejected'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {author.approvalStatus}
                    </span>
                  </td>
                  <td className="p-2">
                    {author.approvalStatus === 'pending' && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleApprove(author._id)}
                          className="bg-green-500 text-white px-3 py-1 rounded text-sm"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleReject(author._id)}
                          className="bg-red-500 text-white px-3 py-1 rounded text-sm"
                        >
                          Reject
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}
