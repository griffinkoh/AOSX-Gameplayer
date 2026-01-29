import type { Cell, Dir, CrosswordPuzzle } from "../types";

export function isLetter(x: string) {
  return /^[A-Z]$/.test(x);
}

export function idx(size: number, r: number, c: number) {
  return r * size + c;
}

export function buildGrid(puzzle: CrosswordPuzzle): Cell[] {
  const { size, ans } = puzzle;
  const grid: Cell[] = [];

  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      const raw = ans[r]?.[c] ?? "#";
      const isBlock = raw === "#";
      grid.push({
        r,
        c,
        isBlock,
        solution: isBlock ? undefined : raw,
        entry: "",
      });
    }
  }
  return grid;
}

// Number EVERYTHING (including blocks) 1..(size*size)
export function computeNumbersAll(cells: Cell[]) {
  let n = 1;
  return cells.map((cell) => ({ ...cell, number: n++ }));
}

export function findFirstPlayable(cells: Cell[]) {
  return cells.find((c) => !c.isBlock) ?? null;
}

export function findWordStart(size: number, cells: Cell[], r: number, c: number, dir: Dir) {
  let rr = r, cc = c;

  while (true) {
    const prevR = dir === "down" ? rr - 1 : rr;
    const prevC = dir === "across" ? cc - 1 : cc;
    if (prevR < 0 || prevC < 0) break;

    const prev = cells[idx(size, prevR, prevC)];
    if (!prev || prev.isBlock) break;

    rr = prevR;
    cc = prevC;
  }

  return { r: rr, c: cc };
}

export function wordCells(size: number, cells: Cell[], startR: number, startC: number, dir: Dir) {
  const res: Cell[] = [];
  let r = startR, c = startC;

  while (r >= 0 && c >= 0 && r < size && c < size) {
    const cell = cells[idx(size, r, c)];
    if (cell.isBlock) break;
    res.push(cell);
    if (dir === "across") c++;
    else r++;
  }

  return res;
}
