const { resolve } = require("path");
const HTMLWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const tailwindcss = require("tailwindcss");
const autoprefixer = require("autoprefixer");
const webpack = require("webpack");
const NodePolyfillPlugin = require("node-polyfill-webpack-plugin");

const plugins = [
  new CleanWebpackPlugin(),
  new MiniCssExtractPlugin({
    filename: "styles/[name].[contenthash].css",
    chunkFilename: "[id].[contenthash].css",
  }),
  new HTMLWebpackPlugin({
    template: "./src/roots/popup.html",
    filename: "popup.html",
    chunks: ["popup"],
  }),
  new HTMLWebpackPlugin({
    template: "./src/roots/txApproval.html",
    filename: "txApproval.html",
    chunks: ["txApproval"],
  }),
  new HTMLWebpackPlugin({
    template: "./src/roots/syncApproval.html",
    filename: "syncApproval.html",
    chunks: ["syncApproval"],
  }),
  new HTMLWebpackPlugin({
    template: "./src/roots/claimApproval.html",
    filename: "claimApproval.html",
    chunks: ["claimApproval"],
  }),
  new CopyWebpackPlugin({
    patterns: [{ from: "public", to: "." }],
  }),
  new NodePolyfillPlugin(),
  new webpack.IgnorePlugin({
    resourceRegExp: /^\.\/wordlists\/(?!english)/,
    contextRegExp: /bip39\/src$/,
  }),
];

/** @type {import('webpack').Configuration} */
module.exports = {
  mode: "development",
  devtool: "cheap-module-source-map",
  entry: {
    popup: "./src/pages/Popup.tsx",
    txApproval: "./src/pages/TxApproval/TxApproval.tsx",
    claimApproval: "./src/pages/ClaimApproval/ClaimApproval.tsx",
    syncApproval: "./src/pages/SyncApproval/SyncApproval.tsx",
    contentscript: "./src/scripts/contentscript.ts",
    backgroundscript: "./src/scripts/backgroundscript.ts",
    inpage: "./src/scripts/inpage.ts",
  },
  output: {
    filename: "[name].js",
    path: resolve(__dirname, "dist"),
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
      {
        test: /\.(css|scss|sass)$/,
        use: [
          MiniCssExtractPlugin.loader,
          "css-loader",
          "sass-loader",
          {
            loader: "postcss-loader",
            options: {
              postcssOptions: {
                ident: "postcss",
                plugins: [tailwindcss, autoprefixer],
              },
            },
          },
        ],
      },
    ],
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js", ".jsx"],
    // fallback: {
    //   fs: false,
    // },
  },
  externals: {
    fs: "require('fs')",
  },
  plugins,
};
