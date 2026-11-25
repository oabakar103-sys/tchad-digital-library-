interface Props {
  className?: string;
  withText?: boolean;
}

/** Logo : livre ouvert + baobab silhouetté, aux couleurs du drapeau tchadien. */
export default function Logo({ className = 'h-9 w-9', withText = true }: Props) {
  return (
    <span className="inline-flex items-center gap-2.5">
      <svg viewBox="0 0 64 64" className={className} role="img" aria-label="Tchad Digital Library">
        <defs>
          <linearGradient id="tdl-book" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#0f4f9e" />
            <stop offset="1" stopColor="#082f66" />
          </linearGradient>
        </defs>
        {/* pages du livre */}
        <path d="M32 14C25 8.5 15.5 7.5 7 10.5V46c8.5-3 18-2 25 3.5V14z" fill="url(#tdl-book)" />
        <path d="M32 14c7-5.5 16.5-6.5 25-3.5V46c-8.5-3-18-2-25 3.5V14z" fill="#f2b200" opacity="0.95" />
        <path d="M32 14v35.5" stroke="#062450" strokeWidth="1.6" fill="none" />
        {/* baobab sur la page de droite */}
        <g fill="#85091e">
          <path d="M44 40c-.6-5 .4-9.5 2.6-13 .8 3.4.6 7.4-.8 12.9z" />
          <path d="M46.5 27c-4.6 0-7.4-2.4-7.4-5.2 0-2.2 1.9-3.8 4.2-3.8.8 0 1.5.2 2.1.5 1-1.6 3-2.5 5-2.1 2.3.4 3.8 2.2 3.6 4.4 2 .5 3.2 2 3 3.9-.3 2.4-3.2 3.8-7.5 3.8z" />
          <path d="M39.5 40.5h14" stroke="#85091e" strokeWidth="2" strokeLinecap="round" />
        </g>
      </svg>
      {withText && (
        <span className="leading-tight">
          <span className="block font-serif font-bold text-tchad-blue-700 dark:text-tchad-gold-300 text-base sm:text-lg">
            Tchad Digital
          </span>
          <span className="block text-[11px] uppercase tracking-[0.22em] text-tchad-red-600 dark:text-tchad-gold-400">
            Library
          </span>
        </span>
      )}
    </span>
  );
}
