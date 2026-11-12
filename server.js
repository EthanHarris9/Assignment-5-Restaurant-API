// Import packages, initialize an express app, and define the port you will use

// Creating the express server
const express = require('express');
const app = express();
// Starts server on port 3,000
const port = 3000;

app.listen(port, () => {
    console.log(`Restaurant API server running at http://localhost:${port}/api`);
    });


module.exports = app;

// Data for the server
const menuItems = [
  {
    id: 1,
    name: "Classic Burger",
    description: "Beef patty with lettuce, tomato, and cheese on a sesame seed bun",
    price: 12.99,
    category: "entree",
    ingredients: ["beef", "lettuce", "tomato", "cheese", "bun"],
    available: true
  },
  {
    id: 2,
    name: "Chicken Caesar Salad",
    description: "Grilled chicken breast over romaine lettuce with parmesan and croutons",
    price: 11.50,
    category: "entree",
    ingredients: ["chicken", "romaine lettuce", "parmesan cheese", "croutons", "caesar dressing"],
    available: true
  },
  {
    id: 3,
    name: "Mozzarella Sticks",
    description: "Crispy breaded mozzarella served with marinara sauce",
    price: 8.99,
    category: "appetizer",
    ingredients: ["mozzarella cheese", "breadcrumbs", "marinara sauce"],
    available: true
  },
  {
    id: 4,
    name: "Chocolate Lava Cake",
    description: "Warm chocolate cake with molten center, served with vanilla ice cream",
    price: 7.99,
    category: "dessert",
    ingredients: ["chocolate", "flour", "eggs", "butter", "vanilla ice cream"],
    available: true
  },
  {
    id: 5,
    name: "Fresh Lemonade",
    description: "House-made lemonade with fresh lemons and mint",
    price: 3.99,
    category: "beverage",
    ingredients: ["lemons", "sugar", "water", "mint"],
    available: true
  },
  {
    id: 6,
    name: "Fish and Chips",
    description: "Beer-battered cod with seasoned fries and coleslaw",
    price: 14.99,
    category: "entree",
    ingredients: ["cod", "beer batter", "potatoes", "coleslaw", "tartar sauce"],
    available: false
  }
];

// Define routes and implement middleware here

// Middleware to parse JSON requests
app.use(express.json());

// Root endpoint - API homepage
app.get('/api', (req, res) => {
    res.json({ 
        message: "Welcome to the Restaurant API", 
        endpoints: { 
            "GET /menu": "Get entire menu", 
            "GET /menu/:id": "Get a specific menu item by ID" 
        } 
    }); 
});

// GET /menu - Return all menu items
app.get('/api/menu', (req, res) => {
      // Sends back the menu as JSON as the response to the request
      res.json(menu);
});

// GET /menu/:id - Return a specific menu item by ID
app.get('/api/menu/:id', (req, res) => {
    const menuId = parseInt(req.params.id);
    const menu = books.find(m => m.id === menuId);
  
	// Return menu item if it is found
    if (menu) {
        res.json(menu);
    } else {
        res.status(404).json({ error: 'menu item not found' });
    }
});

// POST /menu - Create a new menu item
app.post('/api/menu', (req, res) => {
    // Extract data from request body
    const { name, description, price, category, ingredients, available } = req.body;
  
  	// Create a new menu item with generated ID
    const newMenu = {
        id: menu.length + 1,
        name,
        description,
        price,
        category,
        ingredients,
        available
    };
  
    // Add to menu array
    menu.push(newMenu);
  
    // Return the created menu item with 201 status
    res.status(201).json(newMenu);
});

// PUT /menu/:id - Update an existing menu item
app.put('/api/menu/:id', (req, res) => {
    const menuId = parseInt(req.params.id);
    const { name, description, price, category, ingredients, available } = req.body;
  
    // Find the menu item to update
    const menuIndex = menu.findIndex(m => m.id === menuId);
  
    if (menuIndex === -1) {
          return res.status(404).json({ error: 'menu item not found' }); 
    }
  
    // Update the menu item
    menu[menuIndex] = {
        id: menuId,
        name,
        description,
        price,
        category,
        ingredients,
        available
    };
  
    // Return the updated menu item
    res.json(menu[menuIndex]);
});

// DELETE /menu/:id - Delete a menu item
app.delete('/api/menu/:id', (req, res) => {
    const menuId = parseInt(req.params.id);
  
    // Find the menu index
    const menuIndex = menu.findIndex(m => m.id === menuId);
  
    if (menuIndex === -1) {
        return res.status(404).json({ error: 'menu item not found' });
    }
  
    // Remove the menu item from array
    const deletedMenu = menu.splice(menuIndex, 1)[0];
  
    // Return the deleted menu item
    res.json({ message: 'menu item deleted successfully', menu_item: deletedMenu });
});