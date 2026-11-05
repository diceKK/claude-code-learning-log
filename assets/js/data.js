/*
 * 掲載データ
 * このファイルを書き換えれば、ページの文言・画像・並び順・注目事例が変わります。
 * index.html と main.js は変更しなくてかまいません。
 * - works の配列順がそのまま表示順です。
 * - 注目事例にしたい作品には featured: true を付けます（3件を想定）。
 * - stats（数字の帯）は自動では数えないため、件数が変わったら手で更新します。
 */
window.PORTFOLIO_DATA = {
  site: {
    title: 'Claude Code 学習記録',
    period: '2026.11.04–11.05'
  },

  hero: {
    image: '08-seo.png',
    alt: 'seo-blog-writer に 5000 字の記事を依頼した画面のスクリーンショット',
    heading: '2日間で Claude Code を学んだ記録',
    lead: 'AI 開発の成果を、スクリーンショット15枚でたどります。',
    period: '2026.11.04–11.05'
  },

  stats: [
    { value: '15', label: 'スクリーンショット' },
    { value: '6', label: '学習ステップ' },
    { value: '4', label: '自作スキル' },
    { value: '7', label: '自作サブエージェント' },
    { value: '2', label: '日間' }
  ],

  steps: [
    { id: 'step-1', no: '01', date: '2026-11-04', name: '基本操作', summary: '自然文の指示でファイルを作り、画面分割で複数の作業を並べて進めた。' },
    { id: 'step-2', no: '02', date: '2026-11-04', name: 'プラグイン', summary: 'プラグインを入れてコマンドを増やし、管理画面で確認した。' },
    { id: 'step-3', no: '03', date: '2026-11-05', name: 'サブエージェント', summary: '役割を決めたサブエージェントにレビューを任せ、複数を続けて動かした。' },
    { id: 'step-4', no: '04', date: '2026-11-05', name: 'スキル自作', summary: '文字数の計測や週報作成の手順を、スキルとして自作した。' },
    { id: 'step-5', no: '05', date: '2026-11-05', name: 'エージェント×スキル', summary: 'サブエージェントとスキルを組み合わせ、記事作成や作業の分担を任せた。' },
    { id: 'step-6', no: '06', date: '2026-11-05', name: 'ブラウザ連携', summary: 'ブラウザ操作で情報を集め、ログインでは安全のための制御を確認した。' }
  ],

  works: [
    {
      id: '01-readme',
      file: '01-readme.png',
      date: '2026-11-04',
      step: 'step-1',
      title: '自然文で README を作成',
      alt: '自然文で README を作成のスクリーンショット（一部を伏せています）',
      tags: ['自然文の指示'],
      goal: '自然文の指示だけでファイルを作れるか確かめたい',
      action: '自己紹介の README.md を作るよう、自然文で指示した',
      result: 'README.md が作成された'
    },
    {
      id: '02-split',
      file: '02-split.png',
      date: '2026-11-04',
      step: 'step-1',
      title: '画面分割で並行操作',
      alt: '画面分割で並行操作のスクリーンショット（一部を伏せています）',
      tags: ['画面分割'],
      goal: '複数の作業を1つの画面で並行して進めたい',
      action: 'セッション・ターミナル・プレビューを画面分割で並べた',
      result: '3つを並べたまま、行き来して操作できた'
    },
    {
      id: '03-commit',
      file: '03-commit.png',
      date: '2026-11-04',
      step: 'step-2',
      title: '/commit コマンドの追加',
      alt: '/commit コマンドの追加のスクリーンショット',
      tags: ['プラグイン', '/commit'],
      goal: 'Git のコミットを決まったコマンドで行いたい',
      action: 'commit-commands プラグインを入れ、/commit を入力した',
      result: '/commit がコマンドの補完候補に表示された'
    },
    {
      id: '12-customize',
      file: '12-customize.png',
      date: '2026-11-04',
      step: 'step-2',
      title: 'プラグインの管理画面',
      alt: 'プラグインの管理画面のスクリーンショット',
      tags: ['プラグイン', 'カスタマイズ画面'],
      goal: '入れたプラグインを確認・管理したい',
      action: 'カスタマイズ画面を開いてプラグインの一覧を見た',
      result: 'プラグインを画面上で管理できることを確認した'
    },
    {
      id: '13-review',
      file: '13-review.png',
      date: '2026-11-05',
      step: 'step-3',
      title: 'code-reviewer によるレビュー',
      alt: 'code-reviewer によるレビューのスクリーンショット',
      tags: ['サブエージェント', 'code-reviewer'],
      metric: '高6・中5・低5件',
      goal: 'コードの問題点を重要度別に洗い出したい',
      action: '自作した code-reviewer に inventory.py をレビューさせた',
      result: '重要度 高6件・中5件・低5件の指摘が一覧で出た'
    },
    {
      id: '04-session',
      file: '04-session.png',
      date: '2026-11-05',
      step: 'step-3',
      title: '更新した code-reviewer の確認',
      alt: '更新した code-reviewer の確認のスクリーンショット',
      tags: ['サブエージェント', '別セッション'],
      goal: '定義を更新した code-reviewer が新しい形式で出力するか確かめたい',
      action: '別のセッションで code-reviewer を動かした',
      result: '指摘に CWE 番号が付いた形式で出力された'
    },
    {
      id: '05-chain',
      file: '05-chain.png',
      date: '2026-11-05',
      step: 'step-3',
      title: '3つのエージェントを連続実行',
      alt: '3つのエージェントを連続実行のスクリーンショット',
      tags: ['サブエージェント', '連続実行'],
      metric: '3エージェント',
      goal: '文書作成・レビュー・テストを続けて任せたい',
      action: 'doc-writer → code-reviewer → test-runner の順に実行した',
      result: '3つのサブエージェントが順番に動き、それぞれの結果が出た',
      featured: true
    },
    {
      id: '06-charcount',
      file: '06-charcount.png',
      date: '2026-11-05',
      step: 'step-4',
      title: 'char-count スキル',
      alt: 'char-count スキルのスクリーンショット',
      tags: ['スキル', 'char-count'],
      metric: '4パターン',
      goal: '文章の文字数を正確に数えたい',
      action: '文字数を数える char-count スキルを自作して実行した',
      result: '4パターンの文字数が表で出力された'
    },
    {
      id: '15-charcount-script',
      file: '15-charcount-script.png',
      date: '2026-11-05',
      step: 'step-4',
      title: 'スクリプト自身を計測',
      alt: 'スクリプト自身を計測のスクリーンショット',
      tags: ['スキル', 'count_chars.py'],
      goal: 'プログラムのファイルでも数えられるか確かめたい',
      action: 'スキルのスクリプト count_chars.py 自身を計測させた',
      result: '行数と原稿用紙換算の枚数が出た'
    },
    {
      id: '07-weekly',
      file: '07-weekly.png',
      date: '2026-11-05',
      step: 'step-4',
      title: 'weekly-report スキル',
      alt: 'weekly-report スキルのスクリーンショット',
      tags: ['スキル', 'weekly-report'],
      goal: '週報を毎回同じ手順で作りたい',
      action: 'weekly-report スキルを自作した',
      result: 'スキルのファイル一式がそろった'
    },
    {
      id: '08-seo',
      file: '08-seo.png',
      date: '2026-11-05',
      step: 'step-5',
      title: '5000字の SEO 記事を依頼',
      alt: '5000字の SEO 記事を依頼のスクリーンショット',
      tags: ['サブエージェント', 'seo-blog-writer'],
      metric: '本文5,067字',
      goal: '指定した文字数の記事を書かせたい',
      action: 'seo-blog-writer に 5000 字の記事を依頼した',
      result: '本文 5,067 字の記事ができた',
      featured: true
    },
    {
      id: '09-competitor',
      file: '09-competitor.png',
      date: '2026-11-05',
      step: 'step-5',
      title: '上位記事の見出し比較',
      alt: '上位記事の見出し比較のスクリーンショット（一部を伏せています）',
      tags: ['スキル', 'competitor-headings'],
      metric: '上位5記事',
      goal: '検索上位の記事がどんな構成かを知りたい',
      action: '/competitor-headings で上位5記事の見出しを比較した',
      result: '5記事の見出しを並べて比べられた（記事名・著者名は伏せています）'
    },
    {
      id: '14-agents',
      file: '14-agents.png',
      date: '2026-11-05',
      step: 'step-5',
      title: '3つのエージェントの定義',
      alt: '3つのエージェントの定義のスクリーンショット',
      tags: ['サブエージェント', 'analyzer / builder / reviewer'],
      goal: '依頼を分析・作成・確認の役割に分けて任せたい',
      action: 'analyzer・builder・reviewer の3つを定義ファイルとして作った',
      result: '役割ごとの定義ファイル3つがそろった'
    },
    {
      id: '10-chrome',
      file: '10-chrome.png',
      date: '2026-11-05',
      step: 'step-6',
      title: 'ニュース見出しの取得',
      alt: 'ニュース見出しの取得のスクリーンショット（一部を伏せています）',
      tags: ['Claude in Chrome'],
      metric: '3サイト',
      goal: '複数サイトの情報をブラウザ操作で集めたい',
      action: 'Claude in Chrome で3つのニュースサイトから見出しを取得させた',
      result: '3サイトの見出しを取得できた（見出し本文は伏せています）'
    },
    {
      id: '11-login',
      file: '11-login.png',
      date: '2026-11-05',
      step: 'step-6',
      title: 'ログイン操作と安全制御',
      alt: 'ログイン操作と安全制御のスクリーンショット（一部を伏せています）',
      tags: ['Claude in Chrome', '安全制御'],
      goal: 'ブラウザ操作をどこまで任せられるか確かめたい',
      action: '練習用サイトでログイン操作を依頼した',
      result: 'パスワードの入力は本人に委ねる制御が働いた（パスワード文字列は伏せています）',
      featured: true
    }
  ],

  made: {
    skills: [
      { name: 'char-count', desc: '文章の文字数を、改行やスペースの扱い別に数える' },
      { name: 'weekly-report', desc: '週報を決まった形式で作る' },
      { name: 'competitor-headings', desc: '検索上位の記事の見出しを集めて比べる' },
      { name: 'summarize-file', desc: 'ファイルの内容を要約する' }
    ],
    agents: [
      { name: 'code-reviewer', desc: 'コードを読み、問題点を重要度別に挙げる' },
      { name: 'doc-writer', desc: 'コードや作業の文書を書く' },
      { name: 'test-runner', desc: 'テストを実行して結果をまとめる' },
      { name: 'analyzer', desc: '依頼を読み、仕様書と受け入れ基準を作る' },
      { name: 'builder', desc: '仕様書に沿って成果物を作る' },
      { name: 'reviewer', desc: '受け入れ基準で成果物の合否を判定する' },
      { name: 'seo-blog-writer', desc: 'スキルと組み合わせて SEO 記事を書く' }
    ]
  },

  reflection: {
    heading: '振り返り',
    body: [
      '2日間で、自然文の指示からプラグイン、サブエージェント、スキルの自作、ブラウザ連携までを順に試しました。',
      '役割を分けたエージェントと、数える・確かめる作業を受け持つスキルを組み合わせると、任せられる作業が増えました。',
      'パスワードの入力のように本人が行うべき操作では、AI が手を止めて人に委ねることも確認しました。'
    ]
  },

  footer: {
    notes: [
      'HTML・CSS・JavaScript だけで作り、GitHub Pages で公開しています。',
      '掲載画像は、アカウント名・パス・他社の記事情報・パスワードなどを伏せたものです。'
    ]
  }
};
