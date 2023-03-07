import { default as ReactModal } from "react-modal";
import { SpinnerCircular } from "spinners-react";

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

const Loading = ({ visible }: { visible: boolean }) => {
  return (
    <ReactModal isOpen={visible} style={customStyles} ariaHideApp={false}>
      <div className="poppins mx-10">
        <h1 className="text-center my-3">Loading</h1>
        <SpinnerCircular className="mx-auto" size={70} />
      </div>
    </ReactModal>
  );
};

export default Loading;
