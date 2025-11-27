import React, { useState } from 'react';
import { Member, WishlistItem } from '../types';

interface WishlistProps {
    items: WishlistItem[];
    members: Member[];
    currentUser: string;
    onAddItem: (itemName: string, price: number) => void;
    onDeleteItem: (id: string) => void;
    onEditItem: (item: WishlistItem) => void;
}

const Wishlist: React.FC<WishlistProps> = ({ items, members, currentUser, onAddItem, onDeleteItem, onEditItem }) => {
    const [newItemName, setNewItemName] = useState('');
    const [newItemPrice, setNewItemPrice] = useState('');
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editName, setEditName] = useState('');
    const [editPrice, setEditPrice] = useState('');

    const memberMap = new Map(members.map(m => [m.id, m.name]));
    const totalExpense = items.reduce((sum, item) => sum + item.price, 0);

    const handleAdd = (e: React.FormEvent) => {
        e.preventDefault();
        if (newItemName.trim() && newItemPrice) {
            onAddItem(newItemName.trim(), parseFloat(newItemPrice));
            setNewItemName('');
            setNewItemPrice('');
        }
    };

    const startEdit = (item: WishlistItem) => {
        setEditingId(item.id);
        setEditName(item.itemName);
        setEditPrice(item.price.toString());
    };

    const cancelEdit = () => {
        setEditingId(null);
        setEditName('');
        setEditPrice('');
    };

    const saveEdit = (id: string) => {
        if (editName.trim() && editPrice) {
            const item = items.find(i => i.id === id);
            if (item) {
                onEditItem({
                    ...item,
                    itemName: editName.trim(),
                    price: parseFloat(editPrice)
                });
            }
            setEditingId(null);
        }
    };

    return (
        <div className="space-y-4">
            <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Wishlist & Expenses</h3>

                <form onSubmit={handleAdd} className="flex flex-col sm:flex-row gap-3 mb-6">
                    <input
                        type="text"
                        placeholder="Item name (e.g., Barbeque)"
                        value={newItemName}
                        onChange={(e) => setNewItemName(e.target.value)}
                        className="w-full sm:flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500"
                        required
                    />
                    <input
                        type="number"
                        placeholder="Price"
                        value={newItemPrice}
                        onChange={(e) => setNewItemPrice(e.target.value)}
                        className="w-full sm:w-32 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500"
                        min="0"
                        step="0.01"
                        required
                    />
                    <button
                        type="submit"
                        className="w-full sm:w-auto px-6 py-2 bg-violet-600 text-white font-semibold rounded-md hover:bg-violet-700 transition-colors"
                    >
                        Add
                    </button>
                </form>

                <div className="space-y-3">
                    {items.length > 0 ? (
                        <ul className="divide-y divide-gray-200">
                            {items.map(item => (
                                <li key={item.id} className="py-3 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 group">
                                    {editingId === item.id ? (
                                        <div className="w-full flex flex-col sm:flex-row gap-2">
                                            <input
                                                type="text"
                                                value={editName}
                                                onChange={(e) => setEditName(e.target.value)}
                                                className="flex-1 px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-violet-500"
                                                placeholder="Item Name"
                                            />
                                            <div className="flex gap-2">
                                                <input
                                                    type="number"
                                                    value={editPrice}
                                                    onChange={(e) => setEditPrice(e.target.value)}
                                                    className="flex-1 sm:w-24 px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-violet-500"
                                                    step="0.01"
                                                    placeholder="Price"
                                                />
                                                <button onClick={() => saveEdit(item.id)} className="p-1 text-green-600 hover:text-green-800 bg-green-50 rounded">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                    </svg>
                                                </button>
                                                <button onClick={cancelEdit} className="p-1 text-gray-500 hover:text-gray-700 bg-gray-50 rounded">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                                    </svg>
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <>
                                            <div className="flex-1 min-w-0">
                                                <p className="font-medium text-gray-800 break-words">{item.itemName}</p>
                                                <p className="text-xs text-gray-500">Added by {memberMap.get(item.memberId) || 'Unknown'}</p>
                                            </div>
                                            <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-4">
                                                <span className="font-semibold text-gray-700">₱{item.price.toLocaleString()}</span>
                                                <div className="flex items-center gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                                                    <button
                                                        onClick={() => startEdit(item)}
                                                        className="p-1 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded"
                                                        title="Edit item"
                                                    >
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                                                        </svg>
                                                    </button>
                                                    <button
                                                        onClick={() => onDeleteItem(item.id)}
                                                        className="p-1 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded"
                                                        title="Delete item"
                                                    >
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                        </svg>
                                                    </button>
                                                </div>
                                            </div>
                                        </>
                                    )}
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-center text-gray-500 py-4">No items in the wishlist yet.</p>
                    )}
                </div>

                <div className="mt-6 pt-4 border-t border-gray-200 flex flex-col sm:flex-row sm:justify-between items-center gap-2">
                    <span className="text-lg font-bold text-gray-700">Total Estimated Expense</span>
                    <span className="text-2xl font-bold text-violet-600">₱{totalExpense.toLocaleString()}</span>
                </div>
            </div>
        </div>
    );
};

export default Wishlist;
