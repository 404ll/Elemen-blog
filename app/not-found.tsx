import Image from 'next/image';
export default function NotFound() {
  return (
    <div className="min-h-[calc(100svh-1.5rem)] flex flex-col items-center justify-center px-4 pt-16 pb-4 overflow-hidden">
      <div className="relative mb-1">
        <div className="text-7xl sm:text-8xl md:text-[10rem] leading-none font-bitcount font-bold text-[#D18F31] drop-shadow-[4px_4px_0px_white,6px_6px_0px_white]">
          404
        </div>
      </div>

      <h1 className="text-2xl sm:text-3xl md:text-4xl font-bitcount font-bold text-black mb-2 text-center">
        PAGE NOT FOUND
      </h1>
      <div className="w-[min(88vw,560px)] h-[min(42svh,340px)]">
        <Image
          src="/not-found.png"
          alt="dinosaur"
          width={500}
          height={500}
          className="w-full h-full object-contain"
          priority
        />
      </div>

    </div>
  );
}
