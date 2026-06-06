import { Shop, Genre, ShopMenu } from './types';

export const SHOPS: Shop[] = [
  // === 3F ===
  { id: 's301', floor: 3, x: 155, y: 111, genre: 'food', icon: '🍡', name: 'たこ焼き屋', label: 'たこ焼き', org: '3-1 実行委員', hours: '10:00 - 16:00', price: '¥', desc: '外はカリッ、中はとろっ。秘伝のソースで味わう本格たこ焼き。', stars: 4 },
  { id: 's302', floor: 3, x: 205, y: 150, genre: 'food', icon: '🧋', name: 'タピオカ専門店', label: 'タピオカ', org: '3-2 文化部', hours: '10:00 - 16:00', price: '¥', desc: '黒糖タピオカミルクティーが人気。映えるドリンクで休憩を。', stars: 5 },
  { id: 's303', floor: 3, x: 256, y: 188, genre: 'attraction', icon: '👻', name: 'お化け屋敷', label: 'お化け屋敷', org: '3-3 文化部', hours: '10:30 - 15:30', price: '¥¥', desc: '廃病院をモチーフにした本格お化け屋敷。心霊現象多発中…', stars: 5 },
  { id: 's304', floor: 3, x: 306, y: 227, genre: 'attraction', icon: '🎯', name: '射的コーナー', label: '射的', org: '3-4 有志', hours: '10:00 - 16:00', price: '¥', desc: 'コルク銃で景品を狙え！全員参加できる定番ゲーム。', stars: 4 },
  { id: 's305', floor: 3, x: 489, y: 175, genre: 'exhibit', icon: '🎨', name: '美術部展示', label: '美術部', org: '美術部', hours: '9:30 - 16:30', price: '無料', desc: '部員が1年かけて制作した油絵・水彩画・立体作品を展示。', stars: 4 },
  { id: 's306', floor: 3, x: 529, y: 145, genre: 'exhibit', icon: '📚', name: '文芸部部誌販売', label: '文芸部', org: '文芸部', hours: '9:30 - 16:00', price: '¥', desc: '部員の小説・詩・エッセイをまとめた部誌を配布・販売中。', stars: 4 },
  { id: 's307', floor: 3, x: 567, y: 117, genre: 'food', icon: '🍦', name: 'クレープ屋', label: 'クレープ', org: '3-7', hours: '10:00 - 16:00', price: '¥¥', desc: 'いちご・チョコ・キャラメル等10種類以上のクレープ。', stars: 5 },
  { id: 's308', floor: 3, x: 605, y: 89, genre: 'attraction', icon: '🎮', name: 'レトロゲーセン', label: 'ゲーセン', org: '3-8', hours: '10:00 - 16:00', price: '¥', desc: '部員が改造したアーケード筐体でレトロゲームを体験。', stars: 4 },


  // === 4F ===
  { id: 's401', floor: 4, x: 155, y: 111, genre: 'food', icon: '🍜', name: 'ラーメン横丁', label: 'ラーメン', org: '4-1', hours: '11:00 - 15:00', price: '¥¥', desc: '醤油・味噌・塩・とんこつの4種類が楽しめる学園祭限定屋台。', stars: 5 },
  { id: 's402', floor: 4, x: 205, y: 150, genre: 'attraction', icon: '🎲', name: 'カジノ風ゲーム', label: 'カジノ', org: '4-2', hours: '10:00 - 16:00', price: '¥', desc: 'ルーレット・ブラックジャック・ポーカー。チップで景品交換。', stars: 5 },
  { id: 's403', floor: 4, x: 256, y: 188, genre: 'food', icon: '🍩', name: 'チュロス＆ドーナツ', label: 'チュロス', org: '4-3', hours: '10:00 - 16:00', price: '¥', desc: '揚げたてチュロスとカラフルドーナツ。シナモンシュガーが絶品。', stars: 4 },
  { id: 's404', floor: 4, x: 306, y: 227, genre: 'attraction', icon: '🏰', name: '脱出ゲーム', label: '脱出', org: '4-4 有志', hours: '10:30 - 15:30', price: '¥¥', desc: '60分以内に教室から脱出せよ。難易度別に3コース用意。', stars: 5 },
  { id: 's405', floor: 4, x: 489, y: 175, genre: 'food', icon: '🍕', name: 'ピザ屋', label: 'ピザ', org: '4-5', hours: '11:00 - 15:00', price: '¥¥', desc: 'チーズたっぷり手作りピザ。マルゲリータが看板メニュー。', stars: 4 },
  { id: 's406', floor: 4, x: 529, y: 145, genre: 'attraction', icon: '🎭', name: '演劇部公演', label: '演劇部', org: '演劇部', hours: '11:30 / 14:00', price: '無料', desc: 'オリジナル脚本「青春の方方程式」。1日2回公演、各40分。', stars: 5 },
  { id: 's407', floor: 4, x: 567, y: 117, genre: 'exhibit', icon: '📷', name: '写真部展示', label: '写真部', org: '写真部', hours: '9:30 - 16:30', price: '無料', desc: '部員が撮影した風景・人物写真を展示。来場者投票も実施。', stars: 4 },
  { id: 's408', floor: 4, x: 605, y: 89, genre: 'food', icon: '🍢', name: 'おでん屋台', label: 'おでん', org: '4-8', hours: '11:00 - 15:30', price: '¥', desc: '出汁にこだわった本格おでん。大根・卵・はんぺん等10種。', stars: 4 },

  // === 2F ===
  { id: 's201', floor: 2, x: 306, y: 457, genre: 'food', icon: '🍫', name: 'チョコバナナ', label: 'チョコバナナ', org: '2-1', hours: '10:00 - 16:00', price: '¥', desc: '色とりどりのトッピングが選べるチョコバナナ。', stars: 4 },
  { id: 's202', floor: 2, x: 256, y: 418, genre: 'attraction', icon: '🎪', name: 'メイドカフェ', label: 'メイド喫茶', org: '2-2', hours: '10:00 - 16:00', price: '¥¥', desc: '可愛い制服のメイドがお端迎え。オムライス・パフェあり。', stars: 5 },
  { id: 's203', floor: 2, x: 205, y: 380, genre: 'exhibit', icon: '🔬', name: '科学部実験ショー', label: '科学部', org: '科学部', hours: '10:30 / 13:30 / 15:30', price: '無料', desc: '液体窒素・炎色反応など、迫力の実験ショーを生で見られる。', stars: 5 },
  { id: 's204', floor: 2, x: 155, y: 341, genre: 'food', icon: '🍰', name: 'ケーキ屋', label: 'ケーキ', org: '2-4', hours: '10:00 - 16:00', price: '¥¥', desc: '手作りケーキ各種。ショートケーキ・チーズケーキが人気。', stars: 4 },
  { id: 's205', floor: 2, x: 489, y: 405, genre: 'attraction', icon: '☕', name: '猫カフェ風', label: '猫カフェ', org: '2-5', hours: '10:00 - 16:00', price: '¥¥', desc: '保護猫団体協力。猫と触れ合いながらドリンクが楽しめる。', stars: 5 },
  { id: 's206', floor: 2, x: 529, y: 375, genre: 'stage', icon: '💃', name: 'ダンス部発表', label: 'ダンス部', org: 'ダンス部', hours: '12:00 / 14:30', price: '無料', desc: 'K-POP・HIPHOP・JAZZの3ジャンル全12演目。', stars: 5 },
  { id: 's207', floor: 2, x: 567, y: 347, genre: 'exhibit', icon: '🧬', name: '生物部展示', label: '生物部', org: '生物部', hours: '9:30 - 16:30', price: '無料', desc: '飼育中の小動物・昆虫・植物の展示。エサやり体験あり。', stars: 4 },
  { id: 's208', floor: 2, x: 605, y: 319, genre: 'food', icon: '🥟', name: '餃子屋台', label: '餃子', org: '2-8', hours: '11:00 - 15:00', price: '¥', desc: '手包み焼き餃子。タレは醤油ベース・ラー油・ポン酢から選択。', stars: 4 },

  // === 1F ===
  { id: 's101', floor: 1, x: 386, y: 280, genre: 'stage', icon: '🎤', name: 'メインステージ', label: 'メインステージ', org: '実行委員会', hours: '11:00 - 16:00', price: '無料', desc: 'リンクスホールで開催の特設ステージ。漫才・歌・ダンス等多彩なプログラム。', stars: 5 },
  { id: 's103', floor: 1, x: 530, y: 273, genre: 'facility', icon: '🩹', name: '救護室', label: '救護室', org: '保健委員会', hours: '9:00 - 17:00', price: '無料', desc: '体調不良の方はすぐにお越しください。看護師常駐。', stars: 4 },
];

