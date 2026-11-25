'use client';

import { useEffect, useState } from 'react';
import { IconCheck, IconNote, IconStar } from '@/components/icons';

const FAV = 'tdl:favorites';
const LATER = 'tdl:later';

function read(key: string): string[] {
  try {
    return JSON.parse(localStorage.getItem(key) ?? '[]');
  } catch {
    return [];
  }
}

function write(key: string, values: string[]) {
  try {
    localStorage.setItem(key, JSON.stringify(values));
  } catch {
    /* stockage indisponible */
  }
}

export default function BookShelfButtons({ slug, className = '' }: { slug: string; className?: string }) {
  const [fav, setFav] = useState(false);
  const [later, setLater] = useState(false);

  useEffect(() => {
    setFav(read(FAV).includes(slug));
    setLater(read(LATER).includes(slug));
  }, [slug]);

  const toggle = (key: string, setter: (v: boolean) => void, current: boolean) => {
    const list = read(key);
    const next = current ? list.filter((s) => s !== slug) : [...list, slug];
    write(key, next);
    setter(!current);
  };

  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      <button
        type="button"
        onClick={() => toggle(FAV, setFav, fav)}
        className={fav ? 'btn-gold !text-xs' : 'btn-outline !text-xs'}
        aria-pressed={fav}
      >
        <IconStar width={14} height={14} />
        {fav ? 'Favori enregistré' : 'Ajouter aux favoris'}
      </button>
      <button
        type="button"
        onClick={() => toggle(LATER, setLater, later)}
        className={later ? 'btn-primary !text-xs' : 'btn-outline !text-xs'}
        aria-pressed={later}
      >
        <IconNote width={14} height={14} />
        {later ? 'Dans « À lire plus tard »' : 'À lire plus tard'}
      </button>
      {fav && later && (
        <span className="inline-flex items-center gap-1 text-xs text-green-700 dark:text-green-300">
          <IconCheck width={14} height={14} /> Ajouté à votre bibliothèque
        </span>
      )}
    </div>
  );
}
