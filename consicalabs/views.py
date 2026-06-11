import os
from django.conf import settings
from django.http import Http404
from django.views.static import serve

def serve_static_site(request, path=""):
    """
    Safely serves static HTML and assets from the project root folder.
    This enables hosting a static site under Django without modifying relative link structures,
    while restricting access to Python code and system files.
    """
    # Clean and normalize path
    if not path or path == "/":
        path = "index.html"
        
    # Prevent directory traversal attacks
    normalized_path = os.path.normpath(path)
    if normalized_path.startswith("..") or os.path.isabs(normalized_path):
        raise Http404("Invalid path")

    # Define whitelist of directories and files that are safe to expose
    allowed_dirs = {
        "products", "shared", "assets", "contents", 
        "desktop", "mobile", "tablet", "tools", "tutor", "scratch"
    }
    allowed_files = {"index.html", "robots.txt", "sitemap.xml"}

    # Determine the first segment of the path
    parts = normalized_path.split(os.sep)
    first_segment = parts[0]

    # Validate against whitelist
    is_allowed = False
    if normalized_path in allowed_files:
        is_allowed = True
    elif first_segment in allowed_dirs:
        is_allowed = True

    if not is_allowed:
        raise Http404("Access denied")

    # Resolve full path on disk
    full_path = os.path.join(settings.BASE_DIR, normalized_path)
    
    # If the path points to a directory, check if index.html exists inside it
    if os.path.isdir(full_path):
        index_path = os.path.join(full_path, "index.html")
        if os.path.exists(index_path):
            normalized_path = os.path.join(normalized_path, "index.html")
            full_path = index_path
        else:
            raise Http404("Directory index not found")

    if not os.path.exists(full_path):
        raise Http404("File not found")

    # Serve the file securely with correct MIME type
    return serve(request, normalized_path, document_root=settings.BASE_DIR)
