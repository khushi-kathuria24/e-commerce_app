import React, { useState, useEffect } from "react";
import api from "../api";

function Orders({ onOrderCreated, refreshKey }) {
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [selectedUser, setSelectedUser] = useState("");
  const [selectedProducts, setSelectedProducts] = useState([]);

  useEffect(() => {
    fetchAll();
  }, [refreshKey]);

  const fetchAll = async () => {
    setLoading(true);
    setError("");
    try {
      const [u, p, o] = await Promise.all([
        api.get("/api/users"),
        api.get("/api/products"),
        api.get("/api/orders")
      ]);

      setUsers(u.data);
      setProducts(p.data);
      setOrders(o.data);
    } catch (err) {
      setError("Could not load order data. Please refresh.");
    } finally {
      setLoading(false);
    }
  };

  const toggleProduct = (productId) => {
    setSelectedProducts((prev) => {
      if (prev.includes(productId)) {
        return prev.filter((id) => id !== productId);
      }
      return [...prev, productId];
    });
  };

  const createOrder = async () => {
    if (!selectedUser) {
      setError("Please select a user before creating an order.");
      return;
    }

    if (!selectedProducts.length) {
      setError("Please choose at least one product.");
      return;
    }

    const totalAmount = selectedProducts.length * 100; // simple calc

    try {
      await api.post("/api/orders", {
        user: selectedUser,
        products: selectedProducts,
        totalAmount: Number(totalAmount)
      });

      setSelectedUser("");
      setSelectedProducts([]);
      fetchAll();
      if (onOrderCreated) {
        onOrderCreated();
      }
    } catch (err) {
      setError("Could not create order. Please try again.");
    }
  };

  return (
    <section className="section-card">
      <h2>Orders</h2>
      <p className="section-copy">Each order links one user with multiple products.</p>

      <div className="row-form split">
        <select value={selectedUser} onChange={(e) => setSelectedUser(e.target.value)}>
          <option value="">Select user</option>
          {users.map((u) => (
            <option key={u._id} value={u._id}>
              {u.name}
            </option>
          ))}
        </select>

        <div className="product-checkbox-list">
          {products.map((p) => (
            <label key={p._id} className="product-checkbox-item">
              <input
                type="checkbox"
                checked={selectedProducts.includes(p._id)}
                onChange={() => toggleProduct(p._id)}
              />
              <span>{p.name}</span>
            </label>
          ))}
        </div>

        <p className="array-preview">Selected products: {selectedProducts.length}</p>

        <button onClick={createOrder}>Create Order</button>
      </div>

      {error && <p className="status error">{error}</p>}
      {loading ? <p className="status">Loading orders...</p> : null}

      <ul className="stack-list">
        {orders.map((o) => (
          <li key={o._id} className="stack-item">
            <div className="stack-title">
              <strong>{o.user?.name || "Unknown user"}</strong>
              <span className="badge">Rs {o.totalAmount}</span>
            </div>
            <ul className="inner-list">
              {o.products.map((p) => (
                <li key={p._id}>{p.name}</li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default Orders;