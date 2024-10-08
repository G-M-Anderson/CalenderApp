# **Calendar App for Software Engineering Fall 2024**

# Overview

Creating a Calendar application, to be developed as part of the Software Engineering course for Fall 2024. The initial project structure was created on 8/31 to facilitate development and testing. This calendar will be interactive and allows the user to tailor it to their needs.


# Project Structure

Folders and Files:

    * calendar/ : Contains the core application code.
       * __calendar_init__.py : To be used to have cleaner interface by importing functions and classes, as well as holding some modules.
       * calendar.py : The main module for calendar functionality.
       * utils.py : Contains utility functions and classes that are used across the project. General-purpose helpers and common tasks. 
    
    * config/ : Contains configuration files. 
       * config.yaml : Configuration file for application settings (Formating, etc.)

    * gui/: Contains GUI codes and files
       * __gui_init__.py : Used to have cleaner interface for the GUI, by holding functions and classes.
       * app.py : GUI codes and functions stored here. 

    * tests/ : Contains test files.
       * __tests_init__.py : Can be empty or contain setup code for tests. This file initializes the test package. 
       * test_calendar.py : Where tests for the calendar functionality should be written. 


# Notes


# Update Log

Made some basic folders Calendar, Config and Tests to get us started. - 8/31, Garrett

Added 3 files under calendar folder, 1 file under config folder and 2 files under tests folder. - 8/31, Garrett

Imported datetime library and created basic functions to get current date. - 8/31, Garrett

Imported Tkinter library and added basic functions for GUI. -9/2, Garrett