import { useEffect, useState } from 'react';
import { userManager } from './auth';


type Order = {
  id: number;
  customerId: number;
  description: string;
  total: string;
  status: 'CREATED' | 'PROCESSING' | 'COMPLETED' | 'CANCELLED';
};

const ORDER_STATUSES: Order['status'][] = [
  'CREATED',
  'PROCESSING',
  'COMPLETED',
  'CANCELLED',
];

function App() {
  const handleLogin = () => {
    userManager.signinRedirect();
   }; 
  const [orders, setOrders] = useState<Order[]>([]);
  const [customerId, setCustomerId] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [newOrder, setNewOrder] = useState({
  customerId: '',
  description: '',
  total: '',
  });
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);
  const [updateError, setUpdateError] = useState('');
  const [deleteError, setDeleteError] = useState('');
  const [saving, setSaving] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [statusError, setStatusError] = useState('');
  const [updatingStatus, setUpdatingStatus] = useState(false);


  useEffect(() => {
  const handleAuthCallback = async () => {
    try {
      if (window.location.search.includes('code=')) {
        await userManager.signinRedirectCallback();

        window.history.replaceState(
          {},
          document.title,
          window.location.pathname,
        );
      }
    } catch (error) {
      console.error('Authentication callback failed', error);
    }
  };

  handleAuthCallback();
}, []);

  useEffect(() => {
  const loadOrders = async () => {
    try {
      setLoading(true);
      setError('');

      const endpoint =
        customerId === ''
          ? `${import.meta.env.VITE_API_URL}/orders`
          : `${import.meta.env.VITE_API_URL}/orders/search?customerId=${customerId}`;

      const response = await fetch(endpoint);

      if (!response.ok) {
        throw new Error('Failed to load orders');
      }

      const data: Order[] = await response.json();
      setOrders(data);
    } catch {
      setError('Unable to load orders');
    } finally {
      setLoading(false);
    }
  };

  loadOrders();
}, [customerId]);

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  if (
    newOrder.customerId === '' ||
    !newOrder.description.trim() ||
    newOrder.total === ''
  ) {
    setError('All fields are required');
    return;
  }

  if (Number(newOrder.customerId) <= 0) {
  setError('Customer ID must be greater than 0');
  return;
}

