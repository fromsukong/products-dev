#!/usr/bin/env node

/**
 * AI Agent Helper Script for `products-md`
 * 
 * Inspects high-level product specifications (`products/`) and submodule repository specifications/tasks (`repos/<repo-name>/product/` & `product/`).
 * 
 * Usage:
 *   node scripts/agent-helper.js graph
 *   node scripts/agent-helper.js list-products
 *   node scripts/agent-helper.js get-product <product-name>
 */

const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '..');
const PRODUCTS_DIR = path.join(ROOT_DIR, 'products');
const REPOS_DIR = path.join(ROOT_DIR, 'repos');
const LOCAL_PRODUCT_DIR = path.join(ROOT_DIR, 'product');

// Utility: Helper to parse YAML Frontmatter
function parseFrontmatter(fileContent) {
  const frontmatterRegex = /^---\r?\n([\s\S]*?)\r?\n---/;
  const match = fileContent.match(frontmatterRegex);
  if (!match) return {};
  
  const yamlBlock = match[1];
  const metadata = {};
  yamlBlock.split('\n').forEach(line => {
    const colonIdx = line.indexOf(':');
    if (colonIdx !== -1) {
      const key = line.slice(0, colonIdx).trim();
      let value = line.slice(colonIdx + 1).trim();
      if (value.startsWith('[') && value.endsWith(']')) {
        value = value.slice(1, -1).split(',').map(v => v.trim()).filter(Boolean);
      } else {
        value = value.replace(/^['"]|['"]$/g, '');
      }
      metadata[key] = value;
    }
  });
  return metadata;
}

// Utility: Extract Repositories Table from PRD markdown
function parseReposFromPRD(prdContent) {
  const repos = [];
  const lines = prdContent.split('\n');
  let inTable = false;

  for (const line of lines) {
    if (line.includes('| Repository Name |') || line.includes('| Repository |')) {
      inTable = true;
      continue;
    }
    if (inTable) {
      if (line.trim().startsWith('| ---') || line.trim().startsWith('|---')) continue;
      if (!line.trim().startsWith('|')) {
        inTable = false;
        continue;
      }
      const cells = line.split('|').map(c => c.trim()).filter(Boolean);
      if (cells.length > 0) {
        const rawRepo = cells[0].replace(/[`']/g, '');
        if (rawRepo && rawRepo !== 'Repository Name' && rawRepo !== 'Repository') {
          repos.push({
            name: rawRepo,
            role: cells[1] || '',
            tech_stack: cells[2] || '',
            github_url: cells[3] ? cells[3].replace(/.*?\((.*?)\).*/, '$1') : ''
          });
        }
      }
    }
  }
  return repos;
}

// Utility: Read Tasks from Submodule or Local Directory
function getRepoTasks(repoName) {
  let tasksDir;
  if (repoName === 'products-md') {
    tasksDir = path.join(LOCAL_PRODUCT_DIR, 'task');
  } else {
    const repoDir = path.join(REPOS_DIR, repoName);
    tasksDir = path.join(repoDir, 'product', 'task');
    if (!fs.existsSync(tasksDir)) {
      tasksDir = path.join(repoDir, 'product', 'tasks');
    }
  }

  const activeDir = path.join(tasksDir, 'active');
  const archiveDir = path.join(tasksDir, 'archive');

  const readDir = (dir, status) => {
    if (!fs.existsSync(dir)) return [];
    return fs.readdirSync(dir).filter(f => f.endsWith('.md')).map(file => {
      const content = fs.readFileSync(path.join(dir, file), 'utf8');
      const fm = parseFrontmatter(content);
      const relPath = repoName === 'products-md' 
        ? `product/task/${status}/${file}`
        : `repos/${repoName}/product/task/${status}/${file}`;
      return {
        file: file,
        path: relPath,
        id: fm.id || '',
        title: fm.title || '',
        status: fm.status || status,
        priority: fm.priority || 'Medium',
        repo: repoName,
        related_tasks: Array.isArray(fm.related_tasks) ? fm.related_tasks : []
      };
    });
  };

  return {
    active: readDir(activeDir, 'active'),
    archive: readDir(archiveDir, 'archive')
  };
}

// Command: List Products
function getProducts() {
  if (!fs.existsSync(PRODUCTS_DIR)) return [];
  const productFolders = fs.readdirSync(PRODUCTS_DIR).filter(f => fs.statSync(path.join(PRODUCTS_DIR, f)).isDirectory());
  
  return productFolders.map(productName => {
    const prdPath = path.join(PRODUCTS_DIR, productName, 'prd.md');
    let repos = [];
    let title = productName;

    if (fs.existsSync(prdPath)) {
      const content = fs.readFileSync(prdPath, 'utf8');
      repos = parseReposFromPRD(content);
      const titleMatch = content.match(/^#\s+(.*)/m);
      if (titleMatch) title = titleMatch[1].trim();
    }

    return {
      product: productName,
      title: title,
      prd_path: `products/${productName}/prd.md`,
      repositories: repos.map(r => {
        const isLocal = r.name === 'products-md';
        return {
          ...r,
          submodule_path: isLocal ? 'product/' : `repos/${r.name}`,
          sparse_folder: isLocal ? 'product/' : `repos/${r.name}/product/`,
          spec_file: isLocal ? 'product/spec.md' : `repos/${r.name}/product/spec.md`,
          task_dir: isLocal ? 'product/task/' : `repos/${r.name}/product/task/`,
          is_initialized: isLocal ? fs.existsSync(LOCAL_PRODUCT_DIR) : fs.existsSync(path.join(REPOS_DIR, r.name, 'product'))
        };
      })
    };
  });
}

// Command: Full Graph
function buildGraph() {
  const products = getProducts();
  return {
    timestamp: new Date().toISOString(),
    architecture: 'Submodule Sparse-Checkout Aggregator (singular product/ folder target)',
    sparse_checkout_target: 'product/',
    products: products.map(p => ({
      ...p,
      repositories: p.repositories.map(r => {
        const tasks = getRepoTasks(r.name);
        return {
          ...r,
          active_tasks: tasks.active,
          archived_tasks: tasks.archive
        };
      })
    }))
  };
}

// CLI Argument Handler
function main() {
  const args = process.argv.slice(2);
  const command = args[0] || 'graph';

  switch (command) {
    case 'graph':
      console.log(JSON.stringify(buildGraph(), null, 2));
      break;

    case 'list-products':
      console.log(JSON.stringify(getProducts(), null, 2));
      break;

    case 'get-product': {
      const productName = args[1];
      if (!productName) {
        console.error('Error: Please provide product name. Example: node scripts/agent-helper.js get-product ously');
        process.exit(1);
      }
      const products = getProducts();
      const product = products.find(p => p.product === productName);
      if (!product) {
        console.error(`Product "${productName}" not found.`);
        process.exit(1);
      }
      console.log(JSON.stringify(product, null, 2));
      break;
    }

    default:
      console.log(`
AI Agent Helper CLI

Commands:
  node scripts/agent-helper.js graph               Outputs complete product-to-submodule graph (JSON)
  node scripts/agent-helper.js list-products        Lists all products and their mapped submodules
  node scripts/agent-helper.js get-product <name>   Gets product PRD details & submodule state
      `);
      break;
  }
}

main();
