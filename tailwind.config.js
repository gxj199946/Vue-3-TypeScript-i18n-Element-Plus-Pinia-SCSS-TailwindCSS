/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  darkMode: 'class', // 添加这一行来启用基于类的暗色模式
  theme: {
    extend: {
      // 在这里可以添加自定义的主题变量
      colors: {
        // 示例：
        // primary: '#3490dc',
        // secondary: '#ffed4a',
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography')
  ],
}