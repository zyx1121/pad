module.exports = [
  26026,
  (a, b, c) => {
    "use strict"
    b.exports = a.r(66763).vendored.contexts.HooksClientContext
  },
  91615,
  (a, b, c) => {
    "use strict"
    b.exports = a.r(66763).vendored.contexts.ServerInsertedHtml
  },
  18622,
  (a, b, c) => {
    b.exports = a.x(
      "next/dist/compiled/next-server/app-page-turbo.runtime.prod.js",
      () =>
        require("next/dist/compiled/next-server/app-page-turbo.runtime.prod.js")
    )
  },
  56704,
  (a, b, c) => {
    b.exports = a.x(
      "next/dist/server/app-render/work-async-storage.external.js",
      () =>
        require("next/dist/server/app-render/work-async-storage.external.js")
    )
  },
  32319,
  (a, b, c) => {
    b.exports = a.x(
      "next/dist/server/app-render/work-unit-async-storage.external.js",
      () =>
        require("next/dist/server/app-render/work-unit-async-storage.external.js")
    )
  },
  20635,
  (a, b, c) => {
    b.exports = a.x(
      "next/dist/server/app-render/action-async-storage.external.js",
      () =>
        require("next/dist/server/app-render/action-async-storage.external.js")
    )
  },
  66763,
  (a, b, c) => {
    "use strict"
    b.exports = a.r(18622)
  },
  10513,
  (a, b, c) => {
    "use strict"
    b.exports = a.r(66763).vendored["react-ssr"].ReactJsxRuntime
  },
  90875,
  (a, b, c) => {
    "use strict"
    b.exports = a.r(66763).vendored["react-ssr"].React
  },
  14796,
  (a, b, c) => {
    "use strict"
    b.exports = a.r(66763).vendored.contexts.AppRouterContext
  },
  71160,
  (a, b, c) => {
    "use strict"
    function d(a) {
      if ("function" != typeof WeakMap) return null
      var b = new WeakMap(),
        c = new WeakMap()
      return (d = function (a) {
        return a ? c : b
      })(a)
    }
    c._ = function (a, b) {
      if (!b && a && a.__esModule) return a
      if (null === a || ("object" != typeof a && "function" != typeof a))
        return { default: a }
      var c = d(b)
      if (c && c.has(a)) return c.get(a)
      var e = { __proto__: null },
        f = Object.defineProperty && Object.getOwnPropertyDescriptor
      for (var g in a)
        if ("default" !== g && Object.prototype.hasOwnProperty.call(a, g)) {
          var h = f ? Object.getOwnPropertyDescriptor(a, g) : null
          h && (h.get || h.set) ? Object.defineProperty(e, g, h) : (e[g] = a[g])
        }
      return ((e.default = a), c && c.set(a, e), e)
    }
  },
  52245,
  (a, b, c) => {
    "use strict"
    Object.defineProperty(c, "__esModule", { value: !0 })
    var d = {
      DEFAULT_SEGMENT_KEY: function () {
        return l
      },
      NOT_FOUND_SEGMENT_KEY: function () {
        return m
      },
      PAGE_SEGMENT_KEY: function () {
        return k
      },
      addSearchParamsIfPageSegment: function () {
        return i
      },
      computeSelectedLayoutSegment: function () {
        return j
      },
      getSegmentValue: function () {
        return f
      },
      getSelectedLayoutSegmentPath: function () {
        return function a(b, c, d = !0, e = []) {
          let g
          if (d) g = b[1][c]
          else {
            let a = b[1]
            g = a.children ?? Object.values(a)[0]
          }
          if (!g) return e
          let h = f(g[0])
          return !h || h.startsWith(k) ? e : (e.push(h), a(g, c, !1, e))
        }
      },
      isGroupSegment: function () {
        return g
      },
      isParallelRouteSegment: function () {
        return h
      },
    }
    for (var e in d) Object.defineProperty(c, e, { enumerable: !0, get: d[e] })
    function f(a) {
      return Array.isArray(a) ? a[1] : a
    }
    function g(a) {
      return "(" === a[0] && a.endsWith(")")
    }
    function h(a) {
      return a.startsWith("@") && "@children" !== a
    }
    function i(a, b) {
      if (a.includes(k)) {
        let a = JSON.stringify(b)
        return "{}" !== a ? k + "?" + a : k
      }
      return a
    }
    function j(a, b) {
      if (!a || 0 === a.length) return null
      let c = "children" === b ? a[0] : a[a.length - 1]
      return c === l ? null : c
    }
    let k = "__PAGE__",
      l = "__DEFAULT__",
      m = "/_not-found"
  },
  61013,
  (a) => {
    "use strict"
    var b = a.i(10513),
      c = a.i(41249),
      d = a.i(62453)
    function e() {
      let a = (0, c.useSearchParams)()
      return (0, b.jsxs)("button", {
        onClick: () => {
          let b
          return d.signIn.social({
            provider: "google",
            callbackURL:
              (b = a.get("next") ?? "/").startsWith("/") && !b.startsWith("//")
                ? b
                : "/",
          })
        },
        className:
          "flex w-full items-center justify-center gap-2 rounded-md border px-4 py-2 text-sm font-medium hover:bg-muted transition-colors",
        children: [
          (0, b.jsxs)("svg", {
            className: "h-4 w-4",
            viewBox: "0 0 24 24",
            "aria-hidden": !0,
            children: [
              (0, b.jsx)("path", {
                fill: "currentColor",
                d: "M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z",
              }),
              (0, b.jsx)("path", {
                fill: "currentColor",
                d: "M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z",
              }),
              (0, b.jsx)("path", {
                fill: "currentColor",
                d: "M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z",
              }),
              (0, b.jsx)("path", {
                fill: "currentColor",
                d: "M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z",
              }),
            ],
          }),
          "使用 Google 登入",
        ],
      })
    }
    a.s(["LoginButton", () => e])
  },
]

//# sourceMappingURL=%5Broot-of-the-server%5D__76c1c52c._.js.map
