'use client';

import React from 'react';
import { ArrowRight, Database, Server, Cpu, HardDrive, Layers, BarChart3 } from 'lucide-react';

const pipelineNodes = [
  {
    step: '01',
    name: 'Viewing Events',
    tech: 'Client Telemetry',
    desc: 'Playback sessions, buffer events, bitrate changes',
  },
  {
    step: '02',
    name: 'Raw Ingestion',
    tech: 'Batch Aggregator',
    desc: 'Snappy-compressed staging logs',
  },
  {
    step: '03',
    name: 'Hadoop HDFS',
    tech: 'Distributed Storage',
    desc: 'Fault-tolerant multi-terabyte Parquet archives',
  },
  {
    step: '04',
    name: 'Apache Hive',
    tech: 'Data Warehouse',
    desc: 'Schema-on-read partitioned tables',
  },
  {
    step: '05',
    name: 'Apache Spark',
    tech: 'PySpark Core & ML',
    desc: 'Window aggregations and churn scoring models',
  },
  {
    step: '06',
    name: 'Analytics Store',
    tech: 'Serving Layer',
    desc: 'Aggregated dimensional metrics cache',
  },
  {
    step: '07',
    name: 'StreamInsight',
    tech: 'Next.js UI',
    desc: 'Executive telemetry & business intelligence',
  },
];

export default function BigDataPipelineVisual() {
  return (
    <div className="card-clean p-6">
      <div className="pb-5">
        <h3 className="text-base font-semibold text-white tracking-tight">
          Big Data Pipeline Architecture
        </h3>
        <p className="text-xs text-gray-400 mt-0.5">
          End-to-end data flow from raw streaming telemetry to distributed analytical aggregations
        </p>
      </div>

      {/* Clean Pipeline Steps Flow */}
      <div className="grid grid-cols-1 md:grid-cols-7 gap-3 my-2">
        {pipelineNodes.map((node, i) => (
          <div
            key={node.step}
            className="p-4 rounded-lg bg-[#141720] border border-[#1E2330] flex flex-col justify-between"
          >
            <div>
              <span className="text-[10px] font-mono text-gray-500 font-bold block mb-1">
                {node.step}
              </span>
              <h4 className="text-xs font-semibold text-white">
                {node.name}
              </h4>
              <span className="text-[11px] text-red-400 font-medium block mt-0.5">
                {node.tech}
              </span>
            </div>
            <p className="text-[10px] text-gray-400 mt-3 leading-relaxed">
              {node.desc}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-4 pt-4 border-t border-[#1E2330] flex flex-wrap items-center justify-between gap-3 text-xs text-gray-400">
        <span>Big Data Components: <strong className="text-gray-200">Hadoop HDFS • Apache Hive • PySpark</strong></span>
        <span className="text-gray-500">Planned Phase 2 Infrastructure</span>
      </div>
    </div>
  );
}
