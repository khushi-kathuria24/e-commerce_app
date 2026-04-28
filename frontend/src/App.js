import React from "react";
import { useState } from "react";
import Users from "./components/Users";
import Products from "./components/Products";
import Orders from "./components/Orders";
import "./App.css";

function App() {
  const [refreshUsersKey, setRefreshUsersKey] = useState(0);
  const [refreshOrdersKey, setRefreshOrdersKey] = useState(0);

  const handleOrderCreated = () => {
    setRefreshUsersKey((prev) => prev + 1);
  };

  const handleUserOrderCreated = () => {
    setRefreshOrdersKey((prev) => prev + 1);
  };

  return (
    <div className="app-shell">
      <header className="hero">
        <p className="eyebrow">Admin Dashboard</p>
        <h1>E-Commerce Relationship Demo</h1>
        <p className="subtitle">
          Add users and products, then create orders and see user history update instantly.
        </p>
      </header>

      <main className="panel-grid">
        <Users refreshKey={refreshUsersKey} onUserOrderCreated={handleUserOrderCreated} />
        <Products />
        <Orders onOrderCreated={handleOrderCreated} refreshKey={refreshOrdersKey} />
      </main>
    </div>
  );
}

export default App;