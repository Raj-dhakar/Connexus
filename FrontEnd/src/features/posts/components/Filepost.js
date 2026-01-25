import { Button } from '@mui/material';
import React, { forwardRef, useRef, useState } from 'react'
import Modal from 'react-modal';

const customStyles = {
    content: {
        top: '60%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
    },
};

function Filepost(props, ref) {

    const fileRef = useRef(null)

    const [file, setFile] = useState(null)

    let subtitle;
    const [modalIsOpen, setIsOpen] = React.useState(false);

    function openModal() {
        setTimeout(() => {
            fileRef.current.click()
        }, 500)
        setIsOpen(true);
    }

    function afterOpenModal() {
        if (subtitle) subtitle.style.color = 'grey';
    }

    function closeModal() {
        setIsOpen(false);
    }

    const addPost = () => {
        // Mock upload
        console.log("File post created");
        setFile(null);
        closeModal();
    }



    return (
        <div>
            <button ref={ref} onClick={openModal} style={{ display: "none" }}>Open Modal</button>
            <Modal
                isOpen={modalIsOpen}
                onAfterOpen={afterOpenModal}
                onRequestClose={closeModal}
                style={customStyles}
                contentLabel="Example Modal"
                ariaHideApp={false}
            >
                <Button onClick={() => fileRef.current.click()} sx={{ borderRadius: "30px" }} variant='contained'>Upload from computer</Button>
                <h3 style={{ fontWeight: "500" }}>Select files here</h3>
                <h6>Share your images or videos</h6>
                <input onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                        setFile(URL.createObjectURL(e.target.files[0]))
                    }
                }} style={{ display: "none" }} type='file' accept='image/*,video/*' ref={fileRef} />
                <h2 ref={(_subtitle) => (subtitle = _subtitle)}></h2>
                {file && <img style={{ width: "500px" }} src={file} alt="preview" />}
                <br />
                <Button sx={{ mt: "10px" }} variant='outlined' size='small' onClick={closeModal}>Cancel</Button>
                <Button sx={{ ml: "10px", mt: "10px" }} variant='contained' size='small' onClick={addPost}>Done</Button>
            </Modal>
        </div>
    );
}

export default forwardRef(Filepost)
