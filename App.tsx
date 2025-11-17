import React, { useState, useCallback } from 'react';
import { OutputDisplay } from './components/OutputDisplay';
import { analyzeTheme } from './services/geminiService';
import { InstructionPanel } from './components/InstructionPanel';

const App: React.FC = () => {
  const [theme, setTheme] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [analysisResult, setAnalysisResult] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [outputFormat, setOutputFormat] = useState<'html' | 'markdown'>('html');

  const handleSubmit = useCallback(async () => {
    if (!theme.trim()) {
      setError('調査したいテーマを入力してください。');
      return;
    }
    setIsLoading(true);
    setError(null);
    setAnalysisResult('');

    try {
      const result = await analyzeTheme(theme);
      setAnalysisResult(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : '分析中に不明なエラーが発生しました。');
    } finally {
      setIsLoading(false);
    }
  }, [theme]);

  return (
    <div className="min-h-screen bg-gray-100 text-gray-800 font-sans">
      <header className="bg-white shadow-sm sticky top-0 z-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
            マーケットインサイトリサーチAI
          </h1>
        </div>
      </header>

      <main className="container mx-auto p-4 sm:p-6 lg:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          <div className="flex flex-col gap-8">
            <div className="bg-white p-6 rounded-2xl shadow-lg">
              <h2 className="text-xl font-bold mb-4 text-gray-800">調査テーマ入力</h2>
              <p className="text-sm text-gray-600 mb-4">
                市場全体の構造、既存プレイヤーの動向、顧客が感じる不安・障壁、および現時点で満たされていない需要（空白）を明確化したいテーマを1文で入力してください。
              </p>
              <textarea
                value={theme}
                onChange={(e) => setTheme(e.target.value)}
                placeholder="例：「IT活用を進めたい個人事業主・フリーランスの悩みや課題」"
                className="w-full h-32 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 resize-none"
                disabled={isLoading}
              />
              <button
                onClick={handleSubmit}
                disabled={isLoading}
                className="mt-4 w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition duration-200 flex items-center justify-center"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    分析中...
                  </>
                ) : (
                  '分析を開始'
                )}
              </button>
              {error && <p className="text-red-500 mt-4 text-sm">{error}</p>}
            </div>
            <InstructionPanel />
          </div>

          <div className="lg:sticky lg:top-24">
            <OutputDisplay
              result={analysisResult}
              isLoading={isLoading}
              format={outputFormat}
              onFormatChange={setOutputFormat}
            />
          </div>
        </div>
      </main>

      <footer className="text-center py-6 mt-8 text-sm text-gray-500 border-t border-gray-200">
        <p>テーマを変えるだけで、どんな業界・市場にも対応できるマーケットリサーチツールです。</p>
      </footer>
    </div>
  );
};

export default App;