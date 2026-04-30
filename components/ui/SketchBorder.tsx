interface SketchBorderProps {
  children: React.ReactNode;
  className?: string;
}

export default function SketchBorder({ children, className = "" }: SketchBorderProps) {
  return (
    <div className={`relative ${className}`}>
      <svg
        className="pointer-events-none absolute inset-0 h-full w-full overflow-visible text-black dark:text-white"
        viewBox="0 0 400 200"
        preserveAspectRatio="none"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M4,4 Q100,2 200,3 Q300,1 396,4 Q398,50 397,100 Q398,150 396,196 Q300,198 200,197 Q100,199 4,196 Q2,150 3,100 Q2,50 4,4Z"
          stroke="currentColor"
          strokeWidth="1.5"
        />
      </svg>
      {children}
    </div>
  );
}
