#file to contain functions for creating events

import pygame
pygame.init()
#GUI here, open window

#variable like 
program_running = True
#begin event handling loop
while (program_running):
  for event in pygame.event.get():
    if event.type == pygame.QUIT:
      #exit behavior
      program_running = False
    #handle all possible event types

pygame.quit()
quit()

