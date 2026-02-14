import React from 'react';
import { Bot, Zap } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="bg-blue-600 p-2 rounded-lg">
            <Bot className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900 tracking-tight">
              工程師回覆禮貌化工具
              <span className="ml-2 text-xs font-normal text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-100">MVP</span>
            </h1>
            <p className="text-xs text-gray-500 hidden sm:block">
              保留專業術語，自動潤飾語氣
            </p>
          </div>
        </div>
        <div className="flex items-center text-sm text-gray-500">
          <Zap className="h-4 w-4 mr-1 text-amber-500" />
          <span>Powered by Gemini 3 Flash</span>
        </div>
      </div>
    </header>
  );
};

export default Header;