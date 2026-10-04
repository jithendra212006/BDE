"""
run_pipeline.py
---------------
One-click script to execute the full StreamInsight Big Data pipeline:

  Step 1 – Generate dataset (if data/ott_viewing_data.csv does not exist)
  Step 2 – Run PySpark ETL  (reads CSV, produces spark/output/*.json)
  Step 3 – (Optional) Start FastAPI server

Usage:
  python run_pipeline.py          # Steps 1 + 2 only
  python run_pipeline.py --serve  # Steps 1 + 2 + start FastAPI
"""

import os
import sys
import subprocess
import argparse
import time

ROOT = os.path.dirname(os.path.abspath(__file__))

def run(cmd, label):
    print(f"\n{'='*60}")
    print(f"  {label}")
    print(f"{'='*60}")
    result = subprocess.run(cmd, shell=True, cwd=ROOT)
    if result.returncode != 0:
        print(f"\n[ERROR] Step failed: {label}")
        sys.exit(1)
    print(f"[OK] {label} completed\n")

def step1_generate_dataset():
    csv_path = os.path.join(ROOT, "data", "ott_viewing_data.csv")
    if os.path.exists(csv_path):
        size = os.path.getsize(csv_path)
        print(f"[SKIP] Dataset already exists ({size/1024:.0f} KB) -> {csv_path}")
        return
    run("python data/generate_dataset.py", "Step 1: Generating OTT Dataset (10 000 rows)")

def step2_spark_etl():
    run("python spark/spark_etl.py", "Step 2: PySpark ETL Pipeline")

def step3_fastapi(host="127.0.0.1", port=8000):
    print(f"\n{'='*60}")
    print(f"  Step 3: Starting FastAPI Server  (http://{host}:{port})")
    print(f"{'='*60}")
    print("  API Docs -> http://localhost:8000/docs")
    print("  Press Ctrl+C to stop\n")
    cmd = f"uvicorn backend.main:app --reload --host {host} --port {port}"
    subprocess.run(cmd, shell=True, cwd=ROOT)

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="StreamInsight Big Data Pipeline Runner")
    parser.add_argument("--serve",  action="store_true", help="Start FastAPI server after ETL")
    parser.add_argument("--host",   default="127.0.0.1", help="FastAPI host (default: 127.0.0.1)")
    parser.add_argument("--port",   default=8000, type=int, help="FastAPI port (default: 8000)")
    args = parser.parse_args()

    print("\n  StreamInsight – Full Big Data Pipeline")
    print("  OTT CSV -> PySpark -> spark/output/*.json -> FastAPI\n")

    step1_generate_dataset()
    step2_spark_etl()

    if args.serve:
        step3_fastapi(args.host, args.port)
    else:
        print("\n[DONE] Pipeline complete. Start the API server with:")
        print("       uvicorn backend.main:app --reload --port 8000\n")
        print("       Then start the dashboard:")
        print("       npm run dev\n")
