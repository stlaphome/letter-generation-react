import { Button } from "@mui/material";
import { styled } from "@mui/material/styles";
const CustomButton = styled(Button)((props) => ({
  backgroundColor: props.backgroundColor,
  color:props.color,
  padding:props.padding
}));
export default CustomButton;
