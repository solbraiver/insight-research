
import React from 'react';

export const LoadingSpinner: React.FC = () => {
  const messages = [
    "Webをクロールして情報を収集しています...",
    "顧客心理を多層的に分析しています...",
    "市場構造と競合をマッピングしています...",
    "未充足ニーズの機会を探しています...",
    "インサイトを抽出しています...",
  ];
  const [message, setMessage] = React.useState(messages[0]);

  React.useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      index = (index + 1) % messages.length;
      setMessage(messages[index]);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-full text-center text-gray-600 p-8">
      <svg className="animate-spin h-10 w-10 text-blue-600 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
      <p className="text-lg font-semibold text-gray-800">分析実行中</p>
      <p className="mt-2 text-sm text-gray-500 transition-opacity duration-500">{message}</p>
      <p className="mt-4 text-xs text-gray-400">分析には数分かかる場合があります。しばらくお待ちください。</p>
    </div>
  );
};