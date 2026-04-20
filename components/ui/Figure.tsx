import Image from "next/image";

type FigureProps = {
  src: string;
  alt: string;
  caption?: string;
  width?: number;
  height?: number;
};

export default function Figure({
  src,
  alt,
  caption,
  width = 1200,
  height = 675,
}: FigureProps) {
  return (
    <figure className="my-10">
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        className="w-full rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm"
      />
      {(caption || alt) && (
        <figcaption className="mt-3 text-center text-sm text-gray-600 dark:text-gray-400">
          {caption || alt}
        </figcaption>
      )}
    </figure>
  );
}
