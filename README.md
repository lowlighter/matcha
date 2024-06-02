# 🍵 matcha.css

[`🌊 See live on matcha.mizu.sh !`](https://matcha.mizu.sh)
[![npm](https://img.shields.io/npm/v/@lowlighter%2Fmatcha?logo=npm&labelColor=cb0000&color=black)](https://www.npmjs.com/package/@lowlighter/matcha)

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

### 🍴 À la carte

Each subdirectory listed in [`/styles`](/styles) directory is also directly served from [matcha.mizu.sh](https://matcha.mizu.sh). For example, if you only wish to include the
[`@syntax-highlighting`](/styles/@syntax-highlighting/mod.css) styles rather than using the default build or a custom one, you could use:

```html
<link rel="stylesheet" href="https://matcha.mizu.sh/styles/@syntax-highlighting/mod.css">
```

However note that unless you provide your own CSS variables, you will most likely need to include the [`@root`](/styles/@root/mod.css) package as it contains all matcha.css variables definition.

> All `mod.css` files are also aliased to their respective parent directories for convenience, which means you can also use:
>
> ```html
> <link rel="stylesheet" href="https://matcha.mizu.sh/@syntax-highlighting.css">
> ```

## 🫰 Contributing

### 🎌 Project scope

- Respect accessibility and usability best practices
- Respect end-users' preferences _(e.g., color scheme)_
- Be desktop and mobile friendly
- Not drastically change its current styling _(unless to fulfill one of the previous mentioned principles)_
- Remain lightweight, modular and customizable
  - Additional features considered as "bloat" will be excluded by default and will be opt-in
  - `!important` rules will never be used to ensure users can easily override styles

### 📂 Project structure

This project is separated into three main directories:

- `/api` for serverless functions run on [Vercel](https://vercel.com)
- `/app` for entry points, static assets, and build scripts
- `/styles` for CSS source files

### 🎨 About `/styles` directory

Each subdirectory within this folder is intended to be mostly self-contained and scoped. It helps to keep the codebase organized while also allows users to cherry-pick specific features and create
custom builds.

Extra features should be prefixed using the character `@` and should most likely be excluded by default in the builder to avoid bloating the default build.

### 🧑‍💻 Development lifecycle

When submitting a pull request, the preview will be available on [Vercel](https://vercel.com). Maintainers and other contributors can review the changes and provide feedback before merging.

Local development is intended to be done using the [deno](https://deno.com) runtime. If you do not wish to install it, you can also use the provided [devcontainer](/.devcontainer) configuration to run
the project in a containerized environment or directly on [GitHub Codespaces](https://github.com/features/codespaces).

To start the development server, run the following command:

```sh
deno task serve
```

Before submitting your changes, ensure everything is correctly formatted by running the following command:

```sh
deno task fmt
```

# 📜 License

```
MIT License
Copyright (c) 2024-present Simon Lecoq (lowlighter)
```
