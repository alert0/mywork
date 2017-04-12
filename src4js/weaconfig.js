var ExtractTextPlugin = require('extract-text-webpack-plugin');
var path = require('path');
var webpack = require('webpack');
var marked = require("marked");

exports.create = function(obj, mode, node_env) {

	node_env = node_env == "" ? null : node_env;

	var output = obj.output.split("/");

	marked.setOptions({
		gfm: true,
		tables: true,
		breaks: false,
		pedantic: false,
		sanitize: false,
		smartLists: true,
		smartypants: false
	});

	marked.setOptions({
		highlight: function(code) {
			//console.log("code:",code);
			return require('highlight.js').highlightAuto(code, ["javascript", "html", "java"]).value;
		}
	});

	var renderer = new marked.Renderer();

	var plugins = [];

	if(node_env != "development") {
		plugins.push(new webpack.optimize.UglifyJsPlugin({
			compress: {
				warnings: false
			},
			output: {
				comments: false
			}
		}));
	}

	plugins.push(new ExtractTextPlugin(obj.styleUrl, {
		disable: obj.styleUrl ? false : true,
		allChunks: true,
	}));

	plugins.push(new webpack.DefinePlugin({
		'process.env.NODE_ENV': "'" + node_env + "'" || "'production'" //production
	}));

	var wp4ec = {
		entry: obj.entry,
		output: {
			filename: obj.output
		},
		plugins: plugins,
		externals: [
			{ 'react': 'React' },
			{ 'react-dom': 'ReactDOM' },
			{ 'antd': 'antd' },
			{ 'weaCom': 'weaCom' },
			{ 'jquery': 'jQuery' },
			{ 'weaWorkflow': 'weaWorkflow' },
			{ 'weaPortal': 'weaPortal' },
			{ 'ecCom': 'ecCom' },
			{ '$': '$' }
		],
		module: {
			loaders: [
				{ test: /\.md$/, loader: "html!markdown" },
				{ test: /\.js$/, exclude: /node_modules/, loader: 'babel-loader' },
				{ test: /\.jsx$/, exclude: /node_modules/, loader: 'babel-loader' },
				{ test: /\.css$/, loader: ExtractTextPlugin.extract("style-loader", "css-loader" + (obj.ismobile ? "!postcss-loader?sourceMap=inline" : "")) },
				//{ test: /\.css$/, loader: ExtractTextPlugin.extract("style-loader" + (obj.ismobile ? "!postcss-loader" : ""), "css-loader" + (obj.ismobile ? "!postcss-loader" : "")) },
				{ test: /\.jpe?g$|\.gif$|\.eot$|\.png$|\.svg$|\.woff$|\.woff2$|\.ttf$/, loader: "file" },
				{ test: /\.less$/, loader: ExtractTextPlugin.extract("style-loader", "css-loader" + (obj.ismobile ? "!postcss-loader" : "") + "!less-loader") }
				//{ test: /\.less$/, loader: ExtractTextPlugin.extract("css!less" + (obj.ismobile ? "" : "")) }
			]
		},
		resolve: {
			extensions: ['', '.web.js', '.js', '.jsx', '.json'],
		},
		babel: {
			plugins: []
		},
		postcss: [],
		markdownLoader: {
			renderer: renderer
		}
	};

	const pxtorem = require('postcss-pxtorem');

	if(obj.outputlib) {
		wp4ec.output.library = obj.outputlib.library;
		wp4ec.output.libraryTarget = obj.outputlib.libraryTarget;
	}

	if(obj.ismobile) {
		wp4ec.babel.plugins.push('transform-runtime');
		wp4ec.babel.plugins.push(['antd', {
			style: 'css', // if true, use less
			libraryName: 'antd-mobile'
		}]);
		wp4ec.postcss.push(pxtorem({
			rootValue: 100,
			propWhiteList: [],
		}));
		//console.log("wp4ec:",wp4ec);
	}
	return "release" === mode ? wp4ec : function(webpackConfig) {
		webpackConfig.entry = { index: obj.entry };
		webpackConfig.externals = [
			{ 'react': 'React' },
			{ 'react-dom': 'ReactDOM' },
			{ 'antd': 'antd' },
			{ 'weaCom': 'weaCom' },
			{ 'weaWorkflow': 'weaWorkflow' },
			{ 'weaPortal': 'weaPortal' },
			{ 'ecCom': 'ecCom' }
		];
		if(obj.ismobile) {
			webpackConfig.babel.plugins.push('transform-runtime');
			webpackConfig.babel.plugins.push(['antd', {
				style: 'css', // if true, use less
				libraryName: 'antd-mobile'
			}]);
			webpackConfig.postcss.push(pxtorem({
				rootValue: 100,
				propWhiteList: [],
			}));
		} else {
			webpackConfig.babel.plugins.push('antd');
		}
		//console.log(webpackConfig.module.loaders);
		return webpackConfig;
	};
}