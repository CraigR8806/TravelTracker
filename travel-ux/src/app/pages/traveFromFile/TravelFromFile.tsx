import React from "react";
import { Button, Container, Form } from "react-bootstrap";

import "./TravelFromFile.css";



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
                <div className="travelFromFileContainer">
                    <div className="travelFromFileWindow">
                        <h4 className="travelFromFileHeader">Import From File</h4>
                        <hr/>
                        <Form.Group data-bs-theme="dark" controlId="formFile" className="mb-3">
                            <Form.Label>Select File</Form.Label>
                            <Form.Control type="file" />
                        </Form.Group>
                        <Button onClick={this.upload} className="mb-3 uploadButton">Upload</Button>
                    </div>
                </div>
            </Container>
        );
    }
}


export default TravelFromFile;