import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useCoverImage } from "@/hooks/useCoverImage";
import { SingleImageDropzone } from "@/components/single-image-dropzone";
import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useParams } from "next/navigation";
import { Id } from "@/convex/_generated/dataModel";
import { useTrackedUpload } from "@/hooks/useTrackedUpload";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FilePicker } from "@/components/file-picker";

export const CoverImageModal = () => {
  const params = useParams();

  const [file, setFile] = useState<File>();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const update = useMutation(api.documents.update);
  const coverImage = useCoverImage();
  const { uploadFile } = useTrackedUpload();

  const onClose = () => {
    setFile(undefined);
    setIsSubmitting(false);
    coverImage.onClose();
  };

  const onChange = async (file?: File) => {
    if (file) {
      setIsSubmitting(true);
      setFile(file);

      try {
        const res = await uploadFile(file, {
          replaceTargetUrl: coverImage.url,
        });

        await update({
          id: params.documentId as Id<"documents">,
          coverImage: res.url,
        });

        onClose();
      } catch (error) {
        console.log("Cover image upload failed", error);
        setIsSubmitting(false);
        setFile(undefined);
      }
    }
  };

  const onSelectFile = async (url: string) => {
    setIsSubmitting(true);
    try {
      await update({
        id: params.documentId as Id<"documents">,
        coverImage: url,
      });
      onClose();
    } catch (error) {
      console.log("Failed to set cover image from file", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={coverImage.isOpen} onOpenChange={coverImage.onClose}>
      <DialogContent>
        <DialogHeader>
          <h2 className="text-center text-lg font-semibold">Cover Image</h2>
        </DialogHeader>

        <Tabs defaultValue="upload" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="upload">Upload</TabsTrigger>
            <TabsTrigger value="files">Select from Files</TabsTrigger>
          </TabsList>
          <TabsContent value="upload">
            <SingleImageDropzone
              className="w-full outline-none"
              disabled={isSubmitting}
              value={file}
              onChange={onChange}
            />
          </TabsContent>
          <TabsContent value="files">
            <div className="pt-2">
              <FilePicker onSelect={onSelectFile} selectedUrl={coverImage.url} />
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
