# 簡単な手引き
## ファイル構造とその説明
### App.tsx
- ページの概要を決定
- ページを追加したい場合やサイト全体の構成についての設定をしたい場合はここでdiv作成->classnameなどで変更
- 新規ページ追加はindex.tsxと同時にimportをしてあげる
### index.tsx
- ページを簡略化してインポートする
- 新しいページ、コンポーネントなどを追加したい際は他参照で追記、import追加
- App.tsxにimportお忘れなく
### styles/App.css
- tailwindcssのインポート
- 他ファイルでtailwindをサポート
- 触らない
### main.tsx
- ファイルの大外を決定
- 触らない
## 操作方法
### 現時点で完成しているフォルダを読み込みたい場合
```git pull ここにurl```
### ローカルでテストしたい場合
```npm run dev```
### 作業をしたい場合
```git
git checkout main
git checkout -b "feature/BranchName"
```
mainブランチから作業用ブランチを作成してそのブランチを新規作成&移動
基本的に作業用ブランチは使い捨て
### 作業をする前に
```git branch```
これで自分のブランチがちゃんと作業用のブランチかチェック
### 画面遷移をしたい場合
aタグ、またはLink importして使用(乱雑しているので適当に参照)
### タグ付けをして装飾したい場合
例: 
```<div className="bg-red-500 m-20">```
### プルリクを送る方法
```git add .```
```git commit -m "[ADD]READMEを変えたよ"```
```git push origin feature/yourbranch```




























# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      ...tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      ...tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      ...tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
