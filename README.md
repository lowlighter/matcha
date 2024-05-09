# 🍵 matcha.css

<img src="/app/icons/matchat.svg" width="300" align="center">

**matcha.css** is a pure CSS library that directly styles HTML elements akin to a default browser stylesheet, rather than requiring users to patch their documents with classes.

It is perfect for fast prototyping, Markdown-generated or static HTML pages, developers who don't want to bother with CSS, or want to use more than [`<div> and <span>`](https://developer.mozilla.org/docs/Web/HTML/Element) in their documents, etc.

- ✅ **No** build steps
- ✅ **No** dependencies
- ✅ **No** JavaScript
- ✅ **No** configuration needed
- ✅ **No** refactoring needed

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="/.github/demo-dark-a.png">
  <img alt="" src="/.github/demo-light-a.png" width="500">
</picture>
<picture>
  <source media="(prefers-color-scheme: dark)" srcset="/.github/demo-dark-b.png">
  <img alt="" src="/.github/demo-light-b.png" width="500">
</picture>
<picture>
  <source media="(prefers-color-scheme: dark)" srcset="/.github/demo-dark-c.png">
  <img alt="" src="/.github/demo-light-c.png" width="500">
</picture>

## 🥢 Why choose **matcha.css** ?

### 🍜 Agnostic

Works with any document and cover a larger range of HTML elements than most other similar libraries.
Remains unobstrusive by making clever usage of CSS pseudo-elements and support a wide range of browsers

### 🍥 Reversible

Simply include its `<link rel="stylesheet">` to get started, and remove it if you don't want to use it anymore.
No need to refactor or clean your document thereafter.

### 🍡 Semantic

Styling adapts to elements hierarchy.
For example, nesting `<menu>` elements will implicitely « create » submenus, a `<label>` with an `<input required>` has an `*` indicator prepended, etc.

### 🍱 Customizable

Brew your own build using our [custom builder](https://matcha.mizu.sh/#custom-build) to select which features you want to include and reduce the final build size.

### 🍘 Open-source

Released under the [MIT License](/LICENSE), source code is available at [github.com/lowlighter/matcha](https://github.com/lowlighter/matcha).

## 📖 Usage

To use **matcha.css**, simply include the following in your document `<head>`. That's it.

```html
<link rel="stylesheet" href="https://matcha.mizu.sh/matcha.css">
```
          
