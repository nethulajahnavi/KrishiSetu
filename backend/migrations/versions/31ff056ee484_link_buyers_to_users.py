"""link buyers to users

Revision ID: 31ff056ee484
Revises: c908810ebf7a
Create Date: 2026-09-20 13:20:59.671023

"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = "31ff056ee484"
down_revision: Union[str, Sequence[str], None] = "c908810ebf7a"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Add user_id relationship to buyers table."""

    op.add_column(
        "buyers",
        sa.Column(
            "user_id",
            sa.Integer(),
            nullable=True
        )
    )

    op.create_index(
        "ix_buyers_user_id",
        "buyers",
        ["user_id"],
        unique=True
    )

    op.create_foreign_key(
        "fk_buyers_user_id_users",
        "buyers",
        "users",
        ["user_id"],
        ["id"]
    )


def downgrade() -> None:
    """Remove user_id relationship from buyers table."""

    op.drop_constraint(
        "fk_buyers_user_id_users",
        "buyers",
        type_="foreignkey"
    )

    op.drop_index(
        "ix_buyers_user_id",
        table_name="buyers"
    )

    op.drop_column(
        "buyers",
        "user_id"
    )