import { useState, useEffect } from 'react';
import { Send, Sparkles } from 'lucide-react';
import { analyzeQuery } from '../utils/queryAnalyzer';

interface QueryInterfaceProps {
  data: any[];
  columns: string[];
  onQuerySubmit: (query: string, result: any) => void;
  selectedQuestion?: string;
}

export function QueryInterface({ data, columns, onQuerySubmit, selectedQuestion }: QueryInterfaceProps) {
  const [query, setQuery] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (selectedQuestion) {
      setQuery(selectedQuestion);
    }
  }, [selectedQuestion]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim() || isProcessing) return;

    setIsProcessing(true);

    // Simulate processing delay for realistic feel
    setTimeout(() => {
      const result = analyzeQuery(query, data, columns);
      onQuerySubmit(query, result);
      setQuery('');
      setIsProcessing(false);
    }, 800);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg p-2">
          <Sparkles className="w-5 h-5 text-white" />
        </div>
        <div>
          <h2 className="font-semibold text-slate-900">Ask a Question</h2>
          <p className="text-sm text-slate-600">Use natural language to query your data</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <textarea
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="e.g., Which routes had the most delays last month? Show me total costs by carrier..."
            className="w-full px-4 py-3 pr-12 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            rows={3}
            disabled={isProcessing}
          />
          <button
            type="submit"
            disabled={!query.trim() || isProcessing}
            className="absolute bottom-3 right-3 p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors"
          >
            {isProcessing ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Send className="w-5 h-5" />
            )}
          </button>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-500">
          <Sparkles className="w-3 h-3" />
          <span>Try asking about delays, costs, routes, carriers, or trends over time</span>
        </div>
      </form>
    </div>
  );
}
