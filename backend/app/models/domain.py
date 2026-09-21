from datetime import datetime

from sqlalchemy import (
    Boolean, Column, Date, DateTime, ForeignKey, Integer,
    Numeric, String, Text
)
from app.database import Base


class UserRoleAssignment(Base):
    __tablename__ = "user_roles"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    role = Column(String(30), nullable=False)
    is_primary = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)


class UserPreference(Base):
    __tablename__ = "user_preferences"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    language = Column(String(10), default="en")
    sound_enabled = Column(Boolean, default=True)
    notifications_enabled = Column(Boolean, default=True)
    low_bandwidth_mode = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


class BuyerProfile(Base):
    __tablename__ = "buyer_profiles"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    business_name = Column(String(200), nullable=False)
    business_type = Column(String(100))
    location = Column(String(200))
    district = Column(String(100))
    state = Column(String(100))
    verification_status = Column(String(30), default="pending")
    trust_score = Column(Numeric(5, 2), default=50)
    created_at = Column(DateTime, default=datetime.utcnow)


class FPOProfile(Base):
    __tablename__ = "fpo_profiles"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    organization_name = Column(String(200), nullable=False)
    registration_number = Column(String(100))
    village = Column(String(150))
    district = Column(String(100))
    state = Column(String(100))
    member_count = Column(Integer, default=0)
    verification_status = Column(String(30), default="pending")
    created_at = Column(DateTime, default=datetime.utcnow)


class TransporterProfile(Base):
    __tablename__ = "transporter_profiles"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    business_name = Column(String(200))
    contact_name = Column(String(150))
    district = Column(String(100))
    state = Column(String(100))
    verification_status = Column(String(30), default="pending")
    trust_score = Column(Numeric(5, 2), default=50)
    created_at = Column(DateTime, default=datetime.utcnow)


class Crop(Base):
    __tablename__ = "crops"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    variety = Column(String(100))
    category = Column(String(100))
    created_at = Column(DateTime, default=datetime.utcnow)


class Market(Base):
    __tablename__ = "markets"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(200), nullable=False)
    market_code = Column(String(100))
    district = Column(String(100))
    state = Column(String(100))
    latitude = Column(Numeric(10, 7))
    longitude = Column(Numeric(10, 7))
    created_at = Column(DateTime, default=datetime.utcnow)


class PriceHistory(Base):
    __tablename__ = "price_history"
    id = Column(Integer, primary_key=True, index=True)
    crop_id = Column(Integer, ForeignKey("crops.id"))
    market_id = Column(Integer, ForeignKey("markets.id"))
    price_date = Column(Date, nullable=False)
    min_price = Column(Numeric(12, 2))
    max_price = Column(Numeric(12, 2))
    modal_price = Column(Numeric(12, 2))
    arrival_quantity = Column(Numeric(12, 2))
    source = Column(String(200))
    data_status = Column(String(30), default="LIVE")
    created_at = Column(DateTime, default=datetime.utcnow)


class FarmerLot(Base):
    __tablename__ = "farmer_lots"
    id = Column(Integer, primary_key=True, index=True)
    farmer_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    crop_id = Column(Integer, ForeignKey("crops.id"))
    quantity = Column(Numeric(12, 2), nullable=False)
    unit = Column(String(30), default="kg")
    quality_grade = Column(String(50))
    variety = Column(String(100))
    harvest_date = Column(Date)
    expected_ready_date = Column(Date)
    location = Column(String(200))
    district = Column(String(100))
    state = Column(String(100))
    status = Column(String(30), default="AVAILABLE")
    created_at = Column(DateTime, default=datetime.utcnow)


class FPOLot(Base):
    __tablename__ = "fpo_lots"
    id = Column(Integer, primary_key=True, index=True)
    fpo_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    crop_id = Column(Integer, ForeignKey("crops.id"))
    quantity = Column(Numeric(12, 2), nullable=False)
    unit = Column(String(30), default="kg")
    quality_grade = Column(String(50))
    variety = Column(String(100))
    location = Column(String(200))
    district = Column(String(100))
    state = Column(String(100))
    status = Column(String(30), default="AVAILABLE")
    created_at = Column(DateTime, default=datetime.utcnow)


class BuyerRequirement(Base):
    __tablename__ = "buyer_requirements"
    id = Column(Integer, primary_key=True, index=True)
    buyer_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    crop_id = Column(Integer, ForeignKey("crops.id"))
    quantity_required = Column(Numeric(12, 2), nullable=False)
    unit = Column(String(30), default="kg")
    min_quality_grade = Column(String(50))
    variety = Column(String(100))
    target_price = Column(Numeric(12, 2))
    required_date = Column(Date)
    destination = Column(String(200))
    district = Column(String(100))
    state = Column(String(100))
    status = Column(String(30), default="OPEN")
    created_at = Column(DateTime, default=datetime.utcnow)


