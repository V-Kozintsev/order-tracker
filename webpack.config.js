// webpack.config.js
const path = require("path");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  entry: "./frontend/src/index.jsx", // Точка входа - правильно
  output: {
    filename: "main.js", // Имя выходного файла
    path: path.resolve(__dirname, "dist"), // Папка для выходных файлов
    clean: true, // Очистка папки dist перед сборкой
    publicPath: "/", //  Важно для развертывания (относительно корня сайта)
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      filename: "index.html", //  Имя выходного HTML-файла
      template: "public/index.html", // Шаблон HTML-файла
    }),
  ],
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/, //  Обрабатываем .js и .jsx файлы
        exclude: /node_modules/, //  Исключаем node_modules
        use: {
          loader: "babel-loader", //  Используем babel-loader
        },
      },
      {
        test: /\.css$/, // Обрабатываем .css файлы
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.(png|jpg|gif|svg|eot|ttf|woff|woff2)$/, //  Обработка изображений и шрифтов
        type: "asset/resource", //  Используем asset module
      },
    ],
  },
  devServer: {
    static: {
      directory: path.join(__dirname, "public"), //  Папка для статики
    },
    compress: true, // Включаем сжатие
    port: 3000, //  Порт для dev-сервера (измените, если нужно)
    open: true, //  Автоматически открываем браузер
    historyApiFallback: true, //  Важно для SPA (обработка маршрутизации)
  },
  resolve: {
    extensions: [".js", ".jsx", ".css"], //  Разрешаем импорт без указания расширения
  },
};
