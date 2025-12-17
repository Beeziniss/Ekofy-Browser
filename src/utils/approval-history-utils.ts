import { execute } from "@/gql/execute";
import { 
  ApprovalHistoriesArtistQuery, 
  ApprovalHistoriesUserQuery,
  ApprovalHistoriesCategoryQuery,
  ApprovalHistoriesUserFullInfoQuery
} from "@/modules/shared/queries/moderator/approval-histories-queries";

interface Artist {
  id?: string | null;
  userId?: string | null;
  stageName?: string | null;
  email?: string | null;
}

interface User {
  id?: string | null;
  artists?: {
    items?: Artist[] | null;
  } | null;
}

interface Category {
  id?: string | null;
  name?: string | null;
  type?: string | null;
}

/**
 * Fetch artist names by artist IDs
 * @param artistIds - Array of artist IDs or user IDs
 * @returns Promise<Map<string, string>> - Map of ID to stage name
 */
export async function fetchArtistNames(artistIds: string[]): Promise<Map<string, string>> {
  if (!artistIds || artistIds.length === 0) return new Map();

  const artistMap = new Map<string, string>();

  try {
    // Try to fetch as artist IDs first
    const artistResult = await execute(ApprovalHistoriesArtistQuery, {
      where: {
        id: { in: artistIds }
      }
    });

    // Add artists to map
    artistResult?.artists?.items?.forEach((artist: Artist) => {
      if (artist?.id && artist?.stageName) {
        artistMap.set(artist.id, artist.stageName);
      }
    });

    // For IDs not found as artists, try as user IDs
    const notFoundIds = artistIds.filter(id => !artistMap.has(id));
    
    if (notFoundIds.length > 0) {
      const userResult = await execute(ApprovalHistoriesUserQuery, {
        where: {
          id: { in: notFoundIds }
        }
      });

      userResult?.users?.items?.forEach((user: User) => {
        if (user?.id && user?.artists?.items && user.artists.items.length > 0) {
          const artist = user.artists.items[0];
          if (artist?.stageName) {
            artistMap.set(user.id, artist.stageName);
          }
        }
      });
    }
  } catch (error) {
    console.error("Error fetching artist names:", error);
  }

  return artistMap;
}

/**
 * Fetch category names by category IDs
 * @param categoryIds - Array of category IDs
 * @returns Promise<Map<string, string>> - Map of ID to category name
 */
export async function fetchCategoryNames(categoryIds: string[]): Promise<Map<string, string>> {
  if (!categoryIds || categoryIds.length === 0) return new Map();

  const categoryMap = new Map<string, string>();

  try {
    const result = await execute(ApprovalHistoriesCategoryQuery, {
      where: {
        id: { in: categoryIds }
      }
    });

    result?.categories?.items?.forEach((category: Category) => {
      if (category?.id && category?.name) {
        categoryMap.set(category.id, category.name);
      }
    });
  } catch (error) {
    console.error("Error fetching category names:", error);
  }

  return categoryMap;
}

/**
 * Fetch a single artist name by ID
 * @param artistId - Artist ID or User ID
 * @returns Promise<string | null> - Artist stage name or null
 */
export async function fetchArtistName(artistId: string): Promise<string | null> {
  const map = await fetchArtistNames([artistId]);
  return map.get(artistId) || null;
}

/**
 * Fetch a single category name by ID
 * @param categoryId - Category ID
 * @returns Promise<string | null> - Category name or null
 */
export async function fetchCategoryName(categoryId: string): Promise<string | null> {
  const map = await fetchCategoryNames([categoryId]);
  return map.get(categoryId) || null;
}

/**
 * Fetch user emails by user IDs
 * @param userIds - Array of user IDs
 * @returns Promise<Map<string, string>> - Map of user ID to email
 */
export async function fetchUserEmails(userIds: string[]): Promise<Map<string, string>> {
  if (!userIds || userIds.length === 0) return new Map();

  const emailMap = new Map<string, string>();

  try {
    const result = await execute(ApprovalHistoriesUserQuery, {
      where: {
        id: { in: userIds }
      }
    });

    result?.users?.items?.forEach((user: User) => {
      if (user?.id && user?.artists?.items && user.artists.items.length > 0) {
        const artist = user.artists.items[0];
        if (artist?.email) {
          emailMap.set(user.id, artist.email);
        }
      }
    });
  } catch (error) {
    console.error("Error fetching user emails:", error);
  }

  return emailMap;
}

/**
 * Fetch user full information by user IDs
 * @param userIds - Array of user IDs
 * @returns Promise<Map<string, { fullName: string; email: string }>> - Map of user ID to user info
 */
export async function fetchUserFullInfo(userIds: string[]): Promise<Map<string, { fullName: string; email: string }>> {
  if (!userIds || userIds.length === 0) return new Map();

  const userInfoMap = new Map<string, { fullName: string; email: string }>();

  try {
    const result = await execute(ApprovalHistoriesUserFullInfoQuery, {
      where: {
        id: { in: userIds }
      }
    });

    result?.users?.items?.forEach((user: any) => {
      if (user?.id && user?.fullName && user?.email) {
        userInfoMap.set(user.id, {
          fullName: user.fullName,
          email: user.email
        });
      }
    });
  } catch (error) {
    console.error("Error fetching user full info:", error);
  }

  return userInfoMap;
}