class Offer(Base):
    __tablename__ = "offers"
    id = Column(Integer, primary_key=True, index=True)
    farmer_id = Column(Integer, ForeignKey("users.id"))
    buyer_id = Column(Integer, ForeignKey("users.id"))
    farmer_lot_id = Column(Integer, ForeignKey("farmer_lots.id"))
    buyer_requirement_id = Column(Integer, ForeignKey("buyer_requirements.id"))
    offered_price = Column(Numeric(12, 2), nullable=False)
    quantity = Column(Numeric(12, 2), nullable=False)
    message = Column(Text)
    status = Column(String(30), default="PENDING")
    expires_at = Column(DateTime)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


class Vehicle(Base):
    __tablename__ = "vehicles"
    id = Column(Integer, primary_key=True, index=True)
    transporter_id = Column(Integer, ForeignKey("users.id"))
    vehicle_number = Column(String(50), nullable=False)
    vehicle_type = Column(String(100))
    capacity_kg = Column(Numeric(12, 2))
    refrigerated = Column(Boolean, default=False)
    status = Column(String(30), default="AVAILABLE")
    created_at = Column(DateTime, default=datetime.utcnow)


class TransportQuote(Base):
    __tablename__ = "transport_quotes"
    id = Column(Integer, primary_key=True, index=True)
    transporter_id = Column(Integer, ForeignKey("users.id"))
    origin = Column(String(200), nullable=False)
    destination = Column(String(200), nullable=False)
    distance_km = Column(Numeric(10, 2))
    quantity_kg = Column(Numeric(12, 2))
    transport_cost = Column(Numeric(12, 2))
    loading_cost = Column(Numeric(12, 2), default=0)
    unloading_cost = Column(Numeric(12, 2), default=0)
    estimated_time_hours = Column(Numeric(8, 2))
    source = Column(String(100), default="TRANSPORTER")
    status = Column(String(30), default="ACTIVE")
    created_at = Column(DateTime, default=datetime.utcnow)

class PricePrediction(Base):
    __tablename__ = "price_predictions"

    id = Column(Integer, primary_key=True, index=True)
    crop_id = Column(Integer, ForeignKey("crops.id"))
    market_id = Column(Integer, ForeignKey("markets.id"))
    prediction_date = Column(Date, nullable=False)
    predicted_price = Column(Numeric(12, 2))
    lower_bound = Column(Numeric(12, 2))
    upper_bound = Column(Numeric(12, 2))
    model_name = Column(String(100))
    confidence = Column(Numeric(5, 2))
    created_at = Column(DateTime, default=datetime.utcnow)

class MarketRecommendation(Base):
    __tablename__ = "market_recommendations"
    id = Column(Integer, primary_key=True, index=True)
    farmer_id = Column(Integer, ForeignKey("users.id"))
    crop_id = Column(Integer, ForeignKey("crops.id"))
    market_id = Column(Integer, ForeignKey("markets.id"))
    score = Column(Numeric(6, 2))
    expected_price = Column(Numeric(12, 2))
    estimated_transport_cost = Column(Numeric(12, 2))
    estimated_net_realisation = Column(Numeric(12, 2))
    distance_km = Column(Numeric(10, 2))
    demand_score = Column(Numeric(6, 2))
    risk_score = Column(Numeric(6, 2))
    explanation = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)


class WeatherData(Base):
    __tablename__ = "weather_data"
    id = Column(Integer, primary_key=True, index=True)
    location = Column(String(200), nullable=False)
    district = Column(String(100))
    state = Column(String(100))
    temperature = Column(Numeric(6, 2))
    humidity = Column(Numeric(6, 2))
    rainfall = Column(Numeric(8, 2))
    weather_condition = Column(String(100))
    forecast_date = Column(Date)
    source = Column(String(200))
    fetched_at = Column(DateTime, default=datetime.utcnow)


class Notification(Base):
    __tablename__ = "notifications"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    title = Column(String(200), nullable=False)
    message = Column(Text, nullable=False)
    notification_type = Column(String(50))
    is_read = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)


class Grievance(Base):
    __tablename__ = "grievances"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    subject = Column(String(200), nullable=False)
    description = Column(Text, nullable=False)
    category = Column(String(100))
    status = Column(String(30), default="OPEN")
    resolution = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


class SyncRecord(Base):
    __tablename__ = "sync_records"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    operation = Column(String(50), nullable=False)
    entity_type = Column(String(100), nullable=False)
    entity_id = Column(Integer)
    payload = Column(Text)
    status = Column(String(30), default="PENDING")
    created_at = Column(DateTime, default=datetime.utcnow)
    synced_at = Column(DateTime)


class AuditLog(Base):
    __tablename__ = "audit_logs"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    action = Column(String(100), nullable=False)
    entity_type = Column(String(100))
    entity_id = Column(Integer)
    details = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)
