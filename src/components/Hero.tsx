'use client';

import { useEffect, useState } from 'react';
import SearchBar from '@/components/SearchBar';
import Counter from '@/components/Counter';

interface Props {
  slogans: string[];
  title: string;
  subtitle: string;
  stats: { books: number; downloads: number; readers: number; categories: number };
}

export default function Hero({ slogans, title, subtitle, stats }: Props) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setIndex((i) => (i + 1) % slogans.length), 7000);
    return () => clearInterval(t);
  }, [slogans.length]);

  return (
    <section className="relative overflow-hidden bg-tchad-blue-800 text-white">
      <div className="absolute inset-0 cover-pattern" aria-hidden />
      <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-tchad-gold-500/15 blur-3xl" aria-hidden />
      <div className="absolute -left-16 bottom-0 h-64 w-64 rounded-full bg-tchad-red-500/15 blur-3xl" aria-hidden />

      <div className="container-x relative py-14 sm:py-20">
        <div className="mx-auto max-w-3xl text-center">
          <p key={index} className="animate-slogan font-serif text-lg sm:text-2xl text-tchad-gold-200 min-h-[2rem]">
            « {slogans[index] ?? slogans[0]} »
          </p>
          <h1 className="mt-4 font-serif text-3xl font-bold leading-tight text-balance sm:text-5xl">{title}</h1>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-tchad-blue-100 sm:text-base">{subtitle}</p>

          <div className="mt-8 flex justify-center">
            <SearchBar large />
          </div>

          <dl className="mx-auto mt-10 grid max-w-3xl grid-cols-2 gap-6 sm:grid-cols-4">
            <Counter value={stats.books} label="Livres catalogués" />
            <Counter value={stats.downloads} label="Téléchargements" />
            <Counter value={stats.readers} label="Lecteurs actifs" />
            <Counter value={stats.categories} label="Catégories" />
          </dl>
        </div>
      </div>
    </section>
  );
}
