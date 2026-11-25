interface Props {
  seed: string;
  title: string;
  authorName: string;
  color: string;
  categoryName?: string;
  pages?: number;
  className?: string;
}

function wrap(title: string, max = 22): string[] {
  const words = title.split(/\s+/);
  const lines: string[] = [];
  let line = '';
  for (const w of words) {
    if ((line + ' ' + w).trim().length > max && line) {
      lines.push(line.trim());
      line = w;
    } else {
      line = `${line} ${w}`;
    }
  }
  if (line.trim()) lines.push(line.trim());
  return lines.slice(0, 4);
}

/** Couverture générée automatiquement (remplace la miniature PDF en attente).
 *  En production, la 1re page du PDF est extraite (pdfjs-sharp) puis synchronisée. */
export default function CoverArt({ seed, title, authorName, color, categoryName, pages, className = '' }: Props) {
  const id = `cov-${seed.replace(/[^a-z0-9]/gi, '')}`;
  const lines = wrap(title);
  return (
    <svg viewBox="0 0 200 300" className={className} role="img" aria-label={`Couverture de ${title}`}>
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={color} />
          <stop offset="1" stopColor="#05101f" />
        </linearGradient>
      </defs>
      <rect width="200" height="300" fill={`url(#${id})`} />
      <rect x="0" y="0" width="16" height="300" fill="#00000055" />
      <circle cx="150" cy="70" r="46" fill="#ffffff14" />
      <circle cx="40" cy="250" r="60" fill="#ffffff0d" />

      {/* silhouette de baobab */}
      <g fill="#ffffff22">
        <path d="M132 236c-1-14 1-26 6-36 2 9 1 21-3 36z" />
        <path d="M138 196c-12 0-19-6-19-13 0-5.5 5-9.5 11-9.5 2 0 3.8.5 5.2 1.3 2.5-3.8 7.5-6 12.5-5 5.8 1 9.5 5.5 9 11 5 1.3 8 5 7.5 9.8-.8 6-8 9.4-18.8 9.4z" />
      </g>

      {categoryName && (
        <text x="28" y="42" fill="#ffd042" fontSize="10" fontFamily="Inter, sans-serif" letterSpacing="2">
          {categoryName.toUpperCase()}
        </text>
      )}

      <text x="28" y="96" fill="#ffffff" fontFamily="Georgia, serif" fontWeight="700" fontSize="17">
        {lines[0]}
      </text>
      {lines[1] && <text x="28" y="118" fill="#ffffff" fontFamily="Georgia, serif" fontWeight="700" fontSize="17">{lines[1]}</text>}
      {lines[2] && <text x="28" y="140" fill="#ffffff" fontFamily="Georgia, serif" fontWeight="700" fontSize="17">{lines[2]}</text>}
      {lines[3] && <text x="28" y="162" fill="#ffffff" fontFamily="Georgia, serif" fontWeight="700" fontSize="15">{lines[3]}</text>}

      <rect x="28" y="182" width="34" height="2" fill="#f2b200" />

      <text x="28" y="266" fill="#e8eef6" fontFamily="Inter, sans-serif" fontSize="11" fontWeight="600">
        {authorName}
      </text>
      {pages ? (
        <text x="28" y="282" fill="#a9bdd4" fontFamily="Inter, sans-serif" fontSize="9">
          {pages} pages · PDF
        </text>
      ) : null}
    </svg>
  );
}
