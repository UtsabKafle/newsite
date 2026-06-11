from django.contrib import admin
from django.urls import path, re_path
from consicalabs.views import serve_static_site

urlpatterns = [
    path('admin/', admin.site.urls),
    
    # Catch-all pattern to serve the static site files and assets
    re_path(r'^(?P<path>.*)$', serve_static_site, name='catch_all'),
]
