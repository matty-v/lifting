interface StatusMessageProps {
  status: string;
}

export function StatusMessage({ status }: StatusMessageProps) {
  if (!status) return null;

  const getStatusStyle = () => {
    if (status.includes('✓')) {
      return 'bg-[#00ff88]/10 text-[#00ff88]';
    }
    if (status.includes('❌') || status.includes('⚠️')) {
      return 'bg-[var(--accent-pink)]/10 text-[var(--accent-pink)]';
    }
    return 'bg-[var(--accent-cyan)]/10 text-[var(--accent-cyan)]';
  };

  return (
    <div className={`p-3 rounded-lg text-sm font-medium ${getStatusStyle()}`}>
      {status}
    </div>
  );
}
