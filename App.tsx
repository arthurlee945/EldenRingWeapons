import React,{useEffect, useState} from 'react';
import './App.scss';
import WeaponCanvas from "./component/WeaponCanvas"
import logo from "./assets/base/logo.svg"
import data from "./data.json"

const App = ()  => {
  const[rendered, setRendered] = useState<boolean>(false);
  const[instruction, setInstruction] = useState<boolean>(false);
  const[inputBox, setInputBox] = useState<boolean>(false);
  const[control, setControl] = useState<boolean>(true);
  const[lightStrength, setLightStrength] = useState<number>(2);
  const[selected, setSelected] = useState<string>("longsword");
  const[weaponName, setWeaponName] = useState<string>("Long Sword");
  const[inputTxt, setInputTxt] = useState<string>("");
  const[match, setMatch] = useState<string[]>([]);
  const[enter, setEnter] = useState<boolean>(false);
  const[index, setIndex] = useState<boolean[]>([false, false]);
  const[movement, setMovement] = useState<boolean>(false);
  const[indexNumber, setIndexNumber] = useState<number>(0);
  const[preSelected,  setPreSelected] = useState<string>("");
  //initial Render
  useEffect(()=>{
    setTimeout(()=>{
      setTimeout(()=>{ setInputBox(true);},500);
      let initialSelected = data.models[Math.floor(Math.random() * data.models.length)]
      setSelected(initialSelected.url);
      setWeaponName(initialSelected.name);

      window.addEventListener("keydown", handleEnter);
      document.addEventListener("click", handleClick);

      setRendered(true);
      setInstruction(true);
      document.querySelector(".lightRange")?.animate([{opacity:0},{opacity:1}],{duration:500, fill:"forwards" });
      document.querySelector(".playBtn")?.animate([{opacity:0},{opacity:1}],{duration:500, fill:"forwards" });
      document.querySelector(".title >h2")?.animate([{opacity:1},{opacity:0}],{duration:500, fill:"forwards" });
      return()=>{
        window.removeEventListener("keydown", handleEnter);
        document.removeEventListener("click", handleClick);
      }
    },3000)
  },[]);
  useEffect(()=>{
    if(enter){
      if(match.length>0){
        let selectedEle;
        if(preSelected != ""){
          selectedEle = document.getElementById(preSelected);
        }else{
          selectedEle = document.querySelector(".listBox >p");
        }
        selectedEle?.animate([{letterSpacing:"0.2rem", color:"#fdaa2d",offset:0.5},{letterSpacing:"0", color:"#fdaa2d"}],100);
        setTimeout(()=>{
          let selectedWeapon;
          if(preSelected != ""){
            selectedWeapon = data.models.filter(model => model.name === preSelected).pop();
          } else{
            selectedWeapon = data.models.filter(model => model.name === match[0]).pop();
          }
          setInputTxt("");
          setMatch([]);
          setIndexNumber(0);
          setPreSelected("");
          try{
            (document.querySelector(".userInput") as HTMLElement).blur();
          }catch(e){
            console.log("couldn't unfocus");
          }
          if(selectedWeapon){
            setSelected(selectedWeapon.url);
            setWeaponName(selectedWeapon.name);
          }
        },200)
      }
      setEnter(false);
    }
  },[enter])
  useEffect(()=>{
    if(index[0]){
      if(index[1]){
        if(indexNumber >= match.length){
          setIndexNumber(match.length)
        }else{
          setIndexNumber(indexNumber + 1)
        }
      }else{
        if(indexNumber <= 0){
          setIndexNumber(0)
        }else{
          setIndexNumber(indexNumber - 1)
        }
      }
      setIndex([false,false]);
    }
  },[index])
  useEffect(()=>{
    if(match.length>0){
      if(indexNumber > 0){
        try{
          if(movement){
            (document.getElementById(match[indexNumber]) as HTMLElement).style.color = "#ababab";
          }else{
            (document.getElementById(match[indexNumber-2]) as HTMLElement).style.color = "#ababab";
          }
        }catch(e){console.log("Error in arrow button press")};
        setPreSelected(match[indexNumber-1]);
        (document.getElementById(match[indexNumber-1]) as HTMLElement).style.color = "#fdaa2d";
        (document.getElementById(match[indexNumber-1]) as HTMLElement).scrollIntoView({block: "nearest", inline: "nearest"});
      }else{
        setPreSelected("");
        (document.getElementById(match[0]) as HTMLElement).style.color = "#ababab";
      }
    }
  },[indexNumber])
  const handleControl = (e:any) => {
    if(e.target.getAttribute("id") === "pause"){
      setControl(false);
    } else{
      setControl(true)
    }
  };
  const handleLight = (e:any) =>{
    setLightStrength(e.target.value)
  };
  const handleInput = (e:any) => {
    setInputTxt(e.target.value)

    let condensed = e.target.value.toLowerCase().match(/\w/g)?.reduce((a:string,b:string)=>{ return a+b});
    setMatch( 
      data.models.filter(model=>{
      return model.id.includes(condensed);
      }).map(model=>model.name) 
    );
    setIndexNumber(0);
  };
  const handleSelect = (e:any) =>{
    e.preventDefault();
    let selectedWeapon = data.models.filter(model => model.name === e.target.getAttribute("id")).pop();
    setInputTxt("");
    setMatch([]);
    setEnter(false);
    try{
      (document.querySelector(".userInput") as HTMLElement).blur()
    }catch(e){
      console.log("couldn't unfocus")
    }
    if(selectedWeapon){
      setSelected(selectedWeapon.url);
      setWeaponName(selectedWeapon.name);
    }
  };
  const handleEnter = (e:any) => {
    if(e.keyCode === 13){
      setEnter(true);
    };
    if(e.keyCode === 38){
      (document.querySelector(".userInput") as HTMLElement).blur();
      setIndex([true, false]);
      setMovement(true);                    
    }else if(e.keyCode == 40){
      (document.querySelector(".userInput") as HTMLElement).blur();
      setIndex([true, true]);
      setMovement(false);  
    }
  };
  const handleClick = () =>{
    setInputTxt("");
    setMatch([]);
    setIndexNumber(0);
    setPreSelected("");
    setInstruction(false);
  }
  return (
    <div className = "erBody">
      <div className="title">
        <img src={logo} alt="Elden Ring Logo" className="logo" draggable ="false"/>
        {inputBox?<input className = "userInput" placeholder = {weaponName} onChange={handleInput} value = {inputTxt}  type="text"/>
          :<h2>Weapons</h2>}
        <div className = "matchedContainer">
          <div className="listBox">
            {
              match.map(matched => 
                <p key = {matched} id ={matched} onClick ={handleSelect}>{matched}</p>
              )
            }
          </div>
        </div>
      </div>
      <div className = "weaponContainer">
        {instruction?
        <div className="instruction">
          <p className = "instructionText">
            Rotate - Left Click / Touch 
            <br/>
            Zoom - Mouse Wheel / Pinch
            <br/>
            Move - Right Click / Drag 2 Fingers 
          </p>
        </div>:""}
        <input className ="lightRange"type="range" min="1" max="8" step="0.01" value = {lightStrength} onChange ={handleLight}/>
        {control?<i id = "pause" className="fa-solid fa-pause playBtn" onClick = {handleControl}></i>
        :<i id ="play" className="fa-solid fa-play playBtn" onClick = {handleControl}></i>}
        {rendered?<WeaponCanvas weapon = {selected} controlAni = {control} lightStrength = {lightStrength}/>:""}
      </div>
      <p className = "signature">created by <a href="https://github.com/arthurlee945/EldenRingWeapons" target="_blank">Me</a></p>
    </div>
  );
}

export default App;

