import os
import sys
import zipfile
import subprocess
import json

# Deployment configuration
SSH_HOST = "192.250.235.158"
SSH_PORT = 22
SSH_USER = "consicac"
SSH_KEY = r"C:\Users\Acer\.ssh\id_rsa_nebians"
REMOTE_DIR = "/home/consicac/consicalabs"
ZIP_NAME = "consicalabs.zip"

def create_zip():
    print(f"[*] Creating {ZIP_NAME} from current workspace...")
    local_dir = os.path.dirname(os.path.abspath(__file__))
    
    # Exclude list for zip packaging
    exclude_dirs = {'.git', '.gemini', 'node_modules', '__pycache__', 'staticfiles'}
    exclude_files = {ZIP_NAME, 'deploy.py', '.ssh_deploy_info.json', 'db.sqlite3'}
    
    count = 0
    with zipfile.ZipFile(ZIP_NAME, 'w', zipfile.ZIP_DEFLATED) as zipf:
        for root, dirs, files in os.walk(local_dir):
            # Modify dirs in-place to skip excluded directories
            dirs[:] = [d for d in dirs if d not in exclude_dirs]
            
            for file in files:
                if file in exclude_files:
                    continue
                if file.endswith('.zip') or file.endswith('.bak') or file.endswith('.bak2'):
                    continue
                    
                full_path = os.path.join(root, file)
                rel_path = os.path.relpath(full_path, local_dir)
                zipf.write(full_path, rel_path)
                count += 1
                
    print(f"[+] Zip file created successfully with {count} files.")

def run_command(cmd, desc="Running command"):
    print(f"[*] {desc}...")
    try:
        result = subprocess.run(cmd, shell=True, check=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE, encoding='utf-8')
        return result.stdout.strip()
    except subprocess.CalledProcessError as e:
        print(f"[!] Error during {desc.lower()}:")
        print(f"Exit code: {e.returncode}")
        print(f"Error output:\n{e.stderr}")
        sys.exit(1)

def main():
    # 1. Create zip package
    create_zip()
    
    try:
        # 2. Upload zip package
        scp_cmd = f'scp -i "{SSH_KEY}" -P {SSH_PORT} -o StrictHostKeyChecking=no "{ZIP_NAME}" {SSH_USER}@{SSH_HOST}:{REMOTE_DIR}/'
        run_command(scp_cmd, "Uploading zip file to server")
        
        # 3. Remote execution (Install dependencies, extract zip, restart passenger)
        remote_commands = (
            f"echo '[*] Installing Django on server...' && "
            f"/home/consicac/virtualenv/consicalabs/3.13/bin/pip install django && "
            f"echo '[*] Extracting files...' && "
            f"unzip -o {REMOTE_DIR}/{ZIP_NAME} -d {REMOTE_DIR}/ && "
            f"echo '[*] Cleaning up archive...' && "
            f"rm -f {REMOTE_DIR}/{ZIP_NAME} && "
            f"echo '[*] Restarting Python application...' && "
            f"mkdir -p {REMOTE_DIR}/tmp && "
            f"touch {REMOTE_DIR}/tmp/restart.txt && "
            f"echo '[+] Remote deployment successfully completed!'"
        )
        
        ssh_cmd = f'ssh -i "{SSH_KEY}" -p {SSH_PORT} -o StrictHostKeyChecking=no {SSH_USER}@{SSH_HOST} "{remote_commands}"'
        output = run_command(ssh_cmd, "Executing remote setup and reload commands")
        print(output)
        
    finally:
        # 4. Clean up local zip
        if os.path.exists(ZIP_NAME):
            os.remove(ZIP_NAME)
            print("[*] Local temporary zip file removed.")

if __name__ == "__main__":
    main()
