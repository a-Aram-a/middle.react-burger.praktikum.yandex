import { CloseIcon } from '@krgaa/react-developer-burger-ui-components';
import { useEffect } from 'react';
import { createPortal } from 'react-dom';

import { ModalOverlay } from '@components/modal-overlay/modal-overlay';

import styles from './modal.module.css';

type TModalProps = {
  title?: string;
  onClose: () => void;
  children: React.ReactNode;
};

export const Modal = ({ title, onClose, children }: TModalProps): React.JSX.Element => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent): void => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    return (): void => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  return createPortal(
    <>
      <ModalOverlay onClick={onClose} />
      <div className={styles.modal}>
        <div className={styles.header}>
          {title && (
            <h2 className={`${styles.title} text text_type_main-large`}>{title}</h2>
          )}
          <CloseIcon type="primary" onClick={onClose} className={styles.close} />
        </div>
        {children}
      </div>
    </>,
    document.body
  );
};
