"use client";
import Header from "../components/Header";
import Image from "next/image";
import { useState, useEffect } from "react";

export default function Home() {
  const [productForm, setProductForm] = useState({
      productId: "",
      productName: "",
      quantity: "",
      price: "",
  });
  const [products, setProducts] = useState([]);
  const [alertForAdd, setAlertForAdd] = useState("");
  const [alertForAdd2, setAlertForAdd2] = useState("");

  const [alertForSearch, setAlertForSearch] = useState("");
  const [alertForNoMatch, setAlertForNoMatch] = useState("");

  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);

  const [dropdown, setDropdown] = useState([]);

  const [loadingAction, setLoadingAction] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      const response = await fetch("/api/product");
      let rjson = await response.json();
      setProducts(rjson.products);
    };
    fetchProducts();
  }, []);

  const handleChange = (event) => {
    setProductForm({ ...productForm, [event.target.name]: event.target.value });
  };

  const addProduct = async (event) => {
    event.preventDefault();
    if (
      productForm.productId == "" ||
      productForm.productName == "" ||
      productForm.quantity == "" ||
      productForm.price == ""
    ) {
      setAlertForAdd2("Please enter all the details and then add!");
      setProductForm({
        productId: "",
        productName: "",
        quantity: "",
        price: "",
      });
      setTimeout(() => {
        setAlertForAdd2(""); // Set the alert back to null after 1.5 second
      }, 1500); // 1500 milliseconds = 1.5 second
    } else {
      try {
        const response = await fetch("/api/product", {
          method: "POST", // Specify the request method
          headers: {
            "Content-Type": "application/json", // Specify the content type as JSON
          },
          body: JSON.stringify(productForm), // Convert the product data to JSON format
        });
        // Check if the response was successful
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        } else {
          console.log("Product added succesfully");
          setAlertForAdd("Your Product has been added!");
          setProductForm({
            productId: "",
            productName: "",
            quantity: "",
            price: "",
          });
          setTimeout(() => {
            setAlertForAdd(""); // Set the alert back to null after 1.5 second
          }, 1500); // 1500 milliseconds = 1.5 second
        }
      } catch (error) {
        console.error("Error adding product:", error);
        throw error; // Re-throw the error after logging it
      }
    }
    const response = await fetch('/api/product');
    let rjson = await response.json();
    setProducts(rjson.products);
  };

  const handleSearch = async(event) => {
    const q = event.target.value;
    setQuery(q);
    if(q == "")
    {
      setDropdown([]);
    }
  }

  const onSearch = async () => {
    if (loading == false) {
      setLoading(true);
      setDropdown([]);
      if (query != "") {
        const response = await fetch("/api/search?query=" + query);
        let rjson = await response.json();
        if (rjson.products.length != 0) {
          setDropdown(rjson.products);
        } else {
          setAlertForNoMatch("No Match Found!");
          setTimeout(() => {
            setAlertForNoMatch(""); // Set the alert back to null after 1 second
          }, 1000); // 1000 milliseconds = 1 second
          setQuery("");
        }
      } else {
        setAlertForSearch("Please enter something and then search!");
        setTimeout(() => {
          setAlertForSearch(""); // Set the alert back to null after 1.5 second
        }, 1500); // 1500 milliseconds = 1.5 second
      }
      setLoading(false);
    }
  };

  const buttonAction = async (action, name, initialQuantity) => {

    // Immediately change the quantity of the product with given name in Products
    let index = products.findIndex((item) => item.productName == name);
    let newProducts = JSON.parse(JSON.stringify(products));
    if (action == "plus") {
      newProducts[index].quantity = parseInt(initialQuantity) + 1;
    }
    else {
      newProducts[index].quantity = parseInt(initialQuantity) - 1;
    }
    setProducts(newProducts);

    // Immediately change the quantity of the product with given name in Dropdown
    let indexDrop = dropdown.findIndex((item) => item.productName == name);
    let newDropdown = JSON.parse(JSON.stringify(dropdown));
    if (action == "plus") {
      newDropdown[indexDrop].quantity = parseInt(initialQuantity) + 1;
    }
    else {
      newDropdown[indexDrop].quantity = parseInt(initialQuantity) - 1;
    }
    setDropdown(newDropdown);

    setLoadingAction(true);

    const response = await fetch("/api/action", {
      method: "POST", // Specify the request method
      headers: {
        "Content-Type": "application/json", // Specify the content type as JSON
      },
      body: JSON.stringify({action, name, initialQuantity}) // Convert the product data to JSON format
    });
    let rjson = await response.json();
    console.log(rjson.message);

    setLoadingAction(false);
  }

  return (
    <>
      <Header />
      {/* Container for searching a Product */}
      <div className="container bg-red-50 mx-auto p-4 mb-4">
        <h1 className="text-2xl font-semi-bold text-black-700 mb-4">
          Search a Product
        </h1>

        <div className="text-red-600 text-center mb-5">{alertForSearch}</div>
        <div className="text-red-600 text-center mb-5">{alertForNoMatch}</div>

        <div className="bg-white p-4 rounded-lg shadow-md">
          {/* Search Input */}
          <div className="mb-4">
            <label
              htmlFor="search"
              className="block text-gray-700 font-semibold mb-1"
            >
              Enter Product Name
            </label>
            <input
              type="text"
              id="search"
              value={query}
              placeholder="Search for a product..."
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-300"
              onChange={handleSearch}
            />
            {loading == true && (
              <div
                style={{
                  "display": "flex",
                  "justifyContent": "center",
                  "alignItems": "center",
                  "height": "20vh",
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 100 100"
                  width="70"
                  height="70"
                >
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    stroke="#E9D8FD"
                    strokeWidth="10"
                    fill="none"
                    strokeLinecap="round"
                  >
                    <animate
                      attributeName="stroke-dasharray"
                      from="0,282.743"
                      to="282.743,282.743"
                      dur="1.5s"
                      repeatCount="indefinite"
                    />
                    <animate
                      attributeName="stroke-dashoffset"
                      from="0"
                      to="-565.486"
                      dur="1.5s"
                      repeatCount="indefinite"
                    />
                  </circle>
                </svg>
              </div>
            )}

            <div className="container rounded-bl-sm rounded-br-sm w-full bg-purple-100">
              {dropdown.map((item) => {
                return (
                  <div key={item.productId} className="container flex justify-between px-3 py-3 border-b border-r border-l border-gray-300">
                    <span>{item.productName + " (Product Id: " + item.productId + ", " + "Quantity: " + item.quantity + ", " + "Price: ₹" + item.price + ")"}</span>
                    <div className="mx-5">
                      <button 
                      disabled={loadingAction}
                      className="subtract inline-block px-3 py-1 bg-purple-500 text-white rounded-lg hover:bg-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-400 cursor-pointer disabled:bg-purple-200"
                      onClick={() => {buttonAction("minus", item.productName, item.quantity)}}> - </button>
                      <span className="quantity inline-block w-6 mx-3">{item.quantity}</span>
                      <button 
                      disabled={loadingAction}
                      className="add inline-block px-3 py-1 bg-purple-500 text-white rounded-lg hover:bg-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-400 cursor-pointer disabled:bg-purple-200"
                      onClick={() => {buttonAction("plus", item.productName, item.quantity)}}> + </button>
                    </div>
                  </div>
                );
              })}
            </div>

          </div>

          {/* Search Button */}
          <button
            className="bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600"
            type="submit"
            onClick={onSearch}
          >
            Search
          </button>
        </div>
      </div>

      {/* Container for adding a product */}
      <div className="container bg-red-50 mx-auto p-4 mb-4">
        <h1 className="text-2xl font-semi-bold text-black-700 mb-4">
          Add a Product
        </h1>
        <div className="text-green-600 text-center mb-5">{alertForAdd}</div>
        <div className="text-red-600 text-center mb-5">{alertForAdd2}</div>
        {/* Form to add a new product */}
        <form className="bg-white p-4 rounded-lg shadow-md">
          <div className="mb-4">
            <label
              htmlFor="productId"
              className="block text-gray-700 font-semibold mb-1"
            >
              Product Id
            </label>
            <input
              type="number"
              id="productId"
              name="productId"
              value={productForm.productId}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-300"
              placeholder="Enter product Id"
              onChange={handleChange}
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="productName"
              className="block text-gray-700 font-semibold mb-1"
            >
              Product Name
            </label>
            <input
              type="text"
              id="productName"
              name="productName"
              value={productForm.productName}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-300"
              placeholder="Enter product name"
              onChange={handleChange}
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="quantity"
              className="block text-gray-700 font-semibold mb-1"
            >
              Quantity
            </label>
            <input
              type="number"
              id="quantity"
              name="quantity"
              value={productForm.quantity}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-300"
              placeholder="Enter quantity"
              onChange={handleChange}
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="price"
              className="block text-gray-700 font-semibold mb-1"
            >
              Price
            </label>
            <input
              type="text"
              id="price"
              name="price"
              value={productForm.price}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-300"
              placeholder="Enter price"
              onChange={handleChange}
            />
          </div>
          <button
            onClick={addProduct}
            type="submit"
            className="bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600"
          >
            Add Product
          </button>
        </form>
      </div>

      {/* Container for displaying current stock */}
      <div className="container bg-red-50 mx-auto p-4">
        <h1 className="text-2xl font-semi-bold text-black-700 mb-4">
          Display Current Stock
        </h1>
        {/* Table to display current stock */}
        <table className="min-w-full bg-white border border-gray-300 mt-4">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b">ID</th>
              <th className="py-2 px-4 border-b">Product Name</th>
              <th className="py-2 px-4 border-b">Quantity</th>
              <th className="py-2 px-4 border-b">Price</th>
            </tr>
          </thead>
          <tbody>
            {products.map((item) => (
              <tr key={item.productId} className="text-center">
                <td className="py-2 px-4 border-b">{item.productId}</td>
                <td className="py-2 px-4 border-b">{item.productName}</td>
                <td className="py-2 px-4 border-b">{item.quantity}</td>
                <td className="py-2 px-4 border-b">₹{item.price}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
