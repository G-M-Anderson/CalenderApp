# calendar/utils.py

from datetime import datetime

# Format of Date Function
def format_date(date):
    """Return a string representation of the date in YYYY-MM--DD format."""
    return date.strftime('%Y-%m-%d')

# String Parsing Function for datetime objects
def parse_date(date_str):
    """Parse a date string into a datetime object"""
    return datetime.strptime(date_str, '%Y-%m-%d')
