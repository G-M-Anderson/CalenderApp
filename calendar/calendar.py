# calendar/calendar.py

# Importing datetime library
from datetime import datetime, timedelta


# Function for getting today's date
def get_today_date():
    """Return today's date."""
    return datetime.now().date()

# Function to get future dates
def get_future_date(days):
    """Return a date that is a certain number of days in the future"""
    return datetime.now() + timedelta(days=days)

