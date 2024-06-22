const fs = require("fs");
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
} = require("../index.js");

const mockQuestion = jest.fn();

jest.mock("readline", () => ({
  createInterface: jest.fn().mockReturnValue({
    question: mockQuestion,
    close: jest.fn(),
  }),
}));

jest.mock("fs");
const mockReadFile = jest.fn();
const mockWriteFile = jest.fn();
fs.readFileSync.mockImplementation(mockReadFile);
fs.writeFileSync.mockImplementation(mockWriteFile);

describe("add()", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should add a new item to the inventory", () => {
    const name = "Test Item";
    const priceInCents = 1000;
    const inStock = true;
    const category = "Test";
    mockReadFile.mockReturnValueOnce("[]");
    add(name, priceInCents, inStock, category);
    expect(mockWriteFile).toHaveBeenCalledWith(
      "inventory.json",
      expect.stringContaining(name)
    );
    const writtenData = JSON.parse(mockWriteFile.mock.calls[0][1]);
    expect(writtenData).toHaveLength(1);
    expect(writtenData[0].name).toBe(name);
    expect(writtenData[0].priceInCents).toBe(priceInCents);
    expect(writtenData[0].inStock).toBe(inStock);
    expect(writtenData[0].category).toBe(category);
  });

  it("should handle adding duplicate items", () => {
    const name = "Duplicate Item";
    const priceInCents = 1500;
    const inStock = true;
    const category = "Duplicate";
    mockReadFile.mockReturnValueOnce(
      JSON.stringify([
        {
          id: "1",
          name: "Duplicate Item",
          priceInCents: 1500,
          inStock: true,
          category: "Duplicate",
        },
      ])
    );

    const consoleErrorSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});
    add(name, priceInCents, inStock, category);
    expect(mockWriteFile).not.toHaveBeenCalled();
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      expect.stringContaining(
        `Item with name "${name}" already exists in the inventory.`
      )
    );

    consoleErrorSpy.mockRestore();
  });
});

describe("list()", () => {
  it("should list all items in the inventory", () => {
    const mockInventory = [
      {
        id: "1",
        name: "Item 1",
        priceInCents: 1200,
        inStock: true,
        category: "Category A",
      },
      {
        id: "2",
        name: "Item 2",
        priceInCents: 800,
        inStock: false,
        category: "Category B",
      },
    ];

    mockReadFile.mockReturnValueOnce(JSON.stringify(mockInventory));
    const consoleLogSpy = jest
      .spyOn(console, "log")
      .mockImplementation(() => {});
    list();
    expect(consoleLogSpy).toHaveBeenCalledTimes(mockInventory.length);
    expect(consoleLogSpy).toHaveBeenCalledWith(
      expect.stringContaining("Item 1")
    );
    expect(consoleLogSpy).toHaveBeenCalledWith(
      expect.stringContaining("Item 2")
    );
    consoleLogSpy.mockRestore();
  });
  it("should handle empty inventory", () => {
    mockReadFile.mockReturnValueOnce("[]");
    const consoleLogSpy = jest
      .spyOn(console, "log")
      .mockImplementation(() => {});
    list();
    expect(consoleLogSpy).toHaveBeenCalledWith(
      expect.stringContaining("No items")
    );
    consoleLogSpy.mockRestore();
  });
});

describe("view()", () => {
  it("should view details of a specific item in the inventory", () => {
    const mockInventory = [
      {
        id: "1",
        name: "Item 1",
        priceInCents: 1200,
        inStock: true,
        category: "Category A",
      },
    ];
    mockReadFile.mockReturnValueOnce(JSON.stringify(mockInventory));
    const consoleLogSpy = jest
      .spyOn(console, "log")
      .mockImplementation(() => {});
    view("1");
    expect(consoleLogSpy).toHaveBeenCalledWith(
      expect.stringContaining("Item 1")
    );
    expect(consoleLogSpy).toHaveBeenCalledWith(
      expect.stringContaining("Category A")
    );
    consoleLogSpy.mockRestore();
  });

  it("should handle item not found", () => {
    mockReadFile.mockReturnValueOnce("[]");
    const consoleLogSpy = jest
      .spyOn(console, "log")
      .mockImplementation(() => {});
    view("nonexistentid");
    expect(consoleLogSpy).toHaveBeenCalledWith(
      expect.stringContaining("Item not found")
    );
    consoleLogSpy.mockRestore();
  });
});

describe("update()", () => {
  it("should update details of a specific item in the inventory", () => {
    const mockInventory = [
      {
        id: "1",
        name: "Item 1",
        priceInCents: 1200,
        inStock: true,
        category: "Category A",
      },
    ];
    mockReadFile.mockReturnValueOnce(JSON.stringify(mockInventory));
    const consoleLogSpy = jest
      .spyOn(console, "log")
      .mockImplementation(() => {});
    update("1", "Updated Item", 1500, false, "Category B");
    const writtenData = JSON.parse(mockWriteFile.mock.calls[0][1]);
    expect(writtenData).toHaveLength(1);
    expect(writtenData[0].name).toBe("Updated Item");
    expect(writtenData[0].priceInCents).toBe(1500);
    expect(writtenData[0].inStock).toBe(false);
    expect(writtenData[0].category).toBe("Category B");
    consoleLogSpy.mockRestore();
  });

  it("should handle item not found", () => {
    mockReadFile.mockReturnValueOnce("[]");
    const consoleLogSpy = jest
      .spyOn(console, "log")
      .mockImplementation(() => {});
    update("nonexistentid", "Updated Item", 1500, false, "Category B");
    expect(consoleLogSpy).toHaveBeenCalledWith(
      expect.stringContaining("Item not found")
    );
    consoleLogSpy.mockRestore();
  });
});

