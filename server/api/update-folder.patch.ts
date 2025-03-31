import { H3Event } from "h3";

interface UpdateFolderRequest {
  id: number;
  name: string;
}

export default defineEventHandler(async (event: H3Event) => {
  try {
    // Get request body
    const body = await readBody<UpdateFolderRequest>(event);

    // Validate request data
    if (!body.id) {
      return createError({
        statusCode: 400,
        statusMessage: "Missing folder ID",
      });
    }

    if (!body.name) {
      return createError({
        statusCode: 400,
        statusMessage: "Missing folder name",
      });
    }

    // In a real app, this would update the folder in a database
    // For demo purposes, we'll just return the updated folder

    return {
      success: true,
      data: {
        id: body.id,
        name: body.name,
        updatedAt: new Date().toISOString(),
      },
    };
  } catch (error) {
    return createError({
      statusCode: 500,
      statusMessage: "Failed to update folder",
      data: error,
    });
  }
});
