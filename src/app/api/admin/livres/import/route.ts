import { NextRequest, NextResponse } from 'next/server';
import { apiGuard } from '@/lib/auth';
import { bulkImportBooks } from '@/lib/store';

export const dynamic = 'force-dynamic';

/** Import en masse de PDF : mode démo = métadonnées extraites des noms de fichiers.
 *  Production : enregistre les fichiers dans Supabase Storage bucket `pdfs`,
 *  extrait la 1re page en miniature (pdfjs + sharp) puis crée la fiche livre. */
export async function POST(req: NextRequest) {
  const session = await apiGuard();
  if (session instanceof NextResponse) return session;

  const form = await req.formData();
  const files = form.getAll('files').filter((f): f is File => f instanceof File);
  const authorId = String(form.get('authorId') ?? '');
  const categoryId = String(form.get('categoryId') ?? '');

  if (files.length === 0) return NextResponse.json({ error: 'Aucun fichier fourni.' }, { status: 400 });
  if (!authorId || !categoryId) return NextResponse.json({ error: 'Auteur et catégorie par défaut requis.' }, { status: 400 });

  const records = files.map((f) => {
    const title = f.name
      .replace(/\.pdf$/i, '')
      .replace(/[-_]+/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
    return {
      title,
      authorId,
      categoryId,
      fileSizeKb: Math.round(f.size / 1024),
      status: 'draft' as const,
    };
  });

  const count = await bulkImportBooks(records);
  return NextResponse.json({ count, names: records.map((r) => r.title) });
}
