/* extend - 0.0.3
 * a teeny-tiny JavaScript namespacing script 
 * https://github.com/searls/extend.js
 */
(function() {
  var isExtensible, makeExtender, originalExtend, resolveAncestors, verifyDistinctness;

  makeExtender = function(top) {
    return function(name, value) {
      var ancestors, leaf, parent;

      ancestors = name.split(/[./\\]/g);
      leaf = ancestors.pop();
      parent = resolveAncestors(ancestors, top);
      verifyDistinctness(name, value, parent[leaf]);
      if (isExtensible(parent[leaf], value)) {
        _(parent[leaf]).extend(value);
      } else if (arguments.length > 1) {
        parent[leaf] = value;
      }
      return parent[leaf];
    };
  };

  isExtensible = function(existing, value) {
    return (existing != null) && !_(value).isFunction() && !_(existing).isFunction();
  };

  resolveAncestors = function(ancestors, top) {
    return _(ancestors).reduce(function(ancestor, child) {
      return ancestor[child] || (ancestor[child] = {});
    }, top);
  };

  verifyDistinctness = function(name, value, existing) {
    if (_(existing).isFunction() && (value != null) && existing !== value) {
      throw "Cannot define a new function \"" + name + "\", because one is already defined.";
    }
  };

  originalExtend = window.extend;

  window.extend = makeExtender(window);

  window.extend.myNamespace = function(namespace) {
    return namespace.extend = makeExtender(namespace);
  };

  window.extend.noConflict = function() {
    var ourExtend;

    ourExtend = window.extend;
    window.extend = originalExtend;
    return ourExtend;
  };

}).call(this);
