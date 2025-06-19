import { useEffect, useState } from "react";
import axios from "axios";
import Services from "../services/services";
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";
import {Translator, Translate} from 'react-auto-translate';
import 'bulma/css/bulma.css'



function Test() {

    const [userToken, setToken] = useState()
    const [lang, setLang] = useState('ko')
    const [id, setId] = useState()
    const [pw, setPw] = useState()
    const [resgisterId, setRegisterId] = useState()
    const [registerPw, setRegisterPw] = useState()
    const [registerName, setRegisterName] = useState()
    const [tourList, setTourList] = useState([])

    const [googleLang, setGoogleLang] = useState('ko')

    const [script, setScript] = useState('')

    const handleId = (e) => {
        setRegisterId(e.target.value)
    }

    const handlePw = (e) => {
        setRegisterPw(e.target.value)
    }

    const handleName = (e) => {
        setRegisterName(e.target.value)
    }
    

    const handleLang = (e) => {
        setLang(e.target.value)
    }

    const handleChangeLang = (e) => {
        setGoogleLang(e.target.value)
    }

    

    useEffect(async () => {
        console.log(`${process.env.REACT_APP_GOOGLEKEY}`)
        const key = `${process.env.REACT_APP_TOUR}`
        Services.searchStay(setTourList,key)


        navigator.geolocation.getCurrentPosition(async(position) => {
            console.log(position.coords.latitude, position.coords.longitude)

            await axios.post(`https://port-0-testpro-17xco2nlt6nmnfk.sel5.cloudtype.app/api/latlng`,{lng: position.coords.longitude, lat: position.coords.latitude})
                .then(async(res) =>{
                    console.log(res.data[0].text)
                })
        
        },(err) => {
            console.log(err)
        })

        await axios.get(`https://api.odsay.com/v1/api/searchPubTransPathT?SX=126.9027279&SY=37.5349277&EX=126.9145430&EY=37.5499421&apiKey=${process.env.REACT_APP_ODSAY}`)
            .then(async (res) => {
                console.log(res)
            })

        
    },[])
    
    

    const{
        transcript,
        listening,
        resetTranscript,
        browserSupportsSpeechRecognition
    } = useSpeechRecognition();

    const startlisen = () => {
        SpeechRecognition.startListening({
        continuous: false,
        language: lang
      })
    }

    if(!browserSupportsSpeechRecognition) {
        return <span>Browser doesn't support recognition.</span>
    }

    

    const onClickPlay = () => {
        const script = document.getElementById("script")
        console.log(script.innerHTML)
        if(script.innerHTML !== ""){
            console.log(script.innerHTML)
            const utterThis = new SpeechSynthesisUtterance(script.innerHTML)
            utterThis.pitch = 1
            utterThis.rate = 1
            utterThis.lang = lang
            window.speechSynthesis.speak(utterThis)
            //utterThis.onend()
        }
    }




    const onClickBtn = async() => {
        
        await Services.nodetest()
    }

    const onLogin = async() => {
        var token = await Services.login({email: 'aaa', password: '2222'})
        setToken(token)
    }

    const changeId = (e) => {
        setId(e.target.value)
    }

    const changePw = (e) => {
        setPw(e.target.value)
    }

    const registerBtn = () => {
        Services.register({name: registerName, email: resgisterId, password: registerPw})
    }

    const onAuth = () => {
        let headers = new Headers()

        let option = {
            headers: {
                "Content-Type": "application/json",
                "Authorization": userToken
            },
            //method: "GET",
        }

        try{
            Services.auth(option)
        }catch(err){
            console.log(err)
        }
    }

    const onOpenClose = () => {
        const container = document.getElementsByClassName("container")[0]
        const stateClose = document.getElementsByClassName("close")[0]
        const stateOpen = document.getElementsByClassName("open")[0]
        const inner = document.getElementsByClassName("inner")[0]
        if(stateClose){
            inner.style.height = "20vh"
            container.style.height = '35vh'
            container.classList.remove("close")
            container.classList.add("open")
        }
        else if(stateOpen){
            inner.style.height = "0vh"
            container.style.height = '15vh'
            container.classList.remove("open")
            container.classList.add("close")
        }
    }

    const tourInformation = async () => {
        await Services.hknuChatgpt({
            tourTitle: "간송미술관",
            language: "English",
            key: process.env.REACT_APP_CHATHKNU
        })
    }
    
    

    return(
        <div>
        <Translator
            //cacheProvider={cacheProvider}
            /*from='ko'
            to={googleLang}
            googleApiKey={process.env.REACT_APP_GOOGLEKEY}*/
        >
            
            <h1 class="testScreen"><Translate>테스트 화면</Translate></h1>
            <button onClick={onClickBtn}><Translate>연습</Translate></button>
            <button onClick={onLogin}>로그인</button>
            <button onClick={onAuth}>인증</button>
            <input onChange={changeId}></input>
            <input onChange={changePw}></input>
        </Translator>

        {/*<iframe
                width="450"
                height="250"
                frameborder="0" 
                style={{border:"0"}}
                referrerpolicy="no-referrer-when-downgrade"
                src={`https://www.google.com/maps/embed/v1/directions?key=${process.env.REACT_APP_GOOGLE}&origin=37.0080,127.2763&destination=Кёнбоккун&mode=transit&language=${googleLang}`}
                allowfullscreen
            >
    </iframe>*/}

            <div>
                <select onChange={handleChangeLang}>
                    <option value={'ko'}>한국</option>
                    <option value={'en'}>영어</option>
                    <option value={"ja"}>일본</option>
                    <option value={"zh-CN"}>중국</option>
                    <option value={"ru"}>러시아</option>
                </select>
                {/*tourList.map((e) => {
                    return(<p><Translator
                        //cacheProvider={cacheProvider}
                        //from='ko'
                        //to={googleLang}
                        //googleApiKey={process.env.REACT_APP_GOOGLE}
                    ><Translate>{e.addr1}</Translate></Translator></p>)
                })*/}
            </div>
            
            <p>Microphone: {listening ? 'on' : 'off'}</p>
            <button onClick={startlisen}>Start</button>
            <button onClick={SpeechRecognition.stopListening}>Stop</button>
            <button onClick={resetTranscript}>Reset</button>
            <p id="script">{transcript}</p>
            <button onClick={onClickPlay}>재생</button>

            <div>
                <select onChange={handleLang}>
                    <option value={'ko'}>한국어</option>
                    <option value={'en'}>영어</option>
                    <option value={"ja"}>일본어</option>
                    <option value={"zh-CN"}>중국어</option>
                    <option value={"ru"}>러시아어</option>
                </select>
            </div>

            

            <div>
                이름:<input onChange={handleName}></input>
                이메일:<input onChange={handleId}></input>
                비밀번호:<input onChange={handlePw}></input>
                <button onClick={registerBtn}>회원가입</button>
                <button onClick={tourInformation}>간송미술관 정보</button>
            </div>


            
            <div className="container close" style={{height:"15vh",width:"100vw",backgroundColor:"black",bottom:"0",position:"fixed", transition: "height 0.5s"}}>
                <button className="btn open" style={{color:"red"}} onClick={onOpenClose}>open</button>
                <div className="inner" style={{backgroundColor:"yellow",height:"0vh",width:"100vw",bottom:"10vh",position:"fixed", transition:"height 0.5s"}}><p>안뇽하세요</p></div>
            </div>
            <div className="bottomNav" style={{height:"10vh",width:"100vw",backgroundColor:"red",bottom:"0",position:"fixed"}}>

            </div>
            
            
    </div>
    )
}

export default Test;