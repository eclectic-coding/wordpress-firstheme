module.exports = {
  projectURL: "http://localhost:10013",
  styleSRC: [
    "src/assets/scss/bundle.scss",
    "src/assets/scss/admin.scss",
    "src/assets/scss/editor.scss"
  ],
  styleDEST: 'dist/assets/css',
  imagesSRC: "src/assets/images/**/*.{jpg,jpeg,png,svg,gif}",
  imagesDEST: "dist/assets/images",
  copySRC: [
    "src/assets/**/*",
    "!src/assets/{images,js,scss}",
    "!src/assets/{images,js,scss}/**/*"
  ],
  copyDEST: "dist/assets",
  scriptSRC: [
    "src/assets/js/bundle.js",
    "src/assets/js/admin.js",
    "src/assets/js/customize-preview.js",
  ],
  scriptDEST: "dist/assets/js",
  package: {
    src: [
      "**/*",
      "!.idea",
      "!node_modules{,/**}",
      "!packaged{,/**}",
      "!src{,/**}",
      "!.babelrc",
      "!.browserslistrc",
      "!.gitignore",
      "!gulpfile.babel.js",
      "!gulp.config.js",
      "!package.json",
      "!yarn.lock",
    ],
    dest: "packaged"
  },
  plugins: {
    src: [
      "../../plugins/_themename-metaboxes/packaged/*"
    ],
    dest: ["lib/plugins"]
  }
}
