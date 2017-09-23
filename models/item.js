class Item {
  constructor () {
    this.name = ''
    this.time = ''
    this.options = []
  }

  isVegan () {
    return this.options.includes('vegan')
  }
  isVegetarian () {
    return this.options.includes('vegetarian')
  }
}
