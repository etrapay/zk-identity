import { default as ReactModal } from "react-modal";

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    borderRadius: "10px",
  },
};

const Modal = ({
  visible,
  onClose,
  content,
}: {
  visible: boolean;
  onClose: () => void;
  content: React.ReactNode;
}) => {
  return (
    <ReactModal
      isOpen={visible}
      onRequestClose={onClose}
      style={customStyles}
      ariaHideApp={false}
    >
      <div className="poppins mx-10">{content}</div>
    </ReactModal>
  );
};

export default Modal;
