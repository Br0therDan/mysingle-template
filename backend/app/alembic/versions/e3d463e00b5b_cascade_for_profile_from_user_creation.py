"""cascade for profile from user creation

Revision ID: e3d463e00b5b
Revises: 10b3f16e64eb
Create Date: 2025-01-07 23:57:56.693441

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'e3d463e00b5b'
down_revision: Union[str, None] = '10b3f16e64eb'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    pass
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    pass
    # ### end Alembic commands ###