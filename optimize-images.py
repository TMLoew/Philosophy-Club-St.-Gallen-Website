#!/usr/bin/env python3
"""
Image Optimization Script for Philosophy Club Website
Converts images to WebP format and adds responsive image variants
Requires: Pillow library (pip install Pillow)
"""

import os
from PIL import Image
import sys

def optimize_image(input_path, output_dir, quality=85):
    """
    Optimize a single image by converting to WebP and creating responsive variants

    Args:
        input_path: Path to source image
        output_dir: Directory for optimized images
        quality: WebP quality (1-100, default 85)
    """
    try:
        img = Image.open(input_path)

        # Convert RGBA to RGB if necessary
        if img.mode in ('RGBA', 'LA', 'P'):
            background = Image.new('RGB', img.size, (255, 255, 255))
            if img.mode == 'P':
                img = img.convert('RGBA')
            background.paste(img, mask=img.split()[-1] if img.mode in ('RGBA', 'LA') else None)
            img = background

        filename = os.path.basename(input_path)
        name, ext = os.path.splitext(filename)

        # Create WebP version
        webp_path = os.path.join(output_dir, f"{name}.webp")
        img.save(webp_path, 'WEBP', quality=quality, method=6)

        original_size = os.path.getsize(input_path)
        webp_size = os.path.getsize(webp_path)
        savings = ((original_size - webp_size) / original_size) * 100

        print(f"✓ {filename}: {original_size/1024:.1f}KB → {webp_size/1024:.1f}KB (saved {savings:.1f}%)")

        # Create responsive variants for large images
        width, height = img.size
        if width > 800:
            # Create medium variant (800px wide)
            medium_img = img.copy()
            medium_img.thumbnail((800, int(800 * height / width)), Image.Resampling.LANCZOS)
            medium_path = os.path.join(output_dir, f"{name}-800w.webp")
            medium_img.save(medium_path, 'WEBP', quality=quality, method=6)

        if width > 400:
            # Create small variant (400px wide)
            small_img = img.copy()
            small_img.thumbnail((400, int(400 * height / width)), Image.Resampling.LANCZOS)
            small_path = os.path.join(output_dir, f"{name}-400w.webp")
            small_img.save(small_path, 'WEBP', quality=quality, method=6)

        return True
    except Exception as e:
        print(f"✗ Error processing {input_path}: {e}")
        return False

def main():
    """Main optimization function"""
    docs_dir = os.path.join(os.path.dirname(__file__), 'docs')
    images_dir = os.path.join(docs_dir, 'images')
    board_dir = os.path.join(images_dir, 'board')

    if not os.path.exists(images_dir):
        print(f"Error: Images directory not found at {images_dir}")
        sys.exit(1)

    # Create optimized directory
    optimized_dir = os.path.join(images_dir, 'optimized')
    os.makedirs(optimized_dir, exist_ok=True)

    optimized_board_dir = os.path.join(optimized_dir, 'board')
    os.makedirs(optimized_board_dir, exist_ok=True)

    print("🖼️  Image Optimization for Philosophy Club Website")
    print("=" * 60)

    # Optimize main images
    print("\nOptimizing main images...")
    for filename in os.listdir(images_dir):
        filepath = os.path.join(images_dir, filename)
        if os.path.isfile(filepath) and filename.lower().endswith(('.jpg', '.jpeg', '.png')):
            optimize_image(filepath, optimized_dir)

    # Optimize board images
    if os.path.exists(board_dir):
        print("\nOptimizing board member images...")
        for filename in os.listdir(board_dir):
            filepath = os.path.join(board_dir, filename)
            if os.path.isfile(filepath) and filename.lower().endswith(('.jpg', '.jpeg', '.png')):
                optimize_image(filepath, optimized_board_dir)

    print("\n" + "=" * 60)
    print("✓ Optimization complete!")
    print(f"Optimized images saved to: {optimized_dir}")
    print("\nNext steps:")
    print("1. Review the optimized images")
    print("2. Update HTML to use <picture> tags with WebP sources")
    print("3. Replace original images with optimized versions")
    print("4. Add loading='lazy' attributes to <img> tags")

if __name__ == '__main__':
    try:
        from PIL import Image
    except ImportError:
        print("Error: Pillow library not found.")
        print("Install it with: pip install Pillow")
        sys.exit(1)

    main()
