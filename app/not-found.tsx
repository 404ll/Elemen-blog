import Link from 'next/link';
import Image from 'next/image';
export default function NotFound() {
  return (
    <div className="pt-20 min-h-screen flex flex-col items-center justify-center px-4">
      {/* 404 数字 */}
      <div className="relative mb-2">
        <div className="text-9xl md:text-[12rem] font-bitcount font-bold text-[#D18F31] drop-shadow-[4px_4px_0px_white,6px_6px_0px_white]">
          404
        </div>
      </div>

      <h1 className="text-4xl md:text-5xl font-bitcount font-bold text-black mb-2">
        PAGE NOT FOUND
      </h1>
        <div className="w-[700px] h-[500px] overflow-hidden">
          <Image 
            src="/not-found.png" 
            alt="dinosaur" 
            width={700} 
            height={700} 
            className="w-full h-full object-bottom object-cover" 
          />
        </div>

    </div>
  );
}

