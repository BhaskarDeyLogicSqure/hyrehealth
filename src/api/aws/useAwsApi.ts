import { useState } from 'react';
import { awsApi } from './awsApi';
import { ApiResponse, IAwsCredentials } from '@/types';

export const useAwsApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAwsCredentials = async (folderPrefix?: string): Promise<ApiResponse<IAwsCredentials> | null> => {
    try {
      setLoading(true);
      setError(null);
      return await awsApi.fetchAwsCredentials(folderPrefix);
    } catch (err) {
      console.error('Error fetching AWS credentials:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch AWS credentials');
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    fetchAwsCredentials,
    loading,
    error
  };
}; 