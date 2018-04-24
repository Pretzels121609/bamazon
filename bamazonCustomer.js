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
    connection.query("SELECT * FROM products", function(err, data) {
        if (err) throw err;
        // Log all results of the SELECT statement
        // console.log(data);
        for(var i = 0; i < data.length; i++) {
            console.log("ID: ", data[i].item_id)
            console.log("Name: ", data[i].product_name)
            console.log("Price: ", data[i].price) 
            console.log("Quantity: ", data[i].stock_quantity);
            console.log();
        }
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
        // console.log(answers);
        // "read" the database and check to see if the id exists
        // connection to the mysql database, and we query the database to see if product id exists
        connection.query("SELECT * FROM products WHERE ?",
        {
          // this code fills in the question mark from line 49
          // left side(item_id) = which came from the mysql database field name (the column name)
          // right side (answers.id) = is the value we're looking for from that field
          item_id: answers.id
        },
        // call back function happens when we get a response from the query on line 49
        function(err, data) {
            // this is just to see what data we got back from query (line 49) 
            // console.log(data)
            // if the id does not exist, then the date array will be empty 
            if (data.length === 0){
                //then we'll log a msg to the user
                console.log("Sorry, product does not exist.")
                // if the id does not exist, and let the customer know and start them over again
                displayItems();
            }
            else {
            // it it does exits, check to see if there is enough product
              // making data[0] a variable of product so we can store the first object
              // in the date array as product
              var product = data[0];
              //   console.log(product);
            //   console.log("stock quantity:", product.stock_quantity);

            // if you do have enough, let the customer know
            // if the units ordered is < or = to quanity on hand
              if (answers.units <= product.stock_quantity){
                  // then it lets customer know the total price
                  var totalPrice = answers.units * product.price;
                  console.log("Your total price is $" + totalPrice);


                  // and "updates" the database with the new quantity
                  var updatedQuantity = product.stock_quantity - answers.units;
                  connection.query(
                    "UPDATE products SET ? WHERE ?",
                    [
                      {
                        // this replaces the 1st question mark
                        stock_quantity: updatedQuantity
                      },
                      {
                        // this replaces the 2nd question mark
                        // field name: value
                        item_id: product.item_id
                      }
                    ],
                    function(err, res) {
                      console.log("Product purchased successfully.");
                      connection.end();
                    }
                  );
              } else {
                  // if youd don't have enough, let the customer know and start them over again
                  console.log("Sorry, we only have " + product.stock_quantity + " available.")
                  displayItems();
              }
          }
        }
      );
    });
};
