import { InputLabel, TextField } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import "./Custom.css";

const CustomDateField = (props) => {
  return (
    <>
      {props.label && (
        <InputLabel
          required={props.required}
          size="small"
          sx={{
            color: "#004A92",
            mb: 2,
            fontWeight: 400,
            fontSize: "14px",
          }}
        >
          {props.label}
        </InputLabel>
      )}

      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DatePicker
          disabled={props.disabled}
          disableFuture={props.disableFuture}
          minDate={props.minDate ? props.minDate : "1970/01/01"}
          maxDate={props.maxDate ? props.maxDate : "2055/12/31"}
          disablePast={props.disablePast}
          //disableOpenPicker={true}
          PopperProps={props.PopperProps}
          onKeyDown={props.onKeyDown}
          openTo="day"
          onOpen={props.onOpen}
          inputFormat="DD/MM/YYYY"
          views={["year", "month", "day"]}
          value={props.value}
          onChange={props.onChange}
          renderInput={(params) => (
            <TextField
              autoComplete="off"
              fullWidth={!props.fullWidth}
              id={props.id}
              variant={props.variant}
              value={props.value}
              type={props.type}
              onBlur={props.onBlur}
              placeholder={props.placeholder}
              onFocus={props.onFocus}
              {...params}
              sx={{
                "& div.MuiInputBase-adornedEnd.css-1a1fmpi-MuiInputBase-root-MuiInput-root:after":
                  {
                    borderBottom: "none",
                  },
                "& .css-1vl9ima-MuiInputBase-root-MuiInput-root.Mui-error:after":
                  { borderBottom: "none" },
              }}
            />
          )}
        />
      </LocalizationProvider>
    </>
  );
};

export default CustomDateField;
