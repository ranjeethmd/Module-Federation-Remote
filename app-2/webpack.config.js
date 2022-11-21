const HtmlWebpackPlugin = require("html-webpack-plugin");
const path = require("path");
const webpack = require("webpack"); // only add this if you don't have yet
const { ModuleFederationPlugin } = require("webpack").container;
const deps = require("./package.json").dependencies;

const buildDate = new Date();

module.exports = (env, argv) => {
  const mode = "production";
  console.log({ mode });
  return {
    performance: {
      hints: false,
    },
    entry: `./src/index.tsx`,
    output: {
      path: path.resolve(__dirname, "___dist___"),

      /*
        Take care to make sure this is unique!
        If you are serving from 1 server. All chunks
        have to go into 1 folder. Duplicated names
        will get files overwritten.
      */

      filename: "app-2-module.js",
    },
    devServer: {
      port: 3001,
      open: false,
    },
    devtool: "inline-source-map",
    mode,
    resolve: {
      extensions: [".ts", ".tsx", ".js"],
    },
    module: {
      rules: [
        {
          test: /\.(js|jsx|tsx|ts)$/,
          loader: "ts-loader",
          exclude: /node_modules/,
        },
        {
          test: /\.css$/i,
          use: ["style-loader", "css-loader"],
        },
      ],
    },
    plugins: [
      new webpack.EnvironmentPlugin({
        BUILD_DATE: buildDate.toISOString(),
      }),
      new webpack.DefinePlugin({
        "process.env": JSON.stringify(process.env),
      }),
      new ModuleFederationPlugin({
        /*
          The name should be different from app-1's
        */
        name: "app2",
        /*
          We want to differentiate this too.
        */
        filename: "app2.js",
        exposes: {
          /* 
            expose each component
            I am calling this component CounterApp2
          */
          "./CounterApp2": "./src/components/Counter",
        },
        shared: {
          ...deps,
          react: { singleton: true, eager: true, requiredVersion: deps.react },
          "react-dom": {
            singleton: true,
            eager: true,
            requiredVersion: deps["react-dom"],
          },
        },
      }),
      new HtmlWebpackPlugin({
        template: `./public/index.html`,
      }),
    ],
  };
};
