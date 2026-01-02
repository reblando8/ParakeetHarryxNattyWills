#!/bin/bash

# GitHub Wiki Copy Script
# This script copies all documentation files to your GitHub Wiki repository
# 
# Usage:
#   1. Update WIKI_DIR variable below with your wiki repository path
#   2. Run: bash copy-to-wiki.sh

# ============================================
# CONFIGURATION - UPDATE THIS PATH
# ============================================
# Replace with your actual wiki repository path
# Example: WIKI_DIR="$HOME/Desktop/ParakeetWebApp.wiki"
WIKI_DIR="$HOME/Desktop/ParakeetHarryxNattyWills.wiki"

# Get the directory where this script is located
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

# ============================================
# VALIDATION
# ============================================
if [ ! -d "$WIKI_DIR" ]; then
    echo "❌ Error: Wiki directory not found: $WIKI_DIR"
    echo ""
    echo "Please:"
    echo "1. Clone your wiki repository first:"
    echo "   git clone https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.wiki.git"
    echo "2. Update WIKI_DIR in this script with the correct path"
    exit 1
fi

echo "📚 Copying documentation files to GitHub Wiki..."
echo "Wiki directory: $WIKI_DIR"
echo ""

# ============================================
# CORE DOCUMENTATION
# ============================================
echo "📋 Copying Core Documentation..."
cp "$SCRIPT_DIR/01-Core-Documentation/DOCUMENTATION_INDEX.md" "$WIKI_DIR/Home.md"
cp "$SCRIPT_DIR/01-Core-Documentation/SYSTEM_REQUIREMENTS.md" "$WIKI_DIR/System-Requirements.md"
cp "$SCRIPT_DIR/01-Core-Documentation/USER_GUIDE.md" "$WIKI_DIR/User-Guide.md"
cp "$SCRIPT_DIR/01-Core-Documentation/TEST_CASES.md" "$WIKI_DIR/Test-Cases.md"
cp "$SCRIPT_DIR/01-Core-Documentation/SYSTEM_DOCUMENTATION.md" "$WIKI_DIR/System-Documentation.md"

# ============================================
# ARCHITECTURE & DESIGN
# ============================================
echo "🏗️  Copying Architecture & Design..."
cp "$SCRIPT_DIR/02-Architecture-Design/APPLICATION_ARCHITECTURE_DIAGRAM.md" "$WIKI_DIR/Architecture-Diagram.md"
cp "$SCRIPT_DIR/02-Architecture-Design/AI_CHATBOT_RAG_DIAGRAM.md" "$WIKI_DIR/AI-Chatbot-RAG-Diagram.md"
cp "$SCRIPT_DIR/02-Architecture-Design/PRESENTATION_PART3_WEB_APP_DESIGN.md" "$WIKI_DIR/Web-App-Design.md"

# ============================================
# AI & RAG
# ============================================
echo "🤖 Copying AI & RAG Documentation..."
cp "$SCRIPT_DIR/03-AI-RAG/PRESENTATION_PART1_AI_CHATBOT.md" "$WIKI_DIR/AI-Chatbot.md"
cp "$SCRIPT_DIR/03-AI-RAG/PRESENTATION_PART2_RAG.md" "$WIKI_DIR/RAG-System.md"
cp "$SCRIPT_DIR/03-AI-RAG/HOW_RAG_CONTEXT_AWARENESS_WORKS.md" "$WIKI_DIR/RAG-Context-Awareness.md"
cp "$SCRIPT_DIR/03-AI-RAG/RAG_BENEFITS_SUMMARY.md" "$WIKI_DIR/RAG-Benefits.md"
cp "$SCRIPT_DIR/03-AI-RAG/RAG_EXPLAINED.md" "$WIKI_DIR/RAG-Explained.md"
cp "$SCRIPT_DIR/03-AI-RAG/RAG_INTEGRATION_EXPLANATION.md" "$WIKI_DIR/RAG-Integration.md"
cp "$SCRIPT_DIR/03-AI-RAG/RAG_VS_DATABASE_EXPLANATION.md" "$WIKI_DIR/RAG-vs-Database.md"

