# Products Markdown Project Management System (`products-md`)

`products-md` is a central **Submodule & Sparse-Checkout Aggregator** for managing products under [`@fromsukong`](https://github.com/fromsukong).

---

## 🏛️ Submodule & Sparse-Checkout Architecture

Each codebase repository (e.g. `ously-core`, `ously-cli`, `fromsukong.com`, `products-md`) contains a dedicated singular **`product/`** folder containing its technical spec:

```
<repo-name>/ (Codebase Repository)
├── product/            <-- Targeted by sparse checkout in products-md
│   └── spec.md         # Repository specification
├── src/                # Codebase source code (excluded from products-md)
└── package.json
```

---

## ⚡ How `products-md` Pulls ONLY the `product/` Folder

`products-md` adds each codebase as a Git Submodule with **Git Sparse-Checkout** configured to pull **ONLY `product/`**:

```bash
./scripts/setup-submodules.sh <repo-name> <git-url>

# Example:
./scripts/setup-submodules.sh ously-core https://github.com/fromsukong/ously-core.git
```

This ensures `products-md` **only checks out `repos/<repo-name>/product/`**, leaving all source code (`src/`, `node_modules/`, `dist/`) completely un-checked out.

---

## 🤖 AI Agent Helper CLI (`scripts/agent-helper.js`)

AI agents can inspect product PRDs and submodule `product/` folders programmatically:

```bash
# 1. Get complete product-to-submodule graph
node scripts/agent-helper.js graph

# 2. Inspect a specific product and its mapped submodules
node scripts/agent-helper.js get-product ously
```

---

## 📂 System Directory Structure

```
products-md/
├── README.md                      # System guidelines & Sparse Checkout guide
├── scripts/
│   ├── agent-helper.js            # AI Agent CLI tool
│   └── setup-submodules.sh        # Submodule setup script targeting product/ folder
├── products/                      # High-Level Product PRDs (products/<product>/prd.md)
│   ├── ously/prd.md
│   ├── project-management/prd.md
│   └── personal-brand/prd.md
├── product/                       # Local Repo Spec for products-md itself
│   └── spec.md
└── repos/                         # Submodules (Sparse-checked out to repos/<name>/product/)
    ├── ously-core/product/
    ├── ously-cli/product/
    ├── ously-landing/product/
    ├── products-web/product/
    └── fromsukong.com/product/
```