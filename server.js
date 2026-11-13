// Import packages, initialize an express app, and define the port you will use

// Creating the express server
const express = require('express');
const app = express();

// Import express-validator
const { body, validationResult } = require('express-validator');

// Starts server on port 3,000
const port = 3000;

app.listen(port, () => {
    console.log(`Restaurant API server running at http://localhost:${port}/api`);
    });


module.exports = app;

// Data for the server
const menu = [
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
const requestLogger = (req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.originalUrl}`);

  // Log request body for POST and PUT requests
  if (req.method === 'POST' || req.method === 'PUT')
{
  console.log('Request Body:', JSON.stringify(req.body, null, 2));
}

  next(); // Passing the control to the next middleware
}

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const errorMessages = errors.arrary().map(error =>.msg);

    return res.status(400).json({
      error: 'Validation Failed',
      messages: errorMessages
    });
  }

  // Set default value for available if not provided
  if (req.body.available === undefined) {
      req.body.available = true;
  }

  next();
};

// validation rules for menu items
const menuValidation = [
  body('name')
    .isLength({ min: 3 })
    .withMessage('Name must be at least 3 characters long'),

  body('description')
    .isLength({ min: 10 })
    .withMessage('Description must be at least 10 characters long'),

  body('price')
    .notEmpty()
    .withMessage('Price is required')
    .isFloat({ gt: 0 })
    .withMessage('Price must be a number greater than 0'),

  body('category')
    .isIn(['apperizer', 'entree', 'dessert', 'beverage'])
    .withMessage('category must be apperizer, entree, dessert, beverage'),

  body('ingredients')
    .isArray({ min: 1 })
    .withMessage('Ingredients must be an array with at least one ingredient'),

  body('available')
    .optional()
    .isBoolean()
    .withMessage('Available must be true or false')
    .toBoolean(),

];


// Middleware to parse JSON requests
app.use(express.json());

// Custom logging middleware
app.use(requestLogger);


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
    const menuItem = menu.find(m => m.id === menuId);
  
	// Return menu item if it is found
    if (menuItem) {
        res.json(menuItem);
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