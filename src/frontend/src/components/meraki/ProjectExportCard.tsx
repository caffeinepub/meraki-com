import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Download, RefreshCw, AlertCircle, CheckCircle2, Terminal } from 'lucide-react';
import { useGetProjectExportUrl } from '../../hooks/useQueries';
import { validateZipUrl } from '../../utils/zipValidation';

export default function ProjectExportCard() {
  const { data: exportUrl, refetch, isLoading, isError, error } = useGetProjectExportUrl();
  const [validationState, setValidationState] = useState<'idle' | 'validating' | 'valid' | 'invalid'>('idle');
  const [validationError, setValidationError] = useState<string>('');

  const handleGenerateExport = async () => {
    setValidationState('idle');
    setValidationError('');
    
    const result = await refetch();
    
    if (result.data) {
      // Automatically validate the URL
      setValidationState('validating');
      const validation = await validateZipUrl(result.data);
      
      if (validation.isValid) {
        setValidationState('valid');
      } else {
        setValidationState('invalid');
        setValidationError(validation.error || 'Unknown validation error');
      }
    }
  };

  const showFallbackInstructions = validationState === 'invalid' || isError;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Download className="h-5 w-5" />
          Project Export
        </CardTitle>
        <CardDescription>
          Generate a fresh ZIP download of your complete project codebase (frontend, backend, and configuration files).
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Button
            onClick={handleGenerateExport}
            disabled={isLoading || validationState === 'validating'}
            className="gap-2"
          >
            {isLoading || validationState === 'validating' ? (
              <>
                <RefreshCw className="h-4 w-4 animate-spin" />
                {validationState === 'validating' ? 'Validating...' : 'Generating...'}
              </>
            ) : (
              <>
                <Download className="h-4 w-4" />
                Generate Fresh Export
              </>
            )}
          </Button>
        </div>

        {validationState === 'valid' && exportUrl && (
          <Alert className="border-green-500 bg-green-50 dark:bg-green-950">
            <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
            <AlertDescription className="text-green-800 dark:text-green-200">
              <div className="space-y-2">
                <p className="font-medium">Export ready for download!</p>
                <a
                  href={exportUrl}
                  download="meraki-codebase-export.zip"
                  className="inline-flex items-center gap-2 text-sm underline hover:no-underline"
                >
                  <Download className="h-3 w-3" />
                  Download meraki-codebase-export.zip
                </a>
              </div>
            </AlertDescription>
          </Alert>
        )}

        {showFallbackInstructions && (
          <Alert className="border-amber-500 bg-amber-50 dark:bg-amber-950">
            <AlertCircle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
            <AlertDescription className="text-amber-800 dark:text-amber-200">
              <div className="space-y-3">
                <p className="font-medium">
                  {isError ? 'Export generation failed' : 'Download link validation failed'}
                </p>
                {isError && error && (
                  <p className="text-sm">
                    Error: {error instanceof Error ? error.message : String(error)}
                  </p>
                )}
                {validationError && (
                  <p className="text-sm">Validation error: {validationError}</p>
                )}
                
                <div className="space-y-2 text-sm">
                  <p className="font-medium flex items-center gap-2">
                    <Terminal className="h-4 w-4" />
                    Alternative Download Option:
                  </p>
                  <ol className="list-decimal list-inside space-y-1 ml-2">
                    <li>Open a terminal in your project root directory</li>
                    <li>Run: <code className="bg-amber-100 dark:bg-amber-900 px-1 py-0.5 rounded">node frontend/scripts/export-codebase-zip.mjs</code></li>
                    <li>Find the generated ZIP files in your project root:
                      <ul className="list-disc list-inside ml-4 mt-1">
                        <li><code className="bg-amber-100 dark:bg-amber-900 px-1 py-0.5 rounded">meraki-codebase-export.zip</code> (primary)</li>
                        <li><code className="bg-amber-100 dark:bg-amber-900 px-1 py-0.5 rounded">meraki-codebase-export-[timestamp].zip</code> (backup)</li>
                      </ul>
                    </li>
                  </ol>
                  <p className="text-xs mt-2">
                    Both files contain identical content. See <code className="bg-amber-100 dark:bg-amber-900 px-1 py-0.5 rounded">frontend/scripts/EXPORT_README.txt</code> for more details.
                  </p>
                </div>
              </div>
            </AlertDescription>
          </Alert>
        )}

        <div className="text-sm text-muted-foreground space-y-1">
          <p>The export includes:</p>
          <ul className="list-disc list-inside ml-2 space-y-0.5">
            <li>Complete frontend/ directory (React + TypeScript)</li>
            <li>Complete backend/ directory (Motoko smart contracts)</li>
            <li>Root configuration files (dfx.json, package.json, etc.)</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
