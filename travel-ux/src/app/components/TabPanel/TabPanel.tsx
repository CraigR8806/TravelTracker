import { Box, Fade, Typography } from '@mui/material';
import { Component } from 'react';



interface TabPanelProps {
    selected:boolean
    children:React.ReactNode
}


class TabPanel extends Component<TabPanelProps, {}> {
    

    render() {
        const {children, selected} = this.props;
        return (
            <div
                role="tabpanel"
                hidden={!selected}
            >
                {selected && (
                    <Box sx={{ p: 3 }}>
                        <Fade timeout={1000} in={selected}><Typography>{children}</Typography></Fade>
                    </Box>
                )}
            </div>
        )
    }

}

export default TabPanel;