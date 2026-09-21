"""phase 2 database foundation

Revision ID: b7c2d9e4f101
Revises: a6622de85062
"""

from alembic import op
from app.database import Base
import app.models  # noqa: F401


revision = "b7c2d9e4f101"
down_revision = "a6622de85062"
branch_labels = None
depends_on = None


def upgrade() -> None:
    # Non-destructive foundation migration.
    # Creates only tables that do not already exist.
    Base.metadata.create_all(bind=op.get_bind(), checkfirst=True)


def downgrade() -> None:
    raise RuntimeError(
        "Phase 2 foundation migration is intentionally non-destructive; "
        "downgrade is disabled."
    )
