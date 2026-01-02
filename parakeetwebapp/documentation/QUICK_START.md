# 🚀 Quick Start Guide - GitHub Wiki Setup

## Overview

Your documentation is now organized into folders. This guide will help you quickly add everything to your GitHub Wiki.

---

## 📁 Current Organization

```
documentation/
├── 01-Core-Documentation/          # 5 files - Essential docs
├── 02-Architecture-Design/        # 3 files - Architecture diagrams
├── 03-AI-RAG/                     # 7 files - AI & RAG docs
├── 04-Development-Guides/         # 5 files - Dev guides
├── 05-State-Management/           # 2 files - Redux docs
├── README.md                      # Main readme
├── GITHUB_WIKI_SETUP_GUIDE.md    # Detailed guide
├── copy-to-wiki.sh                # Automated script
└── QUICK_START.md                 # This file
```

---

## ⚡ Quick Setup (3 Steps)

### Step 1: Enable Wiki on GitHub

1. Go to your GitHub repository
2. Click **Settings** → Scroll to **Features**
3. ✅ Check **Wikis** → Click **Save**

### Step 2: Clone Wiki Repository

```bash
# Replace with your actual username and repo name
git clone https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.wiki.git
cd YOUR_REPO_NAME.wiki
```

### Step 3: Run the Copy Script

```bash
# Navigate to documentation folder
cd /Users/roquereblando/ParakeetRoqueReblando/ParakeetWebApp/documentation

# Edit the script and update WIKI_DIR path (line 9)
# Then run:
bash copy-to-wiki.sh
```

**Or manually copy files** (see `GITHUB_WIKI_SETUP_GUIDE.md` for details)

---

## 📤 Push to GitHub

```bash
cd YOUR_REPO_NAME.wiki
git add .
git commit -m "Add complete documentation to wiki"
git push origin master  # or 'main' if that's your default branch
```

---

## ✅ Verify

1. Go to your repository on GitHub
2. Click the **Wiki** tab
3. You should see all your documentation pages
4. Sidebar navigation should appear on the right

---

## 📚 What Gets Created

The script automatically:

- ✅ Copies all 22 documentation files
- ✅ Creates `Home.md` (main entry point)
- ✅ Creates `_Sidebar.md` (navigation menu)
- ✅ Renames files to wiki-friendly names (hyphens, not spaces)

---

## 🆘 Need Help?

See **GITHUB_WIKI_SETUP_GUIDE.md** for:

- Detailed step-by-step instructions
- Troubleshooting guide
- Manual copy commands
- Wiki naming conventions
- Best practices

---

## 📝 Important Notes

1. **GitHub Wiki doesn't support folders** - Files are flattened with descriptive names
2. **Page names use hyphens** - `System-Requirements.md` not `System Requirements.md`
3. **Links use brackets** - `[[Page-Name|Display Text]]` syntax
4. **Sidebar is automatic** - `_Sidebar.md` creates the navigation menu

---

## 🎯 File Mapping

| Source File                         | Wiki Page Name            |
| ----------------------------------- | ------------------------- |
| DOCUMENTATION_INDEX.md              | Home.md                   |
| SYSTEM_REQUIREMENTS.md              | System-Requirements.md    |
| USER_GUIDE.md                       | User-Guide.md             |
| TEST_CASES.md                       | Test-Cases.md             |
| SYSTEM_DOCUMENTATION.md             | System-Documentation.md   |
| APPLICATION_ARCHITECTURE_DIAGRAM.md | Architecture-Diagram.md   |
| AI_CHATBOT_RAG_DIAGRAM.md           | AI-Chatbot-RAG-Diagram.md |
| ...                                 | ...                       |

_See `GITHUB_WIKI_SETUP_GUIDE.md` for complete mapping_

---

**That's it!** Your documentation will be viewable in GitHub Wiki. 🎉