# ============================================
# DEVELOPMENT GUIDES
# ============================================
echo "🔧 Copying Development Guides..."
cp "$SCRIPT_DIR/04-Development-Guides/BUILD_PROCESS_GUIDE.md" "$WIKI_DIR/Build-Process.md"
cp "$SCRIPT_DIR/04-Development-Guides/APPLICATION_OVERVIEW.md" "$WIKI_DIR/Application-Overview.md"
cp "$SCRIPT_DIR/04-Development-Guides/HOW_PARAKET_ACHIEVES_VISION.md" "$WIKI_DIR/Vision-Achievement.md"
cp "$SCRIPT_DIR/04-Development-Guides/TECHNICAL_CHALLENGES_AND_RAG_EXPLANATION.md" "$WIKI_DIR/Technical-Challenges.md"
cp "$SCRIPT_DIR/04-Development-Guides/USER_COUNT_EXPLANATION.md" "$WIKI_DIR/User-Count-Explanation.md"

# ============================================
# STATE MANAGEMENT
# ============================================
echo "🔄 Copying State Management Documentation..."
cp "$SCRIPT_DIR/05-State-Management/REDUX_INTEGRATION_COMPLETE.md" "$WIKI_DIR/Redux-Integration.md"
cp "$SCRIPT_DIR/05-State-Management/REDUX_USAGE_GUIDE.md" "$WIKI_DIR/Redux-Usage-Guide.md"

# ============================================
# CREATE SIDEBAR
# ============================================
echo "📑 Creating Sidebar..."
cat > "$WIKI_DIR/_Sidebar.md" << 'EOF'
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
EOF

# ============================================
# UPDATE HOME PAGE
# ============================================
echo "🏠 Updating Home page..."
cat > "$WIKI_DIR/Home.md" << 'EOF'
# 📚 Parakeet Documentation

Welcome to the Parakeet documentation wiki!

## Quick Navigation

### Core Documentation
- [[System-Requirements|System Requirements]] - Complete functional and non-functional requirements
- [[User-Guide|User Guide]] - End-user documentation and instructions
- [[Test-Cases|Test Cases]] - Comprehensive test case documentation (50+ test cases)
- [[System-Documentation|System Documentation]] - Technical system documentation

### Architecture & Design
- [[Architecture-Diagram|Application Architecture]] - Visual diagrams of overall application architecture
- [[AI-Chatbot-RAG-Diagram|AI Chatbot & RAG Diagram]] - Visual diagrams of AI chatbot and RAG flow
- [[Web-App-Design|Web App Design]] - Web application design documentation

### AI & RAG
- [[AI-Chatbot|AI Chatbot]] - AI chatbot implementation details
- [[RAG-System|RAG System]] - RAG system explanation
- [[RAG-Context-Awareness|RAG Context Awareness]] - Detailed explanation of RAG's context awareness
- [[RAG-Benefits|RAG Benefits]] - Summary of RAG benefits

### Development
- [[Build-Process|Build Process]] - Step-by-step build instructions
- [[Application-Overview|Application Overview]] - Application overview
- [[Redux-Integration|Redux Integration]] - Redux integration summary

---

*Use the sidebar for complete navigation.*
EOF

echo ""
echo "✅ Files copied successfully!"
echo ""
echo "📝 Next steps:"
echo "1. Review the files in: $WIKI_DIR"
echo "2. Commit and push to GitHub:"
echo "   cd $WIKI_DIR"
echo "   git add ."
echo "   git commit -m 'Add complete documentation to wiki'"
echo "   git push origin master"
echo ""
echo "3. View your wiki at: https://github.com/YOUR_USERNAME/YOUR_REPO_NAME/wiki"

