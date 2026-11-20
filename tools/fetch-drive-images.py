"""Download the shared MGR CASA image folder from Google Drive into reference/mgr-casa-drive.

    pip install gdown
    python3 tools/fetch-drive-images.py

Needs network access to drive.google.com and drive.usercontent.google.com. Files already on
disk are skipped. Only the folders the catalogue uses are fetched by default (new Furlenco
sofas and Cellbell chairs); pass --all for everything.
"""
import concurrent.futures as cf
import json
import os
import sys
import urllib.request

import gdown

FOLDER = "https://drive.google.com/drive/folders/1IrbL94cvgHFZujQBIEXh12m29T0Gao5F"
ROOT = os.path.join(os.path.dirname(__file__), "..", "reference", "mgr-casa-drive")


def fetch(item):
    fid, rel = item
    dest = os.path.join(ROOT, rel)
    if os.path.exists(dest) and os.path.getsize(dest) > 0:
        return
    os.makedirs(os.path.dirname(dest), exist_ok=True)
    url = f"https://drive.usercontent.google.com/download?id={fid}&export=download&confirm=t"
    for _ in range(3):
        try:
            urllib.request.urlretrieve(url, dest)
            return
        except Exception:  # noqa: BLE001
            pass
    print("FAILED", rel, file=sys.stderr)


def main():
    files = gdown.download_folder(FOLDER, output=ROOT, skip_download=True, quiet=True)
    items = [(f.id, f.path) for f in files if not f.path.endswith(".pyc")]
    if "--all" not in sys.argv:
        meta = [i for i in items if i[1].endswith((".json", ".csv"))]
        with cf.ThreadPoolExecutor(8) as ex:
            list(ex.map(fetch, meta))
        products = json.load(open(os.path.join(ROOT, "scraped/furlenco/products.json")))
        new = {p["local_folder"] for p in products if p.get("condition") == "New"}
        items = [i for i in items if "/cellbell/" in i[1] or "/".join(i[1].split("/")[1:4]) in new or i in meta]
    print(f"Fetching {len(items)} files…")
    with cf.ThreadPoolExecutor(12) as ex:
        list(ex.map(fetch, items))


if __name__ == "__main__":
    main()
