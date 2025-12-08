import Image from "next/image";

export default function SelfCard() {
  return (
    <div className="max-w-xl mx-auto mt-10">
      {/* 外层容器：设置白色背景，黑色粗边框， */}
      <div className="bg-white border-4 border-black rounded-xl py-4 px-2 transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
        
        <div className="flex flex-col items-start text-black space-y-4">   
            <div className="flex items-center gap-2">
                <Image 
                    src="/icon/sun.png" 
                    alt="logo" 
                    width={100} 
                    height={100} 
                    className="w-10 h-10 bg-yellow-100 p-2 rounded-full" 
                />
                 {/* 标题：加粗，加大间距 */}
            <span className="text-2xl font-bold tracking-tight">
                Hello, I'm Elemen
            </span>
            </div>

            {/* 标签栏 */}
            <div className="flex gap-4 flex-wrap">
                <span className="px-2 py-1 bg-blue-100  border-black text-xs font-bold rounded-md">Web Dev</span>
                <span className="px-2 py-1 bg-purple-100  border-black text-xs font-bold rounded-md">Blockchain Dev</span>
            </div>

            {/* 正文*/}
            <div className="text-lg leading-relaxed text-gray-700">
                <ul className="list-inside space-y-2">
                    <li>Welcome to my blog ! </li>
                    <li>I am a web developer and a blockchain developer.</li>
                    <li>I like to learn new things and share them with others.</li>
                </ul>
            </div>

            {/* 底部装饰 */}
            {/* <div className="pt-4 flex gap-4">
                 <button className="px-6 py-2 bg-black text-white font-bold border-2 border-transparent hover:bg-white hover:text-black hover:border-black transition-colors">
                    Read More
                 </button>
            </div> */}
        </div>
      </div>
    </div>
  );
}