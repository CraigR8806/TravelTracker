import React from "react";
import { Container } from "@mui/material";

import "./TravelFromFile.css";
import FileChooser from "src/app/components/FileChooser/FileChooser";



interface TravelFromFileProps {

}

interface TravelFromFileState {
    
}

class TravelFromFile extends React.Component<TravelFromFileProps, TravelFromFileState> {


    private upload() {

    }


    render() {
        return (
            <Container>
                <FileChooser onChoose={(s)=>console.log(s)} />
            </Container>
        );
    }
}


export default TravelFromFile;