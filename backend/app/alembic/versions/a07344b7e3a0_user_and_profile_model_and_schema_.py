"""user and profile model and schema updated

Revision ID: a07344b7e3a0
Revises: 4eb320098e35
Create Date: 2025-01-07 21:44:16.637393

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'a07344b7e3a0'
down_revision: Union[str, None] = '4eb320098e35'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    pass

def downgrade() -> None:
    pass
