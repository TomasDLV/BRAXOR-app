"use client";

import { useState, useCallback } from "react";

export interface ModalConfig {
  title: string;
  description: string;
  confirmLabel?: string;
  variant?: "danger" | "warning";
}

interface ModalState extends ModalConfig {
  isOpen: boolean;
  onConfirm: () => void;
}

const CLOSED: ModalState = {
  isOpen: false,
  title: "",
  description: "",
  onConfirm: () => {},
};

export function useModalAction() {
  const [modal, setModal] = useState<ModalState>(CLOSED);

  const openModal = useCallback((config: ModalConfig, onConfirm: () => void) => {
    setModal({ ...config, isOpen: true, onConfirm });
  }, []);

  const closeModal = useCallback(() => {
    setModal(CLOSED);
  }, []);

  const handleConfirm = useCallback(() => {
    modal.onConfirm();
    setModal(CLOSED);
  }, [modal]);

  return {
    modalProps: {
      isOpen: modal.isOpen,
      title: modal.title,
      description: modal.description,
      confirmLabel: modal.confirmLabel,
      variant: modal.variant,
      onConfirm: handleConfirm,
      onCancel: closeModal,
    },
    openModal,
    closeModal,
  };
}
