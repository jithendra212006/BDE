'use client';

import React, { useState } from 'react';
import { Download, FileSpreadsheet, FileJson, CheckCircle } from 'lucide-react';
import BigDataPipelineVisual from '@/components/dashboard/BigDataPipelineVisual';

interface ReportItem {
  id: string;
  title: string;
  category: string;
  frequency: string;
  recordsCount: string;
  fileFormat: string;
  lastGenerated: string;
}

const reportList: ReportItem[] = [
  {
    id: 'rep-01',
    title: 'Daily Watch Time & Concurrency Rollup',
    category: 'Viewership Analytics',
    frequency: 'Daily',
    recordsCount: '48.2M Events',
    fileFormat: 'CSV / Parquet',
    lastGenerated: 'Today, 21:00 UTC',
  },
  {
    id: 'rep-02',
    title: 'Catalog Completion & Drop-Off Benchmarks',
    category: 'Content Performance',
    frequency: 'Weekly',
    recordsCount: '1,420 Titles',
    fileFormat: 'CSV',
    lastGenerated: 'Nov 20, 2024',
  },
  {
    id: 'rep-03',
    title: 'Viewer Retention & Cohort Churn Matrix',
    category: 'Audience Dynamics',
    frequency: 'Monthly',
    recordsCount: '24.8M Viewers',
    fileFormat: 'JSON / CSV',
    lastGenerated: 'Nov 01, 2024',
  },
  {
    id: 'rep-04',
    title: 'Subscription MRR & Regional ARPU Allocation',
    category: 'Financial Intelligence',
    frequency: 'Monthly',
    recordsCount: '18.2M Subscribers',
    fileFormat: 'CSV',
    lastGenerated: 'Nov 01, 2024',
  },
  {
    id: 'rep-05',
    title: 'Hardware Device & Bandwidth Distribution',
    category: 'Platform Operations',
    frequency: 'Daily',
    recordsCount: '68.1M Sessions',
    fileFormat: 'CSV',
    lastGenerated: 'Today, 12:00 UTC',
  },
];

export default function ReportsPage() {
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  const handleExport = (id: string, title: string) => {
    setDownloadingId(id);
    setTimeout(() => {
      setDownloadingId(null);
      alert(`Exporting "${title}" dataset. Ready for download.`);
    }, 500);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 py-2 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            Reports & Data Architecture
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            Exportable analytics summaries and Big Data pipeline architecture.
          </p>
        </div>

        <button
          onClick={() => handleExport('all', 'Full Analytics Summary')}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-600 hover:bg-red-500 text-white text-xs font-semibold transition-colors self-start sm:self-auto"
        >
          <Download className="w-4 h-4" />
          Export All Summaries (CSV)
        </button>
      </div>

      {/* Available Reports Table */}
      <section className="card-clean p-6">
        <div className="pb-4">
          <h3 className="text-base font-semibold text-white tracking-tight">
            Summary Analytics Reports
          </h3>
          <p className="text-xs text-gray-400 mt-0.5">
            Pre-aggregated datasets ready for operational and business review
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-[#1E2330] text-gray-400 font-medium">
                <th className="pb-3 px-3">Report Name</th>
                <th className="pb-3 px-3">Category</th>
                <th className="pb-3 px-3">Frequency</th>
                <th className="pb-3 px-3">Volume</th>
                <th className="pb-3 px-3">Format</th>
                <th className="pb-3 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1E2330]">
              {reportList.map((rep) => (
                <tr key={rep.id} className="hover:bg-[#161924] transition-colors">
                  <td className="py-3.5 px-3">
                    <span className="font-medium text-white block">{rep.title}</span>
                    <span className="text-[10px] text-gray-500">Updated: {rep.lastGenerated}</span>
                  </td>
                  <td className="py-3.5 px-3 text-gray-400">{rep.category}</td>
                  <td className="py-3.5 px-3 text-gray-300">{rep.frequency}</td>
                  <td className="py-3.5 px-3 text-gray-300">{rep.recordsCount}</td>
                  <td className="py-3.5 px-3 text-gray-400">{rep.fileFormat}</td>
                  <td className="py-3.5 px-3 text-right">
                    <button
                      onClick={() => handleExport(rep.id, rep.title)}
                      disabled={downloadingId === rep.id}
                      className="px-3 py-1.5 rounded bg-[#141720] hover:bg-[#1E2330] text-gray-200 border border-[#1E2330] text-xs font-medium transition-colors inline-flex items-center gap-1.5"
                    >
                      <Download className="w-3.5 h-3.5 text-red-400" />
                      {downloadingId === rep.id ? 'Exporting...' : 'Download'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Big Data Pipeline Section */}
      <section>
        <BigDataPipelineVisual />
      </section>
    </div>
  );
}
