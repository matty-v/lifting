interface StatusMessageProps {
  status: string;
}

export function StatusMessage({ status }: StatusMessageProps) {
  if (!status) return null;

  const getStatusStyle = () => {
    if (status.includes('✓')) {
      return 'bg-green-50 dark:bg-green-900 text-green-800 dark:text-green-200';
    }
    if (status.includes('❌') || status.includes('⚠️')) {
      return 'bg-red-50 dark:bg-red-900 text-red-800 dark:text-red-200';
    }
    return 'bg-blue-50 dark:bg-blue-900 text-blue-800 dark:text-blue-200';
  };

  return (
    <div className={`p-3 rounded-lg text-sm font-medium ${getStatusStyle()}`}>
      {status}
    </div>
  );
}
