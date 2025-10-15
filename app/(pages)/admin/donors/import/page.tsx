"use client";
import React, { useState, useRef } from 'react';

export default function Import() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [statusMessage, setStatusMessage] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    if (file) {
      setSelectedFile(file);
      setStatusMessage(''); 
    }
  };

  // click area
  const handleAreaClick = () => {
    fileInputRef.current?.click();
  };
   
  const handleUpload = async () => {
    if (!selectedFile) {
      setStatusMessage('Error: Please select a file first.');
      return;
    }

    setIsUploading(true);
    setStatusMessage('Uploading Excel file...');

    try {
      const formData = new FormData();
      // NOTE: The backend will expect a field named 'excel-file' 
      // change name accordingly to what backend expects
      formData.append("excel-file", selectedFile);

      // *change endpoint here*
      const apiUrl = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api'}/endpoint`;

      const response = await fetch(apiUrl, {
        method: "POST",
        body: formData,
      });

      //error handling
      if (!response.ok) {
        let errorMessage = `Server error: ${response.status}`;
        try {
          // JSON error response
          const errorData = await response.json();
          errorMessage = errorData?.message || "An unknown error occurred on the server.";
        } catch (e) {
          // non-JSON error response
          errorMessage = await response.text();
        }
        throw new Error(errorMessage);
      }

      await response.json();
      setStatusMessage(`'${selectedFile.name}' was successfully processed and imported!`);
      setSelectedFile(null); 

    } catch (error: any) {
      setStatusMessage(`Error: ${error.message}`);
      console.error(error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault(); 
    setIsDragging(true);
  };

  const handleDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
    const file = event.dataTransfer.files?.[0] || null;
    if (file) {
      const allowedExtensions = ['.xlsx', '.xls'];
      const fileNameParts = file.name.split('.');
      const fileExtension = `.${fileNameParts[fileNameParts.length - 1]}`.toLowerCase();
      
      const allowedMimeTypes = [
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      ];

      if (allowedExtensions.includes(fileExtension) || allowedMimeTypes.includes(file.type)) {
        setSelectedFile(file);
        setStatusMessage('');
      } else {
        setStatusMessage('Error: Invalid file type. Please upload an Excel file (.xlsx or .xls).');
        setSelectedFile(null);
      }
    }
  };

  // upload icon svg
  const UploadIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" >
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="17 8 12 3 7 8" />
      <line x1="12" y1="3" x2="12" y2="15" />
    </svg>
  );
  
  // expected database fields for the user's reference
  const dbFields = [
      "Donor Type", "Donor First Name", "Donor Last Name",	"Email Address",	"Contact Number",	"Mailing Address",	
      "Preferred Contact Method",	"Company Name (if applicable)",	"Donation Amount", "Donation Method",
      "Donation Date", "Campaign/Event Name",	"Donation Frequency",	" Thank you/Follow Up Sent? ",
  ];

  return (
    <div className="font-sans p-8 w-full">
      <div className="w-full max-w-3xl mx-auto bg-white rounded-xl shadow-lg p-8 space-y-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-800">Import Donations Data</h1>
          <p className="text-gray-500 mt-2">Upload an Excel file (.xlsx, .xls) to import new records.</p>
        </div>

        {/* Hidden File Input */}
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
          accept=".xlsx, .xls, application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        />

        {/* Drag-and-Drop Area */}
        <div
          className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-indigo-500 transition-colors"
          onClick={handleAreaClick}
        >
          <div className="flex flex-col items-center space-y-3 text-gray-600">
            <UploadIcon />
            {selectedFile ? (
              <div>
                <p className="font-medium text-gray-800">{selectedFile.name}</p>
                <p className="text-sm text-gray-500">({(selectedFile.size / 1024).toFixed(2)} KB)</p>
              </div>
            ) : (
              <p>Click here or drag an Excel file to upload</p>
            )}
          </div>
        </div>

        {/* Action Button */}
        <div className="flex flex-col items-center">
          <button
            type="button"
            onClick={handleUpload}
            disabled={!selectedFile || isUploading}
            className="w-full max-w-xs flex justify-center items-center gap-2 bg-indigo-600 text-white font-medium py-3 px-6 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {isUploading ? 'Uploading...' : 'Import Now'}
          </button>
        </div>
        
        {/* Status Message */}
        {statusMessage && (
            <div className={`text-center text-sm p-3 rounded-md ${statusMessage.startsWith('Error:') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                <p className="font-medium">{statusMessage}</p>
            </div>
        )}

        {/* Database Fields Reference Section */}
          <div className="pt-4 border-t">
            <h2 className="text-lg font-semibold text-gray-700 mb-3">Expected Excel Columns</h2>
            <div className="text-xs text-gray-600 bg-gray-50 p-4 rounded-lg">
                <p className="mb-3">Ensure the first row of your Excel file contains columns matching these fields.</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-x-4 gap-y-2">
                    {dbFields.map(field => <p key={field} className="font-mono bg-gray-200 px-2 py-1 rounded">{field}</p>)}
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}

