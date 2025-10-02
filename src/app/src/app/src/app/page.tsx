'use client'
import React, { useEffect, useMemo, useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { CheckCircle2, XCircle, RefreshCcw } from "lucide-react";

/** 質問データ（20問） */
const allQuestions = [
  { id: 1, text: "高齢者虐待防止法で定義されている5つの虐待の種類として、正しい組み合わせはどれですか。", choices: [
    "身体的虐待、精神的虐待、社会的虐待、介護放棄、自己放任",
    "暴力的虐待、心理的虐待、性的虐待、経済的虐待、世話の放棄",
    "身体的虐待、介護・世話の放棄・放任（ネグレクト）、心理的虐待、性的虐待、経済的虐待",
    "身体的虐待、精神的虐待、経済的虐待、社会的虐待、セルフ・ネグレクト",
  ], answer: 2, explanation: "高齢者虐待防止法第2条：5類型（身体・ネグレクト・心理・性的・経済）。セルフ・ネグレクトは含まれない。"},
  { id: 2, text: "生命または身体に重大な危険が生じている虐待を発見した場合、法律で定められた義務は何ですか。", choices: [
    "警察に直ちに通報する義務", "速やかに市町村に通報する義務", "家族へ連絡し協議する努力義務", "ケアプランに反映し様子を見る義務"
  ], answer: 1, explanation: "第7条：重大な危険がある場合は市町村へ速やかに通報する義務。"},
  { id: 3, text: "息子が本人の年金や預貯金を本人の意思に反して使用。これは？", choices: ["心理的虐待","介護放棄（ネグレクト）","経済的虐待","身体的虐待"], answer: 2, explanation: "合意なしの財産使用は経済的虐待の典型。"},
  { id: 4, text: "訪問介護で不適切な行為は？", choices: [
    "ふさぎ込みに気づき報告・客観的記録", "年金使い込み相談→上司報告→包括へ連絡", "調理で本人の意向を尊重", "「おばあちゃん」と呼ぶ習慣"
  ], answer: 3, explanation: "名前で呼ばず属性で呼ぶのは尊厳を損ない心理的虐待になり得る。"},
  { id: 5, text: "本人の意思を尊重し自ら決定できるよう支援することは？", choices: ["代行決定の支援","自己決定の支援","パターナリズム","事業者主導の計画"], answer: 1, explanation: "権利擁護の基本は自己決定の支援。"},
  { id: 6, text: "通報・相談の第一義的な窓口は？", choices: ["警察署","保健所","市町村または地域包括支援センター","社会福祉協議会"], answer: 2, explanation: "法により市町村が窓口（地域包括が担う地域も）。"},
  { id: 7, text: "発生要因で最多は？", choices:["介護サービスの不適合","経済的困窮","虐待者の性格や人格","介護知識不足"], answer:2, explanation:"東京都調査で最多は『虐待者の性格や人格』。"},
  { id: 8, text: "通報者のプライバシーは？", choices:["通報者名は虐待者に伝える","守秘義務で漏らしてはならない","警察捜査で公開されることがある","匿名は不可"], answer:1, explanation:"第8・23条：通報者特定情報は漏らしてはならない。"},
  { id: 9, text: "判断能力不十分な方を法的に支援する制度は？", choices:["日常生活自立支援事業","成年後見制度","介護保険制度","民生委員制度"], answer:1, explanation:"成年後見制度が該当。"},
  { id:10, text:"法律が目指すものは？", choices:["虐待者を罰する","緊急入所させる","高齢者の権利利益の擁護と養護者支援","介入根拠の明確化"], answer:2, explanation:"高齢者の権利擁護と養護者支援の両立。"},
  { id:11, text:"本人が自ら世話をしない等の状態は？", choices:["心理的虐待","ネグレクト","セルフ・ネグレクト","社会的孤立"], answer:2, explanation:"セルフ・ネグレクト。法律上の虐待ではないが支援要。"},
  { id:12, text:"解決に最重要なアプローチは？", choices:["担当者単独","警察に委ねる","多機関連携のチームアプローチ","家族に任せる"], answer:2, explanation:"多職種・多機関連携が基本。"},
  { id:13, text:"日常生活自立支援事業の内容は？", choices:["訪問介護","福祉サービス利用援助と日常的金銭管理","成年後見の代行","緊急通報"], answer:1, explanation:"利用援助・日常金銭管理・書類預かり等。"},
  { id:14, text:"新しいあざを発見。まず行うべきは？", choices:["内密に本人から詳しく聴取","その場で家族を指導","上司に報告し組織で対応検討","様子見"], answer:2, explanation:"単独判断は危険。まず上司へ報告。"},
  { id:15, text:"本人の力を引き出し自らコントロールできるよう支援する考え方は？", choices:["アセスメント","モニタリング","エンパワメント","コンプライアンス"], answer:2, explanation:"エンパワメント。"},
  { id:16, text:"千代田区のハンドブック愛称は？", choices:["あんしん手帳","かがやきノート","ノックの手帳","ささえあいブック"], answer:2, explanation:"『ノックの手帳』。"},
  { id:17, text:"市町村の法的権限は？", choices:["家宅捜索","立入調査","逮捕・勾留","差押え"], answer:1, explanation:"第11条：立入調査。"},
  { id:18, text:"介護疲れが要因の支援策は？", choices:["成年後見","ショートステイ/デイ利用促進","現金給付","厳しい指導"], answer:1, explanation:"レスパイト確保が重要。"},
  { id:19, text:"令和6年4月の義務化に含まれないのは？", choices:["委員会の開催","指針の整備","監視カメラの設置","研修の定期実施"], answer:2, explanation:"監視カメラは義務ではない。"},
  { id:20, text:"対応の基本姿勢で誤っているのは？", choices:["権利擁護最優先","虐待者を罰することが第一","チームアプローチ","長期的視点"], answer:1, explanation:"第一目的は罰ではなく権利擁護と支援。"},
];

function drawQuestions(list: any[], count: number, seed?: number) {
  const arr = [...list];
  let random = Math.sin(seed || Date.now()) * 10000;
  const rnd = () => { random = Math.sin(random + 1) * 10000; return random - Math.floor(random); };
  for (let i = arr.length - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [arr[i], arr[j]] = [arr[j], arr[i]]; }
  return arr.slice(0, count);
}

const STORAGE_KEY = "ea_quiz_results_v1";
const WEBHOOK_KEY = "ea_webhook_url";
const PENDING_KEY = "ea_pending_posts_v1";
const isPreviewSandbox = () => {
  try { const h = location.hostname || ""; if (h.includes("chatgpt") || h.includes("openai")) return true; } catch {}
  try { const r = document.referrer ? new URL(document.referrer).hostname : ""; if (r.includes("chatgpt") || r.includes("openai")) return true; } catch {}
  return false;
};
const loadResults = () => { try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]"); } catch { return []; } };
const saveResults = (x:any) => { try { localStorage.setItem(STORAGE_KEY, JSON.stringify(x)); } catch {} };
const loadPending = () => { try { return JSON.parse(localStorage.getItem(PENDING_KEY) || "[]"); } catch { return []; } };
const savePending = (x:any) => { try { localStorage.setItem(PENDING_KEY, JSON.stringify(x)); } catch {} };
const queuePending = (url:string, data:string) => { const q = loadPending(); q.push({ url, data, ts: Date.now() }); savePending(q); };
async function flushPending(){
  if (isPreviewSandbox()) return;
  const q = loadPending(); if (!q.length) return;
  const remain:any[] = [];
  for (const it of q) {
    let ok = false;
    try { if (navigator.sendBeacon) { const b = new Blob([it.data], { type:'text/plain;charset=UTF-8' }); ok = navigator.sendBeacon(it.url, b); } } catch {}
    if (!ok) { try { await fetch(it.url, { method:'POST', mode:'no-cors', keepalive:true, body:it.data }); ok = true; } catch {} }
    if (!ok) remain.push(it);
  }
  savePending(remain);
}
function postWebhook(url:string, payload:any){
  if (!url) return;
  const data = JSON.stringify(payload);
  if (isPreviewSandbox()) { queuePending(url, data); return; }
  try {
    if (navigator.sendBeacon) {
      const blob = new Blob([data], { type:'text/plain;charset=UTF-8' });
      const ok = navigator.sendBeacon(url, blob); if (ok) return;
    }
  } catch {}
  try { fetch(url, { method:'POST', mode:'no-cors', keepalive:true, body:data }); } catch {}
}

export default function App(){
  const [attempt, setAttempt] = useState(1);
  const quizQuestions = useMemo(()=>drawQuestions(allQuestions, 15, Date.now()+attempt), [attempt]);
  const [answers, setAnswers] = useState<(number|null)[]>(Array(quizQuestions.length).fill(null));
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [dept, setDept] = useState("");
  const [fullName, setFullName] = useState("");
  const [results, setResults] = useState<any[]>(loadResults());
  const [webhookUrl, setWebhookUrl] = useState<string>(()=>{ try { return localStorage.getItem(WEBHOOK_KEY) || ""; } catch { return ""; } });
  const [saveStatus, setSaveStatus] = useState<"idle"|"ok"|"session"|"error"|"wrong">("idle");
  const [passcode, setPasscode] = useState("");
  const [unlocked, setUnlocked] = useState(false);
  const [delAsk, setDelAsk] = useState(false);
  const [delCode, setDelCode] = useState("");
  const [delStatus, setDelStatus] = useState<"idle"|"wrong"|"ok">("idle");

  useEffect(()=>{ setAnswers(Array(quizQuestions.length).fill(null)); setSubmitted(false); setScore(0); },[quizQuestions]);
  useEffect(()=>{ flushPending(); const f=()=>flushPending(); window.addEventListener('focus',f); return()=>window.removeEventListener('focus',f); },[]);

  const handleSelect = (qi:number, ci:number) => { if (submitted) return; setAnswers(p=>{ const n=[...p]; n[qi]=ci; return n; }); };
  const allAnswered = answers.every(a=>a!==null);
  const answeredCount = answers.filter(a=>a!==null).length;
  const progress = Math.round((answeredCount/Math.max(quizQuestions.length,1))*100);
  const canSubmit = allAnswered && dept.trim()!=="" && fullName.trim()!=="";

  const handleSubmit = () => {
    if (!canSubmit) return;
    const s = answers.reduce((acc, a, i)=> a===quizQuestions[i].answer ? acc+1: acc, 0);
    setScore(s); setSubmitted(true);
    const detail = quizQuestions.map((q,i)=>({ questionId:q.id, questionText:q.text, selectedIndex:answers[i], selectedText:q.choices[answers[i] as number], correctIndex:q.answer, correctText:q.choices[q.answer], isCorrect: answers[i]===q.answer }));
    const record = { timestamp: new Date().toISOString(), dept:dept.trim(), fullName:fullName.trim(), attempt, score:s, total:quizQuestions.length, details:detail };
    const next = [...results, record]; setResults(next); saveResults(next);
    if (webhookUrl) postWebhook(webhookUrl, record);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const handleRetry = () => { setAttempt(a=>a+1); window.scrollTo({ top:0, behavior:"smooth" }); };
  const handlePrint = () => { window.print(); };
  const tryUnlock = () => { if (passcode==="2255") { setUnlocked(true); setSaveStatus("idle"); } else { setSaveStatus("wrong"); } };
  const exportAll = () => {
    const header = ["timestamp","department","fullName","attempt","score","total","questionId","questionText","selectedIndex","selectedText","correctIndex","correctText","isCorrect"];
    const lines = [header.join(",")];
    results.forEach((r:any)=> r.details.forEach((d:any)=>{
      const row = [r.timestamp,r.dept,r.fullName,r.attempt,r.score,r.total,d.questionId,
        String(d.questionText||"").replaceAll("\n"," ").replaceAll(",","、"),
        d.selectedIndex,String(d.selectedText||"").replaceAll(",","、"),
        d.correctIndex,String(d.correctText||"").replaceAll(",","、"), d.isCorrect?"TRUE":"FALSE"];
      lines.push(row.map((v:any)=> typeof v==="string" ? `"${v.replaceAll('"','""')}"` : v).join(","));
    }));
    const csv = lines.join("\n");
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([csv],{type:"text/csv;charset=utf-8;"}));
    a.download = `e-learning-results-${new Date().toISOString().slice(0,19).replace(/[:T]/g,"-")}.csv`;
    document.body.appendChild(a); a.click(); a.remove();
  };
  const doDeleteAll = () => { if (delCode!=="2255") { setDelStatus("wrong"); return; } try { localStorage.removeItem(STORAGE_KEY); } catch {} setResults([]); setDelStatus("ok"); setDelAsk(false); setDelCode(""); };

  const passed = submitted && score===quizQuestions.length;
  const passRate = results.length ? Math.round((results.filter((r:any)=>r.score===r.total).length/results.length)*100) : 0;
  const avgAccuracy = (()=>{ const c=results.reduce((a:number,r:any)=>a+r.score,0); const t=results.reduce((a:number,r:any)=>a+r.total,0); return t? Math.round((c/t)*100) : 0; })();

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-stone-50 to-zinc-100 text-zinc-800">
      <header className="sticky top-0 z-30 backdrop-blur bg-white/70 border-b border-zinc-200">
        <div className="mx-auto max-w-5xl px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-full bg-gradient-to-br from-amber-300 to-amber-500 shadow-inner" />
            <div>
              <h1 className="text-xl font-semibold tracking-tight">高齢者虐待防止・権利擁護 e-learning</h1>
              <p className="text-xs text-zinc-500">社内研修｜全20問から毎回15問をランダム出題</p>
            </div>
          </div>
          <div className="hidden md:block w-56"><Progress value={progress} /></div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-8">
        <Tabs defaultValue="quiz">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="quiz">テスト</TabsTrigger>
            <TabsTrigger value="summary">集計</TabsTrigger>
          </TabsList>

          <TabsContent value="quiz">
            <Card className="border-amber-200/60 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <span className="text-2xl font-serif tracking-wide">確認テスト</span>
                  {submitted && (
                    passed ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1 text-emerald-700 text-sm border border-emerald-200"><CheckCircle2 className="h-4 w-4" /> 合格</span>
                    ) : (
                      <span className="inline-flex items-center gap-2 rounded-full bg-amber-100/80 px-4 py-2 text-amber-800 text-base md:text-lg border-2 border-amber-300 shadow-sm"><XCircle className="h-5 w-5 md:h-6 md:w-6" /> 再挑戦が必要</span>
                    )
                  )}
                </CardTitle>
                <CardDescription className="text-zinc-600">
                  所属・氏名を入力の上、15問すべてに回答してから「採点する」を押してください。満点になるまで終了できません。再挑戦すると毎回ランダムで出題されます。
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-6 grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-sm font-medium text-zinc-700">所属<span className="ml-1 text-amber-600">*</span></label>
                    <Select value={dept} onValueChange={setDept}>
                      <SelectTrigger className="w-full"><SelectValue placeholder="所属を選択" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="特別養護老人ホーム">特別養護老人ホーム</SelectItem>
                        <SelectItem value="看護">看護</SelectItem>
                        <SelectItem value="訪問介護">訪問介護</SelectItem>
                        <SelectItem value="居宅介護支援事業所">居宅介護支援事業所</SelectItem>
                        <SelectItem value="包括支援センター">包括支援センター</SelectItem>
                        <SelectItem value="事務">事務</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-zinc-700">氏名<span className="ml-1 text-amber-600">*</span></label>
                    <Input value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="例：山田 太郎" required />
                  </div>
                </div>

                {submitted && (
                  <div className="mb-6 rounded-xl border border-amber-200 bg-amber-50 p-4 text-amber-900">
                    <p className="text-lg font-semibold">結果：<span className="tabular-nums">{score}</span> / {quizQuestions.length}</p>
                    <p className="text-sm mt-1 text-zinc-700">受講者：{dept} ／ {fullName}</p>
                    <p className="text-sm opacity-90">{passed ? "満点です。大変すばらしいです！" : "満点ではありません。理解を深めるため再挑戦してください。"}</p>
                  </div>
                )}

                <ol className="space-y-6">
                  {quizQuestions.map((q, qi) => {
                    const selected = answers[qi];
                    const correctIndex = q.answer;
                    return (
                      <li key={q.id}>
                        <Card className="border-zinc-200 shadow-sm">
                          <CardHeader><CardTitle className="text-base font-semibold">第{qi + 1}問．{q.text}</CardTitle></CardHeader>
                          <CardContent>
                            <div className="grid gap-3">
                              {q.choices.map((choice, ci) => {
                                const chosen = selected === ci;
                                const showCorrect = submitted && ci === correctIndex;
                                const showWrongChosen = submitted && chosen && ci !== correctIndex;
                                return (
                                  <label key={ci} className={[
                                    "flex cursor-pointer items-start gap-3 rounded-xl border p-3 transition",
                                    chosen && !submitted && "border-amber-400 ring-1 ring-amber-300 bg-amber-50",
                                    showCorrect && "border-emerald-300 ring-1 ring-emerald-200 bg-emerald-50",
                                    showWrongChosen && "border-rose-300 ring-1 ring-rose-200 bg-rose-50",
                                    !chosen && !submitted && "hover:bg-zinc-50",
                                  ].filter(Boolean).join(" ")}>
                                    <input type="radio" name={`q-${qi}`} className="mt-1 h-4 w-4" checked={chosen || false} onChange={() => handleSelect(qi, ci)} disabled={submitted} />
                                    <div className="leading-relaxed"><div className="font-medium">{ci + 1}. {choice}</div></div>
                                  </label>
                                );
                              })}
                            </div>
                            {submitted && (
                              <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
                                <div className="font-semibold mb-1">解説</div>
                                <p>{q.explanation}</p>
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      </li>
                    );
                  })}
                </ol>
              </CardContent>
              <CardFooter className="flex items-center justify-between gap-3">
                <div className="flex-1 md:max-w-[280px]">
                  <Progress value={progress} />
                  <p className="mt-2 text-xs text-zinc-500">回答進捗：{progress}%（{answeredCount}/{quizQuestions.length}）</p>
                </div>

                {submitted && (<Button variant="outline" onClick={handlePrint} className="rounded-2xl px-6 shadow-sm">印刷する</Button>)}

                {!submitted && (<Button size="lg" onClick={handleSubmit} disabled={!canSubmit} className="rounded-2xl px-6 shadow-sm">採点する</Button>)}

                {submitted && !passed && (
                  <Button size="lg" onClick={handleRetry} className="rounded-2xl px-6 shadow-sm bg-amber-600 hover:bg-amber-700">
                    <RefreshCcw className="mr-2 h-4 w-4" /> 再挑戦（新しい15問）
                  </Button>
                )}

                {submitted && passed && (
                  <div className="flex items-center gap-3">
                    <Button variant="secondary" onClick={handleRetry} className="rounded-2xl px-6 shadow-sm">もう一度受ける</Button>
                    <span className="text-sm text-zinc-500">※満点のため終了可能です</span>
                  </div>
                )}
              </CardFooter>
            </Card>

            <p className="mt-6 text-xs text-zinc-500">※ 本教材は社内研修用です。法令の運用・地域ルールは所属自治体の最新要領等を確認してください。</p>
          </TabsContent>

          <TabsContent value="summary">
            {!unlocked ? (
              <Card className="border-amber-200/60 shadow-sm">
                <CardHeader><CardTitle>集計（管理者用）</CardTitle><CardDescription>パスコードを入力すると集計を表示します。</CardDescription></CardHeader>
                <CardContent>
                  <div className="grid gap-3 md:grid-cols-[1fr_auto] max-w-xl">
                    <Input type="password" placeholder="パスコード" value={passcode} onChange={(e)=>setPasscode(e.target.value)} />
                    <Button onClick={tryUnlock}>表示する</Button>
                    {saveStatus === "wrong" && <p className="text-xs text-rose-600 md:col-span-2">パスコードが違います。</p>}
                    <p className="text-xs text-zinc-500 md:col-span-2">※ 集計は管理者のみ閲覧可能です（パスコード 2255）。</p>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <>
                <Card className="border-zinc-200 shadow-sm">
                  <CardHeader><CardTitle>集計</CardTitle><CardDescription>このブラウザに保存されている受験結果の一覧です。必要に応じてCSVをエクスポートしてください。</CardDescription></CardHeader>
                  <CardContent>
                    {results.length === 0 ? (
                      <p className="text-sm text-zinc-500">まだデータがありません。まずはテストを実行し「採点する」を押してください。</p>
                    ) : (
                      <>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-4">
                          <div className="rounded-xl border bg-white p-4"><div className="text-zinc-500">記録件数</div><div className="text-2xl font-semibold tabular-nums">{results.length}</div></div>
                          <div className="rounded-xl border bg-white p-4"><div className="text-zinc-500">平均正答率</div><div className="text-2xl font-semibold tabular-nums">{avgAccuracy}%</div></div>
                          <div className="rounded-xl border bg-white p-4"><div className="text-zinc-500">満点率</div><div className="text-2xl font-semibold tabular-nums">{passRate}%</div></div>
                        </div>

                        <div className="overflow-x-auto">
                          <table className="min-w-full text-sm">
                            <thead>
                              <tr className="border-b">
                                <th className="text-left p-2">受信日時</th>
                                <th className="text-left p-2">所属</th>
                                <th className="text-left p-2">氏名</th>
                                <th className="text-right p-2">得点</th>
                                <th className="text-right p-2">出題数</th>
                                <th className="text-left p-2">合否</th>
                              </tr>
                            </thead>
                            <tbody>
                              {results.map((r:any, idx:number) => (
                                <tr key={idx} className="border-b last:border-0">
                                  <td className="p-2">{new Date(r.timestamp).toLocaleString('ja-JP', { hour12: false })}</td>
                                  <td className="p-2">{r.dept}</td>
                                  <td className="p-2">{r.fullName}</td>
                                  <td className="p-2 text-right tabular-nums">{r.score}</td>
                                  <td className="p-2 text-right tabular-nums">{r.total}</td>
                                  <td className="p-2">{r.score === r.total ? '合格' : '未合格'}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </>
                    )}
                  </CardContent>
                  <CardFooter className="flex flex-col md:flex-row md:items-center gap-3">
                    <div className="flex gap-3">
                      <Button onClick={exportAll}>CSVエクスポート</Button>
                      <Button variant="destructive" onClick={()=>{ setDelStatus('idle'); setDelAsk(v=>!v); }} disabled={results.length===0}>全件削除</Button>
                    </div>
                    {delAsk && (
                      <div className="w-full md:w-auto flex items-center gap-2">
                        <Input type="password" placeholder="パスコード" value={delCode} onChange={(e)=>setDelCode(e.target.value)} className="md:w-56" />
                        <Button variant="destructive" onClick={doDeleteAll}>削除実行</Button>
                        {delStatus === 'wrong' && <span className="text-xs text-rose-600">パスコードが違います</span>}
                        {delStatus === 'ok' && <span className="text-xs text-emerald-700">削除しました</span>}
                      </div>
                    )}
                  </CardFooter>
                </Card>

                <Card className="mt-6 border-amber-200/60 shadow-sm">
                  <CardHeader>
                    <CardTitle>Google シート連携（Webhook）</CardTitle>
                    <CardDescription>GAS URL の末尾に <code>?token=kanda2255_Training_7gP4vY9xL2wQ0nH3tF5Z</code> を付与して保存すると、採点時に自動送信します。</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-3 md:grid-cols-[1fr_auto]">
                      <Input value={webhookUrl} onChange={(e)=>setWebhookUrl(e.target.value)} placeholder="https://script.google.com/macros/s/XXXX/exec?token=kanda2255_Training_7gP4vY9xL2wQ0nH3tF5Z" />
                      <Button onClick={()=>{
                        try { localStorage.setItem(WEBHOOK_KEY, webhookUrl); setSaveStatus("ok"); }
                        catch(e){ try { sessionStorage.setItem(WEBHOOK_KEY, webhookUrl); setSaveStatus("session"); } catch { setSaveStatus("error"); } }
                      }}>保存</Button>
                    </div>
                    <div className="mt-1 text-xs">
                      {saveStatus === "ok" && <span className="text-emerald-700">保存しました（このブラウザに保持）</span>}
                      {saveStatus === "session" && <span className="text-amber-700">保存しました（このセッションのみ）</span>}
                      {saveStatus === "error" && <span className="text-rose-700">保存に失敗しました。URLを控えてください。</span>}
                    </div>
                  </CardContent>
                </Card>
              </>
            )}
          </TabsContent>
        </Tabs>

        <div id="print-area" className="hidden">
          {submitted && (
            <div className="max-w-3xl mx-auto">
              <h1 className="text-2xl font-bold mb-4">高齢者虐待防止・権利擁護 e-learning｜採点結果</h1>
              <p className="mb-2">受講者：{dept} ／ {fullName}</p>
              <p className="mb-4">得点：{score} / {quizQuestions.length}　｜　{new Date().toLocaleString('ja-JP', { hour12: false })}</p>
              <ol className="space-y-4">
                {quizQuestions.map((q, qi) => (
                  <li key={q.id}><div className="font-semibold mb-1">第{qi + 1}問．{q.text}</div>
                    <div className="mb-1"><span className="font-medium">回答：</span>{answers[qi] !== null ? `${(answers[qi] as number) + 1}. ${q.choices[answers[qi] as number]}` : '未回答'}</div>
                    <div className="text-zinc-800"><span className="font-medium">解説：</span>{q.explanation}</div>
                  </li>
                ))}
              </ol>
            </div>
          )}
        </div>

        <style>{`@media print { body * { visibility:hidden !important; } #print-area, #print-area * { visibility:visible !important; } #print-area { position:absolute; inset:0; padding:24px; background:#fff; color:#000; } }`}</style>
      </main>

      <footer className="mx-auto max-w-5xl px-4 pb-10 pt-4 text-center text-xs text-zinc-500">
        高齢者あんしんセンター神田　浜田作成
      </footer>
    </div>
  );
}
