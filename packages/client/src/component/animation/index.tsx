import React from 'react';
import { useSpring, animated } from '@react-spring/web';
import './index.less';

export default function animation(WrappedComponent: React.FunctionComponent) {
    return function DecoratorComponent(props: any) {
        
        const [animation, api] = useSpring(
            () => ({
                from: { transform: "translateX(100%)" },
                to: { transform: "translateX(0%)"},
            }),
            []
        )

        return (
            <animated.div 
                style={animation} 
                className="animated-container"
            >
                <WrappedComponent {...props} />
            </animated.div>
        );
    };
}