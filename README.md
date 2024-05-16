# 🍵 matcha.css

[`🌊 See live on matcha.mizu.sh !`](https://matcha.mizu.sh)

<p align="center"><img src="/app/icons/matchat.svg" width="300"></p>

**matcha.css** is a pure CSS library designed to style HTML elements similarly to a default browser stylesheet, eliminating the need for users to manually patch their documents.

Ideal for fast prototyping, static HTML pages, Markdown-generated documents, and developers seeking to streamline their workflow without delving into CSS intricacies and want to make use of
[the full range of available HTML elements](https://developer.mozilla.org/docs/Web/HTML/Element).

- ✅ **No** build steps
- ✅ **No** dependencies
- ✅ **No** JavaScript
- ✅ **No** configuration needed
- ✅ **No** refactoring required
- ✅ `~6kB` gzipped _(can be further reduced)_

### 📸 Screenshot examples

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="/.github/demo-dark-a.png">
  <img alt="" src="/.github/demo-light-a.png" width="400">
</picture>
<picture>
  <source media="(prefers-color-scheme: dark)" srcset="/.github/demo-dark-b.png">
  <img alt="" src="/.github/demo-light-b.png" width="400">
</picture>
<picture>
  <source media="(prefers-color-scheme: dark)" srcset="/.github/demo-dark-c.png">
  <img alt="" src="/.github/demo-light-c.png" width="400">
</picture>
<picture>
  <source media="(prefers-color-scheme: dark)" srcset="/.github/demo-dark-d.png">
  <img alt="" src="/.github/demo-light-d.png" width="400">
</picture>

## 🥢 Why choose **matcha.css**?

### 🍜 Agnostic

Works seamlessly with any document and covers a broader range of HTML elements compared to similar libraries. It remains unobtrusive by leveraging CSS pseudo-elements and offers extensive
[browser support](https://matcha.mizu.sh/#supported-browsers).

### 🍥 Reversible

Simply include its `<link rel="stylesheet">` to get started, and remove it whenever necessary without the need for document refactoring or cleanup.

### 🍡 Semantic

Adapts styling based on elements hierarchy, providing intuitive behaviors such as "implicit submenus" when nesting `<menu>` elements, required field indicator (`*`) when a `<label>` is paired with
`<input required>`, etc.

### 🍱 Customizable

Brew your own build using our [custom builder](https://matcha.mizu.sh/#custom-build) to select specific features and reduce the final build size according to your project's needs.

### 🍘 Open-source

Released under the [MIT License](/LICENSE), freely available at [github.com/lowlighter/matcha](https://github.com/lowlighter/matcha).

## 📖 Usage

To utilize **matcha.css**, just include the following line in the `<head>` section of your document. It's that simple!

```html
<link rel="stylesheet" href="https://matcha.mizu.sh/matcha.css">
```

# 📜 License

```
MIT License
Copyright (c) 2024-present Simon Lecoq (lowlighter)
```
