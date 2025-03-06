import React, { useState } from "react";

const withModal = (WrappedComponent, ModalContent) => {
  return (props) => {
    const [showModal, setShowModal] = useState(false);

    const handleShowModal = () => setShowModal(true);
    const handleCloseModal = () => setShowModal(false);

    return (
      <>
        <WrappedComponent {...props} onShowModal={handleShowModal} />
        {showModal && (
          <ModalContent
            show={showModal}
            onClose={handleCloseModal}
            data={props.data}
          />
        )}
      </>
    );
  };
};

export default withModal;
