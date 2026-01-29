import CategoryTile from "./CategoryTile";
import type { CategoryTile as CategoryTileType } from "../../pages/Team/Category/categoryTypes";

export default function CategoryCard(props: {
  title: string;
  open: boolean;
  onToggleOpen: () => void;

  tiles: CategoryTileType[]; // tiles in this category
  onDropTeamOnTile: (tileId: number, teamId: string) => void;
}) {
  const { title, open, onToggleOpen, tiles, onDropTeamOnTile } = props;

  // Sort by points so it shows 10/20/30/40 in order
  const sorted = [...tiles].sort((a, b) => a.points - b.points);

  return (
    <div className={`catCard ${open ? "catCardOpen" : ""}`}>
      <button className="catHeader" onClick={onToggleOpen} type="button">
        <div className="catHeaderTitle">{title}</div>
        <div className="catHeaderChevron">{open ? "▴" : "▾"}</div>
      </button>

      {open && (
        <div className="catBody">
          <div className="catValueGrid">
            {sorted.map((t) => (
              <CategoryTile
                key={t.id}
                tile={t} // ✅ FIX: pass ONE tile, not the whole array
                onDropTeam={(teamId) => onDropTeamOnTile(t.id, teamId)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
