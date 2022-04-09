import React, { useEffect, useState, useRef, Suspense } from "react";
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import * as THREE from 'three';
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";
import * as dat from 'dat.gui';


const WeaponCanvas:React.FC<any> = (props:any) => {
    const[rendered, setRendered] = useState<boolean>(false);
    const[orbit, setOrbit] = useState<OrbitControls>();
    const[brightness, setBrightness] = useState<THREE.AmbientLight>();
    //prepping the scene
    const container = document.querySelector(".weaponContainer") as HTMLElement;
    const width = container.clientWidth;
    const height =  container.clientHeight;
    
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, width/height, 0.1, 5000);
    camera.position.set(60, 60, 60);

    //point lights
    const light = new THREE.PointLight()
    light.position.set(25, 45, -35)
    light.intensity =0.1;
    scene.add(light)

    const light2 = new THREE.PointLight()
    light2.position.set(-40, 35, 50)
    light2.intensity =0.125;
    scene.add(light2)

    const light3 = new THREE.PointLight()
    light3.position.set(-65, 35, -85)
    light3.intensity =0.125;
    scene.add(light3)

    const ambientLight = new THREE.AmbientLight();
    ambientLight.intensity = props.lightStrength;
    scene.add(ambientLight);

    //rendering weapons
    let controls:OrbitControls;
    let renderer:THREE.WebGLRenderer;

    useEffect(()=>{
        try{
            container.removeChild(renderer.domElement);
            window.removeEventListener('resize', onWindowResize, false);
            setRendered(false)
        } catch(e){
            console.log("no child element detected")
        }
        renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setSize(width, height);
        container.appendChild(renderer.domElement);
        
        controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.minDistance = 10;
        controls.maxDistance = 400;
        controls.target.set(0, 0, 0);
        controls.autoRotate = props.controlAni;
        controls.autoRotateSpeed = 1.5;
        
        // controls.touches = {
        //     ONE: THREE.TOUCH.ROTATE,
        //     TWO: THREE.TOUCH.DOLLY_PAN
        // }

        const loader = new FBXLoader();
        try{
            const path = require(`../assets/models/${props.weapon}.fbx`)
            loader.load(path,(obj)=>{
                obj.rotateY(60);
                obj.translateZ(-20);
                try{
                    let textures = obj.children
                    for(let i = 0; i<textures.length; i++){
                        let selectedTxt = textures[i] as any
                        selectedTxt.material.opacity = 10;
                        selectedTxt.material.side = THREE.DoubleSide;
                        if(selectedTxt.material.shininess > 35){
                            selectedTxt.material.shininess = 35;
                        }
                    }
                } catch(e){
                    console.log("Fix Texture")
                }
                scene.add(obj)
            },(xhr) =>{
                //console.log((xhr.loaded/xhr.total) * 100 + "% loaded");
                if(xhr.loaded/xhr.total === 1){
                    setBrightness(ambientLight);
                    setOrbit(controls);
                    setRendered(true);
                }
            }, (error)=>{
                console.log("An expected error occured" + error)
            })
        }catch(e){
            console.log("couldn't find the model")
        }
        window.addEventListener('resize', onWindowResize)
        animate();
        return()=>{
            window.removeEventListener('resize', onWindowResize, false);
            container.removeChild(renderer.domElement);
        }
    },[props.weapon]);

    useEffect(()=>{
        if(rendered){
            if(props.controlAni){
                try{
                    (orbit as OrbitControls).autoRotate = true;
                } catch(e){
                    console.log(e)
                }
            }else{
                try{
                    (orbit as OrbitControls).autoRotate = false;
                } catch(e){
                    console.log(e)
                }
            }
        }
    },[props.controlAni])

    useEffect(()=>{
        if(rendered){
            try{
                (brightness as THREE.AmbientLight).intensity = props.lightStrength;
            } catch(e){
                console.log(e)
            }
        }
    },[props.lightStrength])
    
    //render and resizing functions
    const onWindowResize = () => {
        console.log('akllk', container.clientWidth, container.clientHeight)
        setTimeout(()=>{
            camera.aspect = container.clientWidth / container.clientHeight;
            camera.updateProjectionMatrix()
            renderer.setSize(container.clientWidth, container.clientHeight)
            render()
        })
    }
    const animate = () => {
        requestAnimationFrame(animate)
        controls.update()
        render()
    }
    const render = () => {
        renderer.render(scene, camera)
    }

    return(
        <div className = "weaponCanvas">
        </div>
    )
}

export default WeaponCanvas;

//Lighting Test
// const gui = new dat.GUI();
// gui.add(light.position, "y").min(-100).max(100).step(0.01);
// gui.add(light.position, "x").min(-100).max(100).step(0.01);
// gui.add(light.position, "z").min(-100).max(100).step(0.01);
// gui.add(light, "intensity").min(0).max(10).step(0.01);

// const pointLightHelper = new THREE.PointLightHelper(light, 10)
// scene.add(pointLightHelper)