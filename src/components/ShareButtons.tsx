'use client';

import { IconFacebook, IconShare, IconWhatsapp } from '@/components/icons';
import { shareLinks } from '@/lib/utils';

export default function ShareButtons({ title, path }: { title: string; path: string }) {
  const share = async () => {
    const url = window.location.origin + path;
    if (navigator.share) {
      try {
        await navigator.share({ title, text: title, url });
      } catch {
        /* annulé */
      }
    } else {
      await navigator.clipboard?.writeText(url);
      alert('Lien copié dans le presse-papiers.');
    }
  };

  const links = shareLinks(typeof window !== 'undefined' ? window.location.origin + path : path, title);

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-xs font-medium text-[var(--ink-soft)]">Partager :</span>
      <a href={links.whatsapp} target="_blank" rel="noopener noreferrer" aria-label="Partager sur WhatsApp" className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[#25D366] text-white hover:opacity-90">
        <IconWhatsapp width={17} height={17} />
      </a>
      <a href={links.facebook} target="_blank" rel="noopener noreferrer" aria-label="Partager sur Facebook" className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[#1877F2] text-white hover:opacity-90">
        <IconFacebook width={17} height={17} />
      </a>
      <button type="button" onClick={share} aria-label="Partager" className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-tchad-blue-600 text-white hover:bg-tchad-blue-700">
        <IconShare width={17} height={17} />
      </button>
    </div>
  );
}
