module.exports = [
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
  87175,
  (a) => {
    "use strict"
    a.s(["LoginButton", () => b])
    let b = (0, a.i(72527).registerClientReference)(
      function () {
        throw Error(
          "Attempted to call LoginButton() from the server but LoginButton is on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component."
        )
      },
      "[project]/apps/web/components/login-button.tsx <module evaluation>",
      "LoginButton"
    )
  },
  76390,
  (a) => {
    "use strict"
    a.s(["LoginButton", () => b])
    let b = (0, a.i(72527).registerClientReference)(
      function () {
        throw Error(
          "Attempted to call LoginButton() from the server but LoginButton is on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component."
        )
      },
      "[project]/apps/web/components/login-button.tsx",
      "LoginButton"
    )
  },
  14131,
  (a) => {
    "use strict"
    a.i(87175)
    var b = a.i(76390)
    a.n(b)
  },
  56328,
  (a) => {
    "use strict"
    var b = a.i(42222),
      c = a.i(52913),
      d = a.i(14131)
    function e() {
      return (0, b.jsx)("main", {
        className: "flex min-h-screen items-center justify-center",
        children: (0, b.jsxs)("div", {
          className: "w-full max-w-sm rounded-xl border p-8 shadow-sm",
          children: [
            (0, b.jsx)("h1", {
              className: "mb-2 text-xl font-bold",
              children: "登入 Pad",
            }),
            (0, b.jsx)("p", {
              className: "mb-6 text-sm text-muted-foreground",
              children: "使用 Google 帳號登入以留言。",
            }),
            (0, b.jsx)(c.Suspense, { children: (0, b.jsx)(d.LoginButton, {}) }),
          ],
        }),
      })
    }
    a.s([
      "default",
      () => e,
      "metadata",
      0,
      { title: "登入", robots: { index: !1 } },
    ])
  },
]

//# sourceMappingURL=%5Broot-of-the-server%5D__8cc0f115._.js.map
