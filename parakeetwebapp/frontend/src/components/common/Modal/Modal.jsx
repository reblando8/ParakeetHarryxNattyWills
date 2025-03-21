import React, { useState, useCallback } from 'react';
import { Modal, Button } from 'antd';
import { AiOutlinePicture } from 'react-icons/ai';
import { useDropzone } from 'react-dropzone';

const ModalComponent = ({ modalOpen, setModalOpen, sendStatus, setStatus, status }) => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [previews, setPreviews] = useState([]);

  const handlePost = () => {
    sendStatus(selectedFiles); // Pass array of image files
    setStatus('');
    setSelectedFiles([]);
    setPreviews([]);
    setModalOpen(false);
  };

  const onDrop = useCallback((acceptedFiles) => {
    const limitedFiles = acceptedFiles.slice(0, 3 - selectedFiles.length); // Limit to 3 total
    const updatedFiles = [...selectedFiles, ...limitedFiles];
    const updatedPreviews = [...previews, ...limitedFiles.map(file => URL.createObjectURL(file))];

    setSelectedFiles(updatedFiles);
    setPreviews(updatedPreviews);
  }, [selectedFiles, previews]);

  const { getRootProps, getInputProps, open } = useDropzone({
    onDrop,
    accept: 'image/*',
    maxFiles: 3,
    noClick: true,
    noKeyboard: true,
  });

  return (
    <Modal
      title="Create a Post"
      centered
      open={modalOpen}
      onCancel={() => setModalOpen(false)}
      footer={
        <Button
          type="primary"
          onClick={handlePost}
          disabled={status.length === 0 && selectedFiles.length === 0}
        >
          Post
        </Button>
      }
    >
      <textarea
        rows={4}
        placeholder="What's on your mind?"
        value={status}
        onChange={(e) => setStatus(e.target.value)}
        className="w-full p-3 border-none focus:outline-none focus:ring-0 resize-none rounded-lg"
      />

      {/* Upload Area */}
      <div
        {...getRootProps()}
        className="mt-4 p-4 border-2 border-dashed border-gray-300 rounded-lg text-center cursor-pointer"
      >
        <input {...getInputProps()} />
        {previews.length > 0 ? (
          <div className="flex flex-wrap justify-center gap-2">
            {previews.map((src, i) => (
              <img key={i} src={src} alt={`preview-${i}`} className="max-h-28 rounded-lg" />
            ))}
          </div>
        ) : (
          <div className="text-gray-500">
            Drag & drop up to 3 images here, or
            <button
              type="button"
              onClick={open}
              className="text-blue-500 ml-1 underline bg-transparent border-none"
            >
              click to browse
            </button>
          </div>
        )}
      </div>

      {/* Manual Upload Button */}
      <div className="mt-3">
        <button
          type="button"
          onClick={open}
          className="flex items-center gap-2 text-gray-600 hover:text-blue-500"
        >
          <AiOutlinePicture size={20} />
          <span>Add Images</span>
        </button>
        <p className="text-xs text-gray-400 mt-1">Max 3 images</p>
      </div>
    </Modal>
  );
};

export default ModalComponent;
