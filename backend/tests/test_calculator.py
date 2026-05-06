import pytest
import pandas as pd
from src.economics.calculator import UnitEconomicsEngine

def test_financial_summary_normal():
    # Sale Price: 30, COGS: 10, FBA: 10 -> Gross Profit: 10
    # Break-Even ACOS: 10 / 30 = 33.33%
    engine = UnitEconomicsEngine(sale_price=30.0, cogs=10.0, fba_fees=10.0)
    summary = engine.get_financial_summary()
    
    assert summary["Sale Price"] == 30.0
    assert summary["Gross Profit"] == 10.0
    assert summary["Break-Even ACOS (%)"] == 33.33

def test_financial_summary_zero_sale_price():
    # Divide by zero protection
    engine = UnitEconomicsEngine(sale_price=0.0, cogs=10.0, fba_fees=5.0)
    summary = engine.get_financial_summary()
    
    assert summary["Gross Profit"] == -15.0
    assert summary["Break-Even ACOS (%)"] == 0.0

def test_run_full_analysis_bleeding():
    engine = UnitEconomicsEngine(sale_price=30.0, cogs=10.0, fba_fees=10.0, clicks_threshold=10)
    
    # DataFrame with one bleeding term: 15 clicks, 0 orders
    df = pd.DataFrame([{
        "Search Term": "bleeding term",
        "Clicks": 15,
        "Orders": 0,
        "Spend": 15.0,
        "Sales": 0.0,
        "CPC": 1.0,
        "Match Type": "BROAD",
        "Campaign": "Camp A"
    }])
    
    results = engine.run_full_analysis(df, lang="en")
    full_data = results["full_data"]
    
    assert len(full_data) == 1
    assert "EXCLUDE:" in full_data[0]["action"]
    assert len(results["bleeding"]) > 0

def test_run_full_analysis_monitor():
    engine = UnitEconomicsEngine(sale_price=30.0, cogs=10.0, fba_fees=10.0, clicks_threshold=10)
    
    # DataFrame with one term to monitor: 5 clicks, 0 orders (below threshold)
    df = pd.DataFrame([{
        "Search Term": "monitor term",
        "Clicks": 5,
        "Orders": 0,
        "Spend": 5.0,
        "Sales": 0.0,
        "CPC": 1.0,
        "Match Type": "BROAD",
        "Campaign": "Camp A"
    }])
    
    results = engine.run_full_analysis(df, lang="en")
    full_data = results["full_data"]
    
    assert len(full_data) == 1
    assert "Monitor" in full_data[0]["action"]

def test_run_full_analysis_opportunities_exact():
    # Break-even is 33.33%
    engine = UnitEconomicsEngine(sale_price=30.0, cogs=10.0, fba_fees=10.0)
    
    # ACOS = 10 / 60 = 16.66% <= 33.33% -> Profitable
    df = pd.DataFrame([{
        "Search Term": "exact opp",
        "Clicks": 10,
        "Orders": 2,
        "Spend": 10.0,
        "Sales": 60.0,
        "CPC": 1.0,
        "Match Type": "EXACT",
        "Campaign": "Camp A"
    }])
    
    results = engine.run_full_analysis(df, lang="en")
    full_data = results["full_data"]
    
    assert len(full_data) == 1
    assert "SCALE BID" in full_data[0]["action"]
    assert len(results["optimizations"]) > 0

def test_run_full_analysis_opportunities_broad():
    engine = UnitEconomicsEngine(sale_price=30.0, cogs=10.0, fba_fees=10.0)
    
    # ACOS = 10 / 60 = 16.66% <= 33.33% -> Profitable but not exact
    df = pd.DataFrame([{
        "Search Term": "broad opp",
        "Clicks": 10,
        "Orders": 2,
        "Spend": 10.0,
        "Sales": 60.0,
        "CPC": 1.0,
        "Match Type": "BROAD",
        "Campaign": "Camp A"
    }])
    
    results = engine.run_full_analysis(df, lang="en")
    full_data = results["full_data"]
    
    assert len(full_data) == 1
    assert "HARVEST" in full_data[0]["action"]

def test_run_full_analysis_optimizations_exact():
    engine = UnitEconomicsEngine(sale_price=30.0, cogs=10.0, fba_fees=10.0)
    
    # ACOS = 20 / 30 = 66.66% > 33.33% -> Unprofitable
    df = pd.DataFrame([{
        "Search Term": "exact opt",
        "Clicks": 20,
        "Orders": 1,
        "Spend": 20.0,
        "Sales": 30.0,
        "CPC": 1.0,
        "Match Type": "EXACT",
        "Campaign": "Camp A"
    }])
    
    results = engine.run_full_analysis(df, lang="en")
    full_data = results["full_data"]
    
    assert len(full_data) == 1
    assert "CURB:" in full_data[0]["action"]
    assert len(results["optimizations"]) > 0

def test_run_full_analysis_empty_term_handling():
    engine = UnitEconomicsEngine(sale_price=30.0, cogs=10.0, fba_fees=10.0)
    
    # DataFrame with missing search terms
    df = pd.DataFrame([{
        "Search Term": None,
        "Clicks": 10,
        "Orders": 1,
        "Spend": 10.0,
        "Sales": 30.0,
        "CPC": 1.0,
        "Match Type": "EXACT",
        "Campaign": "Camp A"
    }, {
        "Search Term": "   ",
        "Clicks": 10,
        "Orders": 1,
        "Spend": 10.0,
        "Sales": 30.0,
        "CPC": 1.0,
        "Match Type": "EXACT",
        "Campaign": "Camp B"
    }])
    
    results = engine.run_full_analysis(df, lang="en")
    
    assert len(results["full_data"]) == 0
