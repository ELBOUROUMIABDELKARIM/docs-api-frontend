import * as React from 'react';
import Box from '@mui/material/Box';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import Typography from "@mui/material/Typography";

export default function IndeterminateCheckbox() {
    const [checked, setChecked] = React.useState([true, true, true]);

    const handleChange1 = (event: React.ChangeEvent<HTMLInputElement>) => {
        setChecked([event.target.checked, event.target.checked, event.target.checked]);
    };

    const handleChange2 = (event: React.ChangeEvent<HTMLInputElement>) => {
        setChecked([event.target.checked, checked[1], checked[2]]);
    };

    const handleChange3 = (event: React.ChangeEvent<HTMLInputElement>) => {
        setChecked([checked[0], event.target.checked, checked[2]]);
    };

    const handleChange4 = (event: React.ChangeEvent<HTMLInputElement>) => {
        setChecked([checked[0], checked[1], event.target.checked]);
    };

    const allChecked = checked.every(value => value);
    const someChecked = checked.some(value => value) && !allChecked;

    const children = (
        <Box sx={{ display: 'flex', flexDirection: 'row', ml: 3 }}>
            <FormControlLabel
                label="READ"
                control={<Checkbox checked={checked[0]} onChange={handleChange2} />}
            />
            <FormControlLabel
                label="WRITE"
                control={<Checkbox checked={checked[1]} onChange={handleChange3} />}
            />
            <FormControlLabel
                label="DELETE"
                control={<Checkbox checked={checked[2]} onChange={handleChange4} />}
            />
        </Box>
    );

    return (
        <div>
            <Typography variant="h6">
                Permissions
            </Typography>
            <FormControlLabel
                label="ALL"
                control={
                    <Checkbox
                        checked={allChecked}
                        indeterminate={someChecked}
                        onChange={handleChange1}
                    />
                }
            />
            {children}
        </div>
    );
}
