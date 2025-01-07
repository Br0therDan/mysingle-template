"""remove profiles.id and

Revision ID: 4eb320098e35
Revises: 76fae3f9962d
Create Date: 2025-01-07 17:28:34.946507

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '4eb320098e35'
down_revision = '76fae3f9962d'
branch_labels = None
depends_on = None


def upgrade() -> None:
    # Step 1: Add profile_user_id column to profile_roles
    op.add_column('profile_roles', sa.Column('profile_user_id', sa.UUID(as_uuid=True), nullable=False))

    # Step 2: Drop the foreign key constraint on profile_roles.profile_id
    op.drop_constraint('profile_roles_profile_id_fkey', 'profile_roles', type_='foreignkey')

    # Step 3: Drop the profile_id column from profile_roles
    op.drop_column('profile_roles', 'profile_id')

    # Step 4: Drop the profiles_user_id_key constraint
    op.execute("""
        ALTER TABLE profiles DROP CONSTRAINT profiles_user_id_key CASCADE
    """)

    # Step 5: Drop the id column from profiles
    op.drop_column('profiles', 'id')

    # Step 6: Create a new foreign key linking profile_user_id to profiles.user_id
    op.create_foreign_key(
        'profile_roles_profile_user_id_fkey',
        'profile_roles',
        'profiles',
        ['profile_user_id'],
        ['user_id'],
        ondelete='CASCADE'
    )

    # Step 7: Set profiles.user_id as the primary key
    op.create_primary_key('profiles_pkey', 'profiles', ['user_id'])


def downgrade() -> None:
    # Reverse Step 7: Drop the primary key on profiles.user_id
    op.drop_constraint('profiles_pkey', 'profiles', type_='primary')

    # Reverse Step 6: Drop the new foreign key on profile_user_id
    op.drop_constraint('profile_roles_profile_user_id_fkey', 'profile_roles', type_='foreignkey')

    # Reverse Step 5: Add the id column back to profiles
    op.add_column('profiles', sa.Column('id', sa.UUID(as_uuid=True), primary_key=True, nullable=False))

    # Reverse Step 4: Add the unique constraint back on profiles.user_id
    op.create_unique_constraint('profiles_user_id_key', 'profiles', ['user_id'])

    # Reverse Step 3: Add the profile_id column back to profile_roles
    op.add_column('profile_roles', sa.Column('profile_id', sa.UUID(as_uuid=True), nullable=False))

    # Reverse Step 2: Add the foreign key back on profile_roles.profile_id
    op.create_foreign_key(
        'profile_roles_profile_id_fkey',
        'profile_roles',
        'profiles',
        ['profile_id'],
        ['id'],
        ondelete='CASCADE'
    )

    # Reverse Step 1: Drop the profile_user_id column from profile_roles
    op.drop_column('profile_roles', 'profile_user_id')