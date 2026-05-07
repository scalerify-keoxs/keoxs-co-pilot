import pytest
import pandas as pd
from src.ingestion.parser import AmazonReportParser

def test_load_bulksheet_valid(tmp_path):
    csv_content = (
        "Campaign Name (Informational only),Search Term,Match Type,Bid,Ad Group Default Bid (Informational only),Spend,Sales,Orders,Clicks,ROAS,Impressions\n"
        "Campaign A,prod1,EXACT,1.20,1.00,10.00,40.00,2,10,4.0,100\n"
    )
    file_path = tmp_path / "yourinput_file.csv"
    file_path.write_text(csv_content, encoding="utf-8")
    
    df = AmazonReportParser.load_search_term_report(file_path)
    assert "Bid" in df.columns
    assert "Ad Group Default Bid" in df.columns
    assert df.loc[0, "Bid"] == 1.20
    assert df.loc[0, "Ad Group Default Bid"] == 1.00
