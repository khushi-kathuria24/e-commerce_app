import React, { useState, useEffect } from "react";
import api from "../api";

function Products() {
  const [product, setProduct] = useState({ name: "", price: "" });
  const [products, setProducts] = useState([]);
  const [error, setError] = useState("");

  const fetchProducts = async () => {
    const res = await api.get("/api/products");
    setProducts(res.data);
  };

  const addProduct = async () => {
    if (!product.name.trim() || !product.price) {
      setError("Please enter both product name and price.");
      return;
    }

    try {
      await api.post("/api/products", {
        name: product.name.trim(),
        price: Number(product.price)
      });
      setError("");
      setProduct({ name: "", price: "" });
      fetchProducts();
    } catch (err) {
      setError("Could not add product. Please try again.");
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <section className="section-card">
      <h2>Products</h2>
      <p className="section-copy">Create product records before placing orders.</p>

      <div className="row-form">
        <input
          placeholder="Product name"
          value={product.name}
          onChange={(e) => setProduct({ ...product, name: e.target.value })}
        />

        <input
          placeholder="Price"
          type="number"
          min="0"
          value={product.price}
          onChange={(e) => setProduct({ ...product, price: e.target.value })}
        />

        <button onClick={addProduct}>Add Product</button>
      </div>

      {error && <p className="status error">{error}</p>}

      <ul className="stack-list">
        {products.map((p) => (
          <li key={p._id} className="stack-item">
            <div className="stack-title">
              <strong>{p.name}</strong>
              <span className="badge">Rs {p.price}</span>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default Products;