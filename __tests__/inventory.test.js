const fs = require("fs");
const { nanoid } = require("nanoid");
jest.mock("fs");
jest.mock("nanoid");

const {
  add,
  list,
  view,
  update,
  remove,
  addToCart,
  viewCart,
  cancelCart,
  filter,
} = require("./index");

describe("Inventory Management", () => {
  beforeEach(() => {
    fs.readFileSync.mockClear();
    fs.writeFileSync.mockClear();
    nanoid.mockReturnValue("testId");
  });

  test("add item to inventory", () => {
    fs.readFileSync.mockReturnValue("[]");
    add("Apple", "100", "true", "fruit");
    expect(fs.writeFileSync).toHaveBeenCalledWith(
      "inventory.json",
      JSON.stringify(
        [
          {
            id: "testId",
            name: "Apple",
            priceInCents: 100,
            inStock: true,
            category: "fruit",
          },
        ],
        null,
        2
      )
    );
  });

  // More tests for list, view, update, remove
});

describe("Cart Management", () => {
  beforeEach(() => {
    fs.readFileSync.mockClear();
    fs.writeFileSync.mockClear();
  });

  test("add item to cart", () => {
    fs.readFileSync
      .mockReturnValueOnce(
        '[{"id":"testId","name":"Apple","priceInCents":100,"inStock":true,"category":"fruit"}]'
      )
      .mockReturnValueOnce("[]");
    addToCart("Apple", "2");
    expect(fs.writeFileSync).toHaveBeenCalledWith(
      "cart.json",
      JSON.stringify(
        [
          {
            id: "testId",
            name: "Apple",
            priceInCents: 100,
            inStock: true,
            category: "fruit",
            quantity: 2,
          },
        ],
        null,
        2
      )
    );
  });

  // More tests for viewCart, cancelCart
});
