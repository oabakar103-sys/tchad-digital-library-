import { NextRequest, NextResponse } from 'next/server';
import { getBookBySlug, recordDownload } from '@/lib/store';
import { hitRateLimit, rateHeaders } from '@/lib/rateLimit';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  // Limitation anti-abus : N téléchargements/heure/IP (modifiable via .env)
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'anon';
  const limit = Number(process.env.MAX_DOWNLOADS_PER_HOUR ?? 20);
  const rl = hitRateLimit(`dl:${ip}:${slug}`, limit, 3_600_000);
  if (!rl.allowed) {
    return NextResponse.json(
      { error: 'Limite de téléchargements atteinte pour cette heure.' },
      { status: 429, headers: rateHeaders(rl, limit) },
    );
  }

  const book = await getBookBySlug(slug);
  if (!book) return NextResponse.json({ error: 'Livre introuvable.' }, { status: 404 });

  // Production : redirection signée vers Supabase Storage (URL privée signée 15 min)
  if (book.pdfUrl) {
    await recordDownload(slug);
    return NextResponse.redirect(book.pdfUrl, { status: 302 });
  }

  // Mode démo : téléchargement d'une fiche texte en attendant le vrai PDF
  await recordDownload(slug);
  const text = [
    'TCHAD DIGITAL LIBRARY — FICHE DE DÉMONSTRATION',
    '===============================================',
    `Titre : ${book.title}`,
    `Année : ${book.year} · Pages : ${book.pages} · Langue : ${book.language}`,
    '',
    'RÉSUMÉ',
    book.summary,
    '',
    'Notes :',
    '- Ce fichier de démonstration remplace le PDF réel en mode local.',
    '- En production, le PDF est hébergé dans Supabase Storage (bucket privé, URL signée).',
    '- Moteur de lecture : lecteur PDF intégré (pdf.js), zoom, pages, plein écran.',
  ].join('\n');

  return new NextResponse(text, {
    status: 200,
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Content-Disposition': `attachment; filename="${slug}.txt"`,
      ...rateHeaders(rl, limit),
    },
  });
}
