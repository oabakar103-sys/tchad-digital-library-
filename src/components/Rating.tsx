import { IconStar } from '@/components/icons';
import { stars } from '@/lib/utils';

export default function Rating({ rating, count, size = 14 }: { rating: number; count?: number; size?: number }) {
  const s = stars(rating);
  return (
    <span className="inline-flex items-center gap-1" title={`Note ${rating.toFixed(1)} / 5`}>
      <span className="inline-flex items-center gap-0.5 text-tchad-gold-500">
        {Array.from({ length: s.full }).map((_, i) => (
          <IconStar key={`f-${i}`} width={size} height={size} />
        ))}
        {s.half && (
          <span className="relative inline-block" style={{ width: size, height: size }}>
            <IconStar width={size} height={size} className="text-tchad-gold-200 absolute inset-0" />
            <span className="absolute inset-0 overflow-hidden" style={{ width: size / 2 }}>
              <IconStar width={size} height={size} />
            </span>
          </span>
        )}
        {Array.from({ length: s.empty }).map((_, i) => (
          <IconStar key={`e-${i}`} width={size} height={size} className="text-[var(--line)]" />
        ))}
      </span>
      <span className="text-xs text-[var(--ink-soft)]">
        {rating.toFixed(1)}
        {typeof count === 'number' && ` (${count})`}
      </span>
    </span>
  );
}
