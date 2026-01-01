"use client";

import { useEffect, useMemo, useState } from "react";
import Chart from "./charts";

type CsvRow = {
  model: string;
  monthly: number[];
  sum: number;
  category: string;
  year: number;
};

function splitCSVLine(line: string): string[] {
  const result: string[] = [];
  let cur = "";
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      if (inQuotes && line[i + 1] === '"') {
        cur += '"';
        i++; // skip escaped quote
      } else {
        inQuotes = !inQuotes;
      }
    } else if (ch === ',' && !inQuotes) {
      result.push(cur);
      cur = '';
    } else {
      cur += ch;
    }
  }
  result.push(cur);
  return result;
}

function parseCSV(text: string): CsvRow[] {
  const lines = text.split(/\r?\n/).filter((l) => l.trim().length > 0);
  if (lines.length <= 1) return [];
  const headerCols = splitCSVLine(lines[0]);
  const rows = lines.slice(1).map((ln) => {
    const cols = splitCSVLine(ln);
    const model = cols[0] || '';
    function safeNum(v: string | undefined, fallback = 0) {
      const n = Number(v ?? fallback);
      return Number.isFinite(n) ? n : fallback;
    }
    const monthly = cols.slice(1, 13).map((c) => safeNum(c, 0));
    const sum = safeNum(cols[13], 0);
    const category = cols[14] || '';
    const year = safeNum(cols[15], 0);
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
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    fetch('/Canadasalesdata.csv')
      .then((r) => r.text())
      .then((txt) => setCsvRows(parseCSV(txt)))
      .catch(() => setCsvRows([]));
  }, []);

  // initialize theme from localStorage or system preference
  useEffect(() => {
    try {
      const saved = localStorage.getItem('theme');
      if (saved === 'light' || saved === 'dark') {
        setTheme(saved);
        return;
      }
    } catch (e) {
      // ignore
    }
    if (typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setTheme('dark');
    }
  }, []);

  useEffect(() => {
    try {
      document.documentElement.setAttribute('data-theme', theme);
      localStorage.setItem('theme', theme);
    } catch (e) {
      // ignore
    }
  }, [theme]);

  const years = useMemo(() => Array.from(new Set(csvRows.map((r) => r.year))).sort((a, b) => b - a), [csvRows]);
  // filter out invalid/non-finite year values to avoid passing NaN to option `value`
  const validYears = useMemo(() => years.filter((y) => Number.isFinite(y)), [years]);

  const filteredRows = useMemo(() => {
    return csvRows.filter((r) =>
      r.year === year &&
      r.model.toLowerCase().includes(modelFilter.toLowerCase()) &&
      r.sum >= minSum
    );
  }, [csvRows, year, modelFilter, minSum]);

  const aggregated = useMemo(() => {
    const months = Array(12).fill(0);
    filteredRows.forEach((r) => {
      r.monthly.forEach((v, i) => (months[i] += v));
    });
    return months.map((v, i) => ({
      month: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][i],
      sales: v
    }));
  }, [filteredRows]);

  function exportFilteredCSV() {
    const header = ['Model','Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec','Sumofsales','Category','Year'];
    function escapeField(s: string) {
      if (s == null) return '';
      const str = String(s);
      if (str.includes('"')) return '"' + str.replace(/"/g, '""') + '"';
      if (str.includes(',') || str.includes('\n') || str.includes('\r')) return '"' + str + '"';
      return str;
    }
    const lines = filteredRows.map(r =>
      [r.model, ...r.monthly.map((m) => String(m)), String(r.sum), r.category, String(r.year)].map(escapeField).join(',')
    );
    const csv = [header.map(escapeField).join(','), ...lines].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `filtered-sales-${year}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <main className="min-h-screen bg-background text-foreground p-8">
      <h1 className="text-3xl font-extrabold text-center mb-8">Sales Dashboard</h1>

      {/* Controls */}
      <div className="container mx-auto px-6 lg:px-8 mb-6">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="flex gap-3 items-center">
            <label className="font-semibold text-foreground">Year</label>
            <select
              value={year}
              onChange={(e) => {
                const v = Number(e.target.value);
                if (Number.isFinite(v)) setYear(v);
              }}
              className="px-3 py-2 border rounded text-foreground bg-background"
            >
              {validYears.length
                ? validYears.map((y) => (
                    <option key={y} value={y}>{y}</option>
                  ))
                : <option value={2021}>2021</option>}
            </select>

            <label className="font-semibold text-foreground">Chart</label>
            <div className="inline-flex rounded-md shadow-sm" role="group">
              <button
                onClick={() => setChartType('bar')}
                className={`px-3 py-2 font-semibold ${
                  chartType === 'bar'
                    ? "bg-indigo-600 text-white"
                    : "bg-background border text-foreground"
                }`}
              >
                Bar
              </button>
              <button
                onClick={() => setChartType('line')}
                className={`px-3 py-2 font-semibold ${
                  chartType === 'line'
                    ? "bg-indigo-600 text-white"
                    : "bg-background border text-foreground"
                }`}
              >
                Line
              </button>
            </div>
            <button
              onClick={() => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))}
              className="px-3 py-2 ml-2 border rounded text-foreground bg-background"
            >
              {theme === 'dark' ? 'Light' : 'Dark'}
            </button>
          </div>

          <div className="flex gap-3 items-center">
            <input
              placeholder="Search model"
              value={modelFilter}
              onChange={(e) => setModelFilter(e.target.value)}
              className="px-3 py-2 border rounded text-foreground bg-background"
            />

            <label className="font-semibold text-foreground">Min Sum</label>
            <input
              type="number"
              value={minSum}
              onChange={(e) => setMinSum(Number(e.target.value))}
              className="w-24 px-3 py-2 border rounded text-foreground bg-background"
            />

            <a
              href="/Canadasalesdata.csv"
              download
              className="px-4 py-2 bg-green-600 text-white rounded font-semibold"
            >
              Download CSV
            </a>

            <button
              onClick={exportFilteredCSV}
              className="px-4 py-2 bg-blue-600 text-white rounded font-semibold"
            >
              Export Filtered CSV
            </button>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="container mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8">
          <Chart
            data={aggregated}
            title={`Sales ${year} (filtered ${filteredRows.length} models)`}
            type={chartType}
          />
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-indigo-900 text-white py-8 mt-12">
        <div className="container mx-auto px-6 lg:px-8 text-center">
          <p>© 2025 Your Company. All rights reserved.</p>
          <div className="mt-4 flex justify-center gap-6">
            <a href="#" className="hover:text-gray-200 font-semibold">Privacy Policy</a>
            <a href="#" className="hover:text-gray-200 font-semibold">Terms of Service</a>
          </div>
        </div>
      </footer>
    </main>
  );
}
