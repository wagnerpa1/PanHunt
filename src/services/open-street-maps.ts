/**
 * Represents a geographical coordinate with latitude and longitude.
 */
export interface Coordinate {
  /**
   * The latitude of the location.
   */
  latitude: number;
  /**
   * The longitude of the location.
   */
  longitude: number;
}

/**
 * Represents information about a location, including its name and coordinates.
 */
export interface LocationInfo {
  /**
   * The name of the location.
   */
  displayName: string;
  /**
   * The geographical coordinates of the location.
   */
  coordinate: Coordinate;
}

/**
 * Asynchronously retrieves location information based on a query string.
 *
 * @param query The search query string.
 * @returns A promise that resolves to an array of LocationInfo objects matching the query.
 */
export async function getLocationInfo(query: string): Promise<LocationInfo[]> {
  // TODO: Implement this by calling the Open Street Maps API.

  return [
    {
      displayName: 'Pfarrkirchen',
      coordinate: {
        latitude: 48.4376,
        longitude: 12.9398,
      },
    },
  ];
}

/**
 * Asynchronously retrieves a route between two geographical coordinates.
 *
 * @param start The starting coordinate.
 * @param end The destination coordinate.
 * @returns A promise that resolves to a string representing the route (e.g., a polyline).
 */
export async function getRoute(start: Coordinate, end: Coordinate): Promise<string> {
  // TODO: Implement this by calling the Open Street Maps API.
  return 'stubbed route data';
}
