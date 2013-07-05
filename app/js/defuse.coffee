root = this

originals =
  defuse: window.defuse
  def: window.def
  use: window.use

class Defuse

  DELIMETER: /[./\\]/g

  def: (namespace, value) =>
    @extend(namespace, value)

  use: (name) =>
    _(name.split(@DELIMETER)).inject (parent, child) ->
      parent[child]
    , @namespace()

  reset: =>
    @_namespace = undefined

  noConflict: ->
    _(window).extend(originals)
    return this

  #private

  extend: ->
    @namespace().extend.apply(@, _(arguments).toArray())

  namespace: _.memoize ->
    _({}).tap (n) =>
      @extendJs().myNamespace(n)

  extendJs: _.memoize ->
    extend.noConflict()

root.defuse = new Defuse

_(this).extend
  def: defuse.def
  use: defuse.use
