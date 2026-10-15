import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { InventoryItem, InventoryTransaction } from '../../types';
import {
  PackageCheck,
  AlertTriangle,
  PlusCircle,
  MinusCircle,
  History,
  Search,
  Tag,
  Boxes
} from 'lucide-react';

export const InventoryView: React.FC = () => {
  const { inventory, inventoryTransactions, recordInventoryUsageOrRestock, courses, settings } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'stock' | 'transactions'>('stock');
  const [showAdjustModal, setShowAdjustModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);

  // Form State
  const [adjustType, setAdjustType] = useState<'training_usage' | 'purchase' | 'damaged' | 'adjustment'>('training_usage');
  const [quantity, setQuantity] = useState<number>(1);
  const [notes, setNotes] = useState('');
  const [courseId, setCourseId] = useState(courses[0]?.id || '');

  const lowStockCount = inventory.filter((i) => i.quantityInStock <= i.minimumStockLevel).length;

  const filteredItems = inventory.filter(
    (i) =>
      i.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      i.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
      i.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleOpenAdjust = (item: InventoryItem, defaultType: 'training_usage' | 'purchase') => {
    setSelectedItem(item);
    setAdjustType(defaultType);
    setQuantity(1);
    setNotes(defaultType === 'training_usage' ? 'Dispatched for class practical demo' : 'Restock shipment received');
    setShowAdjustModal(true);
  };

  const handleAdjustSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedItem) return;

    const change = adjustType === 'purchase' || adjustType === 'adjustment' ? quantity : -quantity;

    if (adjustType !== 'purchase' && selectedItem.quantityInStock < quantity) {
      alert(`Cannot deduct ${quantity} units. Only ${selectedItem.quantityInStock} available.`);
      return;
    }

    recordInventoryUsageOrRestock(
      selectedItem.id,
      change,
      adjustType,
      notes || 'Manual stock update',
      courseId
    );

    setShowAdjustModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-serif font-bold text-white tracking-tight">
            Salon & Training Inventory Management
          </h1>
          <p className="text-xs text-stone-400 mt-1">
            Track HD lace frontals, adhesives, block mannequins, styling tools, and record consumable usage per course.
          </p>
        </div>

        <div className="flex items-center space-x-2 bg-stone-900 p-1 rounded-xl border border-stone-800">
          <button
            onClick={() => setActiveTab('stock')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              activeTab === 'stock' ? 'bg-amber-600 text-stone-950' : 'text-stone-400 hover:text-white'
            }`}
          >
            Inventory Catalog ({inventory.length})
          </button>
          <button
            onClick={() => setActiveTab('transactions')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              activeTab === 'transactions' ? 'bg-amber-600 text-stone-950' : 'text-stone-400 hover:text-white'
            }`}
          >
            Movement Log ({inventoryTransactions.length})
          </button>
        </div>
      </div>

      {/* Low Stock Banner */}
      {lowStockCount > 0 && (
        <div className="bg-rose-950/40 border border-rose-800/60 rounded-2xl p-4 flex items-center justify-between text-xs text-rose-200">
          <div className="flex items-center space-x-3">
            <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0" />
            <div>
              <span className="font-bold">Threshold Alert: </span>
              <span>
                {lowStockCount} items have reached or fallen below their minimum required reserve stock level.
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Search Bar */}
      <div className="bg-stone-900 border border-stone-800 rounded-2xl p-4 flex items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-stone-500 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search items, SKU, category..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-stone-950 border border-stone-700 rounded-xl pl-9 pr-3 py-2 text-xs text-stone-200 focus:outline-none focus:ring-1 focus:ring-amber-500"
          />
        </div>

        <div className="text-xs text-stone-400 hidden sm:block">
          Total Valuation:{' '}
          <span className="font-mono font-bold text-emerald-400">
            $
            {inventory
              .reduce((sum, i) => sum + i.quantityInStock * i.purchaseCost, 0)
              .toLocaleString()}
          </span>
        </div>
      </div>

      {activeTab === 'stock' ? (
        /* Inventory Catalog Table */
        <div className="bg-stone-900 border border-stone-800 rounded-2xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-stone-300">
              <thead className="bg-stone-950/80 text-stone-400 uppercase text-[10px] tracking-wider border-b border-stone-800">
                <tr>
                  <th className="px-4 py-3">Product Name & SKU</th>
                  <th className="px-4 py-3">Category</th>
                  <th className="px-4 py-3">Location</th>
                  <th className="px-4 py-3 text-right">In Stock</th>
                  <th className="px-4 py-3 text-right">Unit Cost</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-center">Stock Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-800/60">
                {filteredItems.map((item) => (
                  <tr key={item.id} className="hover:bg-stone-850/60 transition">
                    <td className="px-4 py-3.5">
                      <div className="font-semibold text-white">{item.name}</div>
                      <div className="text-[10px] text-stone-500 font-mono">
                        SKU: {item.sku} • {item.supplier}
                      </div>
                    </td>

                    <td className="px-4 py-3.5">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-stone-800 text-stone-300 border border-stone-700">
                        {item.category}
                      </span>
                    </td>

                    <td className="px-4 py-3.5 text-stone-300 text-[11px]">
                      {item.storageLocation}
                    </td>

                    <td className="px-4 py-3.5 text-right font-mono font-bold text-sm">
                      <span
                        className={
                          item.quantityInStock <= item.minimumStockLevel
                            ? 'text-rose-400'
                            : 'text-emerald-400'
                        }
                      >
                        {item.quantityInStock} {item.unit}s
                      </span>
                      <div className="text-[10px] text-stone-500 font-normal">
                        Min: {item.minimumStockLevel}
                      </div>
                    </td>

                    <td className="px-4 py-3.5 text-right font-mono text-stone-300">
                      ${item.purchaseCost.toFixed(2)}
                    </td>

                    <td className="px-4 py-3.5">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-semibold border uppercase tracking-wider ${
                          item.status === 'in_stock'
                            ? 'bg-emerald-950 text-emerald-300 border-emerald-800/60'
                            : item.status === 'low_stock'
                            ? 'bg-rose-950 text-rose-300 border-rose-800/60'
                            : 'bg-stone-800 text-stone-400 border-stone-700'
                        }`}
                      >
                        {item.status.replace('_', ' ')}
                      </span>
                    </td>

                    <td className="px-4 py-3.5 text-center">
                      <div className="flex items-center justify-center space-x-1.5">
                        <button
                          onClick={() => handleOpenAdjust(item, 'training_usage')}
                          className="px-2 py-1 rounded-lg bg-stone-800 hover:bg-stone-700 text-rose-300 text-[11px] font-medium border border-stone-700 transition flex items-center space-x-1"
                          title="Record usage for class"
                        >
                          <MinusCircle className="w-3 h-3" />
                          <span>Use</span>
                        </button>
                        <button
                          onClick={() => handleOpenAdjust(item, 'purchase')}
                          className="px-2 py-1 rounded-lg bg-stone-800 hover:bg-stone-700 text-emerald-300 text-[11px] font-medium border border-stone-700 transition flex items-center space-x-1"
                          title="Record restock arrival"
                        >
                          <PlusCircle className="w-3 h-3" />
                          <span>Restock</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Inventory Transactions Log */
        <div className="bg-stone-900 border border-stone-800 rounded-2xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-stone-300">
              <thead className="bg-stone-950/80 text-stone-400 uppercase text-[10px] tracking-wider border-b border-stone-800">
                <tr>
                  <th className="px-4 py-3">Tx ID & Date</th>
                  <th className="px-4 py-3">Item Name</th>
                  <th className="px-4 py-3">Movement Type</th>
                  <th className="px-4 py-3 text-right">Change</th>
                  <th className="px-4 py-3 text-right">New Stock</th>
                  <th className="px-4 py-3">Notes & Reason</th>
                  <th className="px-4 py-3">Logged By</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-800/60">
                {inventoryTransactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-stone-850/60 transition">
                    <td className="px-4 py-3.5 font-mono">
                      <div className="font-bold text-stone-200">{tx.id}</div>
                      <div className="text-[10px] text-stone-500">{tx.date}</div>
                    </td>

                    <td className="px-4 py-3.5 font-semibold text-white">
                      {tx.itemName}
                    </td>

                    <td className="px-4 py-3.5 capitalize">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                          tx.transactionType === 'purchase'
                            ? 'bg-emerald-950 text-emerald-300 border border-emerald-800/50'
                            : 'bg-amber-950 text-amber-300 border border-amber-800/50'
                        }`}
                      >
                        {tx.transactionType.replace('_', ' ')}
                      </span>
                    </td>

                    <td className="px-4 py-3.5 text-right font-mono font-bold">
                      <span className={tx.quantityChange > 0 ? 'text-emerald-400' : 'text-rose-400'}>
                        {tx.quantityChange > 0 ? `+${tx.quantityChange}` : tx.quantityChange}
                      </span>
                    </td>

                    <td className="px-4 py-3.5 text-right font-mono text-stone-200">
                      {tx.newQuantity}
                    </td>

                    <td className="px-4 py-3.5 text-stone-300 text-[11px] max-w-xs truncate">
                      {tx.notes}
                    </td>

                    <td className="px-4 py-3.5 text-stone-400 text-[11px]">
                      {tx.performedBy}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Adjust Inventory Modal */}
      {showAdjustModal && selectedItem && (
        <div className="fixed inset-0 z-50 bg-stone-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-stone-900 border border-stone-700 rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center space-x-2">
              <Boxes className="w-4 h-4 text-amber-400" />
              <span>Record Stock Movement</span>
            </h3>

            <p className="text-xs text-stone-300">
              Adjusting: <span className="font-semibold text-white">{selectedItem.name}</span> (Current:{' '}
              <span className="font-mono font-bold text-amber-300">
                {selectedItem.quantityInStock} {selectedItem.unit}s
              </span>
              )
            </p>

            <form onSubmit={handleAdjustSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-stone-300 mb-1">
                  Movement Type <span className="text-rose-400">*</span>
                </label>
                <select
                  value={adjustType}
                  onChange={(e) => setAdjustType(e.target.value as any)}
                  className="w-full bg-stone-950 border border-stone-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                >
                  <option value="training_usage">Training Workshop Usage (Deduct)</option>
                  <option value="purchase">Stock Restock / Purchase (Add)</option>
                  <option value="damaged">Damaged / Discarded (Deduct)</option>
                  <option value="adjustment">Inventory Reconciliation Adjustment</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-300 mb-1">
                  Quantity ({selectedItem.unit}s) <span className="text-rose-400">*</span>
                </label>
                <input
                  type="number"
                  min="1"
                  max="1000"
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  className="w-full bg-stone-950 border border-stone-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                  required
                />
              </div>

              {adjustType === 'training_usage' && (
                <div>
                  <label className="block text-xs font-medium text-stone-300 mb-1">
                    Allocated Course
                  </label>
                  <select
                    value={courseId}
                    onChange={(e) => setCourseId(e.target.value)}
                    className="w-full bg-stone-950 border border-stone-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                  >
                    {courses.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <label className="block text-xs font-medium text-stone-300 mb-1">
                  Operational Notes / Dispensation Reason <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Dispatched for Week 2 frontal melt workshop"
                  className="w-full bg-stone-950 border border-stone-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                  required
                />
              </div>

              <div className="flex items-center justify-end space-x-2 pt-2 border-t border-stone-800">
                <button
                  type="button"
                  onClick={() => setShowAdjustModal(false)}
                  className="px-4 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-amber-600 to-rose-600 hover:from-amber-500 hover:to-rose-500 text-white text-xs font-bold transition"
                >
                  Apply Stock Adjustment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
