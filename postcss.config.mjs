//这个文件是用来配置PostCSS的，PostCSS是一个CSS预处理器，它可以帮助我们更方便地编写CSS代码。
//它的工作原理是：它会在CSS代码中查找特定的规则，然后根据这些规则生成新的CSS代码。
const config = {
  plugins: {
    "@tailwindcss/postcss": {},
  },
};

export default config;