if (Number(newOrder.total) < 0) {
  setError('Total cannot be negative');
  return;
}

  setError('');
  setSaving(true);

  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/orders`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          customerId: Number(newOrder.customerId),
          description: newOrder.description,
          total: Number(newOrder.total),
        }),
      },
    );

    if (!response.ok) {
      throw new Error('Failed to create order');
    }

    const createdOrder = await response.json();

    setOrders((currentOrders) => [
      ...currentOrders,
      createdOrder,
    ]);

    setNewOrder({
      customerId: '',
      description: '',
      total: '',
    });
  } catch (err) {
    setError('Failed to create order');
  } finally {
    setSaving(false);
  }
};

  const handleView = async (id: number) => {
  const response = await fetch(
    `${import.meta.env.VITE_API_URL}/orders/${id}`,
  );

  if (!response.ok) {
    throw new Error('Failed to fetch order');
  }

  const order = await response.json();

  setSelectedOrder(order);
  };

  const handleUpdate = async () => {
  if (!editingOrder) return;

  setUpdateError('');

  if (!editingOrder.description.trim()) {
  setUpdateError('Description is required');
  return;
}
  

  if (Number(editingOrder.total) < 0) {
  setUpdateError('Total cannot be negative');
  setUpdating(false);
  return;
}

setUpdating(true);

  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/orders/${editingOrder.id}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          description: editingOrder.description,
          total: Number(editingOrder.total),
        }),
      },
    );

    if (!response.ok) {
      throw new Error('Failed to update order');
    }

    const updatedOrder = await response.json();

    setOrders((currentOrders) =>
      currentOrders.map((order) =>
        order.id === updatedOrder.id ? updatedOrder : order,
      ),
    );

    setEditingOrder(null);
  } catch (err) {
  setUpdateError('Failed to update order');
} finally {
  setUpdating(false);
}
};

  const handleDelete = async (id: number) => {
  const confirmed = window.confirm(
    'Are you sure you want to delete this order?',
  );

  if (!confirmed) return;

  setDeleteError('');
  setDeleting(true);

  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/orders/${id}`,
      {
        method: 'DELETE',
      },
    );

    if (!response.ok) {
      throw new Error('Failed to delete order');
    }

    setOrders((currentOrders) =>
      currentOrders.filter((order) => order.id !== id),
    );

    if (selectedOrder?.id === id) {
  setSelectedOrder(null);
}


  } catch (err) {
  setDeleteError('Failed to delete order');
} finally {
  setDeleting(false);
}
};

  const handleStatusChange = async (
  id: number,
  newStatus: Order['status'],
) => {
  setStatusError('');
  setUpdatingStatus(true);
  try {
  const response = await fetch(
    `${import.meta.env.VITE_API_URL}/orders/${id}/status`,
    {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        status: newStatus,
      }),
    },
  );

  if (!response.ok) {
    throw new Error('Failed to update order status');
  }

  const updatedOrder = await response.json();

  setOrders((currentOrders) =>
    currentOrders.map((order) =>
      order.id === updatedOrder.id ? updatedOrder : order,
    ),
  );
  } catch (err) {
  setStatusError('Failed to update order status');
} finally {
  setUpdatingStatus(false);
}
};

  return (
    <main>
      <h1>Orders API</h1>

      <button type="button" onClick={handleLogin}>
         Login with Cognito
      </button>

      <section>
        <h2>Orders</h2>
        {loading && <p>Loading orders...</p>}

        {error && <p>{error}</p>}

        <input
          type="number"
          placeholder="Search by customer ID"
          value={customerId}
          onChange={(event) => setCustomerId(event.target.value)}
        />

        <h2>Create Order</h2>

        {error && <p>{error}</p>}

<form onSubmit={handleSubmit}>
  <input
    type="number"
    min="1"
    step="1"
    placeholder="Customer ID"
    value={newOrder.customerId}
    onChange={(e) =>
      setNewOrder({
        ...newOrder,
        customerId: e.target.value,
      })
    }
  />

  <input
    type="text"
    placeholder="Description"
    value={newOrder.description}
    onChange={(e) =>
      setNewOrder({
        ...newOrder,
        description: e.target.value,
      })
    }
  />

  <input
    type="number"
    placeholder="Total"
    min="0"
    step="0.01"
    value={newOrder.total}
    onChange={(e) =>
      setNewOrder({
        ...newOrder,
        total: e.target.value,
      })
    }
  />

  <button type="submit" disabled={saving}>
  {saving ? 'Saving...' : 'Create Order'}
</button>
</form>
        
        {!loading && !error && (
        <>  {deleteError && <p>{deleteError}</p>} 
         {statusError && <p>{statusError}</p>}
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Customer</th>
              <th>Description</th>
              <th>Total</th>
              <th>Status</th>
              <th>Actions</th>              
            </tr>
          </thead>          

          <tbody>
            {orders.map((order) => (
              <tr key={order.id}>
                <td>{order.id}</td>
                <td>{order.customerId}</td>
                <td>{order.description}</td>
                <td>${order.total}</td>
                <td>{order.status}</td>
                <td><button type="button" onClick={() => handleView(order.id)}>
                    View
                    </button>
                
                <button
  type="button"
  onClick={() => {
    setUpdateError('');
    setEditingOrder(order);
  }}
>
  Edit
</button>
              
                  <button
  type="button"
  onClick={() => handleDelete(order.id)}
  disabled={deleting}
>
  {deleting ? 'Deleting...' : 'Delete'}
</button>
<select
  value={order.status}
  onChange={(e) => handleStatusChange(order.id, e.target.value as Order['status'])}
  disabled={updatingStatus}
>
  {ORDER_STATUSES.map((status) => (
  <option key={status} value={status}>
    {status}
  </option>
))}
</select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </>
        )}
        {selectedOrder && (
  <div>
    <h2>Order Details</h2>

    <p>
      <strong>ID:</strong> {selectedOrder.id}
    </p>

    <p>
      <strong>Customer ID:</strong> {selectedOrder.customerId}
    </p>

    <p>
      <strong>Description:</strong> {selectedOrder.description}
    </p>

    <p>
      <strong>Total:</strong> {selectedOrder.total}
    </p>

    <p>
      <strong>Status:</strong> {selectedOrder.status}
    </p>
    <button
  type="button"
  onClick={() => setSelectedOrder(null)}
>
  Close
</button>
  </div>
)}
    {editingOrder && (
  <div>
    <h2>Edit Order</h2>
    {updateError && <p>{updateError}</p>}

    <input
      type="text"
      placeholder="Description"
      value={editingOrder.description}
      onChange={(e) =>
        setEditingOrder({
          ...editingOrder,
          description: e.target.value,
        })
      }
    />

    <input
      type="number"
      min="0"
      step="0.01"
      placeholder="Total"
      value={editingOrder.total}
      onChange={(e) =>
        setEditingOrder({
          ...editingOrder,
          total: e.target.value,
        })
      }
    />

    <button type="button" onClick={handleUpdate} disabled={updating}>
  {updating ? 'Saving...' : 'Save'}
</button>
<button
  type="button"
  onClick={() => setEditingOrder(null)}
>
  Cancel
</button>
  </div>
)}
      </section>
    </main>
  );
}

export default App;