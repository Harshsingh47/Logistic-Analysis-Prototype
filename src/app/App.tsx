import './utils/errorSuppression';
import { useState } from 'react';
import { Upload, MessageSquare, BarChart3, TrendingUp } from 'lucide-react';
import { CSVUploader } from './components/CSVUploader';
import { QueryInterface } from './components/QueryInterface';
import { ResultsDisplay } from './components/ResultsDisplay';
import { QuestionSuggestions } from './components/QuestionSuggestions';

export default function App() {
  const [csvData, setCsvData] = useState<any[]>([]);
  const [columns, setColumns] = useState<string[]>([]);
  const [currentQuery, setCurrentQuery] = useState<string>('');
  const [queryResult, setQueryResult] = useState<any>(null);
  const [selectedQuestion, setSelectedQuestion] = useState<string>('');

  const handleDataUpload = (data: any[], cols: string[]) => {
    setCsvData(data);
    setColumns(cols);
    setQueryResult(null);
    setCurrentQuery('');
    setSelectedQuestion('');
  };

  const handleQuery = (query: string, result: any) => {
    setCurrentQuery(query);
    setQueryResult(result);
  };

  const handleSelectQuestion = (question: string) => {
    setSelectedQuestion(question);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-slate-200 shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl p-2.5 shadow-md">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Logistics Intelligence
              </h1>
              <p className="text-sm text-slate-600">Ask questions about your shipment data in plain English</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-12">
        {/* Upload Section */}
        {csvData.length === 0 ? (
          <div className="flex items-center justify-center min-h-[calc(100vh-200px)]">
            <CSVUploader onDataUpload={handleDataUpload} />
          </div>
        ) : (
          <div className="space-y-6">
            {/* Stats Bar */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-4">
                <div className="flex items-center gap-3">
                  <div className="bg-blue-100 rounded-lg p-2">
                    <BarChart3 className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-600">Total Records</p>
                    <p className="text-2xl font-bold text-slate-900">{csvData.length.toLocaleString()}</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-4">
                <div className="flex items-center gap-3">
                  <div className="bg-green-100 rounded-lg p-2">
                    <Upload className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-600">Data Columns</p>
                    <p className="text-2xl font-bold text-slate-900">{columns.length}</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-4">
                <div className="flex items-center gap-3">
                  <div className="bg-purple-100 rounded-lg p-2">
                    <MessageSquare className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-600">Status</p>
                    <p className="text-lg font-semibold text-green-600">Ready to Query</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Question Suggestions */}
            <QuestionSuggestions
              columns={columns}
              data={csvData}
              onSelectQuestion={handleSelectQuestion}
            />

            {/* Query Interface */}
            <QueryInterface
              data={csvData}
              columns={columns}
              onQuerySubmit={handleQuery}
              selectedQuestion={selectedQuestion}
            />

            {/* Results */}
            {queryResult && (
              <ResultsDisplay
                query={currentQuery}
                result={queryResult}
              />
            )}

            {/* Upload New File Button */}
            <div className="flex justify-center pt-4">
              <button
                onClick={() => {
                  setCsvData([]);
                  setColumns([]);
                  setQueryResult(null);
                }}
                className="px-6 py-2 text-sm text-slate-600 hover:text-slate-900 hover:bg-white rounded-lg border border-slate-300 transition-colors"
              >
                Upload New File
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
