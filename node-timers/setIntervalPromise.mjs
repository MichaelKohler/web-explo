import {
  setInterval as every,
} from 'node:timers/promises';

const SECOND = 1000;

for await (const _ of every(SECOND)) {
  console.log("hi");
}