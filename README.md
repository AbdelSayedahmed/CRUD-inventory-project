Here's an updated version of your README to include all the recent changes and enhancements to your project:

# CRUD Inventory Project

A simple inventory management and shopping cart system built with Node.js. This project allows you to manage an inventory of items and handle a shopping cart through command-line interface (CLI) commands.

## Table of Contents

- [Features](#features)
- [Setup](#setup)
- [Usage](#usage)
- [Interactive Menu](#interactive-menu)
- [Recent Changes](#recent-changes)
- [License](#license)

## Features

- Add, list, view, update, and remove inventory items.
- Add items to the shopping cart, view the cart, and cancel the cart.
- Filter inventory items by properties.
- Prices displayed in USD currency format.
- Persistent data storage using JSON files.
- Enhanced CLI experience with colorful output using Chalk.
- Interactive menu for easier navigation.
- Unit testing with Jest.

## Setup

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/crud-inventory-project.git
   cd crud-inventory-project
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create `inventory.json` and `cart.json` files in the project root directory:

   ```json
   // inventory.json
   []
   ```

   ```json
   // cart.json
   []
   ```

## Usage

Run the script using Node.js followed by the desired command and arguments:

- Add a new inventory item:

  ```bash
  add "Item Name" 1000 true "Category"
  ```

- List all inventory items:

  ```bash
  list
  ```

- View a specific inventory item by ID:

  ```bash
  view "item-id"
  ```

- Update an inventory item by ID:

  ```bash
  update "item-id" "Updated Name" 1200 false "New Category"
  ```

- Remove an inventory item by ID:

  ```bash
  remove "item-id"
  ```

- Add an item to the shopping cart:

  ```bash
  addToCart "Item Name" 2
  ```

- View the shopping cart:

  ```bash
  viewCart
  ```

- Cancel the shopping cart:

  ```bash
  cancelCart
  ```

- Filter inventory items:

  ```bash
  filter "inStock" "true"
  filter "priceGreaterThan" 1000
  filter "priceLessThan" 500
  ```

## Interactive Menu

For an interactive CLI experience, simply run:

```bash
node index.js
```

This will prompt you to choose actions and provide inputs interactively.

## Recent Changes

- **Added**: Interactive menu using readline.
- **Added**: Filtering functionality for inventory items.
- **Added**: Unit tests with Jest.
- **Added**: Chalk for colorful CLI output.
