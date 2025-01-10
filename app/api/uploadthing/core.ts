import { createUploadthing, type FileRouter } from "uploadthing/next";

const f = createUploadthing();

export const ourFileRouter = {
  imageUploader: f({ image: { maxFileSize: "16MB" } })
    .onUploadComplete(async ({ file }) => { }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
