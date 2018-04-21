var mysql = require("mysql");
var inquirer = require('inquirer');

var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "",
  database: "bamazon"
});

connection.connect(function(err) {
  if (err) throw err;
  console.log("connected as id " + connection.threadId + "\n");
  displayItems();

});
function displayItems() {
    connection.query("SELECT * FROM products", function(err, res) {
        if (err) throw err;
        // Log all results of the SELECT statement
        console.log(res);
        promptCustomer();
      });
}

function promptCustomer() {
    inquirer.prompt([
        {
            type: "input",
            name: "id",
            message: "What is the id of the product?"
        },
        {
            type: "input",
            name: "units",
            message: "How many units would you like?" 
        }
    
    ]).then(answers => {
        // Use user feedback for... whatever!!
        console.log(answers);
        // "read? the database and check to see if the id exists
        // if the id does not exist, and let the customer know and start them over again
        // it it does exits, check to see if there is enough product
        // if youd don't have enough, let the customer know and start them over again
        // if you don have enough, let the customer know
        // "update" the database
        // and let customer know the total price
    });
};
