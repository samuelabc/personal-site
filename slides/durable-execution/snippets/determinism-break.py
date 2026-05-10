# This breaks replay — non-deterministic branch
if random.random() > 0.5:
    step_a()   # checkpoint saved for position 1
else:
    step_b()   # on replay, position 1 expects step_a!
