'use client';

import { useState, useMemo, useCallback } from 'react';
import { marked } from 'marked';
import { LoadingSpinner } from './LoadingSpinner';

interface OutputDisplayProps {
  result: string;
  isLoading: boolean;
  format: 'html' | 'markdown';
  onFormatChange: (format: 'html' | 'markdown') => void;
}

export const OutputDisplay = ({
  result,
  isLoading,
  format,
  onFormatChange,
}: OutputDisplayProps) => {
  const [isCopied, setIsCopied] = useState(false);

  const parsedHtml = useMemo(() => {
    if (result) {
      return marked.parse(result) as string;
    }
    return '';
  }, [result]);

  const handleCopy = useCallback(() => {
    if (!result || isLoading) return;

    if (format === 'html' && parsedHtml) {
      try {
        const blob = new Blob([parsedHtml], { type: 'text/html' });
        const clipboardItem = new ClipboardItem({ 'text/html': blob });
        navigator.clipboard
          .write([clipboardItem])
          .then(() => {
            setIsCopied(true);
            setTimeout(() => setIsCopied(false), 2000);
          })
          .catch((err) => {
            console.error('Failed to copy HTML content: ', err);
          });
      } catch {
        console.error('Clipboard API is not available or failed.');
      }
    } else {
      navigator.clipboard.writeText(result).then(() => {
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
      });
    }
  }, [result, isLoading, format, parsedHtml]);

  const renderContent = () => {
    if (isLoading) {
      return <LoadingSpinner />;
    }
    if (!result) {
      return (
        <div className="text-center text-gray-500 py-12">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            分析結果がありません
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            左のフォームから調査テーマを入力して分析を開始してください。
          </p>
        </div>
      );
    }

    if (format === 'html') {
      return (
        <div
          className="prose prose-sm sm:prose-base max-w-none p-1"
          dangerouslySetInnerHTML={{ __html: parsedHtml }}
        />
      );
    }

    return (
      <pre className="whitespace-pre-wrap text-sm bg-gray-900 text-white p-4 rounded-lg font-mono overflow-x-auto">
        <code>{result}</code>
      </pre>
    );
  };

  return (
    <div
      className="bg-white rounded-2xl shadow-lg h-full flex flex-col"
      style={{ minHeight: '500px' }}
    >
      <div className="flex justify-between items-center p-4 border-b border-gray-200 sticky top-0 bg-white/80 backdrop-blur-sm rounded-t-2xl z-10">
        <div className="flex items-center gap-2">
          <button
            onClick={() => onFormatChange('html')}
            className={`px-3 py-1 text-sm font-semibold rounded-md transition-colors ${
              format === 'html'
                ? 'bg-blue-100 text-blue-700'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            HTML
          </button>
          <button
            onClick={() => onFormatChange('markdown')}
            className={`px-3 py-1 text-sm font-semibold rounded-md transition-colors ${
              format === 'markdown'
                ? 'bg-blue-100 text-blue-700'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Markdown
          </button>
        </div>
        <button
          onClick={handleCopy}
          disabled={!result || isLoading}
          className="px-3 py-1 text-sm font-semibold bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 mr-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d={
                isCopied
                  ? 'M5 13l4 4L19 7'
                  : 'M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z'
              }
            />
          </svg>
          {isCopied ? 'Copied!' : 'Copy'}
        </button>
      </div>
      <div className="p-6 overflow-y-auto flex-grow">{renderContent()}</div>
    </div>
  );
};
