import { useEffect, useState } from "react";
import { useMediaQuery } from 'react-responsive'
import 'bulma/css/bulma.css'
import { useNavigate, useParams } from "react-router-dom";
import Services from "../services/services";
import {Translator, Translate} from 'react-auto-translate';
import axios from 'axios';
import OpenAI from "openai";



function Introduce() {

    useEffect(async () => {
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
                console.log(userData.data.email.split('@')[0])
                setNickName(userData.data.email.split('@')[0])
                let lang = JSON.parse(sessionStorage.getItem('language')) 
                if(lang){
                    setGoogleLang(lang.lang1)
                    const contentLanguageTitle = document.getElementsByClassName("contentLanguageTitle")[0]
                    contentLanguageTitle.innerHTML = lang.lang2
                    setChatgptLang(lang.lang2)
                }else{
                    console.log(userData.data.code,userData.data.language1,userData.data.language2)
                    setGoogleLang(userData.data.code)
                    const contentLanguageTitle = document.getElementsByClassName("contentLanguageTitle")[0]
                    contentLanguageTitle.innerHTML = userData.data.language1
                    setChatgptLang(userData.data.language1)
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



        let tourData = JSON.parse(sessionStorage.getItem('tourData'))
        if(tourData){
            const tourImage = document.getElementsByClassName('tourImage')[0]
            tourImage.src = tourData.firstimage
            const reviews = await Services.reviewInfo({tourId:tourData.contentid})
            
            setReviews(reviews)
            
            setTourimage(tourData.firstimage)
            setTourAddress(tourData.addr)
            setTourTitle(tourData.title)
            setTourId(tourData.contentid)
            setTourX(tourData.mapx)
            setTourY(tourData.mapy)

            /*let wishData = localStorage.getItem('tourData' + '-' + tourData.contentid)
            if(wishData){
                setWishHeart(true)
            }*/
        }

    },[])

    const isDesktop = useMediaQuery({ query: '(min-width:769px)' })
    const isMobile = useMediaQuery({ query: '(max-width:768px)' })
    
    const navigate = useNavigate();
    const param = useParams()

    const [googleLang, setGoogleLang] = useState('en')
    const [tourLang, setTourLang] = useState()
    const [tourimage, setTourimage] = useState()
    const [tourId, setTourId] = useState('')
    const [tourAddress, setTourAddress] = useState('')
    const [tourTitle, setTourTitle] = useState('')
    const [tourX, setTourX] = useState('')
    const [tourY, setTourY] = useState('')
    const [reviewContent, setReviewContent] = useState()
    const [reviewBtn, setReviewBtn] = useState('Review')
    const [chatgptLang, setChatgptLang] = useState('')
    const [reviews, setReviews] = useState([])
    const [wishHeart, setWishHeart] = useState(false)

    const [nickName, setNickName] = useState('')

    const onOpenClose = () => {
        //setInnerState(!innerState)
        const reviewContainer = document.getElementsByClassName("reviewContainer")[0]
        const stateClose = document.getElementsByClassName("close")[0]
        const stateOpen = document.getElementsByClassName("open")[0]
        const review = document.getElementsByClassName("review")[0]
        const btn = document.getElementsByClassName("btn")[0]
        if(stateClose){
            review.style.height = "50vh"
            reviewContainer.style.height = '63vh'
            reviewContainer.classList.remove("close")
            reviewContainer.classList.add("open")
            setReviewBtn('close')
        }
        else if(stateOpen){
            review.style.height = "0vh"
            reviewContainer.style.height = '13vh'
            reviewContainer.classList.remove("open")
            reviewContainer.classList.add("close")
            setReviewBtn('Review')
        }
    }

    const onClickHeart = () => {
        /*const heartBtn = document.getElementsByClassName("heartBtn")[0]
        const heartFull = document.getElementsByClassName("heartFull")[0]
        const heartEmpty = document.getElementsByClassName("heartEmpty")[0]
        if(heartFull){
            heartBtn.innerHTML = "🤍"
            heartBtn.classList.remove("heartFull")
            heartBtn.classList.add("heartEmpty")
        }
        else if(heartEmpty){
            heartBtn.innerHTML = "❤️"
            heartBtn.classList.remove("heartEmpty")
            heartBtn.classList.add("heartFull")
        }*/
        if(!wishHeart){
            const date = new Date()
            const newwishData = {
                nickName: nickName,
                tourId: tourId,
                tourAddress: tourAddress,
                tourImage: tourimage,
                tourX: tourX,
                tourY: tourY,
                tourTitle: tourTitle,
                date:date.getTime()
            }
            Services.wishRegister(newwishData)
        }else{
            const removeWishData = {
                nickName: nickName,
                tourId: tourId
            }
            Services.wishRemove(removeWishData)
        }
        setWishHeart(!wishHeart)
    }

    /*useEffect(() => {
        if(wishHeart){
            const newwishData = {
                nickName: nickName,
                tourId: tourId,
                tourAddress: tourAddress,
                tourImage: tourimage,
                tourX: tourX,
                tourY: tourY,
                tourTitle: tourTitle
            }
            Services.wishRegister(newwishData)
        }
        else{
            const removeWishData = {
                nickName: nickName,
                tourId: tourId
            }
            Services.wishRemove(removeWishData)
        }
    },[wishHeart])*/

    useEffect(() => {
        if(nickName != ''){
            const getWishData = async () => {
                const searchData = {
                    nickName: nickName
                }
                let aaa = await Services.wishInfo(searchData)
                //console.log(aaa)
                aaa.map((w) => {
                    if(w.tourId == tourId){
                        setWishHeart(true)
                    }
                })
                
                /*
                */
            }
            getWishData()
        }
    },[tourId])

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

    const onClickTourExplainBtn = async () => {
        const tourExplainBtn = document.getElementsByClassName('tourExplainBtn')[0]
        //const reviewRightBtn = document.getElementsByClassName('reviewRightBtn')[0]
        const explainTextareaContainer = document.getElementsByClassName('explainTextareaContainer')[0]

        tourExplainBtn.style.display = "none"
        //reviewRightBtn.style.marginTop = "2vw"
        explainTextareaContainer.style.display = "block"
        
        const openai = new OpenAI({
            apiKey: process.env.REACT_APP_CHAT,
            dangerouslyAllowBrowser: true
        })

        const response = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                {
                "role": "user",
                "content": `${tourTitle}을 ${chatgptLang} 설명해`
                }
            ],
            temperature: 1,
            //max_tokens: 230,
            top_p: 1,
            frequency_penalty: 0,
            presence_penalty: 0,
        })
        console.log(response.choices[0].message.content) 

        const explainTextarea = document.getElementsByClassName('explainTextarea')[0]
        explainTextarea.innerHTML = response.choices[0].message.content
        /*await axios.get(`https://translation.googleapis.com/language/translate/v2?key=${process.env.REACT_APP_GOOGLE}&q=${response.choices[0].message.content}&target=${googleLang}&source=ko`)
                    .then((res) => {
                        console.log(res.data.data.translations[0].translatedText)
                        const explainTextarea = document.getElementsByClassName('explainTextarea')[0]
                        explainTextarea.innerHTML = res.data.data.translations[0].translatedText                            
                    })*/

    }
    
    const onClickChangeLanguage = (e) =>{
        const contentLanguageTitle = document.getElementsByClassName("contentLanguageTitle")[0]
        contentLanguageTitle.innerHTML = e.target.innerHTML

        sessionStorage.removeItem('language')
        sessionStorage.setItem('language',JSON.stringify({"lang1": e.target.id.split(' ')[0],"lang2": e.target.id.split(' ')[1], "lang3": e.target.id.split(' ')[2]}))
        setGoogleLang(e.target.id.split(' ')[0])
        setChatgptLang(e.target.id.split(' ')[1])
    }

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

    const modalOpen = () => {
        const modal = document.getElementsByClassName("modal")[0]

        modal.classList.add("is-active")
    }

    const modalClose = () => {
        const modal = document.getElementsByClassName("modal")[0]

        modal.classList.remove("is-active")
    }

    const onChangeReview = (e) => {
        setReviewContent(e.target.value)
    }

    const onClickReviewRegister = () => {
        if(reviewContent != null){
            //console.log('내용이 없음')
            if(reviewContent != ''){
                const date = new Date()
                console.log(date.getTime())
                const newReview = {
                    nickname: nickName,
                    tourId: tourId,
                    langCode:googleLang,
                    date:date.getTime(),
                    review:reviewContent
                }
                setReviews([...reviews,newReview])
                Services.reviewRegister({nickname:nickName,tourId:tourId,langCode:googleLang,date:date.getTime(),review:reviewContent})
            }else{
                console.log('내용이 없음')
            }
        }else{
            console.log('내용이 없음')
        }
        //Services.reviewRegister({nickname:nickName,tourId:tourId,langCode:googleLang,review:reviewContent})
    }

    const onClickReviewRemove = (e) => {
        setReviews(reviews.filter(r => String(r.date) !== e.target.id))
        console.log(reviews)
        Services.reviewRemove({date:e.target.id})
    }

    const ReviewItem = ({review}) => {
        const [reviewTrans, setReviewTrans] = useState(true)
        const time = new Date(parseInt(review.date))
        const [rrr, setRRR] = useState('')
        const [changedLang, setChangedLang] = useState('')
        useEffect(() => {
            const transFunc =async (ment) => {

                const params = {
                    q: ment,
                    target: googleLang,
                    format: 'text',  // format: text를 넣지 않으면 예시로 It's 와 같은 단어를 출력할 때 오류가 나올 수 있다 '를 &#39; 와 같이 출력한다.
                    key: process.env.REACT_APP_GOOGLE, // `https://translation.googleapis.com/language/translate/v2?key=${process.env.REACT_APP_GOOGLE}&q=${ment}&target=${googleLang}&format=text`와 같은 형식으로 get요청을 보내도 된다.
                    
                };
                await axios.get(`https://translation.googleapis.com/language/translate/v2`,{params})
                    .then((res) => {
                        console.log(res)
                        setRRR(res.data.data.translations[0].translatedText)
                    })

                setChangedLang(googleLang)
            }

            if(!reviewTrans){
                if(changedLang != googleLang){
                    console.log('번역api 사용함')
                    transFunc(review.review)
                }else{
                    console.log('번역api 사용하지 않음')
                }
                
            }
            
        },[reviewTrans])

        //위의 useEffect는 문장의 소스 언어를 몰라도 번역이 가능하도록 하게 하기위해 작성해 놓은것 사용하려면 주석을 풀고 <text>{rrr}</text>를 아래에 Translator와 Translate 로 감싸진 review.review를 지우고 넣으면 된다.

        return (<div className="box" key={review.date} style={{margin:"1vw", fontWeight:"bold"}}>
            {(nickName == review.nickname) && <button className="delete deleteBtn" id={review.date} aria-label="close" style={{float:"right"}} onClick={onClickReviewRemove}></button>}
            <button style={{float:"right", marginRight:"1vw"}} onClick={() => {
                setReviewTrans(!reviewTrans)
            }}>
                {isMobile ? <img src="/images/trans.png" style={{width:"5vw"}}></img> : <img src="/images/trans.png" style={{width:"2vw"}}></img>}
            </button>
            ({review.nickname}) <text style={{color:"blue"}}>{time.toDateString()}</text> <br/>
            {reviewTrans ? <text>{review.review}</text> : <text>{rrr}</text>


            

            }
        </div>)
    }

    

    return(
        <div>
            {isDesktop && <div className="isDesktop">
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
                        <a class="navbar-item" onClick={() => {
                            window.location.href="/map2"
                        }}>
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
                            <div className="nickname" style={{marginRight:"1vw"}} onClick={() => {
                                window.location.href="/user"
                            }}>
                                <a class="button is-success" style={{fontSize:"1.1vw"}}>{nickName}</a>
                            </div>
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

            <div className="imageContainer" style={{height:"50vh",width:"50vw",top:"8vh",position:"fixed"}}>        
                <figure className="image" style={{height:"50vh"}}>
                    {tourimage == "" ? <img className="tourImage" style={{width:"50vw", height:"50vh",top:"8vh",position:"fixed"}} src="/images/nothing.png"/> : <img className="tourImage" style={{width:"50vw", height:"50vh",top:"8vh",position:"fixed"}} src="http://tong.visitkorea.or.kr/cms/resource/33/2678633_image2_1.jpg"/>}
                </figure>
                <span className="heartBtn heartEmpty" type="button" style={{top:"8vh",left:"1vw",position:"fixed",fontSize:"3vw"}} onClick={onClickHeart}>{wishHeart ? "❤️" : "🤍"}</span>
                <span className="mapBtn" onClick={() => {window.location.href = `/map?contetndid=${tourId}`}} type="button" style={{top:"8vh", left:"5vw",position:"fixed",fontSize:"3vw"}}>🗺️</span>
            </div>

            <div className="contentsContainer" style={{backgroundColor:"white",top:"8vh",right:"0",position:"fixed", width:"50vw", height:"50vh"}}>
                <Translator
                    //cacheProvider={cacheProvider}
                    from='ko'
                    to={googleLang}
                    googleApiKey={process.env.REACT_APP_GOOGLE}
                >
                <div>
                    {(tourTitle != '') && <p className="title is-4"><Translate>{tourTitle}</Translate></p>}
                    {(tourAddress != '') && <p className="subtitle is-5" style={{marginBottom:"0.5vh"}}><Translate>{tourAddress}</Translate></p>}
                </div>
                </Translator>

                
                <div className="explainTextareaContainer" style={{width:"48vw",top:"15vh",right:"0",position:"fixed",margin:"1vw", display:"none"}}>
                    <textarea className="explainTextarea textarea is-danger" disabled rows={9} style={{fontSize:"20px"}}></textarea>
                </div>

                <Translator
                    //cacheProvider={cacheProvider}
                    from='en'
                    to={googleLang}
                    googleApiKey={process.env.REACT_APP_GOOGLE}
                > 
                <div>
                    <button className="button is-link tourExplainBtn" onClick={onClickTourExplainBtn} style={{width:"20vw",top:"30vh",right:"15vw",position:"fixed",margin:"1vw"}}><Translate>Tourist attraction introduction</Translate></button>
                </div>
                </Translator>
                {/*<div style={{margin:"2vw",right:"25vw", top:"7vh",position:"fixed"}}>
                    <button className="button is-danger" style={{width:"15vw"}}>Tourist attraction map</button>
                </div>*/}


            </div>

            {/*<div style={{top:"58vh",right:"0",position:"fixed"}}>
                <button className="button is-dark reviewBtn" onClick={onClickReviewBtn} style={{margin:"2vw"}} >리뷰작성</button>
            </div>*/}

            <Translator
                //cacheProvider={cacheProvider}
                from='en'
                to={googleLang}
                googleApiKey={process.env.REACT_APP_GOOGLE}
            > 
            <div className="reviewContainer" style={{height:"40vh",width:"100vw",backgroundColor:"skyblue",bottom:"0",position:"fixed"}}>
                <div style={{height:"25vh",overflowY:"scroll"}}>
                    {reviews.map((review) => {
                        return(<ReviewItem review={review}></ReviewItem>)
                    })}
                </div>
                <div style={{marginBottom:"1vh",width:"80vw",marginLeft:"auto",marginRight:"auto",marginBottom:"1vh"}}>
                    <textarea className="textarea" style={{border:"solid"}} onChange={onChangeReview} rows={1}></textarea>
                </div>
                <div class="control">
                    <button class="button is-info" onClick={onClickReviewRegister} style={{width:"80vw"}}><Translate>Register a review</Translate></button>
                </div>
            </div>
            </Translator>
            </div>}






            {isMobile && <div className="isMobile">
               
            <div className="imageContainer" style={{height:"40vh",width:"100vw",top:"0",position:"fixed"}}>        
                <figure className="image" style={{height:"40vh"}}>
                    {tourimage == "" ? <img className="tourImage" style={{width:"100vw", height:"40vh",top:"0",position:"fixed"}} src="/images/nothing.png"/> : <img className="tourImage" style={{width:"100vw", height:"40vh",top:"0",position:"fixed"}} src="http://tong.visitkorea.or.kr/cms/resource/33/2678633_image2_1.jpg"/>}
                </figure>
                <img className="backBtn" type="button" style={{top:"2vw", left:"2vw",position:"fixed", width:"10vw"}} onClick={onClickBackBtn} src="/images/back.png"></img>
                <span className="mapBtn" onClick={() => {window.location.href = `/map?contetndid=${tourId}`}} type="button" style={{top:"32vh", right:"2vw",position:"fixed",fontSize:"10vw"}}>🗺️</span>
                <span className="heartBtn heartEmpty" type="button" style={{top:"0",right:"2vw",position:"fixed",fontSize:"10vw"}} onClick={onClickHeart}>{wishHeart ? "❤️" : "🤍"}</span>
            </div>
            
            <div className="contentsContainer" style={{backgroundColor:"white",top:"40vh", position:"fixed", width:"100vw", height:"50vh",alignItems:"center",display:"flex", flexDirection:"column",overflowY:"scroll"}}>
                {/*<button className="button is-dark reviewRightBtn" onClick={onClickReviewBtn} style={{marginTop:"10vh",marginBottom:"2vw"}}>리뷰작성</button>*/}
                <Translator
                    //cacheProvider={cacheProvider}
                    from='ko'
                    to={googleLang}
                    googleApiKey={process.env.REACT_APP_GOOGLE}
                >
                <div>
                    {(tourTitle != '') && <p className="title is-5 titleT"><Translate>{tourTitle}</Translate></p>}
                    {(tourAddress != '') && <p className="subtitle is-6 address" style={{marginBottom:"0.5vh"}}><Translate>{tourAddress}</Translate></p>}
                
                </div>
                </Translator>

                <Translator
                    //cacheProvider={cacheProvider}
                    from='en'
                    to={googleLang}
                    googleApiKey={process.env.REACT_APP_GOOGLE}
                > 
                <button className="button is-link tourExplainBtn" onClick={onClickTourExplainBtn} style={{marginTop:"0.5vw"}}><Translate>Tourist attraction introduction</Translate></button>
                </Translator>
                <div className="explainTextareaContainer" style={{width:"90vw",marginTop:"0.5vw",display:"none"}}>
                    <textarea className="explainTextarea textarea is-danger" disabled rows={9}></textarea>
                </div>
            </div>
            <Translator
                //cacheProvider={cacheProvider}
                from='en'
                to={googleLang}
                googleApiKey={process.env.REACT_APP_GOOGLE}
            > 
            <div className="languageContainerBtn langBtnClose" style={{zIndex:"1", backgroundColor: "rgba(0,0,0,0)",top:"40vh",right:"0", position:"fixed", width:"4vw",height:"8vh",transition: "width 0.5s"}}>
                <button className="languageBtn open button is-success" style={{color:"red", height:"8vh",width:"1vw",padding:"2vw",float:"left",writingMode:"vertical-rl",fontSize:"3vw"}} onClick={onClicklanguageBtn}><Translate>Language</Translate></button>
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

            <div className="reviewContainer close" style={{height:"13vh",width:"100vw",backgroundColor: "rgba(0,0,0,0)",bottom:"0",position:"fixed", transition: "height 0.5s"}}>
                <button className="btn open button is-light" style={{color:"red", height:"3vh",width:"20vw"}} onClick={onOpenClose}><Translate>{reviewBtn}</Translate></button>
                <div className="review" style={{backgroundColor:"skyblue",height:"0vh",width:"100vw",bottom:"10vh",position:"fixed", transition:"height 0.5s", overflowY:"scroll"}}>
                    {/*<button className="button is-dark reviewRightBtn" onClick={onClickReviewBtn} style={{marginTop:"1vh",marginBottom:"2vw"}}>리뷰작성</button>*/}
                    <div style={{height:"70VW",overflowY:"scroll", marginBottom:"1vh"}}>
                        {reviews.map((review) => {
                            return(<ReviewItem review={review}></ReviewItem>)
                        })}
                    </div>
                    <div style={{marginBottom:"1vh"}}>
                        <textarea className="textarea" style={{border:"solid"}} onChange={onChangeReview} rows={1}></textarea>
                    </div>
                    <div class="control">
                        <button class="button is-info" onClick={onClickReviewRegister} style={{width:"90vw"}}><Translate>Register a review</Translate></button>
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
                <img type="button" src="/images/map.png" onClick={() => {
                    window.location.href="/map2"
                }} style={{width:"12vw",marginLeft:"3vw",marginRight:"3vw"}}></img>
                <img type="button" src="/images/user.png" style={{width:"12vw",marginLeft:"3vw",marginRight:"3vw"}} onClick={modalOpen}></img>
            </div>

            <div className="modal">
                <div className="modal-background modalBackground" onClick={modalClose}></div>
                <div className="modal-content">
                    <div className="box" style={{width:"80vw",margin:"10vw"}}>
                        <span class="tag is-warning">{nickName}</span>
                        <button class="delete deleteBtn" aria-label="close" style={{float:"right"}} onClick={modalClose}></button><br/>
                        
                        <div style={{marginTop:"1vh"}}>
                            <button className="button is-success" aria-haspopup="true" aria-controls="dropdown-menu3" onClick={() => {
                                window.location.href="/user"
                            }}>Profile</button>
                        </div>

                        <div style={{marginTop:"1vh"}}>
                            <button className="button is-success" aria-haspopup="true" aria-controls="dropdown-menu3" onClick={() => {
                                sessionStorage.removeItem('userToken')
                                window.location.href="/"
                            }}>Log out</button>
                        </div>
                        
                    </div>
                </div>
            </div>
            </Translator>
            </div>}
        </div>
    )
}

export default Introduce