import React, { useEffect, useState } from 'react'
import axios from 'axios'
import download from 'downloadjs';

const Filedata = (props) => {

    let downloadFile = async () => {
        console.log(props.names);
        await axios.get("http://localhost:9000/download/"+props.names).then((result) => {
            download(result.blob, props.names)
        })
    }

    return (
        <>
            <div className="row border rounded shadow p-3 mb-3 bg-white rounded">
                <div className="col-12 d-flex justify-content-between align-items-center">
                    <div>
                    <h5 >{props.names}</h5>
                    </div>
                    <button className='bi-download' onClick={downloadFile}></button>
                </div>
            </div>
        </>
    )

}

export default Filedata; 