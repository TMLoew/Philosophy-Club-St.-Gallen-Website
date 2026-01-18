#!/bin/bash
# Setup validation script for Philosophy Club website improvements

echo "🔍 Checking Website Improvements Setup"
echo "======================================"
echo ""

# Color codes
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Counters
PASS=0
FAIL=0
WARN=0

# Check if file exists
check_file() {
    if [ -f "$1" ]; then
        echo -e "${GREEN}✓${NC} $2"
        ((PASS++))
        return 0
    else
        echo -e "${RED}✗${NC} $2"
        ((FAIL++))
        return 1
    fi
}

# Check if directory exists
check_dir() {
    if [ -d "$1" ]; then
        echo -e "${GREEN}✓${NC} $2"
        ((PASS++))
        return 0
    else
        echo -e "${YELLOW}⚠${NC} $2"
        ((WARN++))
        return 1
    fi
}

# Check if string exists in file
check_content() {
    if grep -q "$2" "$1" 2>/dev/null; then
        echo -e "${GREEN}✓${NC} $3"
        ((PASS++))
        return 0
    else
        echo -e "${YELLOW}⚠${NC} $3"
        ((WARN++))
        return 1
    fi
}

echo "📁 Checking Core Files..."
check_file "docs/index.html" "Homepage exists"
check_file "docs/about-us.html" "About page exists"
check_file "docs/css/style.css" "Stylesheet exists"
check_file "docs/js/site.js" "Main script exists"
echo ""

echo "📄 Checking New Files..."
check_file "docs/data/board.json" "Board data JSON created"
check_file "docs/blog.html" "Blog page created"
check_file "docs/sitemap.xml" "Sitemap created"
check_file "docs/sw.js" "Service worker created"
check_file "docs/js/analytics.js" "Analytics script created"
check_file "optimize-images.py" "Image optimization script created"
echo ""

echo "📚 Checking Documentation..."
check_file "IMPLEMENTATION.md" "Implementation guide created"
check_file "QUICK_START.md" "Quick start guide created"
check_file "IMPROVEMENTS_SUMMARY.md" "Summary document created"
echo ""

echo "🔧 Checking JavaScript Features..."
check_content "docs/js/site.js" "renderBoardMembers" "Board rendering function added"
check_content "docs/js/site.js" "generateICS" "iCalendar export function added"
check_content "docs/js/site.js" "filterEvents" "Event search function added"
check_content "docs/js/site.js" "serviceWorker" "Service worker registration added"
check_content "docs/js/site.js" "mobile-menu-toggle" "Mobile menu handler added"
echo ""

echo "🎨 Checking CSS Features..."
check_content "docs/css/style.css" "prefers-reduced-motion" "Reduced motion support added"
check_content "docs/css/style.css" "event-search" "Event search styles added"
check_content "docs/css/style.css" "mobile-menu-toggle" "Mobile menu styles added"
check_content "docs/css/style.css" "blog-post-card" "Blog post styles added"
echo ""

echo "📊 Checking Data Files..."
check_file "docs/data/events.json" "Events data exists"
check_file "docs/data/posts.json" "Posts data exists"
check_file "docs/data/board.json" "Board data exists"
echo ""

echo "🖼️ Checking Image Structure..."
check_dir "docs/images" "Images directory exists"
check_dir "docs/images/board" "Board images directory exists"
check_file "docs/images/logo.png" "Logo exists"
check_file "docs/images/banner-greeks.jpg" "Banner image exists"
echo ""

echo "⚙️ Checking Optional Setup..."
check_dir "docs/images/optimized" "Optimized images directory (run optimize-images.py to create)"

# Check if Python is available for optimization
if command -v python3 &> /dev/null; then
    echo -e "${GREEN}✓${NC} Python 3 available for image optimization"
    ((PASS++))

    # Check if Pillow is installed
    if python3 -c "import PIL" 2>/dev/null; then
        echo -e "${GREEN}✓${NC} Pillow library installed"
        ((PASS++))
    else
        echo -e "${YELLOW}⚠${NC} Pillow library not installed (run: pip install Pillow)"
        ((WARN++))
    fi
else
    echo -e "${YELLOW}⚠${NC} Python 3 not available"
    ((WARN++))
fi

echo ""
echo "🌐 Checking HTML Integration..."
check_content "docs/index.html" "event-search" "Event search input in homepage (check QUICK_START.md)"
check_content "docs/index.html" "mobile-menu-toggle" "Mobile menu button in homepage (check QUICK_START.md)"
check_content "docs/about-us.html" "current-board-grid" "Dynamic board rendering in About page (check QUICK_START.md)"

echo ""
echo "======================================"
echo "📈 Summary"
echo "======================================"
echo -e "${GREEN}Passed:${NC} $PASS"
echo -e "${YELLOW}Warnings:${NC} $WARN"
echo -e "${RED}Failed:${NC} $FAIL"
echo ""

if [ $FAIL -eq 0 ] && [ $WARN -eq 0 ]; then
    echo -e "${GREEN}✨ All checks passed! Your setup is complete.${NC}"
    echo ""
    echo "Next steps:"
    echo "1. Test locally: cd docs && python3 -m http.server 8000"
    echo "2. Review implementation: cat IMPLEMENTATION.md"
    echo "3. Deploy to GitHub: git add . && git commit && git push"
elif [ $FAIL -eq 0 ]; then
    echo -e "${YELLOW}⚠ Setup mostly complete with some warnings.${NC}"
    echo ""
    echo "Next steps:"
    echo "1. Review warnings above"
    echo "2. Check QUICK_START.md for HTML integration"
    echo "3. Run optimize-images.py if needed"
else
    echo -e "${RED}✗ Setup incomplete. Please check failed items.${NC}"
    echo ""
    echo "Troubleshooting:"
    echo "1. Ensure you're in the project root directory"
    echo "2. Check that all files were created correctly"
    echo "3. Review IMPLEMENTATION.md for details"
fi

echo ""
echo "📖 Documentation:"
echo "   - QUICK_START.md - Immediate actions & snippets"
echo "   - IMPLEMENTATION.md - Comprehensive guide"
echo "   - IMPROVEMENTS_SUMMARY.md - Overview & checklist"
echo ""
