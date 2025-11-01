'use server';

export async function approveAuthor(id: string) {
  const res = await fetch(`${process.env.DOMAIN || ''}/api/v1/author/${id}/approve`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action: 'approved' }),
    cache: 'no-store',
  });

  if (!res.ok) {
    throw new Error('Failed to approve author');
  }

  return true;
}

export async function rejectAuthor(id: string, notes = '') {
  const res = await fetch(`${process.env.DOMAIN || ''}/api/v1/author/${id}/approve`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action: 'rejected', notes }),
    cache: 'no-store',
  });

  if (!res.ok) {
    throw new Error('Failed to reject author');
  }

  return true;
}
