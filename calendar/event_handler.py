#file to contain functions for creating events

import pygame
pygame.init()
#GUI here, open window

#variable like 
program_running = TRUE
#begin event handling loop
while not (program_running):
  for event in pygame.event.get():
    if event.type == pygame.QUIT:
      #exit behavior

    #handle all possible event types

pygame.quit()
quit()

