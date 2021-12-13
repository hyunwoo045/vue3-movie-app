# Webpack 에서 vue.js 사용하기

### <u>- 패키지 설치</u>

```bash
$ npm i -D vue-loader@next vue-style-loader @vue/compiler-sfc
```

vue-loader 뒤에 @next 를 명시함으로써 3.0 버전의 vue를 잘 사용할 수 있도록 한다.

```javascript
// webpack.config.js
const { VueLoaderPlugin } = require('vue-loader');

module.exports = {
  // 확장자를 따로 명시하지 않아도 작동하도록 설정
  resolve: {
    extensions: ['.js', '.vue'],
  }

  module: {
    rules: [
      test: /\.vue$/,
      use: ['vue-loader']
    ]
  }

  plugins: [
    new VueLoaderPlugin(),
  ]
}
```

<br/>

### - 이미지를 불러올 수 있도록 설정

```bash
$ npm i -D file-loader
```

```javascript
module.exports = {
  module: {
    rules: [
      {
        test: /\.(png|jpe?g|gif|webp)$/,
        use: ["file-loader"],
      },
    ],
  },
};
```

<br/>

### <u>- ESLint 구성</u>

```bash
$ npm i -D eslint eslint-plugin-vue babel-eslint
```

```javascript
// .eslintrc.js

module.exports = {
  // browser, node 환경에서 동작하는 여러 전역 개념들이 잘 동작하도록 검사할 것인지를 설정.
  env: {
    browser: true,
    node: true,
  },

  // 코드 검사를 할 여러 규칙들 설정
  extends: [
    // vue (아래 셋 중 선택)
    // 'plugin:vue/vue3-essential', // lv1
    "plugin:vue/vue3-strongly-recommended", // lv2
    // 'plugin:vue/vue3-recommend', // lv3 (가장 엄격)

    // js
    "eslint:recommended", // eslint 에서 권장하는 규칙
  ],

  // 코드를 분석할 수 있는 분석기 설정
  parserOptions: {
    parser: "babel-eslint",
  },

  rules: {
    "vue/html-closing-bracket-newline": [
      "error",
      {
        singleline: "never",
        multiline: "never",
      },
    ],
    "vue/html-self-closing": [
      "error",
      {
        html: {
          void: "always",
          normal: "never",
          component: "always",
        },
        svg: "always",
        math: "always",
      },
    ],
  },
};
```

#### <u>코드 규칙</u>

[eslint 3](https://eslint.vuejs.org/user-guide/) <br/>
Rules 에 들어가서 코드 규칙에 대한 내용을 살펴보자
<br/><br/>
예제
<br/>

```json
 rules: {
    "vue/html-closing-bracket-newline": [
      "error",
      {
        singleline: "never",
        multiline: "never",
      },
    ],
    "vue/html-self-closing": [
      "error",
      {
        html: {
          void: "always",
          normal: "never",
          component: "always",
        },
        svg: "always",
        math: "always",
      },
    ],
  },
```

- 태그 closing 할 때의 규칙
  - 태그를 한 줄로 작성했을 때 줄바꿈을 할 것인가
  - 태그를 여러 줄로 작성했을 때 줄바꿈을 할 것인가

<br/>

- self 태그에 대한 규칙

  - 빈 태그의 경우
  - 일반 태그의 경우
  - 컴포넌트 태그의 경우

  <br/>

### <u>VSCode 의 기능을 통한 자동 수정</u>

VSCode 의 기능을 통해 설정한 ESLint 의 코드 규칙에 따라 자동 수정 되도록 설정하는 법

```
Command + Shift + P
-> settings 검색
-> 기본 설정(JSON)
->

  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  }

위 속성 입력
```

# vue-style-loader 적용 안되는 이슈

webpack.config.js 파일 내에 module 에서 css 파일에 대해 vue-style-loader 를 사용할 시 에러가 발생합니다.

```
Uncaught TypeError: Cannot read property 'locals' of undefined
    at eval (App.vue?./node_modules/vue-style-loader/index.js!./node_modules/style-loader/dist/cjs.js!./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/dist/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js!./node_modules/vue-loader/dist/index.js??ruleSet[1].rules[6].use[0]:7)
    at Object../node_modules/vue-style-loader/index.js!./node_modules/style-loader/dist/cjs.js!./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/dist/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js!./node_modules/vue-loader/dist/index.js??ruleSet[1].rules[6].use[0]!./src/App.vue?vue&type=style&index=0&id=7ba5bd90&scoped=true&lang=css (main.js:572)
    at __webpack_require__ (main.js:612)
    at fn (main.js:823)
    at eval (VM2330 App.vue:2)
    at Module../src/App.vue?vue&type=style&index=0&id=7ba5bd90&scoped=true&lang=css (main.js:562)
    at __webpack_require__ (main.js:612)
    at fn (main.js:823)
    at eval (VM2330 App.vue:4)
    at Module../src/App.vue (main.js:529)
```

vue-style-loader 를 제외하면 정상적으로 동작하는 것을 확인하였습니다.

<br/>

https://github.com/vuejs/vue-style-loader/issues/56

vue-loader@next 에서 더 이상 vue-style-loader 를 사용하지 않고 style-loader 만을 사용한다는 것으로 파악됩니다. (21.07.20 기준)

<br/><br/>
