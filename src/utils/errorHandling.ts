export function handleApiError(error: unknown): Error {
  // Create a new error with only the message to avoid Symbol serialization issues
  const errorMessage = error instanceof Error ? error.message : 'Service temporarily unavailable';
  
  const errorMap: Record<string, string> = {
    'Failed to fetch': 'Connection issue - retrying...',
    'Network Error': 'Network connection lost - reconnecting...',
    'Request timed out': 'Connection timeout - retrying...',
    'No data received': 'No data available - retrying...',
    'Monthly prediction limit reached': 'Monthly limit reached - please upgrade',
    'Rate limit exceeded': 'Too many requests - please wait',
    'Invalid response format': 'Invalid data received - retrying...',
    'Service temporarily unavailable': 'Service temporarily unavailable - retrying...',
    'Connection timeout': 'Connection timeout - retrying...',
    'Network connection lost': 'Network connection lost - reconnecting...'
  };

  const message = errorMap[errorMessage] || 'Service temporarily unavailable - retrying...';
  console.warn(`API Error: ${errorMessage} -> ${message}`);
  return new Error(message);
}