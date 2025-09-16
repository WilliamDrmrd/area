import Header from "../Components/Header";
import { useEffect, useState } from "react";
import Modal from '@mui/material/Modal';
import InfosAuto from "./detailPage";

function ExplorePage() {

  useEffect(() => {
    const url = new URL(window.location.href);
    const code = url.searchParams.get('code');
    const state = url.searchParams.get('state');
    window.opener.postMessage({code: code, state: state}, "*");
    console.log(code, state);
  }, []);

  const [open, setOpen] = useState(false);
  const [id, setId] = useState(0);
  const handleClose = () => {
    setOpen(false);
    setId(0);
  };

  return (
    <>
      <div className="flex flex-col h-[100vh]">
        <Header isHome={false} isLog={false} />
        <div className="bg-black h-full w-full"/>
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <InfosAuto onClose={handleClose} id={id} />
        </Modal>
      </div>
    </>
  );
}

export default ExplorePage;
