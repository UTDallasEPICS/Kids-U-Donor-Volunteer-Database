'use client';

export default function PrintToolbar({ count }: { count?: number }) {
  return (
    <div style={{ padding: '12px 40px', background: '#f3f4f6', borderBottom: '1px solid #e5e7eb' }} className="no-print">
      <button
        onClick={() => window.print()}
        style={{ background: '#2563eb', color: '#fff', border: 'none', padding: '8px 20px', borderRadius: '4px', cursor: 'pointer', marginRight: '8px' }}
      >
        Print
      </button>
      <button
        onClick={() => window.close()}
        style={{ background: '#6b7280', color: '#fff', border: 'none', padding: '8px 20px', borderRadius: '4px', cursor: 'pointer', marginRight: '8px' }}
      >
        Close
      </button>
      {count !== undefined && (
        <span style={{ fontSize: '14px', color: '#374151' }}>
          {count} pending record{count !== 1 ? 's' : ''}
        </span>
      )}
    </div>
  );
}
