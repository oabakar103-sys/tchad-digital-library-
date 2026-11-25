'use client';

import { useRouter } from 'next/navigation';
import { IconLogout } from '@/components/icons';

export default function AdminLogoutButton() {
  const router = useRouter();
  const logout = async () => {
    await fetch('/api/admin/auth/logout', { method: 'POST' });
    router.push('/admin/login');
    router.refresh();
  };
  return (
    <button type="button" onClick={logout} className="flex items-center gap-2 text-xs text-tchad-red-600 hover:underline">
      <IconLogout width={14} height={14} /> Se déconnecter
    </button>
  );
}
