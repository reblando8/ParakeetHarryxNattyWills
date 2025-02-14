import React from 'react';
import { Modal, Button } from 'antd';

const ModalComponent = ({ modalOpen, setModalOpen, sendStatus, setStatus, status }) => {

  const handlePost = () => {
    console.log('User Post:', status);
    setStatus(''); // Clear input after submission
    setModalOpen(false); // Close modal
  };

  return (
    <Modal
      title="Create a Post"
      centered
      open={modalOpen}
      onCancel={() => setModalOpen(false)}
      footer={
        <Button 
          type="primary" 
          onClick={sendStatus}
          disabled={status.length === 0} // Disable when empty
        >
          Post
        </Button>
      }
    >
      <textarea
        rows={4}
        placeholder="What's on your mind?"
        value={status} // Controlled by status
        onChange={(event) => setStatus(event.target.value)} // Directly update status
        className="w-full p-3 border-none focus:outline-none focus:ring-0 resize-none rounded-lg"
      />
    </Modal>
  );
};

export default ModalComponent;
