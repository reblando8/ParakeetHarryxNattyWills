# 📚 GitHub Wiki Setup Guide

## How to Add Documentation to GitHub Wiki

GitHub Wiki is a separate git repository that uses markdown files. This guide will help you add all your documentation files to your GitHub Wiki.

---

## ⚠️ Important: GitHub Wiki Limitations

**GitHub Wiki does NOT support folders/subdirectories directly.** However, you can use naming conventions to organize pages. We'll use a flat structure with descriptive names.

---

## 📋 Step-by-Step Instructions

### Step 1: Enable Wiki on Your Repository

1. Go to your GitHub repository
2. Click on **Settings** (top menu)
3. Scroll down to **Features** section
4. Check the box for **Wikis**
5. Click **Save**

### Step 2: Clone the Wiki Repository

GitHub automatically creates a wiki repository when you enable it. The wiki repository URL is:

```
https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.wiki.git
```

**In your terminal:**

```bash
# Navigate to where you want to clone the wiki
cd ~/Desktop  # or wherever you prefer

# Clone the wiki repository
git clone https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.wiki.git

# Navigate into the wiki directory
cd YOUR_REPO_NAME.wiki
```

**Note:** Replace `YOUR_USERNAME` and `YOUR_REPO_NAME` with your actual GitHub username and repository name.

---

### Step 3: Copy Documentation Files to Wiki

Since GitHub Wiki uses a flat structure, we'll copy files with organized naming:

```bash
# From your project directory, navigate to documentation folder
cd /Users/roquereblando/ParakeetRoqueReblando/ParakeetWebApp/documentation

# Copy Core Documentation files
cp "01-Core-Documentation/DOCUMENTATION_INDEX.md" ~/Desktop/YOUR_REPO_NAME.wiki/Home.md
cp "01-Core-Documentation/SYSTEM_REQUIREMENTS.md" ~/Desktop/YOUR_REPO_NAME.wiki/System-Requirements.md
cp "01-Core-Documentation/USER_GUIDE.md" ~/Desktop/YOUR_REPO_NAME.wiki/User-Guide.md
cp "01-Core-Documentation/TEST_CASES.md" ~/Desktop/YOUR_REPO_NAME.wiki/Test-Cases.md
cp "01-Core-Documentation/SYSTEM_DOCUMENTATION.md" ~/Desktop/YOUR_REPO_NAME.wiki/System-Documentation.md

# Copy Architecture & Design files
cp "02-Architecture-Design/APPLICATION_ARCHITECTURE_DIAGRAM.md" ~/Desktop/YOUR_REPO_NAME.wiki/Architecture-Diagram.md
cp "02-Architecture-Design/AI_CHATBOT_RAG_DIAGRAM.md" ~/Desktop/YOUR_REPO_NAME.wiki/AI-Chatbot-RAG-Diagram.md
cp "02-Architecture-Design/PRESENTATION_PART3_WEB_APP_DESIGN.md" ~/Desktop/YOUR_REPO_NAME.wiki/Web-App-Design.md

# Copy AI & RAG files
cp "03-AI-RAG/PRESENTATION_PART1_AI_CHATBOT.md" ~/Desktop/YOUR_REPO_NAME.wiki/AI-Chatbot.md
cp "03-AI-RAG/PRESENTATION_PART2_RAG.md" ~/Desktop/YOUR_REPO_NAME.wiki/RAG-System.md
cp "03-AI-RAG/HOW_RAG_CONTEXT_AWARENESS_WORKS.md" ~/Desktop/YOUR_REPO_NAME.wiki/RAG-Context-Awareness.md
cp "03-AI-RAG/RAG_BENEFITS_SUMMARY.md" ~/Desktop/YOUR_REPO_NAME.wiki/RAG-Benefits.md
cp "03-AI-RAG/RAG_EXPLAINED.md" ~/Desktop/YOUR_REPO_NAME.wiki/RAG-Explained.md
cp "03-AI-RAG/RAG_INTEGRATION_EXPLANATION.md" ~/Desktop/YOUR_REPO_NAME.wiki/RAG-Integration.md
cp "03-AI-RAG/RAG_VS_DATABASE_EXPLANATION.md" ~/Desktop/YOUR_REPO_NAME.wiki/RAG-vs-Database.md

# Copy Development Guides
cp "04-Development-Guides/BUILD_PROCESS_GUIDE.md" ~/Desktop/YOUR_REPO_NAME.wiki/Build-Process.md
cp "04-Development-Guides/APPLICATION_OVERVIEW.md" ~/Desktop/YOUR_REPO_NAME.wiki/Application-Overview.md
cp "04-Development-Guides/HOW_PARAKET_ACHIEVES_VISION.md" ~/Desktop/YOUR_REPO_NAME.wiki/Vision-Achievement.md
cp "04-Development-Guides/TECHNICAL_CHALLENGES_AND_RAG_EXPLANATION.md" ~/Desktop/YOUR_REPO_NAME.wiki/Technical-Challenges.md
cp "04-Development-Guides/USER_COUNT_EXPLANATION.md" ~/Desktop/YOUR_REPO_NAME.wiki/User-Count-Explanation.md

# Copy State Management files
cp "05-State-Management/REDUX_INTEGRATION_COMPLETE.md" ~/Desktop/YOUR_REPO_NAME.wiki/Redux-Integration.md
cp "05-State-Management/REDUX_USAGE_GUIDE.md" ~/Desktop/YOUR_REPO_NAME.wiki/Redux-Usage-Guide.md
```

