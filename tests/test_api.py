"""
tests/test_api.py
-----------------
Basic smoke tests for the FastAPI backend using TestClient.
Requires: pip install httpx pytest
Run:      pytest tests/test_api.py -v
"""

import sys, os
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

import json
import pytest
from pathlib import Path
from fastapi.testclient import TestClient
from backend.main import app, OUTPUT_DIR

client = TestClient(app)

def test_root():
    r = client.get("/")
    assert r.status_code == 200
    assert r.json()["service"] == "StreamInsight Analytics API"

def test_health():
    r = client.get("/health")
    assert r.status_code == 200
    body = r.json()
    assert "status" in body
    assert "pipeline_output_ready" in body

def test_pipeline_status():
    r = client.get("/api/pipeline/status")
    assert r.status_code == 200
    body = r.json()
    assert "ready" in body
    assert "files" in body

@pytest.mark.skipif(
    not (Path(OUTPUT_DIR) / "kpi.json").exists(),
    reason="Spark ETL outputs not generated yet (run python spark/spark_etl.py first)"
)
class TestLiveEndpoints:
    def test_kpi(self):
        r = client.get("/api/kpi")
        assert r.status_code == 200
        body = r.json()
        assert "unique_viewers" in body
        assert "mrr_display" in body

    def test_watch_time_7d(self):
        r = client.get("/api/watch-time?range=7d")
        assert r.status_code == 200
        data = r.json()
        assert isinstance(data, list)
        assert len(data) <= 7

    def test_watch_time_30d(self):
        r = client.get("/api/watch-time?range=30d")
        assert r.status_code == 200
        assert isinstance(r.json(), list)

    def test_genres(self):
        r = client.get("/api/genres")
        assert r.status_code == 200
        genres = r.json()
        assert isinstance(genres, list)
        genre_names = [g["genre"] for g in genres]
        assert "Drama" in genre_names or len(genre_names) > 0

    def test_devices(self):
        r = client.get("/api/devices")
        assert r.status_code == 200
        devices = r.json()
        total_pct = sum(d["percentage"] for d in devices)
        assert 95 <= total_pct <= 105  # Should sum to ~100%

    def test_countries(self):
        r = client.get("/api/countries")
        assert r.status_code == 200
        assert isinstance(r.json(), list)

    def test_content_default(self):
        r = client.get("/api/content")
        assert r.status_code == 200
        body = r.json()
        assert "items" in body
        assert "total" in body

    def test_content_search(self):
        r = client.get("/api/content?search=last")
        assert r.status_code == 200

    def test_content_genre_filter(self):
        r = client.get("/api/content?genre=Drama")
        assert r.status_code == 200
        for item in r.json()["items"]:
            assert item["genre"].lower() == "drama"

    def test_trending(self):
        r = client.get("/api/content/trending?limit=5")
        assert r.status_code == 200
        data = r.json()
        assert isinstance(data, list)
        assert len(data) <= 5

    def test_subscriptions(self):
        r = client.get("/api/subscriptions")
        assert r.status_code == 200
        plans = {s["tier"] for s in r.json()}
        assert "Basic" in plans
        assert "Standard" in plans
        assert "Premium" in plans

    def test_retention(self):
        r = client.get("/api/retention")
        assert r.status_code == 200
        data = r.json()
        periods = [d["period"] for d in data]
        assert "Day 1" in periods

    def test_dashboard_composite(self):
        r = client.get("/api/dashboard")
        assert r.status_code == 200
        body = r.json()
        assert "kpi" in body
        assert "watchTime" in body
        assert "genres" in body
        assert "trending" in body
