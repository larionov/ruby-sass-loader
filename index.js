/*
MIT License http://www.opensource.org/licenses/mit-license.php
*/

var // imports
	child_process = require('child_process')
	fs = require('fs'),
	os = require('os'),
	path = require('path'),
	async = require("async"),
	loaderUtils = require("loader-utils")
;

module.exports = function(content) {
	this.cacheable();
	// css-loader will trigger the original loader for @import statements,
	// so we could possibly be triggered for normal css files which sass can't handle properly
	// so we just return them
	if(!this.resource.match(/\.s(c|a)ss$/)) {
		return content;
	}
	var callback = this.async();
	var addDependency = this.addDependency.bind(this);
	var query = loaderUtils.parseQuery(this.query);
	var context = this.context;

	var args = [];
	if(query.context) {
		context = query.context;
	}
	if(query.compass) {
		args.push('--compass');
	}
	if(query.outputStyle) {
		args.push('--style=' + query.outputStyle);
	}
	if(query.includePaths) {
		query.includePaths.forEach(function(path) {
			args.push('--load-path=' + path);
		});
	}
	if(query.requires) {
		query.requires.forEach(function(require) {
			args.push('--require=' + require);
		});
	}

	// we always use a sourcemap to determine the dependencies, also
	// we have to use 'inline' so webpack can always determine the
	// actual content of the original file for the sourcemap
	args.push('--sourcemap=inline')

	var buildPath = query.buildPath ? query.buildPath : path.normalize(os.tmpdir() + '/ruby-sass-loader/');
	var cachePath = path.normalize(buildPath + '/sass-cache/');
	var outputPath = query.outputFile ?  path.normalize(buildPath + '/' + query.outputFile) : buildPath + (Math.random(0, 1000) + path.parse(this.resource).name) + '.css' ;
	var outputMapPath = outputPath + '.map';

	args = args.concat(['--cache-location=' + cachePath, this.resource, outputPath]);
	var sass = process.platform === "win32" ? "sass.bat" : "sass";
	child_process.execFile(sass, args, {cwd: context}, function(err, stdout, stderr) {
		if(err) {
			callback(err);
		} else {
			fs.readFile(outputPath, 'utf8', function(err, cssData) {
				if(err) {
					return callback(err);
				}

				cssData = cssData.replace(/\/\*#\s*sourceMappingURL=.*\.css\.map\s*\*\//, '');

				fs.readFile(outputMapPath, 'utf8', function(err, mapData) {
					if(err) {
						return callback(err);
					}

					// make sure webpack recompiles when an included file changes
					JSON.parse(mapData).sources.map(addDependency);
					callback(null, cssData, query.sourceMap ? mapData : null);
				});
			});
		}
	}.bind(this));

}
