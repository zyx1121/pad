module.exports = [
  50227,
  (a, b, c) => {
    b.exports = a.x("node:path", () => require("node:path"))
  },
  66680,
  (a, b, c) => {
    b.exports = a.x("node:crypto", () => require("node:crypto"))
  },
  2157,
  (a, b, c) => {
    b.exports = a.x("node:fs", () => require("node:fs"))
  },
  12714,
  (a, b, c) => {
    b.exports = a.x("node:fs/promises", () => require("node:fs/promises"))
  },
  60526,
  (a, b, c) => {
    b.exports = a.x("node:os", () => require("node:os"))
  },
  69101,
  (a) =>
    a.a(async (b, c) => {
      try {
        let b = await a.y("pg-ac2a65cc6e522f24")
        ;(a.n(b), c())
      } catch (a) {
        c(a)
      }
    }, !0),
  73193,
  (a) => {
    "use strict"
    class b {
      get supportsCreateIfNotExists() {
        return !0
      }
      get supportsMultipleConnections() {
        return !0
      }
      get supportsTransactionalDdl() {
        return !1
      }
      get supportsReturning() {
        return !1
      }
      get supportsOutput() {
        return !1
      }
    }
    a.s(["DialectAdapterBase", () => b])
  },
  25776,
  (a) => {
    "use strict"
    var b = a.i(52740)
    let c = /"/g,
      d = /[\\'"]/g
    class e extends b.DefaultQueryCompiler {
      visitOrAction(a) {
        ;(this.append("or "), this.append(a.action))
      }
      getCurrentParameterPlaceholder() {
        return "?"
      }
      getLeftExplainOptionsWrapper() {
        return ""
      }
      getRightExplainOptionsWrapper() {
        return ""
      }
      getLeftIdentifierWrapper() {
        return '"'
      }
      getRightIdentifierWrapper() {
        return '"'
      }
      getAutoIncrement() {
        return "autoincrement"
      }
      sanitizeIdentifier(a) {
        return a.replace(c, '""')
      }
      sanitizeJSONPathMemberValue(a) {
        return a.replace(d, (a) =>
          "\\" === a ? "\\\\" : "'" === a ? "''" : '\\"'
        )
      }
      visitDefaultInsertValue(a) {
        this.append("null")
      }
    }
    a.s(["SqliteQueryCompiler", () => e])
  },
  98192,
  (a) => {
    "use strict"
    var b = a.i(73193)
    class c extends b.DialectAdapterBase {
      get supportsMultipleConnections() {
        return !1
      }
      get supportsTransactionalDdl() {
        return !1
      }
      get supportsReturning() {
        return !0
      }
      async acquireMigrationLock(a, b) {}
      async releaseMigrationLock(a, b) {}
    }
    a.s(["SqliteAdapter", () => c])
  },
  93695,
  (a, b, c) => {
    b.exports = a.x("next/dist/shared/lib/no-fallback-error.external.js", () =>
      require("next/dist/shared/lib/no-fallback-error.external.js")
    )
  },
  44665,
  (a) => {
    a.n(a.i(28992))
  },
  15447,
  (a) => {
    a.n(a.i(6179))
  },
  98727,
  (a) => {
    a.n(a.i(53263))
  },
  12858,
  (a) => {
    a.n(a.i(66713))
  },
  62157,
  (a) => {
    a.n(a.i(67466))
  },
  54001,
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
  95241,
  (a, b, c) => {
    let { createClientModuleProxy: d } = a.r(72527)
    a.n(
      d(
        "[project]/node_modules/.bun/next@16.1.6+7492c01c6988791b/node_modules/next/dist/client/app-dir/link.js <module evaluation>"
      )
    )
  },
  48676,
  (a, b, c) => {
    let { createClientModuleProxy: d } = a.r(72527)
    a.n(
      d(
        "[project]/node_modules/.bun/next@16.1.6+7492c01c6988791b/node_modules/next/dist/client/app-dir/link.js"
      )
    )
  },
  61267,
  (a) => {
    "use strict"
    a.i(95241)
    var b = a.i(48676)
    a.n(b)
  },
  1929,
  (a, b, c) => {
    "use strict"
    Object.defineProperty(c, "__esModule", { value: !0 })
    var d = {
      default: function () {
        return i
      },
      useLinkStatus: function () {
        return h.useLinkStatus
      },
    }
    for (var e in d) Object.defineProperty(c, e, { enumerable: !0, get: d[e] })
    let f = a.r(54001),
      g = a.r(42222),
      h = f._(a.r(61267))
    function i(a) {
      let b = a.legacyBehavior,
        c =
          "string" == typeof a.children ||
          "number" == typeof a.children ||
          "string" == typeof a.children?.type,
        d = a.children?.type?.$$typeof === Symbol.for("react.client.reference")
      return (
        !b ||
          c ||
          d ||
          (a.children?.type?.$$typeof === Symbol.for("react.lazy")
            ? console.error(
                "Using a Lazy Component as a direct child of `<Link legacyBehavior>` from a Server Component is not supported. If you need legacyBehavior, wrap your Lazy Component in a Client Component that renders the Link's `<a>` tag."
              )
            : console.error(
                "Using a Server Component as a direct child of `<Link legacyBehavior>` is not supported. If you need legacyBehavior, wrap your Server Component in a Client Component that renders the Link's `<a>` tag."
              )),
        (0, g.jsx)(h.default, { ...a })
      )
    }
    ;("function" == typeof c.default ||
      ("object" == typeof c.default && null !== c.default)) &&
      void 0 === c.default.__esModule &&
      (Object.defineProperty(c.default, "__esModule", { value: !0 }),
      Object.assign(c.default, c),
      (b.exports = c.default))
  },
  16132,
  (a) => {
    "use strict"
    a.s(["default", () => b])
    let b = (0, a.i(72527).registerClientReference)(
      function () {
        throw Error(
          "Attempted to call the default export of [project]/node_modules/.bun/lucide-react@1.21.0+e14d3f224186685e/node_modules/lucide-react/dist/esm/Icon.mjs <module evaluation> from the server, but it's on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component."
        )
      },
      "[project]/node_modules/.bun/lucide-react@1.21.0+e14d3f224186685e/node_modules/lucide-react/dist/esm/Icon.mjs <module evaluation>",
      "default"
    )
  },
  33140,
  (a) => {
    "use strict"
    a.s(["default", () => b])
    let b = (0, a.i(72527).registerClientReference)(
      function () {
        throw Error(
          "Attempted to call the default export of [project]/node_modules/.bun/lucide-react@1.21.0+e14d3f224186685e/node_modules/lucide-react/dist/esm/Icon.mjs from the server, but it's on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component."
        )
      },
      "[project]/node_modules/.bun/lucide-react@1.21.0+e14d3f224186685e/node_modules/lucide-react/dist/esm/Icon.mjs",
      "default"
    )
  },
  81901,
  (a) => {
    "use strict"
    a.i(16132)
    var b = a.i(33140)
    a.n(b)
  },
  69216,
  (a) => {
    "use strict"
    var b = a.i(52913)
    let c = (a) => {
      let b = a.replace(/^([A-Z])|[\s-_]+(\w)/g, (a, b, c) =>
        c ? c.toUpperCase() : b.toLowerCase()
      )
      return b.charAt(0).toUpperCase() + b.slice(1)
    }
    var d = a.i(81901)
    let e = (a, e) => {
      let f = (0, b.forwardRef)(({ className: f, ...g }, h) =>
        (0, b.createElement)(d.default, {
          ref: h,
          iconNode: e,
          className: ((...a) =>
            a
              .filter((a, b, c) => !!a && "" !== a.trim() && c.indexOf(a) === b)
              .join(" ")
              .trim())(
            `lucide-${c(a)
              .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
              .toLowerCase()}`,
            `lucide-${a}`,
            f
          ),
          ...g,
        })
      )
      return ((f.displayName = c(a)), f)
    }
    a.s(["default", () => e], 69216)
  },
  21127,
  (a) => {
    "use strict"
    let b = (0, a.i(69216).default)("lock", [
      [
        "rect",
        {
          width: "18",
          height: "11",
          x: "3",
          y: "11",
          rx: "2",
          ry: "2",
          key: "1w4ew1",
        },
      ],
      ["path", { d: "M7 11V7a5 5 0 0 1 10 0v4", key: "fwvmzm" }],
    ])
    a.s(["Lock", () => b], 21127)
  },
  86835,
  (a) => {
    "use strict"
    let b = (0, a.i(69216).default)("users", [
      [
        "path",
        { d: "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2", key: "1yyitq" },
      ],
      ["path", { d: "M16 3.128a4 4 0 0 1 0 7.744", key: "16gr8j" }],
      ["path", { d: "M22 21v-2a4 4 0 0 0-3-3.87", key: "kshegd" }],
      ["circle", { cx: "9", cy: "7", r: "4", key: "nufk8" }],
    ])
    a.s(["Users", () => b], 86835)
  },
  86654,
  (a) => {
    "use strict"
    let b = (0, a.i(69216).default)("globe", [
      ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
      [
        "path",
        { d: "M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20", key: "13o1zl" },
      ],
      ["path", { d: "M2 12h20", key: "9i4pu4" }],
    ])
    a.s(["Globe", () => b], 86654)
  },
  90865,
  (a) => {
    "use strict"
    a.s(["SignOutButton", () => b])
    let b = (0, a.i(72527).registerClientReference)(
      function () {
        throw Error(
          "Attempted to call SignOutButton() from the server but SignOutButton is on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component."
        )
      },
      "[project]/apps/web/components/sign-out-button.tsx <module evaluation>",
      "SignOutButton"
    )
  },
  64362,
  (a) => {
    "use strict"
    a.s(["SignOutButton", () => b])
    let b = (0, a.i(72527).registerClientReference)(
      function () {
        throw Error(
          "Attempted to call SignOutButton() from the server but SignOutButton is on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component."
        )
      },
      "[project]/apps/web/components/sign-out-button.tsx",
      "SignOutButton"
    )
  },
  45743,
  (a) => {
    "use strict"
    a.i(90865)
    var b = a.i(64362)
    a.n(b)
  },
  77739,
  (a) =>
    a.a(async (b, c) => {
      try {
        var d = a.i(42222),
          e = a.i(1929),
          f = a.i(21127),
          g = a.i(86835),
          h = a.i(86654),
          i = a.i(39548),
          j = a.i(40700),
          k = a.i(45743),
          l = a.i(48874),
          m = a.i(83602),
          n = b([i, j, m])
        ;[i, j, m] = n.then ? (await n)() : n
        let p = { private: f.Lock, shared: g.Users, public: h.Globe }
        async function o() {
          let a = await (0, i.getPrincipal)(),
            b = await m.auth.api.getSession({
              headers: await (0, l.headers)(),
            }),
            c = b?.user?.email ?? null,
            f = (0, i.isOwnerEmail)(c),
            g = await (0, j.listDocsFor)(a)
          return (0, d.jsxs)("main", {
            className: "mx-auto max-w-3xl px-4 py-12",
            children: [
              (0, d.jsxs)("div", {
                className: "mb-8 flex items-center justify-between",
                children: [
                  (0, d.jsx)("h1", {
                    className: "text-2xl font-bold tracking-tight",
                    children: "Pad",
                  }),
                  (0, d.jsx)("div", {
                    className:
                      "flex items-center gap-3 text-sm text-muted-foreground",
                    children: c
                      ? (0, d.jsxs)(d.Fragment, {
                          children: [
                            (0, d.jsx)("span", { children: c }),
                            f &&
                              (0, d.jsx)("span", {
                                className:
                                  "rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary",
                                children: "擁有者",
                              }),
                            (0, d.jsx)(k.SignOutButton, {}),
                          ],
                        })
                      : (0, d.jsx)(e.default, {
                          href: "/login",
                          className:
                            "rounded-md px-3 py-1.5 text-sm ring-1 ring-border hover:bg-muted transition-colors",
                          children: "登入",
                        }),
                  }),
                ],
              }),
              0 === g.length
                ? (0, d.jsx)("p", {
                    className: "text-muted-foreground",
                    children: "目前沒有可閱讀的文件。",
                  })
                : (0, d.jsx)("ul", {
                    className: "divide-y divide-border rounded-lg border",
                    children: g.map((a) => {
                      let b = p[a.visibility]
                      return (0, d.jsx)(
                        "li",
                        {
                          children: (0, d.jsxs)(e.default, {
                            href: `/d/${a.id}`,
                            className:
                              "flex items-center gap-3 px-4 py-3 hover:bg-muted/50 transition-colors",
                            children: [
                              (0, d.jsx)(b, {
                                className:
                                  "h-4 w-4 shrink-0 text-muted-foreground",
                              }),
                              (0, d.jsx)("span", {
                                className: "flex-1 font-medium",
                                children: a.title,
                              }),
                              (0, d.jsx)("span", {
                                className: "text-xs text-muted-foreground",
                                children: new Date(
                                  a.updatedAt
                                ).toLocaleDateString("zh-TW"),
                              }),
                            ],
                          }),
                        },
                        a.id
                      )
                    }),
                  }),
            ],
          })
        }
        ;(a.s(["default", () => o]), c())
      } catch (a) {
        c(a)
      }
    }, !1),
  72368,
  (a) => {
    a.v((b) =>
      Promise.all(
        [
          "server/chunks/ssr/26bb7_@better-auth_memory-adapter_dist_index_mjs_ec0937c4._.js",
        ].map((b) => a.l(b))
      ).then(() => b(17654))
    )
  },
  49127,
  (a) => {
    a.v((b) =>
      Promise.all(
        [
          "server/chunks/ssr/3f1dc_better-auth_dist_adapters_kysely-adapter_index_mjs_7e5d9d70._.js",
        ].map((b) => a.l(b))
      ).then(() => b(49915))
    )
  },
  80632,
  (a) => {
    a.v((a) => Promise.resolve().then(() => a(70406)))
  },
  67282,
  (a) => {
    a.v((b) =>
      Promise.all(
        [
          "server/chunks/ssr/e426d_@better-auth_kysely-adapter_dist_0527c70b._.js",
        ].map((b) => a.l(b))
      ).then(() => b(47231))
    )
  },
  51728,
  (a) => {
    a.v((b) =>
      Promise.all(
        [
          "server/chunks/ssr/e426d_@better-auth_kysely-adapter_dist_cc4eb718._.js",
        ].map((b) => a.l(b))
      ).then(() => b(94e3))
    )
  },
  61202,
  (a) => {
    a.v((b) =>
      Promise.all(
        [
          "server/chunks/ssr/e426d_@better-auth_kysely-adapter_dist_a41eddc6._.js",
        ].map((b) => a.l(b))
      ).then(() => b(17033))
    )
  },
  80108,
  (a) => {
    a.v((a) => Promise.resolve().then(() => a(48874)))
  },
]

//# sourceMappingURL=%5Broot-of-the-server%5D__d2418baa._.js.map
