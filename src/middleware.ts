import { NextResponse, type NextRequest } from 'next/server';

/** Porte d'entrée légère : seule la présence du cookie est vérifiée ici ;
 *  la vérification cryptographique du rôle est effectuée côté serveur
 *  (lib/auth.ts) dans chaque page et chaque route API admin. */
export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
    const token = req.cookies.get('tdl_admin_session')?.value;
    if (!token) {
      const url = req.nextUrl.clone();
      url.pathname = '/admin/login';
      url.searchParams.set('from', pathname);
      return NextResponse.redirect(url);
    }
  }
  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
