import React, { useEffect, useState } from 'react';
import 'bulma/css/bulma.min.css';
import './css/translate.css';
import { useNavigate } from "react-router-dom";
import { useMediaQuery } from 'react-responsive'
import { Translate, Translator } from 'react-auto-translate';
import axios from 'axios';
import Services from "../services/services";
import MicRecorder from 'mic-recorder-to-mp3'

function TranslatePage() {

  useEffect(async() => {
    let userToken = JSON.parse(sessionStorage.getItem('userToken'))
        
    if(userToken){
        let option = {
            headers: {
                "Content-Type": "application/json",
                "Authorization": userToken.token
            },
            //method: "GET",
        }

        var userData = await Services.auth(option)
        if(userData.message == "정상 토큰"){
            
            let lang = JSON.parse(sessionStorage.getItem('language')) 
            if(lang){
                setGoogleLang(lang.lang1)
                const contentLanguageTitle = document.getElementsByClassName("contentLanguageTitle")[0]
                contentLanguageTitle.innerHTML = lang.lang2
                setSourceCode(lang.lang1)
                setSourceLanguage(lang.lang2)
            }else{
                console.log(userData.data.code,userData.data.language1)
                setGoogleLang(userData.data.code)
                const contentLanguageTitle = document.getElementsByClassName("contentLanguageTitle")[0]
                contentLanguageTitle.innerHTML = userData.data.language1
                setSourceCode(userData.data.code)
                setSourceLanguage(userData.data.language1)
            }
        }else{
            sessionStorage.removeItem('userToken')
            sessionStorage.removeItem('language')
            sessionStorage.removeItem('searchResult')
            sessionStorage.removeItem('tourData')
            window.location.href = '/'
        }
        
        
    }else{
        sessionStorage.removeItem('language')
        sessionStorage.removeItem('searchResult')
        sessionStorage.removeItem('tourData')
        window.location.href = '/'
    }

    navigator.getUserMedia({ audio: true },
      () => {
        console.log('Permission Granted');
        setBlocked(false)
        //this.setState({ isBlocked: false });
      },
      () => {
        console.log('Permission Denied');
        setBlocked(true)
        //this.setState({ isBlocked: true })
      },
    );

  },[])

  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [sourceLanguage, setSourceLanguage] = useState('English');
  const [sourceCode, setSourceCode] = useState('en')
  const [isDropdownOpen1, setIsDropdownOpen1] = useState(false);
  const [targetLanguage, setTargetLanguage] = useState('한국어');
  const [targetCode, setTargetCode] = useState('ko')
  const [isDropdownOpen2, setIsDropdownOpen2] = useState(false);
  const [googleLang, setGoogleLang] = useState('en')
  
  //음성 시스템 관련 변수
  const [isBlocked, setBlocked] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const [blobURL, setBlobURL] = useState('')
  const [file, setFile] = useState()
  const [text, setText] = useState('')
  const [isMute, setMute] = useState(false)
  const [Mp3Recorder, setMp3Recorder] = useState(new MicRecorder({ bitRate: 128 }))

  const isDesktop = useMediaQuery({ query: '(min-width:769px)' })
  const isMobile = useMediaQuery({ query: '(max-width:768px)' })

  const navigate = useNavigate()

  const sourceToggleDropdown = () => {
    setIsDropdownOpen1(!isDropdownOpen1);
  };

  const sourceLanguageSelect = (e) => {
    setSourceLanguage(e.target.id.split(' ')[1]);
    setSourceCode(e.target.id.split(' ')[0])
    setIsDropdownOpen1(false);
  };

  const targetToggleDropdown = () => {
    setIsDropdownOpen2(!isDropdownOpen2);
  };

  const targetLanguageSelect = (e) => {
    setTargetLanguage(e.target.id.split(' ')[1]);
    setTargetCode(e.target.id.split(' ')[0])
    setIsDropdownOpen2(false);
  };


  const translate = async() => {
    const newText = document.createElement('li')
    newText.innerHTML = inputText
    newText.style.float = "right"
    newText.style.clear = "both"
    newText.style.marginRight = "1vw"
    newText.style.marginBottom = "1vh"
    newText.style.marginTop = "1vh"
    newText.style.whiteSpace = "normal"
    newText.style.height = "auto"
    newText.classList.add('tag')
    newText.classList.add('is-medium')
    newText.classList.add('is-rounded')
    newText.classList.add('is-link')
    
    const chatting = document.getElementsByClassName('chatting')[0]
    chatting.appendChild(newText)
    await axios.get(`https://translation.googleapis.com/language/translate/v2?key=${process.env.REACT_APP_GOOGLE}&q=${inputText}&target=${targetCode}&source=${sourceCode}`)
                    .then((res) => {
                        console.log(res.data.data.translations[0].translatedText)
                        setOutputText(res.data.data.translations[0].translatedText);
                        const newTransText = document.createElement('li')
                        newTransText.innerHTML = res.data.data.translations[0].translatedText
                        newTransText.style.clear = "both"
                        newTransText.style.float = "left"
                        newTransText.style.marginLeft = "1vw"
                        newTransText.style.marginBottom = "1vh"
                        newTransText.style.marginTop = "1vh"
                        newTransText.style.whiteSpace = "normal"
                        newTransText.style.height = "auto"
                        newTransText.classList.add('tag')
                        newTransText.classList.add('is-medium')
                        newTransText.classList.add('is-rounded')
                        newTransText.classList.add('is-success')
                        
                        chatting.appendChild(newTransText)
                        if(!isMute){
                          audioCall(res.data.data.translations[0].translatedText)
                        }
                                    
                    })
    
  };

  const onClickBackBtn = (e) => {
    navigate(-1)
  }

  const onClicklanguageBtn = () => {
    const languageContainer = document.getElementsByClassName("languageContainer")[0]
    const languageContainerBtn = document.getElementsByClassName("languageContainerBtn")[0]
    const langBtnOpen = document.getElementsByClassName("langBtnOpen")[0]
    const langBtnClose = document.getElementsByClassName("langBtnClose")[0]

    if(langBtnOpen){
        languageContainer.style.width = "0"
        languageContainerBtn.style.width = "4vw"
        languageContainerBtn.classList.remove("langBtnOpen")
        languageContainerBtn.classList.add("langBtnClose")
        
    }
    else if(langBtnClose){
        languageContainer.style.width = "30vw"
        languageContainerBtn.style.width = "35vw"
        languageContainerBtn.classList.add("langBtnOpen")
        languageContainerBtn.classList.remove("langBtnClose")
        
    }

  }

  const onClickContentLanguage = () => {
    const contentsLanguage = document.getElementsByClassName("contentsLanguage")[0]
    const isActive = document.getElementsByClassName("is-active")[0]
    const languageOpen = document.getElementsByClassName("languageOpen")[0]
    if(languageOpen){
        contentsLanguage.classList.remove("is-active")
        contentsLanguage.classList.remove("languageOpen")
    }else if(!languageOpen){
        contentsLanguage.classList.add("is-active")
        contentsLanguage.classList.add("languageOpen")
    }

  }

  const onClickChangeLanguage = (e) =>{
    const contentLanguageTitle = document.getElementsByClassName("contentLanguageTitle")[0]
    contentLanguageTitle.innerHTML = e.target.innerHTML

    sessionStorage.removeItem('language')
    sessionStorage.setItem('language',JSON.stringify({"lang1": e.target.id.split(' ')[0],"lang2": e.target.id.split(' ')[1], "lang3": e.target.id.split(' ')[2]}))
    setGoogleLang(e.target.id.split(' ')[0])
  }

  //음성 시스템 관련 함수
  const start = async () => {
    if (isBlocked) {
      console.log('Permission Denied');
    } else {
      await Mp3Recorder
        .start()
        .then(() => {
            setIsRecording(true)
          //this.setState({ isRecording: true });
        }).catch((e) => console.error(e));
    }
  };

  const stop = async () => {
    await Mp3Recorder
      .stop()
      .getMp3()
      .then(([buffer, blob]) => {
        const blobUrl = URL.createObjectURL(blob)
        console.log(blobUrl)
        setBlobURL(blobUrl)
        setIsRecording(false)
        const file = new File(buffer, 'audio.mp3', {
            type: blob.type,
            lastModified: Date.now()
        });
        speechtotext(file)
        //setFile(file)
        //this.setState({ blobURL, isRecording: false });
      }).catch((e) => console.log(e));
  };

  const speechtotext = async (file) => {
    
    const formData = new FormData()
    formData.append("model","whisper-1")
    formData.append("file",file)

    await axios.post('https://api.openai.com/v1/audio/transcriptions',formData,{
        headers: {
            "Content-Type":"multipart/form-data",
            Authorization:`Bearer ${process.env.REACT_APP_CHAT}` //open api key를 사용할 때, .env 파일에 저장해서 키를 사용하면 작동이 안되는 문제점이 있다.(만약 .env에 api 키를 환경변수로 할당해서 사용하려할 때: 리액트에서 .env에 환경변수를 추가해서 사용하려면 REACT_APP_으로 변수명이 시작되어야한다.) 그래서 키 값을 이와 같이 하드 코딩한 후, netlify에 배포해서 사용하고 있다.
        }
    })
    .then((res) => {
        console.log(res.data.text)
        setInputText(res.data.text)
        //audioCall2(res.data.text)
    })
  
  }

  const audioCall = async (text) => {
    /*const aaa = await Service.audioMp3({speak: text})
    console.log(aaa)
    const tmp = new Audio(aaa)
    tmp.play()
    
    setTimeout(() => {
        URL.revokeObjectURL(aaa)
        console.log('삭제됨')
    },2000)*/

    await axios.post('https://api.openai.com/v1/audio/speech',{
        "model": "tts-1",
        "input": text,
        "voice": "alloy"
    },{
        headers: {
            "Content-Type":"application/json",
            Authorization:`Bearer ${process.env.REACT_APP_CHAT}`
        },
        responseType:'blob'
    }).then((res) => {
        console.log(res)
        const audioObjectUrl = URL.createObjectURL(res.data)
        const audio = new Audio(audioObjectUrl)
        audio.volume = 1
        audio.play()


        setTimeout(() => {
            URL.revokeObjectURL(audioObjectUrl)
            console.log('삭제됨')
        },2000)
    })
}

const modalClose = () => {
  const modal = document.getElementsByClassName("modal")[0]

  modal.classList.remove("is-active")
}

const modalOpen = () => {
  const modal = document.getElementsByClassName("modal")[0]
  
  modal.classList.add("is-active")
}
  
  return (
    <div>
      {isDesktop && <div className='Translate'>
        <nav class="navbar" role="navigation" aria-label="main navigation" style={{height:"8vh"}}>
            <div class="navbar-brand">
                <a class="navbar-item" href="/main">
                <img src="/images/logo.png" width="50" height="28"/>
                </a>

                <a role="button" class="navbar-burger" aria-label="menu" aria-expanded="false" data-target="navbarBasicExample">
                <span aria-hidden="true"></span>
                <span aria-hidden="true"></span>
                <span aria-hidden="true"></span>
                </a>
            </div>

            <div id="navbarBasicExample" class="navbar-menu">
                <div class="navbar-start">
                  <a class="navbar-item" onClick={() => {
                      window.location.href="/search"
                  }}>
                      TourList
                  </a>
                  <a class="navbar-item">
                      Map
                  </a>
                  <a class="navbar-item" onClick={() => {
                      window.location.href="/translate"
                  }}>
                      Translation
                  </a>
                  <a class="navbar-item" onClick={() => {
                      window.location.href="/wishlist"
                  }}>
                      Wishlist
                  </a>
                </div>

                <div class="navbar-end">
                    <div class="navbar-item">
                        <div class="buttons">
                        <a class="button is-link" onClick={() => {
                            sessionStorage.removeItem('userToken')
                            window.location.href="/"
                        }}>
                            Log out
                        </a>
                        <div className="contentsLanguage languageOpen dropdown">
                            <div className="dropdown-trigger">
                                <button className="button is-info" aria-haspopup="true" aria-controls="dropdown-menu3" onClick={onClickContentLanguage}>
                                    <span className="contentLanguageTitle">English</span>
                                    <i className="fas fa-angle-down" aria-hidden="true"></i>
                                </button>
                            </div>
                            <div className="dropdown-menu" id="dropdown-menu3" role="menu" style={{width:"100%"}}>
                                <div className="dropdown-content" style={{width:"6vw",height:"30vh",overflowY:"scroll"}}>
                                  <a href="#" class="dropdown-item" style={{width:"6vw",padding:"1vw"}} id="ko 한국어 한국어" onClick={onClickChangeLanguage}>
                                      한국어
                                  </a>
                                  <a className="dropdown-item" style={{width:"6vw",padding:"1vw"}} id="ja 日本語 일본어" onClick={onClickChangeLanguage}>
                                      日本語
                                  </a>
                                  <a href="#" className="dropdown-item" style={{width:"6vw",padding:"1vw"}} id="en English 영어" onClick={onClickChangeLanguage}>
                                      English
                                  </a>
                                  <a href="#" className="dropdown-item" style={{width:"6vw",padding:"1vw"}} id="zh-CN 中文 중국어" onClick={onClickChangeLanguage}>
                                      中文
                                  </a>
                                  <a href="#" className="dropdown-item" style={{width:"6vw",padding:"1vw"}} id="ru Русский 러시아어" onClick={onClickChangeLanguage}>
                                      Русский
                                  </a>
                                  <a href="#" className="dropdown-item" style={{width:"6vw",padding:"1vw"}} id="pt Português 포르투갈어" onClick={onClickChangeLanguage}>
                                      Português
                                  </a>
                                  <a href="#" className="dropdown-item" style={{width:"6vw",padding:"1vw"}} id="es Español 스페인어" onClick={onClickChangeLanguage}>
                                      Español
                                  </a>
                                </div>
                            </div>
                        </div>

                        </div>
                    </div>
                </div>
            </div>
        </nav>

        <section className="section" style={{padding:"1vh"}}>
          <div className="container">
            <div className="columns is-mobile column">
              <div className="column">
                <div className={`dropdown ${isDropdownOpen1 ? 'is-active' : ''}`} style={{marginRight:"2vw"}}>
                  <div className="dropdown-trigger">
                    <button className="button" style={{border:"solid", width:"20vw"}} aria-haspopup="true" aria-controls="dropdown-menu" onClick={sourceToggleDropdown}>
                      <span>{sourceLanguage}</span>
                    </button>
                  </div>
                  <div className="dropdown-menu" id="dropdown-menu" role="menu"> 
                    <div className="dropdown-content" style={{width:"20vw",height:"20vh",overflowY:"scroll"}}>
                    <a href="#" className="dropdown-item" id='ko 한국어 한국어' onClick={sourceLanguageSelect}>한국어</a>
                        <a href="#" className="dropdown-item" id='en English 영어' onClick={sourceLanguageSelect}>English</a>
                        <a href="#" className="dropdown-item" id="zh-CN 中文 중국어" onClick={sourceLanguageSelect}>中文</a>
                        <a href="#" className="dropdown-item" id="fr Français 프랑스어" onClick={sourceLanguageSelect}>Français</a>
                        <a href="#" className="dropdown-item" id='ja 日本語 일본어' onClick={sourceLanguageSelect}>日本語</a>
                        <a href="#" className="dropdown-item" id="ru Русский 러시아어" onClick={sourceLanguageSelect}>Русский</a>
                        <a href="#" className="dropdown-item" id="es Español 스페인어" onClick={sourceLanguageSelect}>Español</a>
                        <a href="#" className="dropdown-item" id="pt Português 포르투갈어" onClick={sourceLanguageSelect}>Português</a>
                    </div>
                  </div>
                </div>

                <img src='/images/transArrow.png' style={{width:"3vw"}} onClick={() => {
                  let temp = sourceLanguage
                  setSourceLanguage(targetLanguage)
                  setTargetLanguage(temp)

                  let temp2 = sourceCode
                  setSourceCode(targetCode)
                  setTargetCode(temp2)
                }}></img>

                <div className={`dropdown ${isDropdownOpen2 ? 'is-active' : ''}`} style={{marginLeft:"2vw"}}>
                  <div className="dropdown-trigger">
                    <button className="button" style={{border:"solid", width:"20vw"}} aria-haspopup="true" aria-controls="dropdown-menu" onClick={targetToggleDropdown}>
                      <span>{targetLanguage}</span>
                    </button>
                  </div>
                  <div className="dropdown-menu" id="dropdown-menu" role="menu">
                    <div className="dropdown-content" style={{width:"20vw",height:"20vh",overflowY:"scroll"}}>
                    <a href="#" className="dropdown-item" id='ko 한국어 한국어' onClick={targetLanguageSelect}>한국어</a>
                        <a href="#" className="dropdown-item" id='en English 영어' onClick={targetLanguageSelect}>English</a>
                        <a href="#" className="dropdown-item" id="zh-CN 中文 중국어" onClick={targetLanguageSelect}>中文</a>
                        <a href="#" className="dropdown-item" id="fr Français 프랑스어" onClick={targetLanguageSelect}>Français</a>
                        <a href="#" className="dropdown-item" id='ja 日本語 일본어' onClick={targetLanguageSelect}>日本語</a>
                        <a href="#" className="dropdown-item" id="ru Русский 러시아어" onClick={targetLanguageSelect}>Русский</a>
                        <a href="#" className="dropdown-item" id="es Español 스페인어" onClick={targetLanguageSelect}>Español</a>
                        <a href="#" className="dropdown-item" id="pt Português 포르투갈어" onClick={targetLanguageSelect}>Português</a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div style={{alignItems:"center",justifyContent:"center",display:"flex"}}>
              <div className='chattingBoard' style={{border:"solid", height:"50vh", width:"70vw",overflowY:"scroll"}}>
                <ul className='chatting'></ul>
              </div>
            </div>
            
            
            {/*<span class="tag is-link" style={{marginBottom:"1vh"}}><Translate>Input</Translate></span>
            <div className="columns">
              <div className="column is-full">
                <div className="field" style={{alignItems:"center",justifyContent:"center",display:"flex"}}>
                  <div className="control" style={{width:"50vw"}}>
                    <textarea className="textarea is-info" value={inputText} onChange={(e) => setInputText(e.target.value)}></textarea>
                  </div>
                </div>
              </div>
            </div>*/}
            
            {/*<span class="tag is-danger" style={{marginBottom:"1vh"}}><Translate>Output</Translate></span>
            <div className="columns">
              <div className="column is-full">
                <div className="field" style={{alignItems:"center",justifyContent:"center",display:"flex"}}>
                  <div className="control" style={{width:"50vw"}}>
                    <textarea className="textarea is-info" value={outputText} readOnly></textarea>
                  </div>
                </div>
              </div>
            </div>*/}
            <div style={{alignItems:"center",justifyContent:"center",display:"flex",marginTop:"1vh"}}>
              <div className='textInput' style={{width:"70vw"}}>
                <textarea className="textarea is-info" value={inputText} rows={1} onChange={(e) => setInputText(e.target.value)}></textarea>
              </div>
            </div>
            <div class="columns" style={{margin:"1vw",alignItems:"center",justifyContent:"center",display:"flex"}}>
              {isMute ? <button onClick={() => setMute(false)} class="button is-primary"style={{width:"15vw",height:"8vh"}}><img src='/images/mute.png' style={{width:"4vw"}}></img></button> : <button onClick={() => setMute(true)} class="button is-primary"style={{width:"15vw",height:"8vh"}}><img src='/images/speaker.png' style={{width:"4vw"}}></img></button>}
              <button class="button is-primary"style={{width:"15vw",height:"8vh",marginRight:"3vw",marginLeft:"3vw"}} onClick={translate}><img src='/images/trans.png' style={{width:"4vw"}}></img></button>
              {isRecording ? <button class="button is-primary" onClick={stop} style={{width:"15vw",height:"8vh"}}><img src='/images/stop.png' style={{width:"4vw"}}></img></button> : <button class="button is-primary" onClick={start} style={{width:"15vw",height:"8vh"}}><img src='/images/mic.png' style={{width:"4vw"}}></img></button>}  
            </div>
          </div>
        </section>
      </div>}




    
      {isMobile && 
        <div className="Translate">
          <img className="backBtn" type="button" style={{top:"2vw", left:"2vw",position:"fixed", width:"10vw"}} onClick={onClickBackBtn} src="/images/back.png"></img>
          <section className="section">
            <div className="container">
              <div className="columns is-mobile column" style={{marginBottom:"0", padding:"0"}}>
                <div className="column">
                  <div className={`dropdown ${isDropdownOpen1 ? 'is-active' : ''}`} style={{marginRight:"2vw"}}>
                    <div className="dropdown-trigger">
                      <button className="button" style={{border:"solid", width:"30vw"}} aria-haspopup="true" aria-controls="dropdown-menu" onClick={sourceToggleDropdown}>
                        <span>{sourceLanguage}</span>
                      </button>
                    </div>
                    <div className="dropdown-menu" id="dropdown-menu" role="menu" style={{width:"50%"}}> 
                      <div className="dropdown-content" style={{width:"30vw",height:"20vh",overflowY:"scroll"}}>
                        <a href="#" className="dropdown-item" id='ko 한국어 한국어' onClick={sourceLanguageSelect}>한국어</a>
                        <a href="#" className="dropdown-item" id='en English 영어' onClick={sourceLanguageSelect}>English</a>
                        <a href="#" className="dropdown-item" id="zh-CN 中文 중국어" onClick={sourceLanguageSelect}>中文</a>
                        <a href="#" className="dropdown-item" id="fr Français 프랑스어" onClick={sourceLanguageSelect}>Français</a>
                        <a href="#" className="dropdown-item" id='ja 日本語 일본어' onClick={sourceLanguageSelect}>日本語</a>
                        <a href="#" className="dropdown-item" id="ru Русский 러시아어" onClick={sourceLanguageSelect}>Русский</a>
                        <a href="#" className="dropdown-item" id="es Español 스페인어" onClick={sourceLanguageSelect}>Español</a>
                        <a href="#" className="dropdown-item" id="pt Português 포르투갈어" onClick={sourceLanguageSelect}>Português</a>
                      </div>
                    </div>
                  </div>

                  <img src='/images/transArrow.png' style={{width:"10vw"}} onClick={() => {
                    let temp = sourceLanguage
                    setSourceLanguage(targetLanguage)
                    setTargetLanguage(temp)

                    let temp2 = sourceCode
                    setSourceCode(targetCode)
                    setTargetCode(temp2)
                  }}></img>

                  <div className={`dropdown ${isDropdownOpen2 ? 'is-active' : ''}`} style={{marginLeft:"2vw"}}>
                    <div className="dropdown-trigger">
                      <button className="button" style={{border:"solid", width:"30vw"}} aria-haspopup="true" aria-controls="dropdown-menu" onClick={targetToggleDropdown}>
                        <span>{targetLanguage}</span>
                      </button>
                    </div>
                    <div className="dropdown-menu" id="dropdown-menu" role="menu" style={{width:"50%"}}>
                      <div className="dropdown-content" style={{width:"30vw",height:"20vh",overflowY:"scroll"}}>
                        <a href="#" className="dropdown-item" id='ko 한국어 한국어' onClick={targetLanguageSelect}>한국어</a>
                        <a href="#" className="dropdown-item" id='en English 영어' onClick={targetLanguageSelect}>English</a>
                        <a href="#" className="dropdown-item" id="zh-CN 中文 중국어" onClick={targetLanguageSelect}>中文</a>
                        <a href="#" className="dropdown-item" id="fr Français 프랑스어" onClick={targetLanguageSelect}>Français</a>
                        <a href="#" className="dropdown-item" id='ja 日本語 일본어' onClick={targetLanguageSelect}>日本語</a>
                        <a href="#" className="dropdown-item" id="ru Русский 러시아어" onClick={targetLanguageSelect}>Русский</a>
                        <a href="#" className="dropdown-item" id="es Español 스페인어" onClick={targetLanguageSelect}>Español</a>
                        <a href="#" className="dropdown-item" id="pt Português 포르투갈어" onClick={targetLanguageSelect}>Português</a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div style={{alignItems:"center",justifyContent:"center",display:"flex"}}>
                <div className='chattingBoard' style={{border:"solid", height:"50vh", width:"70vw", overflowY:"scroll"}}>
                  <ul className='chatting'></ul>
                </div>
              </div>
              {/*<span class="tag is-link" style={{marginBottom:"1vh"}}><Translate>Input</Translate></span>
              <div className="columns">
                <div className="column is-full">
                  <div className="field">
                    <div className="control">
                      <textarea className="textarea is-info" value={inputText} onChange={(e) => setInputText(e.target.value)}></textarea>
                    </div>
                  </div>
                </div>
              </div>*/}
              
              {/*<span class="tag is-danger" style={{marginBottom:"1vh"}}><Translate>Output</Translate></span>
              <div className="columns">
                <div className="column is-full">
                  <div className="field">
                    <div className="control">
                      <textarea className="textarea is-info" value={outputText} readOnly></textarea>
                    </div>
                  </div>
                </div>
              </div>*/}
              <div style={{alignItems:"center",justifyContent:"center",display:"flex", marginTop:"1vh"}}>
                <div className='textInput' style={{width:"70vw"}}>
                  <textarea className="textarea is-info" value={inputText} rows={1} onChange={(e) => setInputText(e.target.value)}></textarea>
                </div>
              </div>
              <div class="columns" style={{margin:"1vw"}}>
                {isMute ? <button onClick={() => setMute(false)} class="button is-primary"style={{width:"25vw",height:"8vh"}}><img src='/images/mute.png' style={{width:"12vw"}}></img></button> : <button onClick={() => setMute(true)} class="button is-primary"style={{width:"25vw",height:"8vh"}}><img src='/images/speaker.png' style={{width:"15vw"}}></img></button>}
                <button class="button is-primary"style={{width:"25vw",height:"8vh",marginRight:"3vw",marginLeft:"3vw"}} onClick={translate}><img src='/images/trans.png' style={{width:"15vw"}}></img></button>
                {isRecording ? <button class="button is-primary" onClick={stop} style={{width:"25vw",height:"8vh"}}><img src='/images/stop.png' style={{width:"12vw"}}></img></button> : <button class="button is-primary" onClick={start} style={{width:"25vw",height:"8vh"}}><img src='/images/mic.png' style={{width:"15vw"}}></img></button>}  
              </div>
            </div>
          </section>

          <div className="languageContainerBtn langBtnClose" style={{zIndex:"1", backgroundColor: "rgba(0,0,0,0)",top:"40vh",right:"0", position:"fixed", width:"4vw",height:"8vh",transition: "width 0.5s"}}>
              <button className="languageBtn open button is-success" style={{color:"red", height:"8vh",width:"1vw",padding:"2vw",float:"left",writingMode:"vertical-rl",fontSize:"3vw"}} onClick={onClicklanguageBtn}>Language</button>
          </div>
          <div className="languageContainer" style={{zIndex:"2", backgroundColor:"white",top:"40vh",right:"0", position:"fixed", width:"0vw",height:"8vh",transition: "width 0.5s"}}>

              <div className="contentsLanguage languageOpen dropdown" style={{margin:"2vw"}}>
                  <div className="dropdown-trigger">
                      <button className="button is-info" aria-haspopup="true" aria-controls="dropdown-menu3" onClick={onClickContentLanguage}>
                          <span className="contentLanguageTitle">English</span>
                          <i className="fas fa-angle-down" aria-hidden="true"></i>
                      </button>
                  </div>
                  <div className="dropdown-menu" id="dropdown-menu3" role="menu" style={{width:"100%"}}>
                      <div className="dropdown-content" style={{width:"25vw",height:"30vh",overflowY:"scroll"}}>
                        <a href="#" class="dropdown-item" style={{width:"15vw",padding:"1vw"}} id='ko 한국어 한국어' onClick={onClickChangeLanguage}>
                            한국어
                        </a>
                        <a className="dropdown-item" style={{width:"15vw",padding:"1vw"}} id='ja 日本語 일본어' onClick={onClickChangeLanguage}>
                            日本語
                        </a>
                        <a href="#" className="dropdown-item" style={{width:"15vw",padding:"1vw"}} id='en English 영어' onClick={onClickChangeLanguage}>
                            English
                        </a>
                        <a href="#" className="dropdown-item" style={{width:"15vw",padding:"1vw"}} id="zh-CN 中文 중국어" onClick={onClickChangeLanguage}>
                            中文
                        </a>
                        <a href="#" className="dropdown-item" style={{width:"15vw",padding:"1vw"}} id="ru Русский 러시아어" onClick={onClickChangeLanguage}>
                            Русский
                        </a>
                        <a href="#" className="dropdown-item" style={{width:"15vw",padding:"1vw"}} id="pt Português 포르투갈어" onClick={onClickChangeLanguage}>
                            Português
                        </a>
                        <a href="#" className="dropdown-item" style={{width:"15vw",padding:"1vw"}} id="es Español 스페인어" onClick={onClickChangeLanguage}>
                            Español
                        </a>
                      </div>
                  </div>
              </div>
          </div>



          <div className="modal">
            <div className="modal-background modalBackground" onClick={modalClose}></div>
            <div className="modal-content">
                <div className="box" style={{width:"80vw",margin:"10vw"}}>
                    <button class="delete deleteBtn" aria-label="close" style={{float:"right"}} onClick={modalClose}></button>
            
                    <div>
                        <button className="button is-success" aria-haspopup="true" aria-controls="dropdown-menu3" onClick={() => {
                            sessionStorage.removeItem('userToken')
                            window.location.href="/"
                        }}>Log out</button>
                    </div>
                    
                </div>
            </div>
          </div>





          <div className="bottomNav" style={{height:"10vh",width:"100vw",backgroundColor:"white",bottom:"0",position:"fixed",alignItems:"center",justifyContent:"center",display:"flex"}}>    
            <img type="button" src="/images/main.png" onClick={() => {
                window.location.href="/main"
            }} style={{width:"12vw",marginLeft:"3vw",marginRight:"3vw"}}></img>
            <img type="button" src="/images/blackheart.png" onClick={() => {
                window.location.href="/wishlist"
            }} style={{width:"12vw",marginLeft:"3vw",marginRight:"3vw"}}></img>
            <img type="button" src="/images/translate.png" onClick={() => {
                window.location.href="/translate"
            }} style={{width:"12vw",marginLeft:"3vw",marginRight:"3vw"}}></img>
            <img type="button" src="/images/map.png" style={{width:"12vw",marginLeft:"3vw",marginRight:"3vw"}}></img>
            <img type="button" src="/images/user.png" style={{width:"12vw",marginLeft:"3vw",marginRight:"3vw"}} onClick={modalOpen}></img>
          </div>
        </div>}
    </div>
  );
}

export default TranslatePage;