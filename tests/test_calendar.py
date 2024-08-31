# tests/test_calendar.py

import unittest
from datetime import datetime
from Calendar.calendar import get_today_date

class TestCalendar(unittest.TestCase):
    def test_get_today_date(self):
        """"Test the get_today_date function"""
        today = datetime.now().date()
        self.assertEqual(get_today_date(), today)