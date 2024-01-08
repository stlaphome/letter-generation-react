import { InputLabel, Stack, TextField, Tooltip } from "@mui/material";
import "./Custom.css";
import { Visibility } from "@mui/icons-material";

const CustomTextField = (props) => {
  return (
    <>
      {/* <Stack direction = "row"> */}
      <div>
        <InputLabel
          required={props.required}
          size="small"
          sx={{
            color: "#004A92",
            mb: 2,
            fontWeight: 400,
            fontSize: "14px",

            overflow: props.overflow ? props.overflow : "hidden",
            visibility: props.visibility ? props.visibility : "visible",
          }}
        >
          {props.label}
        </InputLabel>
        <Tooltip title={props.tooltip ? props.tooltip : ""}>
          <TextField
            autoComplete="off"
            sx={{
              "& .MuiInputBase-input": {
                overflow: "hidden",
                textOverflow: "ellipsis",
              },
            }}
            inputProps={
              props.inputProps
                ? props.inputProps
                : {
                    style: { textAlign: `${props.align}`, fontSize: "12px" },
                  }
            }
            fullWidth
            id={props.id}
            variant={props.variant}
            value={props.value}
            type={props.type}
            placeholder={props.placeholder}
            disabled={props.disabled}
            onChange={props.onChange}
            onBlur={props.onBlur}
            onKeyDown={
              props.type === "number" && !props.onKeyDown
                ? (e) => {
                    if (
                      e.key === "e" ||
                      e.key === "E" ||
                      e.key === "-" ||
                      e.key === "+"
                    ) {
                      e.preventDefault();
                    }
                  }
                : props.onKeyDown
            }
            error={props.error}
          />
        </Tooltip>
        {/* </Stack> */}
      </div>
    </>
  );
};

export default CustomTextField;
