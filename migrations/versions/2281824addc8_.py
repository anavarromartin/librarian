"""empty message

Revision ID: 2281824addc8
Revises: 3f4e9345540d
Create Date: 2019-01-17 22:05:27.995806

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '2281824addc8'
down_revision = '3f4e9345540d'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('checkout_histories',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('name', sa.String(length=120), nullable=False),
    sa.Column('email', sa.String(length=120), nullable=False),
    sa.Column('checkout_time', sa.DateTime(), nullable=True),
    sa.Column('checkin_time', sa.DateTime(), nullable=True),
    sa.Column('book_id', sa.Integer(), nullable=True),
    sa.ForeignKeyConstraint(['book_id'], ['books.id'], name=op.f('fk_checkout_histories_book_id_books')),
    sa.PrimaryKeyConstraint('id', name=op.f('pk_checkout_histories'))
    )
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('checkout_histories')
    # ### end Alembic commands ###