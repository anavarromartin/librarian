import click
import os

HERE = os.path.abspath(os.path.dirname(__file__))
PROJECT_ROOT = os.path.join(HERE, os.pardir)
TEST_PATH = os.path.join(PROJECT_ROOT, 'tests')


@click.command()
@click.argument('single', required=False)
def test(single):
    """Run the tests."""
    import pytest
    if(single == None):
        rv = pytest.main([TEST_PATH, '-vv'])
    else:
        rv = pytest.main([TEST_PATH, '-vv', '-k', single])
    exit(rv)