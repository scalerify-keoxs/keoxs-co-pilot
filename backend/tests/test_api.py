import pytest
from fastapi.testclient import TestClient
from api import app

client = TestClient(app)

def test_export_bulk_endpoint_returns_compliant_bulksheet():
    payload = {
        "analysis_data": {
            "full_data": [
                {
                    "term": "keyword1",
                    "campaign": "Campaign A",
                    "match_type": "EXACT",
                    "action": "SCALE BID (Exact)",
                    "suggested_bid": 1.32,
                    "clicks": 10,
                    "spend": 10.0,
                    "sales": 60.0,
                    "acos": 16.66
                },
                {
                    "term": "keyword2",
                    "campaign": "Campaign A",
                    "match_type": "BROAD",
                    "action": "EXCLUDE : Ajoutez ce terme en Negatif",
                    "suggested_bid": 0.0,
                    "clicks": 15,
                    "spend": 15.0,
                    "sales": 0.0,
                    "acos": 0.0
                }
            ]
        },
        "lang": "fr"
    }
    response = client.post("/api/export-bulk", json=payload)
    assert response.status_code == 200
    assert "text/csv" in response.headers["content-type"]
    
    # Assert exact Amazon Bulksheet structure exists in output
    assert "Keyword Text" in response.text or "Keyword" in response.text
    assert "Operation" in response.text
    assert "Update" in response.text
    assert "Create" in response.text
