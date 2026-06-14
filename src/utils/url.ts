import type { CellState } from "../Components/Cell";

/**
 * Encodes ONLY the coordinates of living cells into a short, dense URL token.
 * Empty grid = ""
 */
export const createToken = (grid: CellState[][]): string => {
  const numColumns = grid[0]?.length || 50;
  const aliveIndices: number[] = [];

  // 1. Collect a single flat index number for each living cell
  grid.forEach((row, r) => {
    row.forEach((cellState, c) => {
      if (cellState === "alive") {
        const flatIndex = r * numColumns + c;
        aliveIndices.push(flatIndex);
      }
    });
  });

  if (aliveIndices.length === 0) return "";

  // 2. Join indices into a comma-separated string (e.g., "12,13,14,56,102")
  const rawString = aliveIndices.join(",");

  // 3. Convert to native Base64 and clean for URL safety
  return btoa(rawString)
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
};

/**
 * Decodes the sparse coordinate token back into a full 50x50 CellState[][] matrix.
 */
export const createGrid = (encoded: string, rows: number, cols: number): CellState[][] => {
  // 1. Initialize a clean, fully dead default canvas matrix
  const grid: CellState[][] = Array.from({ length: rows }, () => Array(cols).fill("dead"));
  
  if (!encoded) return grid;

  try {
    // 2. Reverse URL-safe Base64 adjustments back to standard ASCII string
    let base64 = encoded.replace(/-/g, "+").replace(/_/g, "/");
    while (base64.length % 4) base64 += "=";
    
    const rawString = atob(base64); // Resolves back to e.g., "12,13,14,56,102"
    
    // 3. Map over the text list tokens and convert them back to numbers
    const aliveIndices = rawString.split(",").map(Number);

    // 4. Hydrate the specific target coordinates to an 'alive' state
    aliveIndices.forEach(index => {
      const r = Math.floor(index / cols);
      const c = index % cols;
      
      // Bounds check protection guard rails
      if (r >= 0 && r < rows && c >= 0 && c < cols) {
        grid[r][c] = "alive";
      }
    });
  } catch (error) {
    console.error("Malformed share token provided to deserializer engine:", error);
  }

  return grid;
};
