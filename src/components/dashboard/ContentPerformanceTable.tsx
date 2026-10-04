'use client';

import React, { useState, useEffect } from 'react';
import {
  Search,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  Filter,
} from 'lucide-react';
import { ContentItem, GenreType } from '@/types/analytics';
import { analyticsService } from '@/services/analyticsService';
import { formatCompactNumber } from '@/lib/utils';
import { cn } from '@/lib/utils';

export default function ContentPerformanceTable() {
  const [content, setContent] = useState<ContentItem[]>([]);
  const [search, setSearch] = useState('');
  const [selectedGenre, setSelectedGenre] = useState<GenreType | 'All'>('All');
  const [sortBy, setSortBy] = useState<'views' | 'watchHours' | 'completionRate' | 'rating' | 'trend'>('views');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const genres: (GenreType | 'All')[] = [
    'All',
    'Drama',
    'Action',
    'Sci-Fi',
    'Thriller',
    'Comedy',
    'Anime',
    'Horror',
    'Documentary',
  ];

  useEffect(() => {
    analyticsService
      .getContentCatalog({
        search,
        genre: selectedGenre,
        sortBy,
        sortOrder,
      })
      .then((res) => {
        setContent(res);
        setCurrentPage(1);
      });
  }, [search, selectedGenre, sortBy, sortOrder]);

  const handleSort = (field: 'views' | 'watchHours' | 'completionRate' | 'rating' | 'trend') => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  const totalPages = Math.ceil(content.length / itemsPerPage) || 1;
  const paginatedItems = content.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="card-clean p-6">
      {/* Header & Filter Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5">
        <div>
          <h3 className="text-base font-semibold text-white tracking-tight">Catalog Performance</h3>
          <p className="text-xs text-gray-400 mt-0.5">
            Viewership metrics, completion rates, and ratings
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Search box */}
          <div className="relative w-48">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
            <input
              type="text"
              placeholder="Search title..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg bg-[#141720] text-gray-200 placeholder-gray-500 border border-[#1E2330] focus:border-red-500/60 outline-none"
            />
          </div>

          {/* Genre Filter */}
          <div className="flex items-center gap-1.5 bg-[#141720] px-2.5 py-1.5 rounded-lg border border-[#1E2330] text-xs">
            <Filter className="w-3 h-3 text-gray-400" />
            <select
              value={selectedGenre}
              onChange={(e) => setSelectedGenre(e.target.value as GenreType | 'All')}
              className="bg-transparent text-gray-300 outline-none cursor-pointer text-xs"
            >
              {genres.map((g) => (
                <option key={g} value={g} className="bg-[#141720] text-gray-200">
                  {g === 'All' ? 'All Genres' : g}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Table Container */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-[#1E2330] text-gray-400 font-medium">
              <th className="pb-3 px-3">Title</th>
              <th className="pb-3 px-3">Genre</th>
              <th
                onClick={() => handleSort('views')}
                className="pb-3 px-3 cursor-pointer hover:text-white transition-colors"
              >
                <div className="flex items-center gap-1">
                  Views
                  <ArrowUpDown className="w-3 h-3 text-gray-500" />
                </div>
              </th>
              <th
                onClick={() => handleSort('watchHours')}
                className="pb-3 px-3 cursor-pointer hover:text-white transition-colors"
              >
                <div className="flex items-center gap-1">
                  Watch Time
                  <ArrowUpDown className="w-3 h-3 text-gray-500" />
                </div>
              </th>
              <th
                onClick={() => handleSort('completionRate')}
                className="pb-3 px-3 cursor-pointer hover:text-white transition-colors"
              >
                <div className="flex items-center gap-1">
                  Completion
                  <ArrowUpDown className="w-3 h-3 text-gray-500" />
                </div>
              </th>
              <th
                onClick={() => handleSort('rating')}
                className="pb-3 px-3 cursor-pointer hover:text-white transition-colors"
              >
                <div className="flex items-center gap-1">
                  Rating
                  <ArrowUpDown className="w-3 h-3 text-gray-500" />
                </div>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#1E2330]">
            {paginatedItems.map((item) => (
              <tr
                key={item.id}
                className="hover:bg-[#161924] transition-colors group"
              >
                <td className="py-3 px-3">
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`w-6 h-6 rounded bg-gradient-to-br ${item.posterColor} flex items-center justify-center font-bold text-[9px] text-white/90 shrink-0`}
                    >
                      {item.title.substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <span className="font-medium text-white group-hover:text-red-400 transition-colors block">
                        {item.title}
                      </span>
                      <span className="text-[10px] text-gray-500">
                        {item.releaseYear} • {item.durationMinutes}m
                      </span>
                    </div>
                  </div>
                </td>
                <td className="py-3 px-3 text-gray-400">
                  {item.genre}
                </td>
                <td className="py-3 px-3 font-medium text-gray-200">
                  {formatCompactNumber(item.totalViews)}
                </td>
                <td className="py-3 px-3 text-gray-300">
                  {(item.totalWatchHours / 1000000).toFixed(1)}M hrs
                </td>
                <td className="py-3 px-3">
                  <div className="flex items-center gap-2">
                    <span className="text-emerald-400 font-medium">
                      {item.completionRate}%
                    </span>
                    <div className="w-12 bg-[#1E2330] rounded-full h-1 overflow-hidden">
                      <div
                        className="h-full bg-emerald-500 rounded-full"
                        style={{ width: `${item.completionRate}%` }}
                      />
                    </div>
                  </div>
                </td>
                <td className="py-3 px-3 text-gray-200 font-medium">
                  {item.rating} / 10
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="mt-4 pt-4 border-t border-[#1E2330] flex items-center justify-between text-xs text-gray-400">
        <div>
          Showing {((currentPage - 1) * itemsPerPage) + 1} - {Math.min(currentPage * itemsPerPage, content.length)} of {content.length}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="p-1 rounded bg-[#141720] border border-[#1E2330] text-gray-300 disabled:opacity-40 hover:bg-[#1C212E] transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-gray-300">
            {currentPage} / {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="p-1 rounded bg-[#141720] border border-[#1E2330] text-gray-300 disabled:opacity-40 hover:bg-[#1C212E] transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
