import React from 'react';
import { Copy, Check } from 'lucide-react';
import EyeOfSauron from './EyeOfSauron';

interface PredictionResultProps {
  prediction: string;
  type: 'vision' | 'prop' | 'stock' | 'crypto';
}

export default function PredictionResult({ prediction, type }: PredictionResultProps) {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = async (text: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formatPrediction = (data: string) => {
    try {
      const parsed = JSON.parse(data);
      
      if (type === 'vision' || type === 'prop') {
        return parsed.predictions
          .map((p: any) => {
            const prediction = p.prediction || '';
            const odds = p.odds ? ` ${p.odds}` : '';
            const book = p.book ? ` ${p.book.replace('FanDuel', 'FD').replace('DraftKings', 'DK').replace('BetMGM', 'MGM')}` : '';
            const edge = p.edge ? `\nEdge: ${p.edge.toFixed(1)}%` : '';
            return `${prediction}${odds}${book}${edge}`;
          })
          .join('\n\n');
      } else {
        const symbol = parsed.symbol || '';
        const price = parsed.price ? `$${parsed.price.toFixed(2)}` : '';
        const change = parsed.change ? ` (${parsed.change > 0 ? '+' : ''}${parsed.change.toFixed(2)}%)` : '';
        const edge = parsed.edge ? `\nEdge: ${parsed.edge.toFixed(1)}%` : '';
        return `${symbol} ${price}${change}${edge}`;
      }
    } catch (e) {
      return prediction;
    }
  };

  const formattedPrediction = formatPrediction(prediction);

  if (!formattedPrediction) return null;

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="flex items-start space-x-4">
        <EyeOfSauron />
        <div className="flex-1 relative">
          <pre className="text-xl text-green-400 font-mono leading-relaxed tracking-tight whitespace-pre-wrap">
            {formattedPrediction}
          </pre>
          
          <button
            onClick={() => handleCopy(formattedPrediction)}
            className="absolute right-2 top-0 p-2 text-green-400/50 hover:text-green-400 transition-colors"
            title="Copy prediction"
          >
            {copied ? (
              <Check className="h-4 w-4" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}