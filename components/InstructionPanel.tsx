import React from 'react';

const Section: React.FC<{ title: string; icon: string; children: React.ReactNode }> = ({ title, icon, children }) => (
  <div className="bg-white p-6 rounded-2xl shadow-lg">
    <h2 className="text-xl font-bold mb-4 flex items-center text-gray-800">
      <span className="mr-3 text-2xl">{icon}</span>
      {title}
    </h2>
    {children}
  </div>
);

const Preformatted: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <pre className="bg-gray-50 p-4 rounded-md whitespace-pre-wrap text-sm text-gray-700 font-mono overflow-x-auto">
    {children}
  </pre>
);

export const InstructionPanel: React.FC = () => {
  return (
    <div className="space-y-6">
      <Section title="入力欄テンプレート" icon="💬">
        <Preformatted>
{`調査したいテーマを1文で入力してください。
例：
・「IT活用を進めたい個人事業主・フリーランスの悩みや課題」
・「美容サロンがリピート率を上げられない理由」
・「オンライン講座の離脱が多い背景」

【目的】
市場全体の構造、既存プレイヤーの動向、顧客が感じる不安・障壁、
および現時点で満たされていない需要（空白）を明確化します。`}
        </Preformatted>
      </Section>
    </div>
  );
};
