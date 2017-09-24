function Item (name) {
  this.name = name
  this.options = []

  this.isVegan = function () {
    return this.options.includes('vegan')
  }
  this.isVegetarian = function () {
    return this.options.includes('vegetarian')
  }
}

module.exports = Item
