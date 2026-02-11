import { eq } from "drizzle-orm";
import { db } from "../db/index.js";
import { locations } from "../db/schema.js";
import { NotFoundError } from "../middleware/error-handler.js";

export async function getLocation(locationId: string) {
  const result = db
    .select()
    .from(locations)
    .where(eq(locations.id, locationId))
    .get();

  if (!result) {
    throw new NotFoundError(
      `Location '${locationId}' not found. Use a valid location ID (e.g. 'berlin-de', 'new-york-us').`,
    );
  }

  return result;
}

export async function getLocationFactor(locationId: string): Promise<number> {
  const location = await getLocation(locationId);
  return location.costOfLivingIndex;
}
