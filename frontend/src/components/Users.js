import React, { useState, useEffect } from "react";
import api from "../api";

function Users({ refreshKey, onUserOrderCreated }) {
  const [name, setName] = useState("");
  const [selectedProductsForNewUser, setSelectedProductsForNewUser] = useState([]);
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedProductsByUser, setSelectedProductsByUser] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchUsers = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await api.get("/api/users");
      setUsers(res.data);
    } catch (err) {
      setError("Could not load users. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const fetchProducts = async () => {
    try {
      const res = await api.get("/api/products");
      setProducts(res.data);
    } catch (err) {
      setError("Could not load products for user mapping.");
    }
  };

  const addUser = async () => {
    if (!name.trim()) {
      return;
    }

    try {
      setError("");
      const createdUser = await api.post("/api/users", { name: name.trim() });

      if (selectedProductsForNewUser.length) {
        const totalAmount = selectedProductsForNewUser.reduce((sum, id) => {
          const matched = products.find((p) => p._id === id);
          return sum + Number(matched?.price || 0);
        }, 0);

        await api.post("/api/orders", {
          user: createdUser.data._id,
          products: selectedProductsForNewUser,
          totalAmount
        });
      }

      setName("");
      setSelectedProductsForNewUser([]);
      await fetchUsers();
      if (onUserOrderCreated && selectedProductsForNewUser.length) {
        onUserOrderCreated();
      }
    } catch (err) {
      setError("Could not add user. Please try again.");
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchProducts();
  }, [refreshKey]);

  const handleUserProductSelect = (userId, e) => {
    const options = Array.from(e.target.selectedOptions).map((opt) => opt.value);
    setSelectedProductsByUser((prev) => ({
      ...prev,
      [userId]: options
    }));
  };

  const handleNewUserProductSelect = (e) => {
    const options = Array.from(e.target.selectedOptions).map((opt) => opt.value);
    setSelectedProductsForNewUser(options);
  };

  const addProductsForUser = async (userId) => {
    const selectedIds = selectedProductsByUser[userId] || [];

    if (!selectedIds.length) {
      setError("Select at least one product for this user.");
      return;
    }

    const totalAmount = selectedIds.reduce((sum, id) => {
      const matched = products.find((p) => p._id === id);
      return sum + Number(matched?.price || 0);
    }, 0);

    try {
      setError("");
      await api.post("/api/orders", {
        user: userId,
        products: selectedIds,
        totalAmount
      });
      setSelectedProductsByUser((prev) => ({
        ...prev,
        [userId]: []
      }));
      await fetchUsers();
      if (onUserOrderCreated) {
        onUserOrderCreated();
      }
    } catch (err) {
      setError("Could not add products for this user. Please try again.");
    }
  };

  const getUserProductSummary = (user) => {
    const names = [];
    user.orders?.forEach((order) => {
      order.products?.forEach((product) => {
        if (product && product.name) {
          names.push(product.name);
        }
      });
    });
    return names;
  };

  return (
    <section className="section-card">
      <h2>Users</h2>
      <p className="section-copy">One user can have many orders.</p>

      <div className="row-form">
        <input
          placeholder="Enter user name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <button onClick={addUser}>Add User</button>
      </div>

      <div className="row-form split compact-top">
        <select multiple value={selectedProductsForNewUser} onChange={handleNewUserProductSelect}>
          {products.map((p) => (
            <option key={p._id} value={p._id}>
              {p.name}
            </option>
          ))}
        </select>
        <p className="array-preview">Select multiple products above to link them while creating the user.</p>
      </div>

      {error && <p className="status error">{error}</p>}
      {loading ? <p className="status">Loading users...</p> : null}

      <ul className="stack-list">
        {users.map((u) => (
          <li key={u._id} className="stack-item">
            {(() => {
              const userProductNames = getUserProductSummary(u);
              return (
                <>
            <div className="stack-title">
              <strong>{u.name}</strong>
              <span className="badge">{u.orders?.length || 0} orders | {userProductNames.length} products</span>
            </div>

            <div className="row-form split compact-top">
              <select
                multiple
                value={selectedProductsByUser[u._id] || []}
                onChange={(e) => handleUserProductSelect(u._id, e)}
              >
                {products.map((p) => (
                  <option key={p._id} value={p._id}>
                    {p.name}
                  </option>
                ))}
              </select>
              <button type="button" onClick={() => addProductsForUser(u._id)}>
                Add Products To User
              </button>
            </div>

            {userProductNames.length ? (
              <p className="array-preview">Products ordered array: [{userProductNames.join(", ")}]</p>
            ) : (
              <p className="empty-state">Products ordered array: []</p>
            )}

            {u.orders?.length ? (
              <ul className="inner-list">
                {u.orders.map((o, index) => (
                  <li key={index}>
                    Order total: Rs {o.totalAmount} | Products in order: {o.products.length}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="empty-state">No orders yet for this user.</p>
            )}
                </>
              );
            })()}
          </li>
        ))}
      </ul>
    </section>
  );
}

export default Users;