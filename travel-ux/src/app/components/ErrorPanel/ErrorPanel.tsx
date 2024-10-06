import { Box, Slide, Alert } from "@mui/material";
import React from "react";



interface ErrorPanelProps {
    text:String,
    show:boolean
}


function ErrorPanel(props:ErrorPanelProps) {

    const containerRef = React.useRef<HTMLElement>(null);


    const {text, show} = props;

    return (
        
        <Box sx={{overflow:"hidden"}} ref={containerRef}>
            <Slide timeout={250} container={containerRef.current} in={show}>
                <Alert variant="filled" severity="error">
                    {text}
                </Alert>
            </Slide>
        </Box>
    );
}

export default ErrorPanel;