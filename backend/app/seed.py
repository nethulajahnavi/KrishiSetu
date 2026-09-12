from app.database import SessionLocal
from app.models.logistics import LogisticsOption


def seed_logistics():
    db = SessionLocal()

    try:
        # Avoid duplicate data
        if db.query(LogisticsOption).count() > 0:
            print("Logistics data already exists.")
            return

        logistics_data = [

            # Nashik -> Nashik APMC
            LogisticsOption(
                origin="Nashik",
                destination="Nashik APMC",
                distance_km=15,
                transport_type="Mini Truck",
                cost_per_quintal=350,
                loading_cost_per_quintal=50,
                unloading_cost_per_quintal=40,
                estimated_time_hours=1.5,
                available=True,
            ),

            # Nashik -> Pune APMC
            LogisticsOption(
                origin="Nashik",
                destination="Pune APMC",
                distance_km=210,
                transport_type="Truck",
                cost_per_quintal=650,
                loading_cost_per_quintal=50,
                unloading_cost_per_quintal=50,
                estimated_time_hours=5,
                available=True,
            ),

            # Nashik -> Mumbai APMC
            LogisticsOption(
                origin="Nashik",
                destination="Mumbai APMC",
                distance_km=165,
                transport_type="Truck",
                cost_per_quintal=600,
                loading_cost_per_quintal=50,
                unloading_cost_per_quintal=50,
                estimated_time_hours=4,
                available=True,
            ),

            # Nashik -> Bowenpally Market
            LogisticsOption(
                origin="Nashik",
                destination="Bowenpally Market",
                distance_km=690,
                transport_type="Large Truck",
                cost_per_quintal=1200,
                loading_cost_per_quintal=60,
                unloading_cost_per_quintal=60,
                estimated_time_hours=14,
                available=True,
            ),

            # Nashik -> Gaddiannaram Market
            LogisticsOption(
                origin="Nashik",
                destination="Gaddiannaram Market",
                distance_km=700,
                transport_type="Large Truck",
                cost_per_quintal=1250,
                loading_cost_per_quintal=60,
                unloading_cost_per_quintal=60,
                estimated_time_hours=14.5,
                available=True,
            ),

            # Nashik -> Mehdipatnam Market
            LogisticsOption(
                origin="Nashik",
                destination="Mehdipatnam Market",
                distance_km=705,
                transport_type="Large Truck",
                cost_per_quintal=1280,
                loading_cost_per_quintal=60,
                unloading_cost_per_quintal=60,
                estimated_time_hours=15,
                available=True,
            ),
        ]

        db.add_all(logistics_data)
        db.commit()

        print("Logistics demo data inserted successfully.")

    except Exception as e:
        db.rollback()
        print("Error inserting logistics data:", e)

    finally:
        db.close()


if __name__ == "__main__":
    seed_logistics()