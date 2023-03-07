import Modal from "./Modal";

const ErrorModal = ({
  visible,
  onClose,
  content,
}: {
  visible: boolean;
  onClose: () => void;
  content: React.ReactNode;
}) => {
  return <Modal visible={visible} onClose={onClose} content={content} />;
};

export default ErrorModal;
