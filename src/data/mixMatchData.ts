import type { MixMatchPuzzle } from "../types";

export const DEMO_MIXMATCH_5X5: MixMatchPuzzle = {
  id: "demo-5x5",
  size: 5,
  options: [
    // options
    { id: "o1", label: "Apple" },
    { id: "o2", label: "Banana" },
    { id: "o3", label: "Orange" },
    { id: "o4", label: "Car" },
    { id: "o5", label: "Bus" },
    { id: "o6", label: "Train" },
    { id: "o7", label: "Dog" },
    { id: "o8", label: "Cat" },
    { id: "o9", label: "Fish" },
    { id: "o10", label: "Red" },
    { id: "o11", label: "Blue" },
    { id: "o12", label: "Green" },

    // fill out to at least cover all required options:
    { id: "o13", label: "Chair" },
    { id: "o14", label: "Table" },
    { id: "o15", label: "Sofa" },
    { id: "o16", label: "Guitar" },
    { id: "o17", label: "Piano" },
    { id: "o18", label: "Drums" },
    { id: "o19", label: "Circle" },
    { id: "o20", label: "Square" },
    { id: "o21", label: "Triangle" },
    { id: "o22", label: "Milk" },
    { id: "o23", label: "Water" },
    { id: "o24", label: "Juice" },
    { id: "o25", label: "Coffee" },

    // optional: decoys
    { id: "d1", label: "Decoy 1" },
    { id: "d2", label: "Decoy 2" },
  ],
  tiles: Array.from({ length: 25 }).map((_, i) => {
    const id = `t${i + 1}`;
    return {
      id,
      title: `Tile ${i + 1}`,
      requiredOptionIds: ["o1"], // will overwrite below for variety
    };
  }).map((t, idx) => {
    // create some tiles needing multiple options
    const n = idx + 1;

    // example patterns
    if (n === 1) return { ...t, title: "Fruits", requiredOptionIds: ["o1", "o2", "o3"] };
    if (n === 2) return { ...t, title: "Transport", requiredOptionIds: ["o4", "o5", "o6"] };
    if (n === 3) return { ...t, title: "Pets", requiredOptionIds: ["o7", "o8"] };
    if (n === 4) return { ...t, title: "Colors", requiredOptionIds: ["o10", "o11", "o12"] };
    if (n === 5) return { ...t, title: "Furniture", requiredOptionIds: ["o13", "o14"] };
    if (n === 6) return { ...t, title: "Instruments", requiredOptionIds: ["o16", "o17", "o18"] };
    if (n === 7) return { ...t, title: "Shapes", requiredOptionIds: ["o19", "o20", "o21"] };
    if (n === 8) return { ...t, title: "Drinks", requiredOptionIds: ["o22", "o23"] };

    // rest single requirement (for demo)
    const optionId = `o${((n - 1) % 25) + 1}`;
    return { ...t, title: `Match ${optionId.toUpperCase()}`, requiredOptionIds: [optionId] };
  }),
};
