import React, { useEffect } from "react";
import animation from "@/component/animation";
import "./index.scss";

const Home = () => {
    
    useEffect(() => {
        console.log('12121212')
    }, []);

    return <div>home</div>
}


export default animation(Home);