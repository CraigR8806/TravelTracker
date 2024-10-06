import { Box, Button } from '@mui/material';
import React from 'react';




interface FileChooserProps {
    onChoose:(file:string)=>void
}

function FileChooser(props:FileChooserProps) {

    const fileInput = React.useRef<HTMLInputElement>(null);
    const onChoose = props.onChoose;

    return (
        <Box>
            <Button onClick={()=>fileInput.current && fileInput.current.click()} />
            <input type="file" ref={fileInput} onChange={(e)=>onChoose(e.target.value)}/>
        </Box>
    );
}

export default FileChooser;