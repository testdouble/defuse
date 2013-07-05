# defuse.js

[![Build Status](https://travis-ci.org/testdouble/defuse.png?branch=master)](https://travis-ci.org/testdouble/defuse)

defuse is a nifty little JavaScript library for folks who agree that it makes sense to avoid cluttering the global scope with application namespaces, but acknowledge that the various AMD/CommonJS libraries [may not be worth their cost](http://blog.testdouble.com/posts/2013-06-16-unrequired-love.html).

Defuse intends to give you 80% of the benefit of a module-y approach to code organization at 20% of the cost.

[Download defuse.js here](https://github.com/testdouble/defuse/releases)

[Note: all examples follow in CoffeeScript, which means that all variable identifiers are implied to be file-local. If you don't use CoffeeScript, you should be using [IIFE](http://benalman.com/news/2010/11/immediately-invoked-function-expression/)'s to achieve the same effect.]

## def()

To define an object or function to a given namespace or logical "path", do this:

``` coffeescript
def 'app/models/CoffeeTable',

  bookNames: ->
    # ...
```

You may also define the namespace with back-slashes (e.g. `def 'app\models\CoffeeTable', ...`) or periods (e.g. `def 'app.models.CoffeeTable', ...`). For more information on how naming conflicts are handled, check out the [extend.js](https://github.com/searls/extend.js) project, which is what defuse depends on for this behavior.

## use()

To use a previously-defined name, just call "use" and it will be returned to you.

``` coffeescript
CoffeeTable = use('app/views/CoffeeTable')

new CoffeeTable()
```

That way, your usage of CoffeeTable will be local to the file (or your IIFE, if not using CoffeeScript).

## noConflict()

If you want to be sure that defuse will not leave behind *anything* in the global scope on its own, call `noConflict`

``` coffeescript
  myLocalDefuse = defuse.noConflict()
```

This will have the effect of restoring `window.defuse`, `window.def`, and `window.use` to their original state (including `undefined` if no other script had previously assigned them.

To continue using defuse at this point, `use` and `def` are still available on the `myLocalDefuse` object for you to manage.

## Discussions

### named functions (incl. CoffeeScript classes)

There's one tricky bit here as it pertains to functions you plan to use with `new`, like CoffeeScript classes. If you don't name those functions, then you're going to have a *bad time* when it comes time to debug or profile your application at runtime, as the name of the type will be absent.

As a result, I define my CoffeeScript classes with a duplicative name, like this Backbone view:

``` coffeescript
def 'app/views/ItemList', class ItemList extends Backbone.View

  events:
    # ...

  render: ->
    # ...

```

This will ensure that objects created via `new ItemList` will be named ItemList in runtime tooling.

That's sort of lame, but if anyone can find a workaround for named functions, please show us by [filing an issue](https://github.com/testdouble/defuse/issues)!

### managing load order

Defuse doesn't do anything to try to prevent you from writing load-order-dependent code. If you attempt to `use()` a name before it's been defined, you'll see an error.

More heavyweight module libraries try to solve this entirely, but at the cost of additional implementation complexity (some of which leaks onto users in the form of increased configuration).

We recommend addressing load-order dependencies by designing our apps with it in mind, including these rules-of-thumb:

1. Limit yourself to a single "main" method in your application. Typically, that means only one callback that fires when the document is ready (e.g. `jQuery(function(){ /* a.k.a. right here */ })`).

2. Design code that waits until itself has been invoked before `use`'ing its dependencies. This will typically only fail you when you're extending another type at definition-time (e.g. `class Foo extends Bar`)

3. Adjust script load order at the directory level, as if each directory represented a self-contained package. To illustrate, suppose your application's views in `views/app` extend from general views defined in `views/super_views`, then consider adjusting the load order with globs like `['views/super_views/**/*', '**/*']`. This directory-level-globbing approach is handy, because it will typically only fail when your app commits the age-old sin of [package tangling](http://stackoverflow.com/questions/15321702/what-does-package-tangle-index-data-indicate-in-sonar).

