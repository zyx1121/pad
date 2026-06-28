module.exports = [
  18325,
  (a, b, c) => {
    "use strict"
    b.exports = a.r(66763).vendored["react-ssr"].ReactServerDOMTurbopackClient
  },
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
  79948,
  (a) => {
    "use strict"
    var b = a.i(10513),
      c = a.i(62453),
      d = a.i(41249)
    function e() {
      let a = (0, d.useRouter)()
      return (0, b.jsx)("button", {
        onClick: async () => {
          ;(await (0, c.signOut)(), a.refresh())
        },
        className:
          "text-sm text-muted-foreground hover:text-foreground transition-colors",
        children: "登出",
      })
    }
    a.s(["SignOutButton", () => e])
  },
]

//# sourceMappingURL=%5Broot-of-the-server%5D__8b4fc2f9._.js.map