**Or use this automated script:**

```bash
#!/bin/bash
# Save this as copy-to-wiki.sh in your documentation folder

WIKI_DIR="$HOME/Desktop/YOUR_REPO_NAME.wiki"  # Update this path

# Core Documentation
cp "01-Core-Documentation/DOCUMENTATION_INDEX.md" "$WIKI_DIR/Home.md"
cp "01-Core-Documentation/SYSTEM_REQUIREMENTS.md" "$WIKI_DIR/System-Requirements.md"
cp "01-Core-Documentation/USER_GUIDE.md" "$WIKI_DIR/User-Guide.md"
cp "01-Core-Documentation/TEST_CASES.md" "$WIKI_DIR/Test-Cases.md"
cp "01-Core-Documentation/SYSTEM_DOCUMENTATION.md" "$WIKI_DIR/System-Documentation.md"

# Architecture
cp "02-Architecture-Design/APPLICATION_ARCHITECTURE_DIAGRAM.md" "$WIKI_DIR/Architecture-Diagram.md"
cp "02-Architecture-Design/AI_CHATBOT_RAG_DIAGRAM.md" "$WIKI_DIR/AI-Chatbot-RAG-Diagram.md"
cp "02-Architecture-Design/PRESENTATION_PART3_WEB_APP_DESIGN.md" "$WIKI_DIR/Web-App-Design.md"

# AI & RAG
cp "03-AI-RAG/"*.md "$WIKI_DIR/" 2>/dev/null || true
# Rename files to wiki-friendly names
cd "$WIKI_DIR"
mv PRESENTATION_PART1_AI_CHATBOT.md AI-Chatbot.md 2>/dev/null || true
mv PRESENTATION_PART2_RAG.md RAG-System.md 2>/dev/null || true
mv HOW_RAG_CONTEXT_AWARENESS_WORKS.md RAG-Context-Awareness.md 2>/dev/null || true
mv RAG_BENEFITS_SUMMARY.md RAG-Benefits.md 2>/dev/null || true
mv RAG_EXPLAINED.md RAG-Explained.md 2>/dev/null || true
mv RAG_INTEGRATION_EXPLANATION.md RAG-Integration.md 2>/dev/null || true
mv RAG_VS_DATABASE_EXPLANATION.md RAG-vs-Database.md 2>/dev/null || true

# Development Guides
cp "04-Development-Guides/BUILD_PROCESS_GUIDE.md" "$WIKI_DIR/Build-Process.md"
cp "04-Development-Guides/APPLICATION_OVERVIEW.md" "$WIKI_DIR/Application-Overview.md"
cp "04-Development-Guides/HOW_PARAKET_ACHIEVES_VISION.md" "$WIKI_DIR/Vision-Achievement.md"
cp "04-Development-Guides/TECHNICAL_CHALLENGES_AND_RAG_EXPLANATION.md" "$WIKI_DIR/Technical-Challenges.md"
cp "04-Development-Guides/USER_COUNT_EXPLANATION.md" "$WIKI_DIR/User-Count-Explanation.md"

# State Management
cp "05-State-Management/REDUX_INTEGRATION_COMPLETE.md" "$WIKI_DIR/Redux-Integration.md"
cp "05-State-Management/REDUX_USAGE_GUIDE.md" "$WIKI_DIR/Redux-Usage-Guide.md"

echo "Files copied to wiki directory!"
```

---

### Step 4: Create a Sidebar for Navigation

GitHub Wiki uses a `_Sidebar.md` file for navigation. Create this file:

```bash
cd ~/Desktop/YOUR_REPO_NAME.wiki
```

Create `_Sidebar.md`:

