'use client'

import { useState } from 'react'
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

export default function ReportsTab() {
  const [pastOrders] = useState([
    {
      id: 'ORD100',
      customerName: 'Ravi Kumar',
      products: [
        { name: 'Fresh Tomatoes', quantity: 10, price: 150.00 },
        { name: 'Papaya', quantity: 5, price: 180.00 }
      ],
      totalAmount: 2400.00,
      orderDate: '2024-11-15',
      completedDate: '2024-11-16',
      paymentMethod: 'Online Payment'
    },
    {
      id: 'ORD101',
      customerName: 'Saman Jayawardena',
      products: [
        { name: 'Carrot', quantity: 20, price: 120.00 }
      ],
      totalAmount: 2400.00,
      orderDate: '2024-11-18',
      completedDate: '2024-11-19',
      paymentMethod: 'Cash on Delivery'
    },
    {
      id: 'ORD102',
      customerName: 'Priya Dissanayake',
      products: [
        { name: 'Fresh Tomatoes', quantity: 8, price: 150.00 },
        { name: 'Carrot', quantity: 10, price: 120.00 }
      ],
      totalAmount: 2400.00,
      orderDate: '2024-11-20',
      completedDate: '2024-11-21',
      paymentMethod: 'Online Payment'
    },
    {
      id: 'ORD103',
      customerName: 'Nuwan Silva',
      products: [
        { name: 'Papaya', quantity: 15, price: 180.00 }
      ],
      totalAmount: 2700.00,
      orderDate: '2024-11-22',
      completedDate: '2024-11-23',
      paymentMethod: 'Cash on Delivery'
    },
    {
      id: 'ORD104',
      customerName: 'Chamari Fernando',
      products: [
        { name: 'Fresh Tomatoes', quantity: 12, price: 150.00 },
        { name: 'Papaya', quantity: 8, price: 180.00 }
      ],
      totalAmount: 3240.00,
      orderDate: '2024-11-25',
      completedDate: '2024-11-26',
      paymentMethod: 'Online Payment'
    }
  ])

  // Calculate statistics
  const totalRevenue = pastOrders.reduce((sum, order) => sum + order.totalAmount, 0)
  const totalOrders = pastOrders.length
  const averageOrderValue = totalRevenue / totalOrders

  // Sales by date data for line chart
  const salesByDate = [
    { date: 'Nov 15', sales: 2400 },
    { date: 'Nov 18', sales: 2400 },
    { date: 'Nov 20', sales: 2400 },
    { date: 'Nov 22', sales: 2700 },
    { date: 'Nov 25', sales: 3240 }
  ]

  // Product sales data for bar chart
  const productSales = [
    { product: 'Tomatoes', quantity: 30, revenue: 4500 },
    { product: 'Papaya', quantity: 28, revenue: 5040 },
    { product: 'Carrot', quantity: 30, revenue: 3600 }
  ]

  // Customer distribution for pie chart
  const customerData = [
    { name: 'Ravi Kumar', value: 2400 },
    { name: 'Saman J.', value: 2400 },
    { name: 'Priya D.', value: 2400 },
    { name: 'Nuwan Silva', value: 2700 },
    { name: 'Chamari F.', value: 3240 }
  ]

  const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6']

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold text-gray-800">Sales Reports & Analytics</h2>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-semibold">Total Revenue</h3>
            <span className="text-3xl">💰</span>
          </div>
          <p className="text-3xl font-bold">Rs. {totalRevenue.toFixed(2)}</p>
          <p className="text-green-100 text-sm mt-2">From {totalOrders} completed orders</p>
        </div>

        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-semibold">Total Orders</h3>
            <span className="text-3xl">📦</span>
          </div>
          <p className="text-3xl font-bold">{totalOrders}</p>
          <p className="text-blue-100 text-sm mt-2">Completed successfully</p>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-semibold">Avg Order Value</h3>
            <span className="text-3xl">📊</span>
          </div>
          <p className="text-3xl font-bold">Rs. {averageOrderValue.toFixed(2)}</p>
          <p className="text-purple-100 text-sm mt-2">Per order</p>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales Trend Chart */}
        <div className="bg-white border-2 border-gray-200 rounded-xl p-6 shadow-lg">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Sales Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={salesByDate}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="sales" stroke="#10b981" strokeWidth={3} name="Sales (Rs.)" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Product Performance Chart */}
        <div className="bg-white border-2 border-gray-200 rounded-xl p-6 shadow-lg">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Product Performance</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={productSales}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="product" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="revenue" fill="#10b981" name="Revenue (Rs.)" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Customer Distribution Chart */}
        <div className="bg-white border-2 border-gray-200 rounded-xl p-6 shadow-lg">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Revenue by Customer</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={customerData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {customerData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Top Products Table */}
        <div className="bg-white border-2 border-gray-200 rounded-xl p-6 shadow-lg">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Top Selling Products</h3>
          <div className="space-y-3">
            {productSales.map((product, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${
                    index === 0 ? 'bg-yellow-500' : index === 1 ? 'bg-gray-400' : 'bg-orange-600'
                  }`}>
                    {index + 1}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">{product.product}</p>
                    <p className="text-sm text-gray-600">{product.quantity} units sold</p>
                  </div>
                </div>
                <p className="font-bold text-green-600">Rs. {product.revenue.toFixed(2)}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Past Orders Table */}
      <div className="bg-white border-2 border-gray-200 rounded-xl p-6 shadow-lg">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Past Orders History</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Order ID</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Customer</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Products</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Order Date</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Completed</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Payment</th>
                <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {pastOrders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm font-semibold text-gray-800">{order.id}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">{order.customerName}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">
                    {order.products.map(p => p.name).join(', ')}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700">
                    {new Date(order.orderDate).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700">
                    {new Date(order.completedDate).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700">{order.paymentMethod}</td>
                  <td className="px-4 py-3 text-sm font-bold text-green-600 text-right">
                    Rs. {order.totalAmount.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot className="bg-gray-50">
              <tr>
                <td colSpan="6" className="px-4 py-3 text-right text-sm font-bold text-gray-800">
                  Total Revenue:
                </td>
                <td className="px-4 py-3 text-right text-lg font-bold text-green-600">
                  Rs. {totalRevenue.toFixed(2)}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  )
}

