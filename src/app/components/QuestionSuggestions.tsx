import { Lightbulb } from 'lucide-react';
import { useMemo } from 'react';

interface QuestionSuggestionsProps {
  columns: string[];
  data: any[];
  onSelectQuestion: (question: string) => void;
}

export function QuestionSuggestions({ columns, data, onSelectQuestion }: QuestionSuggestionsProps) {
  const suggestions = useMemo(() => {
    const questions: string[] = [];

    // Detect column types and generate relevant questions
    const lowerColumns = columns.map(c => c.toLowerCase());

    // Delay-related questions
    if (lowerColumns.some(c => c.includes('delay'))) {
      questions.push('Which routes had the most delays last month?');
      questions.push('Show me average delays by carrier');
    }

    // Cost-related questions
    if (lowerColumns.some(c => c.includes('cost') || c.includes('price'))) {
      questions.push('What are the total costs by route?');
      questions.push('Show me cost trends over time');
    }

    // Route-related questions
    if (lowerColumns.some(c => c.includes('route') || c.includes('destination'))) {
      questions.push('Which routes are most frequently used?');
      questions.push('Show me shipment distribution by destination');
    }

    // Carrier-related questions
    if (lowerColumns.some(c => c.includes('carrier') || c.includes('shipper'))) {
      questions.push('Compare performance across carriers');
      questions.push('Which carrier has the best on-time rate?');
    }

    // Status-related questions
    if (lowerColumns.some(c => c.includes('status'))) {
      questions.push('What percentage of shipments are delayed?');
      questions.push('Show me status breakdown');
    }

    // Time-based questions
    if (lowerColumns.some(c => c.includes('date') || c.includes('time'))) {
      questions.push('Show me shipment volume trends over time');
      questions.push('What were the busiest shipping days?');
    }

    // Weight/volume questions
    if (lowerColumns.some(c => c.includes('weight') || c.includes('volume'))) {
      questions.push('What is the average shipment weight by route?');
    }

    // Return top 6 suggestions
    return questions.slice(0, 6);
  }, [columns]);

  if (suggestions.length === 0) return null;

  return (
    <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl border border-amber-200 p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="bg-amber-500 rounded-lg p-2">
          <Lightbulb className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="font-semibold text-slate-900">Suggested Questions</h3>
          <p className="text-sm text-slate-600">Based on your data columns</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {suggestions.map((question, index) => (
          <button
            key={index}
            onClick={() => onSelectQuestion(question)}
            className="text-left px-4 py-3 bg-white hover:bg-amber-100 border border-amber-200 rounded-lg transition-colors group"
          >
            <p className="text-sm text-slate-700 group-hover:text-slate-900">{question}</p>
          </button>
        ))}
      </div>
    </div>
  );
}
