from pathlib import Path

import pandas as pd


# Project paths
PROJECT_ROOT = Path(__file__).resolve().parents[2]
DATA_FILE = PROJECT_ROOT / "ml" / "data" / "market_prices.csv"
OUTPUT_FILE = PROJECT_ROOT / "ml" / "data" / "features.csv"


def create_features():
    print("Loading market price data...")

    df = pd.read_csv(DATA_FILE)

    if df.empty:
        print("Dataset is empty.")
        print("Add real historical market-price data before training.")
        return

    # Convert date column
    df["date"] = pd.to_datetime(df["date"])

    # Sort correctly for time-series features
    df = df.sort_values(
        by=["crop", "market", "date"]
    ).reset_index(drop=True)

    # -----------------------------
    # Price lag features
    # -----------------------------

    grouped_price = df.groupby(
        ["crop", "market"]
    )["modal_price"]

    df["price_lag_1"] = grouped_price.shift(1)
    df["price_lag_2"] = grouped_price.shift(2)
    df["price_lag_3"] = grouped_price.shift(3)
    df["price_lag_7"] = grouped_price.shift(7)
    df["price_lag_14"] = grouped_price.shift(14)

    # -----------------------------
    # Rolling price features
    # -----------------------------

    df["price_rolling_mean_3"] = (
        grouped_price
        .shift(1)
        .rolling(3)
        .mean()
        .reset_index(level=[0, 1], drop=True)
    )

    df["price_rolling_mean_7"] = (
        grouped_price
        .shift(1)
        .rolling(7)
        .mean()
        .reset_index(level=[0, 1], drop=True)
    )

    # -----------------------------
    # Price change
    # -----------------------------

    df["price_change_1"] = (
        df["modal_price"] - df["price_lag_1"]
    )

    df["price_change_percent_1"] = (
        df["price_change_1"]
        / df["price_lag_1"]
        * 100
    )

    # -----------------------------
    # Arrival quantity features
    # -----------------------------

    grouped_arrival = df.groupby(
        ["crop", "market"]
    )["arrival_quantity"]

    df["arrival_lag_1"] = grouped_arrival.shift(1)

    df["arrival_rolling_mean_3"] = (
        grouped_arrival
        .shift(1)
        .rolling(3)
        .mean()
        .reset_index(level=[0, 1], drop=True)
    )

    df["arrival_change_1"] = (
        df["arrival_quantity"]
        - df["arrival_lag_1"]
    )

    # -----------------------------
    # Seasonality features
    # -----------------------------

    df["day_of_week"] = df["date"].dt.dayofweek
    df["month"] = df["date"].dt.month
    df["day_of_year"] = df["date"].dt.dayofyear

    # -----------------------------
    # Save
    # -----------------------------

    df.to_csv(
        OUTPUT_FILE,
        index=False
    )

    print()
    print("Feature engineering completed.")
    print(f"Input:  {DATA_FILE}")
    print(f"Output: {OUTPUT_FILE}")
    print()
    print("Columns created:")
    print(df.columns.tolist())


if __name__ == "__main__":
    create_features()