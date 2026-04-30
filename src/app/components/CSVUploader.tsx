import { useCallback, useState } from 'react';
import { Upload, FileSpreadsheet, AlertCircle, Sparkles, TrendingUp, BarChart3, Package } from 'lucide-react';
import Papa from 'papaparse';

interface CSVUploaderProps {
  onDataUpload: (data: any[], columns: string[]) => void;
}

export function CSVUploader({ onDataUpload }: CSVUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const processFile = useCallback((file: File) => {
    setError(null);
    setIsProcessing(true);

    Papa.parse(file, {
      header: true,
      dynamicTyping: true,
      skipEmptyLines: true,
      complete: (results) => {
        if (results.data.length === 0) {
          setError('No data found in CSV file');
          setIsProcessing(false);
          return;
        }

        const columns = results.meta.fields || [];
        if (columns.length === 0) {
          setError('No columns found in CSV file');
          setIsProcessing(false);
          return;
        }

        onDataUpload(results.data, columns);
        setIsProcessing(false);
      },
      error: (err) => {
        setError(`Failed to parse CSV: ${err.message}`);
        setIsProcessing(false);
      }
    });
  }, [onDataUpload]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file && file.type === 'text/csv') {
      processFile(file);
    } else {
      setError('Please upload a CSV file');
    }
  }, [processFile]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  }, [processFile]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  const downloadSampleCSV = useCallback(() => {
    const csvContent = `shipment_id,route,origin,destination,status,delay_hours,cost,date,carrier,weight
SH001,NYC-LA,New York,Los Angeles,Delivered,0,1250.50,03/15/2026,FastShip,2500
SH002,NYC-CHI,New York,Chicago,Delivered,2,850.00,03/15/2026,QuickMove,1800
SH003,LA-SEA,Los Angeles,Seattle,Delayed,12,950.75,03/16/2026,FastShip,2200
SH004,CHI-MIA,Chicago,Miami,Delivered,0,1100.00,03/16/2026,SpeedyTrans,3000
SH005,NYC-LA,New York,Los Angeles,Delayed,8,1300.00,03/17/2026,QuickMove,2700
SH006,SEA-NYC,Seattle,New York,Delivered,0,1450.25,03/17/2026,FastShip,3200
SH007,MIA-LA,Miami,Los Angeles,Delivered,1,1350.00,03/18/2026,SpeedyTrans,2900
SH008,CHI-NYC,Chicago,New York,Delayed,15,900.50,03/18/2026,QuickMove,1600
SH009,LA-CHI,Los Angeles,Chicago,Delivered,0,875.00,03/19/2026,FastShip,1900
SH010,NYC-MIA,New York,Miami,Delivered,0,1200.00,03/19/2026,SpeedyTrans,2400
SH011,SEA-LA,Seattle,Los Angeles,Delayed,6,825.75,03/20/2026,QuickMove,1500
SH012,CHI-SEA,Chicago,Seattle,Delivered,0,1050.00,03/20/2026,FastShip,2100
SH013,NYC-LA,New York,Los Angeles,Delivered,3,1275.50,03/21/2026,SpeedyTrans,2600
SH014,LA-NYC,Los Angeles,New York,Delayed,10,1425.00,03/21/2026,QuickMove,3100
SH015,MIA-CHI,Miami,Chicago,Delivered,0,1075.25,03/22/2026,FastShip,2300
SH016,NYC-SEA,New York,Seattle,Delivered,0,1500.00,03/22/2026,SpeedyTrans,3300
SH017,CHI-LA,Chicago,Los Angeles,Delayed,5,925.50,03/23/2026,QuickMove,1700
SH018,LA-MIA,Los Angeles,Miami,Delivered,0,1325.00,03/23/2026,FastShip,2800
SH019,SEA-CHI,Seattle,Chicago,Delivered,2,1000.75,03/24/2026,SpeedyTrans,2000
SH020,NYC-CHI,New York,Chicago,Delayed,18,875.00,03/24/2026,QuickMove,1650
SH021,MIA-NYC,Miami,New York,Delivered,0,1175.50,03/25/2026,FastShip,2350
SH022,LA-SEA,Los Angeles,Seattle,Delivered,0,900.00,03/25/2026,SpeedyTrans,1850
SH023,CHI-MIA,Chicago,Miami,Delayed,7,1125.25,03/26/2026,QuickMove,2250
SH024,NYC-LA,New York,Los Angeles,Delivered,0,1250.75,03/26/2026,FastShip,2550
SH025,SEA-MIA,Seattle,Miami,Delivered,1,1550.00,03/27/2026,SpeedyTrans,3400
SH026,LA-CHI,Los Angeles,Chicago,Delayed,9,850.50,03/27/2026,QuickMove,1750
SH027,NYC-SEA,New York,Seattle,Delivered,0,1475.00,03/28/2026,FastShip,3150
SH028,CHI-NYC,Chicago,New York,Delivered,0,925.75,03/28/2026,SpeedyTrans,1900
SH029,MIA-LA,Miami,Los Angeles,Delayed,14,1375.00,03/29/2026,QuickMove,2950
SH030,LA-NYC,Los Angeles,New York,Delivered,0,1400.25,03/29/2026,FastShip,3050
SH031,SEA-CHI,Seattle,Chicago,Delivered,3,975.50,03/30/2026,SpeedyTrans,1950
SH032,NYC-MIA,New York,Miami,Delayed,11,1225.00,03/30/2026,QuickMove,2450
SH033,CHI-LA,Chicago,Los Angeles,Delivered,0,900.75,03/31/2026,FastShip,1800
SH034,LA-SEA,Los Angeles,Seattle,Delivered,0,875.00,03/31/2026,SpeedyTrans,1700
SH035,NYC-CHI,New York,Chicago,Delayed,4,850.25,04/01/2026,QuickMove,1650
SH036,MIA-SEA,Miami,Seattle,Delivered,0,1600.00,04/01/2026,FastShip,3500
SH037,SEA-NYC,Seattle,New York,Delivered,2,1450.50,04/02/2026,SpeedyTrans,3200
SH038,LA-MIA,Los Angeles,Miami,Delayed,16,1350.75,04/02/2026,QuickMove,2900
SH039,CHI-SEA,Chicago,Seattle,Delivered,0,1025.00,04/03/2026,FastShip,2100
SH040,NYC-LA,New York,Los Angeles,Delivered,0,1275.25,04/03/2026,SpeedyTrans,2650
SH041,MIA-CHI,Miami,Chicago,Delayed,6,1100.50,04/04/2026,QuickMove,2300
SH042,LA-NYC,Los Angeles,New York,Delivered,1,1425.75,04/04/2026,FastShip,3100
SH043,SEA-LA,Seattle,Los Angeles,Delivered,0,850.00,04/05/2026,SpeedyTrans,1550
SH044,NYC-SEA,New York,Seattle,Delayed,13,1525.25,04/05/2026,QuickMove,3350
SH045,CHI-MIA,Chicago,Miami,Delivered,0,1150.50,04/06/2026,FastShip,2400
SH046,LA-CHI,Los Angeles,Chicago,Delivered,0,900.75,04/06/2026,SpeedyTrans,1850
SH047,NYC-MIA,New York,Miami,Delayed,8,1200.00,04/07/2026,QuickMove,2400
SH048,SEA-CHI,Seattle,Chicago,Delivered,0,1000.25,04/07/2026,FastShip,2000
SH049,MIA-LA,Miami,Los Angeles,Delivered,2,1375.50,04/08/2026,SpeedyTrans,2950
SH050,LA-SEA,Los Angeles,Seattle,Delayed,5,925.75,04/08/2026,QuickMove,1950`;

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);

    link.setAttribute('href', url);
    link.setAttribute('download', 'sample-shipments.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, []);

  return (
    <div className="w-full max-w-6xl">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-full mb-6">
          <Sparkles className="w-4 h-4" />
          <span className="text-sm font-medium">AI-Powered Analytics</span>
        </div>
        <h2 className="text-4xl font-bold text-slate-900 mb-4">
          Transform Your Logistics Data Into Insights
        </h2>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
          Upload your shipment data and ask questions in plain English. Get instant charts, trends, and actionable insights.
        </p>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="bg-blue-100 rounded-lg p-3 w-fit mb-4">
            <TrendingUp className="w-6 h-6 text-blue-600" />
          </div>
          <h3 className="font-semibold text-slate-900 mb-2">Real-Time Analysis</h3>
          <p className="text-sm text-slate-600">
            Instant insights from your data with intelligent pattern recognition and trend analysis
          </p>
        </div>

        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="bg-green-100 rounded-lg p-3 w-fit mb-4">
            <BarChart3 className="w-6 h-6 text-green-600" />
          </div>
          <h3 className="font-semibold text-slate-900 mb-2">Smart Visualizations</h3>
          <p className="text-sm text-slate-600">
            Automatically generated charts and graphs tailored to your questions
          </p>
        </div>

        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="bg-purple-100 rounded-lg p-3 w-fit mb-4">
            <Package className="w-6 h-6 text-purple-600" />
          </div>
          <h3 className="font-semibold text-slate-900 mb-2">Natural Language</h3>
          <p className="text-sm text-slate-600">
            Ask questions like you would to a colleague - no SQL or code required
          </p>
        </div>
      </div>

      {/* Upload Area */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`
          relative border-2 border-dashed rounded-2xl p-16 transition-all duration-300
          ${isDragging
            ? 'border-blue-500 bg-gradient-to-br from-blue-50 to-purple-50 scale-[1.02] shadow-xl'
            : 'border-slate-300 bg-white hover:border-blue-400 hover:bg-slate-50 shadow-lg'
          }
          ${isProcessing ? 'opacity-50 pointer-events-none' : ''}
        `}
      >
        <input
          type="file"
          accept=".csv"
          onChange={handleFileInput}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          disabled={isProcessing}
        />

        <div className="flex flex-col items-center gap-6 text-center">
          <div className={`
            relative rounded-2xl p-6 transition-all duration-300
            ${isDragging ? 'bg-gradient-to-br from-blue-500 to-purple-600 scale-110' : 'bg-gradient-to-br from-slate-100 to-slate-200'}
          `}>
            {isProcessing ? (
              <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
            ) : (
              <FileSpreadsheet className={`w-16 h-16 ${isDragging ? 'text-white' : 'text-slate-600'}`} />
            )}
            {isDragging && (
              <div className="absolute inset-0 rounded-2xl bg-white/20 animate-pulse" />
            )}
          </div>

          <div>
            <h3 className="text-2xl font-bold text-slate-900 mb-3">
              {isProcessing ? 'Processing Your Data...' : isDragging ? 'Drop Your File Here!' : 'Upload Your Shipment Data'}
            </h3>
            <p className="text-slate-600 mb-6 text-lg">
              {isProcessing
                ? 'Analyzing columns and preparing insights...'
                : 'Drag and drop your CSV file here, or click to browse'}
            </p>

            {!isProcessing && (
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <div className="flex items-center gap-2 px-4 py-2 bg-slate-100 rounded-lg">
                  <Upload className="w-4 h-4 text-slate-600" />
                  <span className="text-sm text-slate-700 font-medium">CSV files only</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-green-100 rounded-lg">
                  <Sparkles className="w-4 h-4 text-green-600" />
                  <span className="text-sm text-green-700 font-medium">Instant analysis</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {error && (
          <div className="mt-8 flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-xl">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-red-900">Upload Error</p>
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        )}
      </div>

      {/* Sample Data Section */}
      <div className="mt-8 bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex-1">
            <p className="font-semibold text-blue-900 mb-2">Don't have data yet? Try our sample dataset</p>
            <p className="text-sm text-blue-700 font-mono bg-white px-3 py-2 rounded-lg inline-block">
              shipment_id, route, origin, destination, status, delay_hours, cost, date, carrier, weight
            </p>
          </div>
          <button
            onClick={downloadSampleCSV}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg"
          >
            <Upload className="w-5 h-5" />
            Download Sample CSV
          </button>
        </div>
      </div>
    </div>
  );
}
