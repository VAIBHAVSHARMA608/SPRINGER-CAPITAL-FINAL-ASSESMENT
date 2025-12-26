"use client";

import { useEffect, useMemo, useState } from "react";
import Chart from "./charts";

type CsvRow = {
  model: string;
  monthly: number[]; // 12 months
  sum: number;
  category: string;
  year: number;
};

function parseCSV(text: string): CsvRow[] {
  const lines = text.split(/\r?\n/).filter(Boolean);
  const header = lines[0].split(",");
  const rows = lines.slice(1).map((ln) => {
    const cols = ln.split(",");
    const model = cols[0];
    const monthly = cols.slice(1, 13).map((c) => Number(c || 0));
    const sum = Number(cols[13] || 0);
    const category = cols[14] || "";
    const year = Number(cols[15] || 0);
    return { model, monthly, sum, category, year } as CsvRow;
  });
  return rows;
}

export default function Dashboard() {
  const [chartType, setChartType] = useState<"bar" | "line">("bar");
  const [csvRows, setCsvRows] = useState<CsvRow[]>([]);
  const [year, setYear] = useState<number>(2021);
  const [modelFilter, setModelFilter] = useState<string>("");
  const [minSum, setMinSum] = useState<number>(0);

  useEffect(() => {
    // fetch published CSV from public folder
    fetch('/Canadasalesdata.csv')
      .then((r) => r.text())
      .then((txt) => setCsvRows(parseCSV(txt)))
      .catch(() => setCsvRows([]));
  }, []);

  const years = useMemo(() => Array.from(new Set(csvRows.map((r) => r.year))).sort((a, b) => b - a), [csvRows]);

  const filteredRows = useMemo(() => {
    return csvRows.filter((r) => r.year === year && r.model.toLowerCase().includes(modelFilter.toLowerCase()) && r.sum >= minSum);
  }, [csvRows, year, modelFilter, minSum]);

  // aggregate monthly totals for filtered rows
  const aggregated = useMemo(() => {
    const months = Array(12).fill(0);
    filteredRows.forEach((r) => {
      r.monthly.forEach((v, i) => (months[i] += v));
    });
    return months.map((v, i) => ({ month: ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"][i], sales: v }));
  }, [filteredRows]);

  function exportFilteredCSV() {
    const header = ['Model','Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec','Sumofsales','Category','Year'];
    const lines = filteredRows.map(r => [r.model, ...r.monthly.map(String), String(r.sum), r.category, String(r.year)].join(','));
    const csv = [header.join(','), ...lines].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `filtered-sales-${year}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <main className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold text-center mb-8">Sales Dashboard</h1>

      {/* Controls */}
      <div className="container mx-auto px-6 lg:px-8 mb-6">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="flex gap-3 items-center">
            <label className="font-medium">Year</label>
            <select value={year} onChange={(e) => setYear(Number(e.target.value))} className="px-3 py-2 rounded border">
              {years.length ? years.map(y => <option key={y} value={y}>{y}</option>) : <option value={2021}>2021</option>}
            </select>

            <label className="font-medium">Chart</label>
            <div className="inline-flex rounded-md shadow-sm" role="group">
              <button onClick={() => setChartType('bar')} className={`px-3 py-2 ${chartType==='bar'? 'bg-indigo-600 text-white':'bg-white border'}`}>Bar</button>
              <button onClick={() => setChartType('line')} className={`px-3 py-2 ${chartType==='line'? 'bg-indigo-600 text-white':'bg-white border'}`}>Line</button>
            </div>
          </div>

          <div className="flex gap-3 items-center">
            <input placeholder="Search model" value={modelFilter} onChange={(e) => setModelFilter(e.target.value)} className="px-3 py-2 border rounded" />
            <label className="font-medium">Min Sum</label>
            <input type="number" value={minSum} onChange={(e) => setMinSum(Number(e.target.value))} className="w-24 px-3 py-2 border rounded" />
            <a href="/Canadasalesdata.csv" download className="px-4 py-2 bg-green-600 text-white rounded">Download CSV</a>
            <button onClick={exportFilteredCSV} className="px-4 py-2 bg-blue-600 text-white rounded">Export Filtered CSV</button>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="container mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8">
          <Chart data={aggregated} title={`Sales ${year} (filtered ${filteredRows.length} models)`} type={chartType} />
        </div>
      </div>

           <footer className="bg-indigo-900 text-gray-200 py-8">
        <div className="container mx-auto px-6 lg:px-8 text-center">
          <p>© 2025 Your Company. All rights reserved.</p>
          <div className="mt-4 flex justify-center gap-6">
            <a href="#" className="hover:text-white">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-white">
              Terms of Service
            </a>
          </div>
        </div>
      </footer>
    </main>

  );
}
