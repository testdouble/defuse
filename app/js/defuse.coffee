root = this

originals =
  defuse: root.defuse
  def: root.def
  use: root.use

_ = root._
extend = root.extend.noConflict({_}) #<-- bundled, therefore noConflict'd
extend.myNamespace(hiddenNamespace = {})

class Defuse

  DELIMETER: /[./\\]/g

  def: (name, value) =>
    @extend(name, value)

  use: (name) =>
    _(name.split(@DELIMETER)).inject (parent, child) ->
      parent[child]
    , hiddenNamespace

  noConflict: (dependencies = {}) ->
    _ = dependencies._ if dependencies._?
    _(root).extend(originals)
    return this

  #private

  extend: ->
    hiddenNamespace.extend.apply(@, _(arguments).toArray())

root.defuse = new Defuse
root.def = root.defuse.def
root.use = root.defuse.use
