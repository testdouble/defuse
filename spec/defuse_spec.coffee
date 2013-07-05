describe "defuse", ->
  Given -> @subject = defuse

  describe ".def+.use", ->
    Given -> @value = kaka: 'pants'

    When -> @subject.def(@address, @value)
    And -> @result = @subject.use(@address)

    context "top-level", ->
      Given -> @address = 'foo'
      Then -> expect(@result).toEqual(@value)

    context "2-level", ->
      Given -> @address = 'foo/bar'
      Then -> expect(@result).toEqual(@value)

    context "5-level", ->
      Given -> @address = 'foo/bar/biz/baz/boo'
      Then -> expect(@result).toEqual(@value)

  describe ".noConflict", ->
    Given -> @defuseLib = window.defuse
    When -> @result = @subject.noConflict()

    # see vendor/js/conflicting_library.js
    Then -> window.defuse = "OG defuse"
    And -> window.def = "OG def"
    And -> window.use = "OG use"
    And -> @result == @defuseLib

    afterEach ->
      window.defuse = @result
      window.def = @result.def
      window.use = @result.use
