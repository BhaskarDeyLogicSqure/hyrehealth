
import { useCallback, useRef } from "react";
import { toast } from "sonner";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { useAwsApi } from "@/api/aws/useAwsApi";
import { IAwsCredentials } from "@/types";
/**
 * Custom hook for handling file uploads
 */
const useUploadService = () => {
  // Track if we've already shown an error toast to prevent duplicates
  const hasShownErrorToastRef = useRef(false);
  const { fetchAwsCredentials, loading } = useAwsApi();
  /**
   * Get AWS credentials for file upload
   * @param {string} folderPrefix - S3 folder prefix for upload
   * @returns {Promise<IAwsCredentials['credentials'] | null>}
   */
  const getAwsCredentials = useCallback(async (folderPrefix: string): Promise<IAwsCredentials | null> => {
    try {
      hasShownErrorToastRef.current = false;

      console.log("Fetching AWS credentials with folderPrefix:", folderPrefix);
      const response = await fetchAwsCredentials(folderPrefix);

      console.log("AWS credentials response:", response);

      if (response?.success && response.data) {
        console.log("AWS credentials received:", response.data);
        return response.data;
      }

      console.error("Failed to get valid AWS credentials");
      return null;
    } catch (error) {
      console.error("Error fetching AWS credentials:", error);

      if (!hasShownErrorToastRef.current) {
        hasShownErrorToastRef.current = true;
        throw error;
      }

      return null;
    }
  }, [fetchAwsCredentials]);

  /**
   * Upload file to AWS S3 with progress tracking
   * @param {File} file - File to upload
   * @param {AwsCredentialsResponse['credentials']} credentials - AWS credentials
   * @param {string} folderPrefix - S3 folder prefix
   * @param {Function} onProgress - Callback for upload progress (0-100)
   * @returns {Promise<{url: string, filename: string, contentType: string}>} - S3 file info if successful
   */
  const uploadToS3 = useCallback(async (
    file: File,
    credentials: IAwsCredentials,
    folderPrefix: string,
    onProgress?: (progress: number) => void
  ): Promise<{ url: string, filename: string, contentType: string }> => {
    try {
      const timestamp = Math.floor(Date.now() / 1000);
      const fileNameWithoutExt = file.name.split('.').slice(0, -1).join('.');
      const fileExtension = file.name.split('.').pop() || 'jpg';
      const filename = `${folderPrefix}${fileNameWithoutExt}_${timestamp}.${fileExtension}`;
  
      if (onProgress) onProgress(0);
      
      // Read file as ArrayBuffer and convert to Uint8Array for AWS SDK compatibility
      const arrayBuffer = await file.arrayBuffer();
      const uint8Array = new Uint8Array(arrayBuffer);
  
      const s3 = new S3Client({
        region: credentials.region,
        credentials: {
          accessKeyId: credentials.AccessKeyId,
          secretAccessKey: credentials.SecretAccessKey,
          sessionToken: credentials.SessionToken,
        }
      });
  
      const command = new PutObjectCommand({
        Bucket: credentials.bucket,
        Key: filename,
        Body: uint8Array,
        ContentType: file.type || 'application/octet-stream'
      });
  
      await s3.send(command);
  
      const s3Url = `https://${credentials.bucket}.s3.${credentials.region}.amazonaws.com/${filename}`;
  
      if (onProgress) onProgress(100);
  
      return {
        url: s3Url,
        filename,
        contentType: file.type || 'application/octet-stream'
      };
    } catch (error) {
      console.error("S3 Upload Error:", error);
      if (onProgress) onProgress(0);
      throw new Error("Upload failed. Please check your credentials or network.");
    }
  }, []);

  /**
   * Upload image to AWS
   * @param {File} file - Image file to upload
   * @param {string} [folder] - Optional folder path in S3 (e.g., "products/")
   * @param {Function} [onProgress] - Optional callback for upload progress (0-100)
   * @returns {Promise<{url: string, filename: string, contentType: string} | null>}
   */
  const uploadImage = useCallback(async (
    file: File,
    folder: string = "",
    onProgress?: (progress: number) => void
  ): Promise<{url: string, filename: string, contentType: string} | null> => {
    try {
      hasShownErrorToastRef.current = false;
      
      // Show loading toast
      toast.loading("Uploading image...");

      // Get AWS credentials for the specified folder
      const awsCredentials = await getAwsCredentials(folder);
      
      if (!awsCredentials) {
        throw new Error("Failed to get AWS credentials");
      }

      if (onProgress) onProgress(10);

      // Upload to S3
      const result = await uploadToS3(
        file,
        awsCredentials,
        folder,
        (s3Progress) => {
          if (onProgress) {
            const overallProgress = 10 + Math.round(s3Progress * 0.9);
            onProgress(overallProgress);
          }
        }
      );

      // Show success toast
      toast.success("Image uploaded successfully!");
      
      return result;
    } catch (error) {
      console.error("Error uploading image:", error);
      
      if (onProgress) onProgress(0);
      
      // Show error toast
      toast.error(error instanceof Error ? error.message : "Failed to upload image");
      
      if (!hasShownErrorToastRef.current) {
        hasShownErrorToastRef.current = true;
        throw error;
      }
      
      return null;
    }
  }, [getAwsCredentials, uploadToS3]);

  return {
    uploadImage,
    loading
  };
};

export default useUploadService;