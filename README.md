# sass loader for [webpack](http://webpack.github.io/)


## Setup

Use `style!css!ruby-sass` as the loader in your `webpack.config`. If you want to generate source maps use `css?sourceMap` instead of `css`. Supply any of the options as query string to ruby-sass like `ruby-sass?requires[]=sass-globbing&outputStyle=nested`

### Options

#### compass
Enabled the --compass argument.

#### outputStyle
Controls the --style argument. See [Output Style](http://sass-lang.com/documentation/file.SASS_REFERENCE.html#output_style) for allowed values.

#### includePaths[]
Controls the --load-path argument. See [@-Rules and Directives](http://sass-lang.com/documentation/file.SASS_REFERENCE.html#directives).

#### requires[]
Controls the --require argument.

#### buildPath
Specify a custom build path. If not given the sass and cache files will be compiled in a temporary directory (os.tmpdir() + '/ruby-sass-loader')


### Example

``` javascript
module.exports = {
  module: {
    loaders: [
      {
        test: /\.scss$/,
        loader: 'style!css?sourceMap!ruby-sass'
      }
    ]
  }
};
```

## Install

`npm install ruby-sass-loader`

## License

[MIT](http://www.opensource.org/licenses/mit-license.php)