export const GENRES: Record<string, Genre> = {
  food: { name: '飲食', color: '#ff7043' },
  attraction: { name: 'アトラク', color: '#ab47bc' },
  exhibit: { name: '展示', color: '#29b6f6' },
  stage: { name: 'ステージ', color: '#ec407a' },
  facility: { name: '施設', color: '#8e8e93' },
};

export const MENUS: Record<string, ShopMenu> = {
  's301': { // たこ焼き屋
    categories: [
      { name: 'おすすめ', sub: '人気メニュー', items: [
        { name: 'たこ焼き 6個', price: 400, badge: 'おすすめ', desc: '外カリ中とろ。特製ソース・青のり付き', emoji: '🐙' },
        { name: 'たこ焼き 12個', price: 700, badge: null, desc: 'シェアにぴったりの大盛りセット', emoji: '🐙' },
      ]},
      { name: 'トッピング', sub: null, items: [
        { name: 'チーズたこ焼き 6個', price: 500, badge: null, desc: 'とろけるチーズをたっぷりON', emoji: '🧀' },
        { name: 'ねぎマヨ 6個', price: 450, badge: null, desc: '刻みねぎとマヨネーズのさっぱり系', emoji: '🌿' },
      ]},
      { name: 'ドリンク', sub: null, items: [
        { name: 'お茶', price: 100, badge: null, desc: '冷たい緑茶', emoji: '🍵' },
        { name: 'コーラ', price: 150, badge: null, desc: '冷えたコーラ', emoji: '🥤' },
      ]},
    ]
  },
  's302': { // タピオカ専門店
    categories: [
      { name: 'タピオカ', sub: 'おすすめ', items: [
        { name: '黒糖タピオカミルクティー', price: 600, badge: 'おすすめ', desc: '濃厚黒糖シロップの定番', emoji: '🧋' },
        { name: 'いちごミルクタピオカ', price: 650, badge: null, desc: '甘酸っぱいいちごと濃厚ミルク', emoji: '🍓' },
        { name: 'マンゴータピオカ', price: 650, badge: null, desc: 'トロピカルなマンゴーフレーバー', emoji: '🥭' },
        { name: '抹茶タピオカ', price: 600, badge: null, desc: '京都産抹茶使用のほろ苦い一杯', emoji: '🍵' },
      ]},
    ]
  },
  's307': { // クレープ屋
    categories: [
      { name: 'スイーツ', sub: 'デザートクレープ', items: [
        { name: 'いちごカスタード', price: 550, badge: 'おすすめ', desc: '生いちご＆濃厚カスタードクリーム', emoji: '🍓' },
        { name: 'チョコバナナ', price: 500, badge: null, desc: 'チョコソース＆バナナのクラシック', emoji: '🍫' },
        { name: 'キャラメルナッツ', price: 580, badge: null, desc: 'キャラメルソース＆砕いたナッツ', emoji: '🌰' },
        { name: 'マンゴーヨーグルト', price: 560, badge: null, desc: 'さわやかヨーグルト＆マンゴー', emoji: '🥭' },
      ]},
      { name: 'セイボリー', sub: 'ごはん系', items: [
        { name: 'ハムチーズエッグ', price: 600, badge: null, desc: 'ハム・チーズ・目玉焼き入り', emoji: '🍳' },
        { name: 'ツナコーンマヨ', price: 580, badge: null, desc: 'ツナ・コーン・マヨネーズ', emoji: '🌽' },
      ]},
    ]
  },
  's401': { // ラーメン横丁
    categories: [
      { name: 'ラーメン', sub: 'スープ全4種', items: [
        { name: '醤油ラーメン', price: 600, badge: 'おすすめ', desc: '鶏ガラベースの澄んだ醤油スープ', emoji: '🍜' },
        { name: '味噌ラーメン', price: 650, badge: null, desc: '濃厚味噌スープにコーンとバター', emoji: '🍜' },
        { name: '塩ラーメン', price: 600, badge: null, desc: 'あっさり塩スープ。体に優しい一杯', emoji: '🍜' },
        { name: 'とんこつラーメン', price: 650, badge: null, desc: '白濁した濃厚とんこつスープ', emoji: '🍜' },
      ]},
      { name: 'トッピング', sub: null, items: [
        { name: '味付け玉子', price: 100, badge: null, desc: 'とろとろ半熟タマゴ', emoji: '🥚' },
        { name: 'チャーシュー追加', price: 150, badge: null, desc: '厚切りチャーシュー2枚', emoji: '🥩' },
      ]},
    ]
  },
  's403': { // チュロス
    categories: [
      { name: 'チュロス', sub: null, items: [
        { name: 'シナモンシュガー', price: 300, badge: 'おすすめ', desc: '定番シナモンシュガーのチュロス', emoji: '🥨' },
        { name: 'チョコがけ', price: 350, badge: null, desc: 'チョコソースをたっぷりかけた一本', emoji: '🍫' },
        { name: 'チュロス3本セット', price: 800, badge: null, desc: 'お得な3本セット。お好みの味で', emoji: '🥨' },
      ]},
      { name: 'ドーナツ', sub: null, items: [
        { name: 'プレーンドーナツ', price: 200, badge: null, desc: 'ふわふわ揚げドーナツ', emoji: '🍩' },
        { name: 'チョコリングドーナツ', price: 250, badge: null, desc: 'チョコアイシングのカラフルドーナツ', emoji: '🍩' },
        { name: 'いちごドーナツ', price: 250, badge: null, desc: 'ピンクのいちごアイシング', emoji: '🍩' },
      ]},
    ]
  },
  's405': { // ピザ
    categories: [
      { name: 'ピザ', sub: 'スライス販売', items: [
        { name: 'マルゲリータ', price: 400, badge: 'おすすめ', desc: 'トマトソース・モッツァレラ・バジル', emoji: '🍕' },
        { name: 'クワトロフォルマッジ', price: 500, badge: null, desc: '4種のチーズをたっぷり使用', emoji: '🍕' },
        { name: 'ペパロニ', price: 450, badge: null, desc: 'スパイシーなペパロニとチーズ', emoji: '🍕' },
        { name: 'バジルチキン', price: 450, badge: null, desc: 'グリルチキン＆バジルソース', emoji: '🍕' },
      ]},
    ]
  },
  's408': { // おでん
    categories: [
      { name: 'おでん', sub: '1本100円〜', items: [
        { name: '大根', price: 150, badge: 'おすすめ', desc: 'だしがしみしみ。定番の大根', emoji: '🥕' },
        { name: '卵', price: 120, badge: null, desc: 'とろとろ半熟卵', emoji: '🥚' },
        { name: 'はんぺん', price: 120, badge: null, desc: 'ふわふわはんぺん', emoji: '⬜' },
        { name: 'こんにゃく', price: 100, badge: null, desc: 'プリプリのこんにゃく', emoji: '🫙' },
        { name: 'ちくわ', price: 120, badge: null, desc: '旨味たっぷりちくわ', emoji: '🍢' },
        { name: 'もち巾着', price: 150, badge: null, desc: 'もちもち油揚げにお餅入り', emoji: '🍢' },
      ]},
      { name: 'セット', sub: null, items: [
        { name: '5本セット', price: 500, badge: null, desc: 'お好みの5本をセレクト', emoji: '🍱' },
      ]},
    ]
  },
  's201': { // チョコバナナ
    categories: [
      { name: 'チョコバナナ', sub: null, items: [
        { name: 'ミルクチョコ', price: 300, badge: 'おすすめ', desc: '定番のミルクチョコレートがけ', emoji: '🍌' },
        { name: 'ホワイトチョコ', price: 300, badge: null, desc: 'まろやかホワイトチョコ', emoji: '🍌' },
        { name: 'ストロベリー', price: 350, badge: null, desc: 'いちご風味のピンクチョコ', emoji: '🍓' },
        { name: 'レインボー', price: 400, badge: null, desc: 'カラフルスプリンクルでデコレーション', emoji: '🌈' },
      ]},
    ]
  },
  's204': { // ケーキ屋
    categories: [
      { name: 'ケーキ', sub: 'ホール・スライス', items: [
        { name: 'いちごショートケーキ', price: 400, badge: 'おすすめ', desc: '生クリームと国産いちごの定番ショート', emoji: '🍰' },
        { name: 'チーズケーキ', price: 380, badge: null, desc: '濃厚ニューヨークスタイル', emoji: '🧀' },
        { name: 'チョコレートケーキ', price: 400, badge: null, desc: '濃厚ガナッシュの大人のチョコケーキ', emoji: '🍫' },
        { name: 'モンブラン', price: 420, badge: null, desc: '栗クリームたっぷり秋の定番', emoji: '🌰' },
      ]},
    ]
  },
  's208': { // 餃子
    categories: [
      { name: '餃子', sub: '手包み焼き餃子', items: [
        { name: '焼き餃子 6個', price: 400, badge: 'おすすめ', desc: 'パリパリ羽根付き。手包み焼き餃子', emoji: '🥟' },
        { name: '焼き餃子 12個', price: 750, badge: null, desc: 'シェアにぴったり大盛り', emoji: '🥟' },
        { name: 'ラー油餃子 6個', price: 450, badge: null, desc: 'ピリ辛ラー油だれで食べる特製', emoji: '🌶️' },
      ]},
      { name: 'セット', sub: null, items: [
        { name: '餃子＋お茶セット', price: 500, badge: null, desc: '餃子6個とお茶のお得セット', emoji: '🍵' },
      ]},
    ]
  },
};
