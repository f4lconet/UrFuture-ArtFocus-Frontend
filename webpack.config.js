const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin'); // Подключили плагин HtmlWebpackPlugin для работы webpack с html
const { CleanWebpackPlugin } = require('clean-webpack-plugin'); // подключили плагин CleanWebpackPlugin для очистки папки dist при сборке
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
    entry: { 
      main: './src/components/index/index.ts',
      accountDirection: './src/components/account-direction/account-direction.ts',
      accountSettings: './src/components/account-settings/account-settings.ts',
      authorization: './src/components/authorization/authorization.ts',
      completedCourses: './src/components/completed-courses/completed-courses.ts',
      jobsLibrary: './src/components/jobs-library/jobs-library.ts',
      lkCourseUnfinished: './src/components/lk-course-unfinished/lk-course-unfinished.ts',
      recommendedJobs: './src/components/recommended-jobs/recommended-jobs.ts',
      registration: './src/components/registration/registration.ts'
    },
    output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js',
        publicPath: ''
  },
    mode: 'development',
  devServer: {
    static: path.resolve(__dirname, './dist'),
    compress: true,
    port: 8080,
    open: true
  },
    module: {
    rules: [ // rules — это массив правил
      // добавим в него объект правил для бабеля
      {
        test: /\.(js|ts)$/, // регулярное выражение, которое ищет все js файлы
        use: 'babel-loader', // при обработке этих файлов нужно использовать babel-loader
        exclude: '/node_modules/', // исключает папку node_modules, файлы в ней обрабатывать не нужно
      },
      {
        test: /\.(png|svg|jpg|gif|woff(2)?|eot|ttf|otf)$/, // регулярное выражение, которое ищет все файлы с такими расширениями
        type: 'asset/resource'
      },
      {
        // применять это правило только к CSS-файлам
        test: /\.css$/,
        // при обработке этих файлов нужно использовать
        // MiniCssExtractPlugin.loader и css-loader
        use: [MiniCssExtractPlugin.loader, {
          loader: 'css-loader',
          options: { importLoaders: 1 }
        },
      'postcss-loader']
      }
      ]
  },
  plugins: [
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin(),
    // страница index
    new HtmlWebpackPlugin({
      template: './src/pages/index.html', // путь к файлу index.html
      filename: 'index.html',
      chunks: ['main']
    }),
    new HtmlWebpackPlugin({
      template: './src/pages/account-direction.html',
      filename: 'account-direction.html',
      chunks: ['accountDirection']
    }),
    new HtmlWebpackPlugin({
      template: './src/pages/account-settings.html',
      filename: 'account-settings.html',
      chunks: ['accountSettings']
    }),
    new HtmlWebpackPlugin({
      template: './src/pages/authorization.html',
      filename: 'authorization.html',
      chunks: ['authorization']
    }),
    new HtmlWebpackPlugin({
      template: './src/pages/completed-courses.html',
      filename: 'completed-courses.html',
      chunks: ['completedCourses']
    }),
    new HtmlWebpackPlugin({
      template: './src/pages/jobs-library.html',
      filename: 'jobs-library.html',
      chunks: ['jobsLibrary']
    }),
    new HtmlWebpackPlugin({
      template: './src/pages/lk-course-unfinished.html',
      filename: 'lk-course-unfinished.html',
      chunks: ['lkCourseUnfinished']
    }),
    new HtmlWebpackPlugin({
      template: './src/pages/recommended-jobs.html',
      filename: 'recommended-jobs.html',
      chunks: ['recommendedJobs']
    }),
    new HtmlWebpackPlugin({
      template: './src/pages/registration.html',
      filename: 'registration.html',
      chunks: ['registration']
    }),
  ],

};