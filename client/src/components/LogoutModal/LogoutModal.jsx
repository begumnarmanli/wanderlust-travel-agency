import styles from "./LogoutModal.module.css";

const LogoutModal = ({ isOpen, onConfirm, onCancel }) => {
  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalBox}>
        <div className={styles.modalContent}>
          <h3>Log Out?</h3>
          <p>Are you sure you want to end your session, traveler?</p>
          <div className={styles.modalButtons}>
            <button className={styles.cancelBtn} onClick={onCancel}>
              No, Stay
            </button>
            <button className={styles.confirmBtn} onClick={onConfirm}>
              Yes, Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LogoutModal;
