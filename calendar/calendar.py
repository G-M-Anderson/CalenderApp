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

# Function to get current year.
def get_current_year():
    """Return the current year."""
    return datetime.now.year()

# Function to get current month.
def get_current_month():
    """Return the current month."""
    return datetime.now.month()

# Eventual Calendar Functionality with GUI
class CalendarFunctionality:
    
    def __init__(self):
        self.events = {}
        
        # Checks to see if events occur in GUI
    def get_events(self, date):
        return self.events.get(date, [])
    
        # Adds events
    def add_event(self, date, event):
        if date not in self.events:
            self.events[date] = []
        self.events[date].append(event)
        
class Calendar(object):
    """Base calendar class, does not do any formating. Provides data to subclass"""
    # Days are organized by 0-6. 0 is Monday, 6 is Sunday.
    def __init__(self, firstweekday=6):
        self.firstweekday = firstweekday
        
    def getfirstweekday(self):
        return self.firstweekday % 7
    
    def setfirstweekday(self, firstweekday):
        self.firstweekday = firstweekday
        
    firstweekday = property(getfirstweekday, setfirstweekday)
    
