import { Suspense } from 'react';
import LoginForm from '@/components/admin/LoginForm';
import { USE_SUPABASE } from '@/lib/store';
import { DEMO_ADMINS } from '@/lib/constants';

export const metadata = { title: 'Connexion admin', robots: { index: false } };

const ROLE_LABEL: Record<string, string> = {
  super_admin: 'Super administrateur',
  editor: 'Éditeur',
};

export default function AdminLoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm
        demoMode={!USE_SUPABASE}
        demoCreds={DEMO_ADMINS.map((u) => ({ email: u.email, password: u.password, label: ROLE_LABEL[u.role] }))}
      />
    </Suspense>
  );
}
