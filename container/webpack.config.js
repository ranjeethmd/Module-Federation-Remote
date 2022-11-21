/*
  Note:
  1. This is a JS file
  2. This exports a FUNCTION (not an object)
*/

const HtmlWebpackPlugin = require("html-webpack-plugin");
const path = require("path");
const webpack = require("webpack"); // only add this if you don't have yet
const { ModuleFederationPlugin } = webpack.container;
const deps = require("./package.json").dependencies;

module.exports = (env, argv) => {
  const buildDate = new Date();
  const mode = "production";
  console.log({ mode });
  return {
    /*
      disable chunk size warning
    */
    performance: {
      hints: false,
    },

    /*
      entry point declaraion
      multiple entry points are possible:
      { output_filename: input_filename }
    */
    entry: `./src/index.tsx`,

    /*
      output filename here.
      feel free to change to something more salient.
    */
    output: {
      path: path.resolve(__dirname, "___dist___"),

      /*
        Take care to make sure this is unique!
        If you are serving from 1 server. All chunks
        have to go into 1 folder. Duplicated names
        will get files overwritten.
      */

      filename: "container.frontend.js",
    },

    /*
      if !(mode = production), insert
      inline source map
    */
    devtool: "inline-source-map",

    // production or development or none
    mode,

    // used by webpack serve
    devServer: {
      port: 3000,
      open: true,
    },

    /*
      tells webpack to care about files of these extensions
    */
    resolve: {
      extensions: [".ts", ".tsx", ".js"],
    },

    /*
      tells webpack which loader to use to handle files
    */
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

    // webpack plugins
    plugins: [
      /*
        tells webpack bundle metadata
      */
      new webpack.EnvironmentPlugin({
        BUILD_DATE: buildDate.toISOString(),
      }),

      /*
        tells webpack to set up process.env.* on bundling
      */
      new webpack.DefinePlugin({
        "process.env": JSON.stringify(process.env),
      }),

      /*
        This is it, people:
        !!!module federation!!!
      */
      new ModuleFederationPlugin({
        name: "container",
        /*
          remote dependencies
          note:
          1. the name/ref
          2. by 'app1@components/remoteEntry.js', we are saying that 
             these remote components are coming out of the same server
             
             if this undesirable, we define it this way:
             'app1@https://somewhere.else.com:4321/app1.js'
        */
        remotes: {
          app1: `app1@http://localhost:5000/components/app1.js`,
          app2: `app2@http://localhost:8080/components/app2.js`,
        },

        /*
          declare the modules that are shared among remote modules
          note special treatment of react
          and react-dom with singleton set true
          this may be needed to be toggled
          for some other libs
        */
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

      /*
        this hooks container.frontend.js into public/index.html
      */
      new HtmlWebpackPlugin({
        template: `./public/index.html`,
      }),
    ],
  };
};