describe("remove()", () => {
  it("should remove a specific item from the inventory", () => {
    const mockInventory = [
      {
        id: "1",
        name: "Item 1",
        priceInCents: 1200,
        inStock: true,
        category: "Category A",
      },
    ];
    mockReadFile.mockReturnValueOnce(JSON.stringify(mockInventory));
    const consoleLogSpy = jest
      .spyOn(console, "log")
      .mockImplementation(() => {});
    remove("1");
    const writtenData = JSON.parse(mockWriteFile.mock.calls[0][1]);
    expect(writtenData).toHaveLength(0);
    consoleLogSpy.mockRestore();
  });

  it("should handle item not found", () => {
    mockReadFile.mockReturnValueOnce("[]");
    const consoleLogSpy = jest
      .spyOn(console, "log")
      .mockImplementation(() => {});
    remove("nonexistentid");
    expect(consoleLogSpy).toHaveBeenCalledWith(
      expect.stringContaining("Item not found")
    );
    consoleLogSpy.mockRestore();
  });
});

describe("addToCart()", () => {
  it("should add an item to the cart", () => {
    const mockInventory = [
      {
        id: "1",
        name: "Item 1",
        priceInCents: 1200,
        inStock: true,
        category: "Category A",
      },
    ];
    mockReadFile.mockReturnValueOnce(JSON.stringify(mockInventory));
    mockReadFile.mockReturnValueOnce("[]");
    addToCart("Item 1", 2);
    expect(mockWriteFile).toHaveBeenCalledWith(
      "cart.json",
      expect.stringContaining("Item 1")
    );
  });

  it("should handle adding item not found", () => {
    mockReadFile.mockReturnValueOnce("[]");
    const consoleLogSpy = jest
      .spyOn(console, "log")
      .mockImplementation(() => {});
    addToCart("Nonexistent Item", 1);
    expect(consoleLogSpy).toHaveBeenCalledWith(
      expect.stringContaining("Item not found")
    );
    consoleLogSpy.mockRestore();
  });
});

describe("viewCart()", () => {
  it("should view items in the cart", () => {
    const mockCart = [
      {
        id: "1",
        name: "Item 1",
        priceInCents: 1200,
        quantity: 2,
      },
    ];
    mockReadFile.mockReturnValueOnce(JSON.stringify(mockCart));
    const consoleLogSpy = jest
      .spyOn(console, "log")
      .mockImplementation(() => {});
    viewCart();
    expect(consoleLogSpy).toHaveBeenCalledWith(
      expect.stringContaining("Item 1")
    );
    consoleLogSpy.mockRestore();
  });

  it("should handle empty cart", () => {
    mockReadFile.mockReturnValueOnce("[]");
    const consoleLogSpy = jest
      .spyOn(console, "log")
      .mockImplementation(() => {});
    viewCart();
    expect(consoleLogSpy).toHaveBeenCalledWith(
      expect.stringContaining("Cart is empty")
    );
    consoleLogSpy.mockRestore();
  });
});

describe("cancelCart()", () => {
  it("should empty the cart", () => {
    mockReadFile.mockReturnValueOnce(
      JSON.stringify([
        {
          id: "1",
          name: "Item 1",
          priceInCents: 1200,
          quantity: 2,
        },
      ])
    );

    cancelCart();
    expect(mockWriteFile).toHaveBeenCalledWith("cart.json", "[]");
  });
});

describe("filter()", () => {
  it("should filter items by 'inStock' property", () => {
    const mockInventory = [
      {
        id: "1",
        name: "Item 1",
        priceInCents: 1200,
        inStock: true,
        category: "Category A",
      },
      {
        id: "2",
        name: "Item 2",
        priceInCents: 800,
        inStock: false,
        category: "Category B",
      },
    ];
    mockReadFile.mockReturnValueOnce(JSON.stringify(mockInventory));
    const consoleLogSpy = jest
      .spyOn(console, "log")
      .mockImplementation(() => {});
    filter("inStock", "true");
    expect(consoleLogSpy).toHaveBeenCalledWith(
      expect.stringContaining("Item 1")
    );
    expect(consoleLogSpy).not.toHaveBeenCalledWith(
      expect.stringContaining("Item 2")
    );
    consoleLogSpy.mockRestore();
  });

  it("should handle no items matching filter criteria", () => {
    mockReadFile.mockReturnValueOnce("[]");
    const consoleLogSpy = jest
      .spyOn(console, "log")
      .mockImplementation(() => {});
    filter("inStock", "true");
    expect(consoleLogSpy).toHaveBeenCalledWith(
      expect.stringContaining("No items")
    );

    consoleLogSpy.mockRestore();
  });
});
