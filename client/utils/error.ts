type AxiosErrorType = Error & {
  isAxiosError: boolean;
  response?: {
    data: {
      message?: string;
      errors?: Record<string, string[]>;
    };
  };
};

export function getErrorMessage(error: unknown): string {
  if (error && typeof error === 'object' && 'isAxiosError' in error && error instanceof Error) {
    const axiosError = error as AxiosErrorType;
    const apiError = axiosError.response?.data;
    return apiError?.message || axiosError.message;
  }
  
  if (error instanceof Error) {
    return error.message;
  }
  
  return 'An unexpected error occurred';
}

export function isAxiosError(error: unknown): error is AxiosErrorType {
  return error instanceof Error && 'isAxiosError' in error;
}

export function formatValidationErrors(error: AxiosErrorType): Record<string, string> {
  const formattedErrors: Record<string, string> = {};
  
  if (error.response?.data.errors) {
    Object.entries(error.response.data.errors).forEach(([field, messages]) => {
      if (Array.isArray(messages) && messages.length > 0) {
        formattedErrors[field] = messages[0];
      }
    });
  }
  
  return formattedErrors;
} 