'use client';

import { useState } from 'react';

function getFilenameFromDisposition(disposition: string | null) {
  if (!disposition) {
    return null;
  }

  const match = disposition.match(/filename="?([^";]+)"?/i);
  if (match && match[1]) {
    return decodeURIComponent(match[1]);
  }

  return null;
}

export default function BackupTab() {
  const [isDownloading, setIsDownloading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastDownloadMeta, setLastDownloadMeta] = useState<{
    fileName: string;
    downloadedAt: Date;
  } | null>(null);

  const handleDownload = async () => {
    try {
      setIsDownloading(true);
      setError(null);

      const response = await fetch('/api/v1/backup', {
        method: 'GET',
        cache: 'no-store',
      });

      if (!response.ok) {
        let message = 'Failed to download backup';
        try {
          const payload = await response.json();
          if (payload?.message) {
            message = payload.message;
          }
        } catch {
          throw new Error(message);
        }
      }

      const fallbackName = `mongodb-backup-${new Date().toISOString()}.json`;
      const disposition = response.headers.get('Content-Disposition');
      const fileName = getFilenameFromDisposition(disposition) ?? fallbackName;

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const anchor = document.createElement('a');
      anchor.href = url;
      anchor.download = fileName;
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
      window.URL.revokeObjectURL(url);

      setLastDownloadMeta({ fileName, downloadedAt: new Date() });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to download backup';
      setError(message);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="h-full overflow-y-auto bg-gray-50 p-6">
      <div className="mx-auto max-w-3xl space-y-6">
        <header className="rounded-lg bg-white p-6 shadow">
          <h1 className="text-3xl font-bold text-gray-900">Database Backup</h1>
          <p className="mt-2 text-sm text-gray-600">
            Download a JSON snapshot of every collection in your MongoDB Atlas database. Only root
            administrators have access to this action.
          </p>
        </header>

        <section className="rounded-lg bg-white p-6 shadow">
          <div className="space-y-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Full JSON Export</h2>
                <p className="text-sm text-gray-600">
                  The exported file may be large and can include sensitive data. Store it securely
                  after download.
                </p>
              </div>
              <button
                onClick={handleDownload}
                disabled={isDownloading}
                className="inline-flex items-center justify-center rounded-md bg-blue-600 px-5 py-2 font-semibold text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-400"
              >
                {isDownloading ? 'Preparing backup...' : 'Download JSON'}
              </button>
            </div>

            {error && (
              <div className="rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                {error}
              </div>
            )}

            {lastDownloadMeta && (
              <div className="rounded-md border border-green-200 bg-green-50 p-4 text-sm text-green-700">
                <p>Last download: {lastDownloadMeta.downloadedAt.toLocaleString()}</p>
                <p>File: {lastDownloadMeta.fileName}</p>
              </div>
            )}

            <div className="rounded-md border border-yellow-200 bg-yellow-50 p-4 text-sm text-yellow-700">
              Downloads run with the current session permissions. Ensure you are on a secure
              connection and share backups only with trusted team members.
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
