/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight, Filter, Search, RotateCcw } from 'lucide-react';
import { Product } from '../types';
import ProductCard from './ProductCard';

interface ProductsViewProps {
  products: Product[];
  onReserve: (product: Product) => void;
  onUnavailableTrigger: () => void;
}

export default function ProductsView({ products, onReserve, onUnavailableTrigger }: ProductsViewProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  
  const itemsPerPage = 3;

  // Derive unique categories for filter
  const categories = useMemo(() => {
    const list = new Set(products.map(p => p.category));
    return ['All', ...Array.from(list)];
  }, [products]);

  // Handle filtering
  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            product.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            product.description.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
      
      const matchesStatus = selectedStatus === 'All' || product.stockStatus === selectedStatus;

      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [products, searchTerm, selectedCategory, selectedStatus]);

  // Compute total pages
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage) || 1;

  // Make sure current page is not out of bounds
  const activePage = Math.min(currentPage, totalPages);

  // Paginated list
  const paginatedProducts = useMemo(() => {
    const start = (activePage - 1) * itemsPerPage;
    return filteredProducts.slice(start, start + itemsPerPage);
  }, [filteredProducts, activePage, itemsPerPage]);

  const startItem = filteredProducts.length === 0 ? 0 : (activePage - 1) * itemsPerPage + 1;
  const endItem = Math.min(activePage * itemsPerPage, filteredProducts.length);

  // Reset filters
  const resetFilters = () => {
    setSearchTerm('');
    setSelectedCategory('All');
    setSelectedStatus('All');
    setCurrentPage(1);
  };

  return (
    <div className="w-full">
      {/* Contextual Header */}
      <div className="mb-8">
        <h2 className="text-[#0b1c30] text-3xl font-extrabold tracking-tight md:text-4xl">
          Global Inventory
        </h2>
        <p className="text-[#464555] text-base mt-2 max-w-2xl leading-relaxed">
          Precision management for high-velocity logistics. Real-time stock distribution across regional hubs.
        </p>
      </div>

      {/* Real-time search tools & filter panel */}
      <div className="bg-white border border-[#e5eeff] p-4 rounded-2xl mb-8 flex flex-col md:flex-row gap-4 items-center shadow-xs">
        {/* Search input field */}
        <div className="relative w-full md:flex-grow">
          <span className="absolute inset-y-0 left-3 flex items-center text-[#777587]">
            <Search className="w-4 h-4" />
          </span>
          <input
            type="text"
            placeholder="Search SKU, name, description..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-10 pr-4 py-2.5 bg-[#f8f9ff] text-[#0b1c30] placeholder-[#777587] border border-[#c7c4d8]/60 rounded-xl font-sans text-sm outline-none focus:border-[#3525cd] focus:ring-2 focus:ring-[#3525cd]/10 transition-all"
          />
        </div>

        {/* Category dropdown selector */}
        <div className="w-full md:w-48 flex items-center gap-2 bg-[#f8f9ff] px-3 py-2.5 rounded-xl border border-[#c7c4d8]/60">
          <Filter className="w-3.5 h-3.5 text-[#3525cd]" />
          <select
            value={selectedCategory}
            onChange={(e) => {
              setSelectedCategory(e.target.value);
              setCurrentPage(1);
            }}
            className="bg-transparent text-[#0b1c30] outline-none text-xs font-semibold w-full cursor-pointer"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat === 'All' ? 'All Classes' : cat}
              </option>
            ))}
          </select>
        </div>

        {/* Status selection slider or select */}
        <div className="w-full md:w-44 flex items-center gap-2 bg-[#f8f9ff] px-3 py-2.5 rounded-xl border border-[#c7c4d8]/60">
          <span className="w-1.5 h-1.5 rounded-full bg-[#3525cd]"></span>
          <select
            value={selectedStatus}
            onChange={(e) => {
              setSelectedStatus(e.target.value);
              setCurrentPage(1);
            }}
            className="bg-transparent text-[#0b1c30] outline-none text-xs font-semibold w-full cursor-pointer"
          >
            <option value="All">All Statuses</option>
            <option value="High Stock">High Stock Only</option>
            <option value="Low Stock">Low Stock Only</option>
            <option value="Out of Stock">Out of Stock Only</option>
          </select>
        </div>

        {/* Clear filter handler */}
        {(searchTerm || selectedCategory !== 'All' || selectedStatus !== 'All') && (
          <button
            onClick={resetFilters}
            className="w-full md:w-auto px-4 py-2.5 text-[#ba1a1a] border border-red-200 bg-red-50 hover:bg-red-100 rounded-xl transition-colors font-sans text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset
          </button>
        )}
      </div>

      {/* Grid listing */}
      {filteredProducts.length === 0 ? (
        <div className="text-center bg-white border border-[#e5eeff] rounded-2xl p-16 shadow-xs">
          <p className="text-[#0b1c30] font-bold text-lg">No matching ledger items found</p>
          <p className="text-xs text-[#777587] mt-1.5 max-w-sm mx-auto">
            Try adjusting your search criteria, filter configuration, or class parameters to look up current stock positions.
          </p>
          <button
            onClick={resetFilters}
            className="mt-6 bg-[#3525cd] hover:bg-[#4f46e5] text-white px-5 py-2.5 rounded-xl font-semibold text-xs transition-colors cursor-pointer shadow-sm"
          >
            Show All Stocks
          </button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginatedProducts.map((product: Product) => (
              <ProductCard
                key={product.id}
                product={product}
                onReserve={onReserve}
                onUnavailableTrigger={onUnavailableTrigger}
              />
            ))}
          </div>

          {/* Pagination bar matching mock perfectly */}
          <div className="mt-12 flex flex-col sm:flex-row justify-between items-center border-t border-[#c7c4d8]/60 pt-6 gap-4">
            <p className="text-sm font-sans text-[#464555]">
              Showing <span className="font-semibold text-[#0b1c30]">{startItem}-{endItem}</span> of <span className="font-semibold text-[#0b1c30]">{filteredProducts.length}</span> premium products
            </p>

            <div className="flex gap-1.5">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={activePage === 1}
                className="p-2 border border-[#c7c4d8]/60 bg-white rounded-lg hover:bg-[#eff4ff] transition-colors disabled:opacity-40 disabled:hover:bg-white select-none cursor-pointer"
                title="Previous page"
              >
                <ChevronLeft className="w-4 h-4 text-[#0b1c30]" />
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((pg) => (
                <button
                  key={pg}
                  onClick={() => setCurrentPage(pg)}
                  className={`px-3 py-1.5 border rounded-lg font-bold text-xs select-none cursor-pointer transition-all ${
                    activePage === pg
                      ? 'border-[#3525cd] bg-[#e5eeff] text-[#3525cd] scale-102'
                      : 'border-[#c7c4d8]/60 bg-white text-[#464555] hover:bg-[#eff4ff]'
                  }`}
                >
                  {pg}
                </button>
              ))}

              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={activePage === totalPages}
                className="p-2 border border-[#c7c4d8]/60 bg-white rounded-lg hover:bg-[#eff4ff] transition-colors disabled:opacity-40 disabled:hover:bg-white select-none cursor-pointer"
                title="Next page"
              >
                <ChevronRight className="w-4 h-4 text-[#0b1c30]" />
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
