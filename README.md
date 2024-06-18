# CRUD Inventory Project

A simple inventory management and shopping cart system built with Node.js. This project allows you to manage an inventory of items and handle a shopping cart through command-line interface (CLI) commands.

## Table of Contents

- [Features](#features)
- [Setup](#setup)
- [Usage](#usage)
- [Recent Changes](#recent-changes)
- [License](#license)

## Features

- Add, list, view, update, and remove inventory items.
- Add items to the shopping cart, view the cart, and cancel the cart.
- Prices displayed in USD currency format.
- Persistent data storage using JSON files.

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
  node index.js add "Item Name" 1000 true "Category"
  ```

- List all inventory items:

  ```bash
  node index.js list
  ```

- View a specific inventory item by ID:

  ```bash
  node index.js view "item-id"
  ```

- Update an inventory item by ID:

  ```bash
  node index.js update "item-id" "Updated Name" 1200 false "New Category"
  ```

- Remove an inventory item by ID:

  ```bash
  node index.js remove "item-id"
  ```

- Add an item to the shopping cart:

  ```bash
  node index.js addToCart "item-id" 2
  ```

- View the shopping cart:

  ```bash
  node index.js viewCart
  ```

- Cancel the shopping cart:
  ```bash
  node index.js cancelCart
  ```
