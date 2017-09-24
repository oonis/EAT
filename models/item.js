function Item (name) {
  this.name = name
  this.options = []

  this.isVegan = function () {
    return this.options.includes('vegan')
  }
  this.isVegetarian = function () {
    return this.options.includes('vegetarian')
  }
  this.hasBeef = function () {
      return this.options.includes('beef')
  }
  this.hasPork = function () {
      return this.options.includes('pork')
  }
}

module.exports = Item
