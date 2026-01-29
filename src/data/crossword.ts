import type { CrosswordPuzzle } from "../types";

export const WFE_CROSSWORD: CrosswordPuzzle = {
  size: 9,
  ans: [
    "W # # # # # # # #",
    "A L E X A # B # #",
    "T I # # T I C # #",
    "F G # # I # P A N",
    "O H # # S # # # #",
    "R T # # # # # # #",
    "D I V E R S I O N",
    "# N # # # A # # #",
    "# G # # # R # # #",
  ].map((row) => row.split(" ")),
  clues: [
    { number: 10, dir: "across", text: "I can view flight totes using the _________." },
    { number: 23, dir: "across", text: "I assist my Tower and Ground controllers." },
    { number: 34, dir: "across", text: "The pilot will transmit a _____ call during an Urgency situation." },
    { number: 55, dir: "across", text: "When an aircraft is unable to return back to this primary aerodrome, the aircraft will request for ____________?" },
    { number: 1, dir: "down", text: "_________ is an interface that integrates both frequency and landline communications?" },
    { number: 11, dir: "down", text: "Aircraft rely on the airfield ________ to assist them to land on the runway at night." },
    { number: 14, dir: "down", text: "I am used to disseminate weather and aerodrome status information for the pilots." },
    { number: 16, dir: "down", text: "I am the brain for the base." },
    { number: 60, dir: "down", text: "When there is an aircraft emergency, _ _ _ aircraft is activated." },
  ],
};
