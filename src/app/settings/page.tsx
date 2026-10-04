'use client';

import React, { useState } from 'react';
import { Save, CheckCircle } from 'lucide-react';

export default function SettingsPage() {
  const [sparkMaster, setSparkMaster] = useState('spark://master.bde-cluster.internal:7077');
  const [hdfsNamenode, setHdfsNamenode] = useState('hdfs://namenode.bde-cluster.internal:9000');
  const [hiveMetastore, setHiveMetastore] = useState('thrift://hive-metastore.bde-cluster.internal:9083');
  const [syncInterval, setSyncInterval] = useState('1h');
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
    }, 2000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 py-2 pb-12">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            Settings
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            Configure platform parameters and planned Big Data endpoints.
          </p>
        </div>

        {saved && (
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium">
            <CheckCircle className="w-4 h-4" />
            Settings saved
          </div>
        )}
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        <div className="card-clean p-6 space-y-5">
          <div className="border-b border-[#1E2330] pb-3">
            <h3 className="text-base font-semibold text-white">
              Data Pipeline Configuration
            </h3>
            <p className="text-xs text-gray-400 mt-0.5">
              Endpoints for Hadoop HDFS, Apache Hive, and Spark cluster execution
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs">
            <div className="space-y-1.5">
              <label className="text-gray-300 font-medium">Hadoop HDFS NameNode</label>
              <input
                type="text"
                value={hdfsNamenode}
                onChange={(e) => setHdfsNamenode(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-[#141720] border border-[#1E2330] font-mono text-gray-200 focus:border-red-500/60 outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-gray-300 font-medium">Apache Spark Master</label>
              <input
                type="text"
                value={sparkMaster}
                onChange={(e) => setSparkMaster(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-[#141720] border border-[#1E2330] font-mono text-gray-200 focus:border-red-500/60 outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-gray-300 font-medium">Apache Hive Metastore URI</label>
              <input
                type="text"
                value={hiveMetastore}
                onChange={(e) => setHiveMetastore(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-[#141720] border border-[#1E2330] font-mono text-gray-200 focus:border-red-500/60 outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-gray-300 font-medium">Batch Sync Frequency</label>
              <select
                value={syncInterval}
                onChange={(e) => setSyncInterval(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-[#141720] border border-[#1E2330] text-gray-200 focus:border-red-500/60 outline-none cursor-pointer"
              >
                <option value="15m" className="bg-[#141720]">Every 15 Minutes</option>
                <option value="1h" className="bg-[#141720]">Hourly Batch (Recommended)</option>
                <option value="24h" className="bg-[#141720]">Daily Nightly Batch</option>
              </select>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-red-600 hover:bg-red-500 text-white text-xs font-semibold transition-colors"
          >
            <Save className="w-4 h-4" />
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
}
