import urllib.request
import json
import os
import base64

def prepare_files():
    files = []
    # Key static files
    file_list = [
        "index.html",
        "styles.css",
        "script.js",
        "vercel.json",
        "assets/images/hero_salon.jpg",
        "assets/images/stylist_sophia.jpg",
        "assets/images/stylist_james.jpg",
        "assets/images/stylist_emma.jpg",
        "assets/images/stylist_marcus.jpg",
        "assets/images/balayage_after.jpg",
        "assets/images/balayage_before.jpg",
        "assets/images/extensions_after.jpg",
        "assets/images/extensions_before.jpg",
        "assets/images/cut_after.jpg",
        "assets/images/cut_before.jpg",
        "assets/images/keratin_after.jpg",
        "assets/images/keratin_before.jpg"
    ]
    
    for rel_path in file_list:
        if not os.path.exists(rel_path):
            continue
        with open(rel_path, 'rb') as f:
            content = f.read()
        if rel_path.endswith(('.html', '.css', '.js', '.json')):
            files.append({"file": rel_path, "data": content.decode('utf-8')})
        else:
            files.append({"file": rel_path, "data": base64.b64encode(content).decode('utf-8'), "encoding": "base64"})
    return files

def deploy():
    files = prepare_files()
    payload = {
        "name": "lumina-salon-london",
        "public": True,
        "files": files,
        "projectSettings": {
            "framework": None
        }
    }
    
    data = json.dumps(payload).encode('utf-8')
    req = urllib.request.Request("https://api.vercel.com/v13/deployments", data=data, headers={"Content-Type": "application/json"})
    
    try:
        print("Sending deployment request to Vercel API...")
        with urllib.request.urlopen(req, timeout=30) as resp:
            res = json.loads(resp.read().decode('utf-8'))
            print("\n=== VERCEL DEPLOYMENT SUCCESSFUL ===")
            print("Deployment URL: https://" + res.get("url", ""))
            print("===================================\n")
    except urllib.error.HTTPError as e:
        err_msg = e.read().decode('utf-8')
        print("HTTP Error", e.code, err_msg)
    except Exception as e:
        print("Error:", e)

if __name__ == "__main__":
    deploy()
