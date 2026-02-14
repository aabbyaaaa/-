import React, { useState } from 'react';
import { PolishedVariant, Tone } from '../types';
import { Copy, Check, MessageSquare } from 'lucide-react';

interface OutputDisplayProps {
  variants: PolishedVariant[];
}

const ToneBadge: React.FC<{ tone: Tone }> = ({ tone }) => {
  const styles = {
    [Tone.CONCISE]: "bg-emerald-100 text-emerald-800 border-emerald-200",
    [Tone.STANDARD]: "bg-blue-100 text-blue-800 border-blue-200",
    [Tone.FORMAL]: "bg-purple-100 text-purple-800 border-purple-200",
  };

  const labels = {
    [Tone.CONCISE]: "精簡回覆 (Concise)",
    [Tone.STANDARD]: "標準回覆 (Standard)",
    [Tone.FORMAL]: "正式回覆 (Formal)",
  };

  return (
    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${styles[tone]}`}>
      {labels[tone]}
    </span>
  );
};

const VariantCard: React.FC<{ variant: PolishedVariant }> = ({ variant }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(variant.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-300 flex flex-col">
      <div className="px-4 py-3 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
        <ToneBadge tone={variant.tone} />
        <button
          onClick={handleCopy}
          className={`p-1.5 rounded-md transition-all ${
            copied 
              ? 'bg-green-100 text-green-600' 
              : 'text-gray-400 hover:text-gray-600 hover:bg-gray-200'
          }`}
          title="複製到剪貼簿"
        >
          {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
        </button>
      </div>
      <div className="p-4 flex-1 flex flex-col">
        {variant.subject && (
          <div className="mb-3 pb-3 border-b border-gray-100 border-dashed">
             <p className="text-xs text-gray-400 uppercase tracking-wider mb-1 font-semibold">建議主旨</p>
             <p className="text-sm font-medium text-gray-800">{variant.subject}</p>
          </div>
        )}
        <div className="flex-1">
            <p className="text-xs text-gray-400 uppercase tracking-wider mb-1 font-semibold">內文</p>
            <div className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">
            {variant.content}
            </div>
        </div>
      </div>
    </div>
  );
};

const OutputDisplay: React.FC<OutputDisplayProps> = ({ variants }) => {
  if (!variants || variants.length === 0) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-gray-400 bg-gray-50/50 rounded-xl border border-dashed border-gray-300 p-8">
        <div className="bg-gray-100 p-4 rounded-full mb-4">
          <MessageSquare className="w-8 h-8 text-gray-300" />
        </div>
        <p className="text-center font-medium">尚未產生內容</p>
        <p className="text-center text-sm mt-1">請在左側輸入內容並點擊「開始轉換」</p>
      </div>
    );
  }

  // Define sort order to ensure display consistency: Concise -> Standard -> Formal
  const sortOrder = {
    [Tone.CONCISE]: 1,
    [Tone.STANDARD]: 2,
    [Tone.FORMAL]: 3,
  };

  const sortedVariants = [...variants].sort((a, b) => sortOrder[a.tone] - sortOrder[b.tone]);

  return (
    <div className="grid grid-cols-1 gap-4 h-full overflow-y-auto pb-4">
      {sortedVariants.map((variant) => (
        <VariantCard key={variant.tone} variant={variant} />
      ))}
    </div>
  );
};

export default OutputDisplay;