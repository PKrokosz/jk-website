#!/usr/bin/env tsx
/* eslint-disable no-console */
import {
  formatJourney,
  simulateUserJourneys,
  validateJourneysHaveLoops,
} from "../src/lib/navigation/journey-simulation";

const journeys = simulateUserJourneys({ userCount: 20 });

validateJourneysHaveLoops(journeys);

journeys.forEach((journey) => {
  console.log(formatJourney(journey));
});
