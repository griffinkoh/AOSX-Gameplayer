import { useMemo } from "react";
import CategoryTile from "./CategoryTile";
import type { CategoryTile as CatTile } from "../../pages/Team/Category/categoryTypes";

const POINT_ROWS = [10, 20, 30, 40] as const;

function uniq<T>(arr: T[]) {
  return Array.from(new Set(arr));
}

export default function CategoryBoard(props: {
  tiles: CatTile[];
  onDropTeamOnTile: (tileId: number, teamId: string) => void;

  // optional: if you still want click-to-pick using selected team, pass these
  selectedTeamId?: string;
  onClickPick?: (tileId: number, teamId: string) => void;
}) {
  const categories = useMemo(() => {
    // Keep stable order: unique in appearance order
    const cats = uniq(props.tiles.map((t) => t.category).filter(Boolean));
    // Ensure exactly 5 columns; if your data has more/less, still render what exists.
    return cats.slice(0, 5);
  }, [props.tiles]);

  const tileByCatPoints = useMemo(() => {
    const m = new Map<string, CatTile>();
    for (const t of props.tiles) {
      const k = `${t.category}__${t.points}`;
      m.set(k, t);
    }
    return m;
  }, [props.tiles]);

  return (
    <div className="catGridBoard" role="grid" aria-label="Category board">
      {/* HEADER ROW (5 columns) */}
      <div className="catHeaderRow">
        {categories.map((cat) => (
          <div key={cat} className="catHeaderCell">
            {cat}
          </div>
        ))}
      </div>

      {/* 4 POINT ROWS */}
      <div className="catBodyGrid">
        {POINT_ROWS.map((pts) =>
          categories.map((cat) => {
            const tile = tileByCatPoints.get(`${cat}__${pts}`) ?? null;

            // If missing tile in DB, render a disabled placeholder
            if (!tile) {
              return (
                <div
                  key={`${cat}-${pts}-missing`}
                  className="catTile catTileMissing"
                  aria-disabled="true"
                >
                  <div className="catTilePts">{pts}</div>
                  <div className="catTileSub">{cat}</div>
                </div>
              );
            }

            return (
              <CategoryTile
                key={`${cat}-${pts}-${tile.id}`}
                tile={tile}
                onDropTeam={(teamId) => props.onDropTeamOnTile(tile.id, teamId)}
                // optional click-to-pick
                onClickPick={
                  props.onClickPick && props.selectedTeamId
                    ? () => props.onClickPick!(tile.id, props.selectedTeamId!)
                    : undefined
                }
              />
            );
          })
        )}
      </div>
    </div>
  );
}
