import urllib.request
import json
import os
import glob

def get_file_object(file_path, rel_path):
    with open(file_path, 'rb') as f:
        content = f.read()
    try:
        data = content.decode('utf-8')
        return {"file": rel_path.replace("\\", "/"), "data": data}
    except Exception:
        import base64
        return {"file": rel_path.replace("\\", "/"), "data": base64.b64encode(content).decode('utf-8'), "encoding": "base64"}

files = []
for root, dirs, filenames in os.walk("."):
    if ".git" in root or "node_modules" in root or "scratch" in root:
        continue
    for fname in filenames:
        if fname in ["deploy.py"]:
            continue
        fpath = os.path.join(root, fname)
        rpath = os.path.relpath(fpath, ".")
        files.append(get_file_object(fpath, rpath))

payload = {
    "name": "lumina-salon-london",
    "public": True,
    "files": files,
    "projectSettings": {
        "framework": None
    }
}

req = urllib.request.Request("https://api.vercel.com/v13/deployments", 
                             data=json.dumps(payload).encode('utf-8'),
                             headers={"Content-Type": "application/json"})

try:
    with urllib.request.urlopen(req) as resp:
        res = json.loads(resp.read().decode('utf-8'))
        print("Deployment successful!")
        print("URL:", res.get("url"))
except urllib.error.HTTPError as e:
    print("HTTP Error:", e.code, e.read().decode('utf-8'))
except Exception as e:
    print("Error:", e)
