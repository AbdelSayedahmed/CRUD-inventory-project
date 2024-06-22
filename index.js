const fs = require("fs");
const { nanoid } = require("nanoid");
const chalk = require("chalk");
const readline = require("readline");

const inventoryFile = "inventory.json";
const cartFile = "cart.json";

// Helpers
const pricer = (input) =>
  (input / 100).toLocaleString("en-US", { style: "currency", currency: "USD" });

const readFile = (file) => {
  try {
    const data = fs.readFileSync(file, "utf8");
    return JSON.parse(data);
  } catch (err) {
    console.error(`Error reading ${file}:`, err);
    return [];
  }
};

const writeFile = (file, data) => {
  try {
    fs.writeFileSync(file, JSON.stringify(data, null, 2));
    console.log(`${file} saved successfully.`);
  } catch (err) {
    console.error(`Error saving ${file}:`, err);
  }
};

const readInventory = () => readFile(inventoryFile);
const saveInventory = (data) => writeFile(inventoryFile, data);
const readCart = () => readFile(cartFile);
const saveCart = (data) => writeFile(cartFile, data);

// Inventory modifiers
const add = (name, priceInCents, inStock, category) => {
  const inventory = readInventory();
  const newItem = {
    id: nanoid(),
    name,
    priceInCents: parseInt(priceInCents, 10),
    inStock: inStock === "true",
    category,
  };
  inventory.push(newItem);
  saveInventory(inventory);
};

const list = () => {
  const inventory = readInventory();
  inventory.forEach((item) => {
    console.log(
      chalk.blue(`${item.name}`) +
        ` -- Category: ${chalk.green(item.category)} -- Price: ${chalk.yellow(
          pricer(item.priceInCents)
        )} -- ${
          item.inStock ? chalk.green("In stock") : chalk.red("Not in stock")
        } -- id: ${chalk.cyan(item.id)}`
    );
  });
};

const view = (id) => {
  const inventory = readInventory();
  const item = inventory.find((item) => item.id === id);
  if (item) {
    console.log(chalk.blue(`Name: ${item.name}`));
    console.log(chalk.yellow(`Price: ${pricer(item.priceInCents)}`));
    console.log(chalk.green(`In stock: ${item.inStock}`));
    console.log(chalk.green(`Category: ${item.category}`));
  } else {
    console.log(chalk.red("Item not found."));
  }
};

const update = (id, name, priceInCents, inStock, category) => {
  const inventory = readInventory();
  const item = inventory.find((item) => item.id === id);
  if (item) {
    item.name = name;
    item.priceInCents = parseInt(priceInCents, 10);
    item.inStock = inStock === "true";
    item.category = category;
    saveInventory(inventory);
  } else {
    console.log(chalk.red("Item not found."));
  }
};

const remove = (id) => {
  const inventory = readInventory();
  const result = inventory.filter((item) => item.id !== id);
  if (result.length < inventory.length) {
    saveInventory(result);
  } else {
    console.log(chalk.red("Item not found."));
  }
};

// Cart functions
const addToCart = (name, quantity) => {
  const inventory = readInventory();
  const item = inventory.find(
    (item) => item.name.toLowerCase() === name.toLowerCase()
  );

  if (!item) {
    console.log(chalk.red("Item not found."));
    return;
  }

  const cart = readCart();
  const cartItem = cart.find((cartItem) => cartItem.id === item.id);

  if (cartItem) {
    cartItem.quantity += parseInt(quantity, 10);
  } else {
    cart.push({
      ...item,
      quantity: parseInt(quantity, 10),
    });
  }

  saveCart(cart);
};

const viewCart = () => {
  const cart = readCart();
  if (cart.length === 0) {
    console.log(chalk.blue("Cart is empty."));
    return;
  }

  let total = 0;
  cart.forEach((item) => {
    const itemTotal = item.priceInCents * item.quantity;
    total += itemTotal;
    console.log(
      chalk.blue(`${item.name}`) +
        ` -- ${chalk.green(item.quantity)} x ${chalk.yellow(
          pricer(item.priceInCents)
        )} = ${chalk.yellow(pricer(itemTotal))}`
    );
  });
  console.log(chalk.blue(`Total: ${pricer(total)}`));
};

const cancelCart = () => {
  saveCart([]);
  console.log(chalk.green("Cart has been emptied."));
};

const filter = (property, value) => {
  const inventory = readInventory();
  let filteredItems;

  switch (property) {
    case "inStock":
      const inStock = value === "true";
      filteredItems = inventory.filter((item) => item.inStock === inStock);
      break;
    case "priceGreaterThan":
      const minPrice = parseInt(value, 10);
      filteredItems = inventory.filter((item) => item.priceInCents > minPrice);
      break;
    case "priceLessThan":
      const maxPrice = parseInt(value, 10);
      filteredItems = inventory.filter((item) => item.priceInCents < maxPrice);
      break;
    default:
      filteredItems = [];
      break;
  }

  if (filteredItems.length > 0) {
    filteredItems.forEach((item) => {
      console.log(
        chalk.blue(`${item.name}`) +
          ` -- Category: ${chalk.green(item.category)} -- Price: ${chalk.yellow(
            pricer(item.priceInCents)
          )} -- ${
            item.inStock ? chalk.green("In stock") : chalk.red("Not in stock")
          } -- id: ${chalk.cyan(item.id)}`
      );
    });
  } else {
    console.log(chalk.red("No items match your criteria."));
  }
};

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const interactiveMenu = () => {
  rl.question(
    "Choose an action (add, list, view, update, remove, addToCart, viewCart, cancelCart, filter): ",
    (action) => {
      switch (action) {
        case "add":
          rl.question(
            "Enter name, priceInCents, inStock, category: ",
            (input) => {
              const [name, priceInCents, inStock, category] = input.split(" ");
              add(name, priceInCents, inStock, category);
              rl.close();
            }
          );
          break;
        case "list":
          list();
          rl.close();
          break;
        case "view":
          rl.question("Enter item id: ", (id) => {
            view(id);
            rl.close();
          });
          break;
        case "update":
          rl.question(
            "Enter id, name, priceInCents, inStock, category: ",
            (input) => {
              const [id, name, priceInCents, inStock, category] =
                input.split(" ");
              update(id, name, priceInCents, inStock, category);
              rl.close();
            }
          );
          break;
        case "remove":
          rl.question("Enter item id: ", (id) => {
            remove(id);
            rl.close();
          });
          break;
        case "addToCart":
          rl.question("Enter name, quantity: ", (input) => {
            const [name, quantity] = input.split(" ");
            addToCart(name, quantity);
            rl.close();
          });
          break;
        case "viewCart":
          viewCart();
          rl.close();
          break;
        case "cancelCart":
          cancelCart();
          rl.close();
          break;
        case "filter":
          rl.question("Enter property and value: ", (input) => {
            const [property, value] = input.split(" ");
            filter(property, value);
            rl.close();
          });
          break;
        default:
          console.log(chalk.red("Invalid action."));
          rl.close();
          break;
      }
    }
  );
};

interactiveMenu();
