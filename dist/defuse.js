/* defuse - 0.1.0
 * An API to define and use JavaScript in a module-y way. And nothing else.
 * https://github.com/testdouble/defuse
 */
(function() {
  var Defuse, extend, hiddenNamespace, originals, root, _,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  root = this;

  originals = {
    defuse: root.defuse,
    def: root.def,
    use: root.use
  };

  _ = root._;

  extend = root.extend.noConflict({
    _: _
  });

  extend.myNamespace(hiddenNamespace = {});

  Defuse = (function() {
    function Defuse() {
      this.use = __bind(this.use, this);
      this.def = __bind(this.def, this);
    }

    Defuse.prototype.DELIMETER = /[./\\]/g;

    Defuse.prototype.def = function(name, value) {
      return this.extend(name, value);
    };

    Defuse.prototype.use = function(name) {
      return _(name.split(this.DELIMETER)).inject(function(parent, child) {
        return parent[child];
      }, hiddenNamespace);
    };

    Defuse.prototype.noConflict = function(dependencies) {
      if (dependencies == null) {
        dependencies = {};
      }
      if (dependencies._ != null) {
        _ = dependencies._;
      }
      _(root).extend(originals);
      return this;
    };

    Defuse.prototype.extend = function() {
      return hiddenNamespace.extend.apply(this, _(arguments).toArray());
    };

    return Defuse;

  })();

  root.defuse = new Defuse;

  root.def = root.defuse.def;

  root.use = root.defuse.use;

}).call(this);

/* extend - 0.2.0
 * a teeny-tiny JavaScript namespacing script 
 * https://github.com/searls/extend.js
 */
(function() {
  var makeExtender, originalExtend, preserveLeaf, resolveAncestors, root, _,
    __slice = [].slice;

  root = this;

  _ = root._;

  makeExtender = function(top) {
    return function() {
      var ancestors, leaf, name, parent, values, _ref;
      name = arguments[0], values = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
      ancestors = name.split(/[./\\]/g);
      leaf = ancestors.pop();
      parent = resolveAncestors(ancestors, top);
      if (preserveLeaf(parent[leaf])) {
        return (_ref = _(parent[leaf])).extend.apply(_ref, values);
      } else {
        return parent[leaf] = _.extend.apply(_, values);
      }
    };
  };

  resolveAncestors = function(ancestors, top) {
    return _(ancestors).reduce(function(ancestor, child) {
      return ancestor[child] || (ancestor[child] = {});
    }, top);
  };

  preserveLeaf = function(leaf) {
    return _(leaf).isFunction() || !_(leaf).isEmpty();
  };

  originalExtend = root.extend;

  root.extend = makeExtender(window);

  root.extend.myNamespace = function(namespace) {
    return namespace.extend = makeExtender(namespace);
  };

  root.extend.noConflict = function(dependencies) {
    var ourExtend;
    if (dependencies == null) {
      dependencies = {};
    }
    if (dependencies._ != null) {
      _ = dependencies._;
    }
    ourExtend = root.extend;
    root.extend = originalExtend;
    return ourExtend;
  };

}).call(this);
