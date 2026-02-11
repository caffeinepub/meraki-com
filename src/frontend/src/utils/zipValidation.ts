/**
 * Validates that a URL is reachable and likely points to a ZIP file.
 * Uses a HEAD request first for efficiency, then validates content-type or ZIP signature.
 */
export async function validateZipUrl(url: string): Promise<{
  isValid: boolean;
  error?: string;
}> {
  try {
    // First try HEAD request to check headers without downloading
    const headResponse = await fetch(url, { method: 'HEAD' });
    
    if (!headResponse.ok) {
      return {
        isValid: false,
        error: `URL returned status ${headResponse.status}`,
      };
    }

    // Check content-type header
    const contentType = headResponse.headers.get('content-type');
    if (contentType && (
      contentType.includes('application/zip') ||
      contentType.includes('application/x-zip-compressed') ||
      contentType.includes('application/octet-stream')
    )) {
      return { isValid: true };
    }

    // If content-type is inconclusive, fetch first few bytes to check ZIP signature
    // ZIP files start with "PK" (0x50 0x4B)
    try {
      const rangeResponse = await fetch(url, {
        headers: { 'Range': 'bytes=0-3' }
      });

      if (rangeResponse.ok) {
        const buffer = await rangeResponse.arrayBuffer();
        const bytes = new Uint8Array(buffer);
        
        // Check for ZIP signature: PK (0x50 0x4B)
        if (bytes.length >= 2 && bytes[0] === 0x50 && bytes[1] === 0x4B) {
          return { isValid: true };
        }
      }
    } catch (rangeError) {
      // Range requests might not be supported, but HEAD succeeded
      // If filename suggests ZIP, consider it valid
      if (url.toLowerCase().endsWith('.zip')) {
        return { isValid: true };
      }
    }

    return {
      isValid: false,
      error: 'URL does not appear to point to a ZIP file',
    };
  } catch (error: any) {
    return {
      isValid: false,
      error: error.message || 'Failed to reach URL',
    };
  }
}