```markdown
## 📚 Documentation

### Core Documentation

- [[Home|Home]]
- [[System-Requirements|System Requirements]]
- [[User-Guide|User Guide]]
- [[Test-Cases|Test Cases]]
- [[System-Documentation|System Documentation]]

### Architecture & Design

- [[Architecture-Diagram|Application Architecture]]
- [[AI-Chatbot-RAG-Diagram|AI Chatbot & RAG Diagram]]
- [[Web-App-Design|Web App Design]]

### AI & RAG

- [[AI-Chatbot|AI Chatbot]]
- [[RAG-System|RAG System]]
- [[RAG-Context-Awareness|RAG Context Awareness]]
- [[RAG-Benefits|RAG Benefits]]
- [[RAG-Explained|RAG Explained]]
- [[RAG-Integration|RAG Integration]]
- [[RAG-vs-Database|RAG vs Database]]

### Development Guides

- [[Build-Process|Build Process]]
- [[Application-Overview|Application Overview]]
- [[Vision-Achievement|Vision Achievement]]
- [[Technical-Challenges|Technical Challenges]]
- [[User-Count-Explanation|User Count Explanation]]

### State Management

- [[Redux-Integration|Redux Integration]]
- [[Redux-Usage-Guide|Redux Usage Guide]]
```

---

### Step 5: Create a Home Page

The `Home.md` file is the main entry point. Update it to include navigation:

```markdown
# 📚 Parakeet Documentation

Welcome to the Parakeet documentation wiki!

## Quick Navigation

### Core Documentation

- [[System-Requirements|System Requirements]]
- [[User-Guide|User Guide]]
- [[Test-Cases|Test Cases]]
- [[System-Documentation|System Documentation]]

### Architecture & Design

- [[Architecture-Diagram|Application Architecture]]
- [[AI-Chatbot-RAG-Diagram|AI Chatbot & RAG Diagram]]
- [[Web-App-Design|Web App Design]]

### AI & RAG

- [[AI-Chatbot|AI Chatbot]]
- [[RAG-System|RAG System]]
- [[RAG-Context-Awareness|RAG Context Awareness]]

### Development

- [[Build-Process|Build Process]]
- [[Application-Overview|Application Overview]]
- [[Redux-Integration|Redux Integration]]

---

_Use the sidebar for complete navigation._
```

---

### Step 6: Commit and Push to Wiki

```bash
cd ~/Desktop/YOUR_REPO_NAME.wiki

# Add all files
git add .

# Commit
git commit -m "Add complete documentation to wiki"

# Push to GitHub
git push origin master
```

**Note:** If this is your first push, GitHub might use `main` instead of `master`:

```bash
git push origin main
```

---

## ✅ Verification

1. Go to your GitHub repository
2. Click on **Wiki** tab (top menu)
3. You should see all your documentation pages
4. The sidebar should appear on the right
5. Click through pages to verify they work

---

## 🔧 Troubleshooting

### Issue: "Wiki is disabled"

**Solution:** Enable Wiki in repository Settings → Features

### Issue: "Cannot push to wiki"

**Solution:** Make sure you have write access to the repository

### Issue: "Files not showing up"

**Solution:**

- Check that files are committed: `git status`
- Verify you pushed: `git log`
- Refresh the wiki page in browser

### Issue: "Links not working"

**Solution:**

- GitHub Wiki uses `[[Page-Name|Display Text]]` syntax
- Page names are case-sensitive
- Use hyphens, not underscores or spaces

---

## 📝 Wiki Naming Conventions

GitHub Wiki page names:

- ✅ Use hyphens: `System-Requirements.md`
- ❌ Don't use spaces: `System Requirements.md` (won't work)
- ❌ Don't use underscores: `System_Requirements.md` (works but not recommended)
- ✅ Keep names short and descriptive

---

## 🎯 Best Practices

1. **Home Page:** Always have a `Home.md` as the entry point
2. **Sidebar:** Use `_Sidebar.md` for navigation
3. **Footer:** Optionally create `_Footer.md` for consistent footer
4. **Naming:** Use descriptive, hyphenated names
5. **Links:** Use `[[Page-Name|Display Text]]` syntax for internal links

---

## 📚 Additional Resources

- [GitHub Wiki Documentation](https://docs.github.com/en/communities/documenting-your-project-with-wikis)
- [Markdown Guide](https://docs.github.com/en/get-started/writing-on-github/getting-started-with-writing-and-formatting-on-github/basic-writing-and-formatting-syntax)

---

## 🚀 Quick Command Reference

```bash
# Clone wiki
git clone https://github.com/USERNAME/REPO.wiki.git

# Navigate to wiki
cd REPO.wiki

# Add files
git add .

# Commit
git commit -m "Your message"

# Push
git push origin master  # or main
```

---

**That's it!** Your documentation is now in GitHub Wiki and viewable by anyone with access to your repository.
