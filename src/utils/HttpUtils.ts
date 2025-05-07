import createHttpError from "http-errors";

/**
 * Parses the number in the query parameter.
 *
 * @param inp Input from the query param.
 * @param def Default value to return in case of invalid input.
 * @returns Number adhering to the criteria.
 */
export function parseQueryNumber(
  inp: unknown,
  def: number,
  max?: number,
  min?: number
): number {
  let num: number = def;

  if (typeof inp === "number" && !isNaN(inp)) num = inp;
  else if (typeof inp === "string") {
    num = parseInt(inp);
    if (isNaN(num)) num = def;
  }

  if (max && num > max) return max;
  if (min && num < min) return min;
  return num;
}

/** Checks if the body is present and is an object. */
export function checkRequestBody(body: unknown): void {
  if (!body) throw createHttpError(400, "No request body.");
  if (typeof body !== "object")
    throw createHttpError(500, "Invalid request body.");
}
