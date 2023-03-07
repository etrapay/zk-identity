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
}: {
  visible: boolean;
  onClose: () => void;
}) => {
  return (
    <ReactModal
      isOpen={visible}
      onRequestClose={onClose}
      style={customStyles}
      ariaHideApp={false}
    >
      <div className="poppins mx-10">
        <h2 className="text-center my-3">You are eligible!</h2>
        <button
          className="text-white bg-yellow-400 hover:bg-yellow-500 font-medium rounded-full text-sm px-5 py-2.5 text-center my-2 w-60 mx-auto h-min"
          onClick={() => {
            window.open(
              "https://www.youtube.com/watch?v=vZ734NWnAHA&ab_channel=StarWars",
              "_blank"
            );
            onClose();
          }}
        >
          Watch Movie
        </button>
      </div>
    </ReactModal>
  );
};

export default Modal;
