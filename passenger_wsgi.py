import os
import sys

# Get the path to this file
PROJECT_ROOT = os.path.dirname(os.path.abspath(__file__))

# Add the project directory to sys.path
sys.path.insert(0, PROJECT_ROOT)

# Add the virtual environment site-packages to sys.path
VENV_PACKAGES = "/home/consicac/virtualenv/consicalabs/3.13/lib/python3.13/site-packages"
if os.path.exists(VENV_PACKAGES):
    sys.path.insert(0, VENV_PACKAGES)

# Set environment variable for Django settings module
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "consicalabs.settings")

# Import the WSGI application
from consicalabs.wsgi import application
