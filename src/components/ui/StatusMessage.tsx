interface StatusMessageProps {
  status: string;
}

export function StatusMessage({ status }: StatusMessageProps) {
  if (!status) return null;

  const getStatusStyle = () => {
    if (status.includes('✓')) {
      return 'bg-green-50 text-green-800';
    }
    if (status.includes('❌') || status.includes('⚠️')) {
      return 'bg-red-50 text-red-800';
    }
    return 'bg-blue-50 text-blue-800';
  };

  return (
    <div className={`p-3 rounded-lg text-sm font-medium ${getStatusStyle()}`}>
      {status}
    </div>
  );
}
