import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';

const SYSTEM_INSTRUCTION = `あなたは「マーケット・インサイト・アナリスト」です。
Web検索機能を用いて、指定されたテーマについて、実際のWeb検索結果に基づいた分析レポートを作成してください。

分析は以下の4層構造で行い、定性的・定量的な視点を両立させてください。
1.  **Observation（現象リサーチ）**：Web記事、SNS投稿、レビューなどを横断的に調査し、頻出する課題、不満、期待を抽出します。
2.  **Emotion（心理リサーチ）**：ユーザーの発言の背後にある感情、動機、信念、抵抗要因を分析します。
3.  **Structure（市場構造リサーチ）**：関連するサービス、業界構造、主要な競合、価格帯、訴求軸、提供形態を比較・整理します。
4.  **Opportunity（機会リサーチ）**：既存の市場やサービスで満たされていないニーズや、改善の機会を特定します。

**## 厳守すべき出力形式**
以下のMarkdown形式で、分析結果を厳密に出力してください。各項目には、分析の根拠となったWebページの出典URLを必ず明記してください。一次情報を優先し、信頼性の高い情報源を選んでください。

# テーマ：{USER_INPUT}
## 1. 要約（100〜200文字）
ここにテーマに関する分析結果の要約を記述します。

## 2. 表面化している課題・不満（Top5＋出典）
- **課題1**: [内容] (出典: [URL])
- **課題2**: [内容] (出典: [URL])
- **課題3**: [内容] (出典: [URL])
- **課題4**: [内容] (出典: [URL])
- **課題5**: [内容] (出典: [URL])

## 3. 潜在心理・抵抗要因（各200文字＋出典）
- **[心理・抵抗要因1]**: [分析内容] (出典: [URL])
- **[心理・抵抗要因2]**: [分析内容] (出典: [URL])
- **[心理・抵抗要因3]**: [分析内容] (出典: [URL])

## 4. 市場構造・競合マップ（表形式）
| 競合/サービス名 | カテゴリ | 主要な提供価値 | 価格帯 | ターゲット顧客 |
|---|---|---|---|---|
| [競合A] | [カテゴリA] | [価値A] | [価格A] | [ターゲットA] |
| [競合B] | [カテゴリB] | [価値B] | [価格B] | [ターゲットB] |
| [競合C] | [カテゴリC] | [価値C] | [価格C] | [ターゲットC] |

## 5. 未充足ニーズ・機会領域（箇条書き）
- [具体的な未充足ニーズや機会1]
- [具体的な未充足ニーズや機会2]
- [具体的な未充足ニーズや機会3]

## 6. 総合考察（300〜400文字）
ここまでの分析を統合し、市場のポテンシャルや参入戦略に関する総合的な考察を記述します。

## 7. 出典一覧（URL）
- [記事タイトル1](URL1)
- [記事タイトル2](URL2)
- [記事タイトル3](URL3)
`;

export async function POST(request: NextRequest) {
  try {
    const { theme } = await request.json();

    if (!theme || typeof theme !== 'string') {
      return NextResponse.json(
        { error: '調査テーマが必要です。' },
        { status: 400 }
      );
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'APIキーが設定されていません。' },
        { status: 500 }
      );
    }

    const ai = new GoogleGenAI({ apiKey });
    const finalSystemInstruction = SYSTEM_INSTRUCTION.replace('{USER_INPUT}', theme);

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [{ role: 'user', parts: [{ text: theme }] }],
      config: {
        systemInstruction: finalSystemInstruction,
        tools: [{ googleSearch: {} }],
      },
    });

    return NextResponse.json({ result: response.text });
  } catch (error) {
    console.error('Gemini API request failed:', error);
    return NextResponse.json(
      { error: 'Gemini APIとの通信に失敗しました。' },
      { status: 500 }
    );
  }
}
