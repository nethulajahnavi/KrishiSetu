"""add market price freshness fields

Revision ID: a55a9eb691e6
Revises: b7c2d9e4f101
Create Date: 2026-09-14 13:19:04.426192

"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = "a55a9eb691e6"
down_revision: Union[str, Sequence[str], None] = "b7c2d9e4f101"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Add market price freshness and demo-data fields."""

    op.add_column(
        "market_prices",
        sa.Column(
            "is_demo_data",
            sa.Boolean(),
            nullable=False,
            server_default=sa.false(),
        ),
    )

    op.add_column(
        "market_prices",
        sa.Column(
            "last_updated_at",
            sa.DateTime(),
            server_default=sa.text("now()"),
            nullable=True,
        ),
    )


def downgrade() -> None:
    """Remove market price freshness and demo-data fields."""

    op.drop_column(
        "market_prices",
        "last_updated_at",
    )

    op.drop_column(
        "market_prices",
        "is_demo_data",
    )