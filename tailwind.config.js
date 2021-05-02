// tailwind.config.js
module.exports = {
  purge: {
    content: [
      './pages/**/*.tsx',
      './components/**/*.tsx'
    ],
    options: {
      safelist: ['bg-gray-200', 'bg-green-200', 'bg-yellow-200']
    }
  }
}