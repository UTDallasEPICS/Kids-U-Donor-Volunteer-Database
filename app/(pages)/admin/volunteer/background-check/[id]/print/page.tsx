import { notFound } from 'next/navigation';
import prisma from '@/app/utils/db';
import PrintTrigger from './PrintTrigger';
import PrintToolbar from './PrintToolbar';

export default async function PrintBackgroundCheckPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const record = await prisma.volunteerBackgroundCheck.findUnique({
    where: { id },
  });

  if (!record) notFound();

  return (
    <html>
      <head>
        <title>Background Check — {record.fullName}</title>
        <style>{`
          body { font-family: Arial, sans-serif; color: #111; margin: 0; padding: 0; }
          .page { max-width: 800px; margin: 0 auto; padding: 40px; }
          h1 { font-size: 22px; border-bottom: 2px solid #333; padding-bottom: 8px; margin-bottom: 24px; }
          h2 { font-size: 15px; font-weight: bold; text-transform: uppercase;
               letter-spacing: 0.05em; color: #555; margin: 24px 0 10px; }
          .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px 32px; }
          .field label { font-size: 11px; text-transform: uppercase; color: #888; display: block; margin-bottom: 2px; }
          .field p { font-size: 14px; margin: 0; border-bottom: 1px solid #ddd; padding-bottom: 4px; }
          .full { grid-column: 1 / -1; }
          .no-print { }
          @media print {
            .no-print { display: none !important; }
            body { margin: 0; }
          }
        `}</style>
      </head>
      <body>
        <PrintTrigger />
        <PrintToolbar />

        <div className="page">
          <h1>Volunteer Background Check Form</h1>

          <h2>Personal Information</h2>
          <div className="grid">
            <div className="field full">
              <label>Full Name</label>
              <p>{record.fullName}</p>
            </div>
            <div className="field">
              <label>Date of Birth</label>
              <p>{new Date(record.dateOfBirth).toLocaleDateString()}</p>
            </div>
            <div className="field">
              <label>Gender</label>
              <p>{record.gender}</p>
            </div>
            <div className="field">
              <label>Race</label>
              <p>{record.race}</p>
            </div>
            <div className="field">
              <label>County</label>
              <p>{record.county}</p>
            </div>
            <div className="field full">
              <label>Address</label>
              <p>{record.addressLine}</p>
            </div>
            <div className="field">
              <label>City</label>
              <p>{record.city}</p>
            </div>
            <div className="field">
              <label>State</label>
              <p>{record.state}</p>
            </div>
            <div className="field">
              <label>Zip Code</label>
              <p>{record.zipCode}</p>
            </div>
          </div>

          <h2>Certification</h2>
          <div className="grid">
            <div className="field full">
              <label>Agreed to Background Check</label>
              <p>{record.agreedToBackgroundCheck ? 'Yes' : 'No'}</p>
            </div>
            <div className="field full">
              <label>Electronic Signature</label>
              <p>{record.eSignature}</p>
            </div>
            <div className="field">
              <label>Signature Date</label>
              <p>{record.signatureDate}</p>
            </div>
          </div>

          <div style={{ marginTop: '48px', fontSize: '11px', color: '#999', borderTop: '1px solid #e5e7eb', paddingTop: '12px' }}>
            Submitted: {new Date(record.createdAt).toLocaleString()} &nbsp;|&nbsp; Record ID: {record.id}
          </div>
        </div>
      </body>
    </html>
  );
}
