import { IconButton } from '@material-ui/core';
import { Lens } from '@material-ui/icons';
import { makeStyles } from '@material-ui/styles';
import { COLORS, hexToRGB } from '../../utils';

const useStyles = makeStyles(() => ({
  container: {
    width: '70px',
    height: '40px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  button: {
    padding: '3px',
    width: '16px',
    height: '16px',
  },
}));

const RGB_COLORS: [string, number[]][] = Object.entries(COLORS).map(([name, hex]) => [name, hexToRGB(hex)]);
const ColorPalette = ({ handleChange }: { handleChange: (c: number[]) => void }) => {
  const classes = useStyles();
  return (
    <div className={classes.container} aria-label="color-swatch">
      {RGB_COLORS.map(([name, rgb]) => {
        return (
          <IconButton className={classes.button} key={name} onClick={() => handleChange(rgb)}>
            <Lens fontSize="small" style={{ color: `rgb(${rgb})` }} />
          </IconButton>
        );
      })}
    </div>
  );
};

export default ColorPalette;
