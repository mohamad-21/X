import { Modal } from "@nextui-org/modal";
import React from "react";
import LoadingSpinner from "./LoadingSpinner";

function PageLockLoading() {
  return (
    <Modal isOpen shouldBlockScroll>
      <div className="bg-gray-800/80 fixed z-10 inset-0 flex items-center justify-center">
        <LoadingSpinner noPadding />
      </div>
    </Modal>
  )
}

export default PageLockLoading;
