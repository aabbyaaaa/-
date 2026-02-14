import React, { useState } from 'react';
import Header from './components/Header';
import InputForm from './components/InputForm';
import OutputDisplay from './components/OutputDisplay';
import { polishText } from './services/geminiService';
import { PolishRequest, PolishResponse } from './types';
import { AlertCircle } from 'lucide-react';

const App: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState<PolishResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handlePolishSubmit = async (data: PolishRequest) => {
    setIsLoading(true);
    setError(null);
    setResponse(null);

    try {
      const result = await polishText(data);
      setResponse(result);
    } catch (err) {
      setError("處理您的請求時發生錯誤。請確認網路連線或稍後再試。");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Error Notification */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center shadow-sm">
            <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-6 h-full lg:h-[calc(100vh-10rem)]">
          {/* Left Column: Input */}
          <div className="w-full lg:w-5/12 h-full">
            <InputForm onSubmit={handlePolishSubmit} isLoading={isLoading} />
          </div>

          {/* Right Column: Output */}
          <div className="w-full lg:w-7/12 h-full">
             <OutputDisplay variants={response?.variants || []} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;