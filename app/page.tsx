'use client';

import { useState, useEffect } from 'react';

interface Product {
  id: string;
  name: string;
  price: number;
  created_at?: string;
}

interface Sale {
  id: string;
  product_id: string;
  quantity: number;
  created_at?: string;
}

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [sales, setSales] = useState<Sale[]>([]);
  const [newProduct, setNewProduct] = useState({ name: '', price: '' });
  const [newSale, setNewSale] = useState({ productId: '', quantity: '' });
  const [activeTab, setActiveTab] = useState<'dashboard' | 'products' | 'sales'>('dashboard');

  // Load data from API on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsRes, salesRes] = await Promise.all([
          fetch('/api/products'),
          fetch('/api/sales')
        ]);

        if (productsRes.ok) {
          const productsData = await productsRes.json();
          setProducts(productsData);
        }

        if (salesRes.ok) {
          const salesData = await salesRes.json();
          setSales(salesData);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const addProduct = async () => {
    if (newProduct.name && newProduct.price) {
      try {
        const response = await fetch('/api/products', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: newProduct.name,
            price: parseFloat(newProduct.price),
          }),
        });

        if (response.ok) {
          const newProductData = await response.json();
          setProducts([newProductData, ...products]);
          setNewProduct({ name: '', price: '' });
        } else {
          console.error('Error adding product');
        }
      } catch (error) {
        console.error('Error adding product:', error);
      }
    }
  };

  const addSale = async () => {
    if (newSale.productId && newSale.quantity) {
      try {
        const response = await fetch('/api/sales', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            productId: newSale.productId,
            quantity: parseInt(newSale.quantity),
          }),
        });

        if (response.ok) {
          const newSaleData = await response.json();
          setSales([newSaleData, ...sales]);
          setNewSale({ productId: '', quantity: '' });
        } else {
          console.error('Error adding sale');
        }
      } catch (error) {
        console.error('Error adding sale:', error);
      }
    }
  };

  const totalSales = sales.reduce((sum, sale) => {
    const product = products.find(p => p.id === sale.product_id);
    return sum + (product ? product.price * sale.quantity : 0);
  }, 0);

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-black">NAMJ & CO Sales Management</h1>
        </div>
      </header>
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'dashboard' ? 'border-blue-500 text-blue-600' : 'border-transparent text-black hover:text-gray-700'
              }`}
            >
              Dashboard
            </button>
            <button
              onClick={() => setActiveTab('products')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'products' ? 'border-blue-500 text-blue-600' : 'border-transparent text-black hover:text-gray-700'
              }`}
            >
              Products
            </button>
            <button
              onClick={() => setActiveTab('sales')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'sales' ? 'border-blue-500 text-blue-600' : 'border-transparent text-black hover:text-gray-700'
              }`}
            >
              Sales
            </button>
          </div>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {activeTab === 'dashboard' && (
          <div className="px-4 py-6 sm:px-0">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-blue-500 rounded"></div>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                      <dt className="text-sm font-medium text-black truncate">Total Sales</dt>
                      <dd className="text-lg font-medium text-black">UGX {totalSales.toLocaleString()}</dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-green-500 rounded"></div>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                      <dt className="text-sm font-medium text-black truncate">Products</dt>
                      <dd className="text-lg font-medium text-black">{products.length}</dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-yellow-500 rounded"></div>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                      <dt className="text-sm font-medium text-black truncate">Total Sales Count</dt>
                      <dd className="text-lg font-medium text-black">{sales.length}</dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        {activeTab === 'products' && (
          <div className="px-4 py-6 sm:px-0">
            <h2 className="text-2xl font-bold text-black mb-4">Manage Products</h2>
            <div className="bg-white shadow rounded-lg p-6 mb-6">
              <h3 className="text-lg font-medium text-black mb-4">Add New Product</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <input
                  type="text"
                  placeholder="Product Name"
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                  className="border border-gray-300 rounded-md px-3 py-2 text-black"
                />
                <input
                  type="number"
                  placeholder="Price"
                  value={newProduct.price}
                  onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                  className="border border-gray-300 rounded-md px-3 py-2 text-black"
                />
                <button
                  onClick={addProduct}
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                >
                  Add Product
                </button>
              </div>
            </div>
            <div className="bg-white shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg font-medium text-black mb-4">Product List</h3>
                <ul className="divide-y divide-gray-200">
                  {products.map((product) => (
                    <li key={product.id} className="py-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-black">{product.name}</p>
                          <p className="text-sm text-black">UGX {product.price.toLocaleString()}</p>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}
        {activeTab === 'sales' && (
          <div className="px-4 py-6 sm:px-0">
            <h2 className="text-2xl font-bold text-black mb-4">Manage Sales</h2>
            <div className="bg-white shadow rounded-lg p-6 mb-6">
              <h3 className="text-lg font-medium text-black mb-4">Add New Sale</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <select
                  value={newSale.productId}
                  onChange={(e) => setNewSale({ ...newSale, productId: e.target.value })}
                  className="border border-gray-300 rounded-md px-3 py-2 text-black"
                >
                  <option value="">Select Product</option>
                  {products.map((product) => (
                    <option key={product.id} value={product.id}>{product.name} - UGX {product.price.toLocaleString()}</option>
                  ))}
                </select>
                <input
                  type="number"
                  placeholder="Quantity"
                  value={newSale.quantity}
                  onChange={(e) => setNewSale({ ...newSale, quantity: e.target.value })}
                  className="border border-gray-300 rounded-md px-3 py-2 text-black"
                />
                <button
                  onClick={addSale}
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                >
                  Add Sale
                </button>
              </div>
            </div>
            <div className="bg-white shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg font-medium text-black mb-4">Sales List</h3>
                <ul className="divide-y divide-gray-200">
                  {sales.map((sale) => {
                    const product = products.find(p => p.id === sale.product_id);
                    return (
                      <li key={sale.id} className="py-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-black">{product?.name || 'Unknown Product'}</p>
                            <p className="text-sm text-black">Quantity: {sale.quantity}</p>
                          </div>
                          <p className="text-sm font-medium text-black">UGX {(product ? product.price * sale.quantity : 0).toLocaleString()}</p>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
