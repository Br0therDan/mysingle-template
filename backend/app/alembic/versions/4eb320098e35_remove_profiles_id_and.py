"""remove profiles.id and

Revision ID: 4eb320098e35
Revises: 76fae3f9962d
Create Date: 2025-01-07 17:28:34.946507

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '4eb320098e35'
down_revision: Union[str, None] = '76fae3f9962d'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Add profile_user_id to profile_roles
    op.add_column('profile_roles', sa.Column('profile_user_id', sa.UUID(as_uuid=True), nullable=False))

    # Drop foreign key constraint on profile_id in profile_roles
    op.drop_constraint('profile_roles_profile_id_fkey', 'profile_roles', type_='foreignkey')

    # Create new foreign key for profile_user_id linking to profiles.user_id
    op.create_foreign_key(
        'profile_roles_profile_user_id_fkey',
        'profile_roles',
        'profiles',
        ['profile_user_id'],
        ['user_id'],
        ondelete='CASCADE'
    )

    # Drop profile_id column from profile_roles
    op.drop_column('profile_roles', 'profile_id')

    # Drop the id column from profiles
    op.drop_column('profiles', 'id')

    # Drop the unique constraint profiles_user_id_key after dependencies are resolved
    op.execute("ALTER TABLE profiles DROP CONSTRAINT profiles_user_id_key")

    # Set user_id as the primary key for profiles
    op.create_primary_key('profiles_pkey', 'profiles', ['user_id'])


def downgrade() -> None:
    # Recreate the id column in profiles
    op.add_column('profiles', sa.Column('id', sa.UUID(as_uuid=True), primary_key=True, nullable=False))

    # Restore unique constraint on profiles.user_id
    op.create_unique_constraint('profiles_user_id_key', 'profiles', ['user_id'])

    # Recreate profile_id column in profile_roles
    op.add_column('profile_roles', sa.Column('profile_id', sa.UUID(as_uuid=True), nullable=False))

    # Remove the profile_user_id foreign key
    op.drop_constraint('profile_roles_profile_user_id_fkey', 'profile_roles', type_='foreignkey')

    # Restore foreign key on profile_id linking to profiles.id
    op.create_foreign_key(
        'profile_roles_profile_id_fkey',
        'profile_roles',
        'profiles',
        ['profile_id'],
        ['id'],
        ondelete='CASCADE'
    )

    # Drop the profile_user_id column from profile_roles
    op.drop_column('profile_roles', 'profile_user_id')

    # Drop the primary key constraint on profiles.user_id
    op.drop_constraint('profiles_pkey', 'profiles', type_='primary')
