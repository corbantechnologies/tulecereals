"use server";

// Import your auth framework's session helper, for example:
// import { getServerSession } from "next-auth"; // For NextAuth
// import { auth } from "@/auth"; // For Auth.js v5 / Clerk / Kinde

interface ContactInput {
  firstName: string;
  lastName: string;
  email: string;
  message: string;
}

export async function saveContactMessage(data: ContactInput) {
  try {
    // 1. Authenticate the request on the server side
    // const session = await auth(); // Or getServerSession()
    const isAuthenticated = true; // Replace with: !!session

    if (!isAuthenticated) {
      return { 
        success: false, 
        error: "Unauthorized. You must be logged in to send a message." 
      };
    }

    // 2. Validate input fields
    if (!data.firstName || !data.lastName || !data.email || !data.message) {
      return { success: false, error: "All fields are required." };
    }

    // -------------------------------------------------------------
    // DATABASE LOGIC (Prisma, Mongoose, Drizzle, etc.)
    // -------------------------------------------------------------
    // await db.contactMessage.create({ data });
    // -------------------------------------------------------------

    await new Promise((resolve) => setTimeout(resolve, 1000));
    return { success: true };

  } catch (error) {
    console.error("Database connection error:", error);
    return { 
      success: false, 
      error: "Failed to save message. Please try again later." 
    };
  }
}