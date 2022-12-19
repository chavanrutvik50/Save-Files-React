import logo from './logo.svg';
import './App.css';
import axios from 'axios';
import GoogleLogin, { GoogleLogout } from 'react-google-login';
import { gapi } from 'gapi-script';
import { React, useEffect, useState } from 'react';
import Filedata from './Filedata'

function App() {

  const [file, setFile] = useState()
  let [profile, setProfile] = useState();
  let [fileNames, setFileNames] = useState([]);
  const [progress, setProgress] = useState()
  const clientId = "636939717839-c64t3q5gc8bfk51d1pve9bp9e2cpugbu.apps.googleusercontent.com";

  useEffect(() => {
    const initClient = () => {
      gapi.client.init({
        clientId: clientId,
        scope: ''
      })
    }
    gapi.load('client:auth2', initClient);


    // const fetchFiles = async () => {
    //   console.log("profile : ", await profile.email);
    //   await axios.get("http://localhost:9000/getAllFiles/" + profile?.email).then((result) => setFileNames(result.data))
    // }
    // initClient().then(() => {
    //   fetchFiles();
    // })
  }, []);


  function handleChange(event) {
    console.log("data : ", event);
    setFile(event.target.files[0])
  }

  async function handleSubmit(event) {
    event.preventDefault()

    if (file) {
      const url = 'http://localhost:9000/upload/' + profile.email;
      const formData = new FormData();
      console.log('file ', file);
      console.log('fileName ', file.name);
      formData.append('file', file);
      formData.append('fileName', file.name);
      const config = {
        headers: {
          'content-type': 'multipart/form-data',
        },
        onUploadProgress: data => {
          setProgress(Math.round((100 * data.loaded) / data.total))
        }
      };
      console.log(formData);

      await axios.post(url, formData, config,).then((response) => {
        console.log(response.data);
      }).catch((err) => {
        console.log("error : ", err);
        setProgress();
      });

      await window.location.reload();
    } else {
      alert("Please choose file..");
    }
  }

  const onSuccess = async (res) => {
    await setProfile(res.profileObj)
    console.log('success:', await res);
    console.log("profile : ", res.profileObj.email);
    axios.get("http://localhost:9000/getAllFiles/" + res.profileObj?.email).then((result) => setFileNames(result.data))

  };
  const onFailure = (err) => {
    console.log('failed:', err);
  };
  const logOut = () => {
    setProfile(null);
  };

  return (
    <>
      {
        profile ? (
          <>
            <nav className="navbar navbar-light bg-light ps-2 pe-2">
              <a className="navbar-brand mb-0 ps-3">
                <img src={profile?.imageUrl} width="30" height="30" className="d-inline-block align-top me-2" alt="" id="profile"></img>
                Welcome to save files {profile?.name}</a>
              <GoogleLogout clientId={clientId} buttonText="Log out" onLogoutSuccess={logOut} className="btn" />
            </nav>
            <br></br>
            <div className='ps-3 pe-3'>
              <form onSubmit={handleSubmit} className="mb-3">
                <div className="input-group mb-3">
                  <input type="file" className="form-control mr-sm-2" id="getFile" onChange={handleChange} />
                  <div className="input-group-append">
                    <button type="submit" className='input-group-text'>Upload</button>
                  </div>
                </div>
              </form>
              {progress ? (<div className="progress">
                <div className="progress-bar-striped bg-info w-75" role="progressbar" aria-valuenow={progress} aria-valuemin="0" aria-valuemax="100"></div>
              </div>
              )
                : ("")
              }

              {fileNames?.map((items, index) => (
                <Filedata names={items} key={index} />
              ))}

            </div>
          </>
        ) : (
          < GoogleLogin
            clientId={clientId}
            buttonText='Login with google'
            onSuccess={onSuccess}
            onFailure={onFailure}
            cookiePolicy={'single_host_origin'}
            isSignedIn={true}
            className='signInButton'
          />
        )
      }
    </>

  );
}

export default App;
