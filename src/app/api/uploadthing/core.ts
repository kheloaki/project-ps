import { createUploadthing, type FileRouter } from "uploadthing/next";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

const f = createUploadthing();

// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {
  // Define as many FileRoutes as you like, each with a unique routeSlug
  imageUploader: f({ image: { maxFileSize: "10MB", maxFileCount: 1 } })
    // Set permissions and file types for this FileRoute
    .middleware(async () => {
      // This code runs on your server before upload
      // Verify user is authenticated
      const { userId } = await auth();
      
      if (!userId) {
        throw new Error("Unauthorized");
      }
      
      // Whatever is returned here is accessible in onUploadComplete as `metadata`
      return { userId };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      // This code RUNS ON YOUR SERVER after upload
      console.log("Upload complete for userId:", metadata.userId);
      console.log("file url", file.url);
      
      // Save to Media table
      try {
        await (prisma as any).media.upsert({
          where: { url: file.url },
          update: {},
          create: {
            url: file.url,
            filename: file.name,
            size: file.size,
            mimeType: file.type,
            uploadedBy: metadata.userId || null,
          },
        });
      } catch (error) {
        console.error('Error saving media to database:', error);
        // Don't fail the upload if database save fails
      }
      
      // !!! Whatever is returned here is sent to the clientside `onClientUploadComplete` callback
      return { uploadedBy: metadata.userId };
    }),
  
  // PDF uploader for COA documents
  pdfUploader: f({ pdf: { maxFileSize: "10MB", maxFileCount: 1 } })
    .middleware(async () => {
      const { userId } = await auth();
      
      if (!userId) {
        throw new Error("Unauthorized");
      }
      
      return { userId };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("PDF upload complete for userId:", metadata.userId);
      console.log("file url", file.url);
      
      return { uploadedBy: metadata.userId };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;

