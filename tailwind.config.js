module.exports = {
    content: {
      relative: true,
      files: [
          "./views/*.ejs",
          "./views/**/*.ejs",
          "./views/product_list.ejs",
          "/views/product_list.ejs",
          "views/product_list.ejs",
          "./static/test.html",
          "./static/*.html",
          "**/*.html"
      ]
    },
    theme: {
      extend: {},
    },
    plugins: [],
  };