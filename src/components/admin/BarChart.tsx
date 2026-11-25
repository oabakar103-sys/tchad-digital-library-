interface Point {
  month: string;
  downloads: number;
  views: number;
}

export default function BarChart({ data }: { data: Point[] }) {
  const max = Math.max(...data.map((d) => Math.max(d.downloads, d.views)), 1);
  const W = 720;
  const H = 240;
  const pad = 36;
  const bw = (W - pad * 2) / data.length;

  return (
    <div className="card p-5">
      <h3 className="mb-4 text-sm font-semibold">Téléchargements et visites — 12 derniers mois</h3>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img" aria-label="Graphique des téléchargements mensuels">
        {[0.25, 0.5, 0.75, 1].map((r) => (
          <g key={r}>
            <line x1={pad} x2={W - pad} y1={H - pad - (H - pad * 2) * r} y2={H - pad - (H - pad * 2) * r} stroke="var(--line)" strokeDasharray="3 4" />
            <text x={6} y={H - pad - (H - pad * 2) * r + 4} fontSize="9" fill="var(--ink-soft)">
              {Math.round((max * r) / 1000)}k
            </text>
          </g>
        ))}
        {data.map((d, i) => {
          const x = pad + i * bw + bw * 0.18;
          const hD = ((H - pad * 2) * d.downloads) / max;
          const hV = ((H - pad * 2) * d.views) / max;
          return (
            <g key={d.month}>
              <rect x={x} y={H - pad - hD} width={bw * 0.28} height={hD} rx="3" fill="#0f4f9e" />
              <rect x={x + bw * 0.3} y={H - pad - hV} width={bw * 0.28} height={hV} rx="3" fill="#f2b200" />
              <text x={x + bw * 0.3} y={H - pad + 14} fontSize="9" textAnchor="middle" fill="var(--ink-soft)">
                {d.month}
              </text>
            </g>
          );
        })}
      </svg>
      <div className="mt-3 flex gap-4 text-xs text-[var(--ink-soft)]">
        <span className="inline-flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-sm bg-tchad-blue-600" /> Téléchargements</span>
        <span className="inline-flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-sm bg-tchad-gold-500" /> Vues</span>
      </div>
    </div>
  );
}
