import {
  Alert,
  Backdrop,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogContent,
  Grid,
  InputLabel,
  Snackbar,
  Stack,
  Switch,
  TextareaAutosize,
  Typography,
} from "@mui/material";
import AccordianContainer from "../CustomComponents/AccordianContainer";
import CustomDateField from "../CustomComponents/CustomDateField";
import { DynamicReportReducerAction } from "../Store/DynamicReport/DynamicReportReducer";
import { useDispatch, useSelector } from "react-redux";
import CustomAutoComplete from "../CustomComponents/CustomAutoComplete";
import { useEffect, useState } from "react";
import axios from "axios";
import CustomDropDown from "../CustomComponents/CustomDropDown";
import { flushSync } from "react-dom";
import dayjs from "dayjs";
import CustomConfirmationDialog from "../CustomComponents/CustomConfirmationDialog";
import StlapFooter from '../CustomComponents/StlapFooter';

import Checkbox from "@mui/material/Checkbox";
import MuiAppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import { styled } from "@mui/material/styles";
import Logo from "../../images/SF_Logo.png";
import SFLogoSmall from "../../images/SFLogo.png";
import {Tooltip,useMediaQuery} from "@mui/material";


const desktopHeader = (
  <>
    <Stack direction="row" sx={{ width: "calc(100% - 600px)" }}>
      <img height="36px" src={Logo} alt="No Logo"></img>
    </Stack>          

  </>
);

const mobileHeader = (
  <>
    <Stack direction="row" sx={{ width: "calc(100% - 600px)" }}>
      <img
        id="logoimage"
        src={SFLogoSmall}
        width={50}
        height={50}
        alt="No Logo"
      ></img>
    </Stack>
  </>
);


const TriggerView = () => {
  const dispatch = useDispatch();

  const [errorExists, setErrorExists] = useState({
    value: false,
    msg: "",
  });

  const [pdfUrl, setPdfUrl] = useState([]);
  const [filesList, setFilesList] = useState({});
  const [contactList, setContactList] = useState({});
  const [apllicationNumberDisable, setApllicationNumberDisable] = useState(false);
  const [sanctionDateError, setSanctionDateError] = useState(false);
  const [sanctionDateDisable, setSanctionDateDisable] = useState(false);
  const [showNotificationDialog, setShowNotificationDialog] = useState(false);
  const [mailSubject, setMailSubject] = useState(
    "Reg : /~~/ Letter from Sundaram Home"
  );
  const [mailContent, setMailContent] = useState(
    "Please use the below Url to View / Download Your /~~/ Letter: "
  );

  const triggerScreen = useSelector(
    (state) => state.letterGeneration.triggerScreen
  );

  const reportScreen = useSelector(
    (state) => state.letterGeneration.reportScreen
  );

  const snackBarHandler = useSelector(
    (state) => state.letterGeneration.snackBarHandler
  );

  let newAxiosBase = { ...axios };
  newAxiosBase.defaults.baseURL =
    process.env.REACT_APP_STLAP_LETTER_GENERATION_BACKEND;

  const { vertical, horizontal } = snackBarHandler.snackBarState;

  const openAlertHandler = () => {
    dispatch(DynamicReportReducerAction.updateSnackBarAlert(true));
  };

  const closeAlertHandler = () => {
    dispatch(DynamicReportReducerAction.updateSnackBarAlert(false));
  };

  const getTemplateNameList = async (productCode) => {
    dispatch(DynamicReportReducerAction.updateLoading(true));
    const response = await axios.get("/dynamicTemplate/getTemplateNameList",{
      method: "get",
      params: {
        productCode: productCode,
        
      },
    });
    if (response.status === 200) {
      dispatch(
        DynamicReportReducerAction.updateTemplateNameForTrigger(
          ""
        )
      )
      dispatch(
        DynamicReportReducerAction.updateTemplateNameListForTrigger(
          response.data
        )
      );
    //  dispatch(DynamicReportReducerAction.updateLoading(false));
    }
  };

  const getApplicationNumberList = async (productCode) => {
    dispatch(DynamicReportReducerAction.updateLoading(true));
    const response = await newAxiosBase.get(
      "/dynamicTemplate/getAllApplicationNumbers"
      ,{
        method: "get",
        params: {
          productCode: productCode
        },
      });
    if (response.status === 200) {
      dispatch(
        DynamicReportReducerAction.updateApplicationNumberForTrigger(
          ""
        )
      )
      dispatch(
        DynamicReportReducerAction.updateApplicationNumberListForTrigger(
          response.data
        )
      );
      dispatch(DynamicReportReducerAction.updateLoading(false));
    }
  };

  useEffect(() => {
    getProductTypeList();
    return () => {
      dispatch(DynamicReportReducerAction.resetForTrigger());
    };
  }, []);

  const getProductTypeList = async () => {
    dispatch(DynamicReportReducerAction.updateLoading(true));
    const response = await newAxiosBase.post(
      "/dynamicTemplate/getProductTypeList"
    );
    if (response.status === 200) {
      dispatch(DynamicReportReducerAction.updateLoading(false));
      dispatch(DynamicReportReducerAction.updateproductTypeListForTrigger(response.data));
    }
  };
  

 
    
  const fetchDataBasedOnDB=async (value,key)=>{
    let newAxiosBase = { ...axios };
  newAxiosBase.defaults.baseURL =
    process.env.REACT_APP_STLAP_LETTER_GENERATION_BACKEND;
    if(value===null){
      return;
    }
    dispatch(DynamicReportReducerAction.updateLoading(true));
    let paramMap = {
      productCode:triggerScreen.productCode,
      templateName: triggerScreen.templateName,
    
    }
    if(key==="date"){
      if(dayjs(value).format("DD/MM/YYYY")!=="Invalid Date"){
      let dateValue = new Date(value);
      const options = {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      };
      const formattedDate = dateValue.toLocaleDateString('en-GB', options);

        paramMap['sanctionDate'] =formattedDate.toString();
        setSanctionDateError(false);
      }else{
        dispatch(DynamicReportReducerAction.updateLoading(false));
        setSanctionDateError(true);
        return;
      }
     }else{
      paramMap['applicationNumber']=value;
    }
    const response = await newAxiosBase.post(
      "/dynamicTemplate/fetchDataBasedOnDB",paramMap
      );
      if(response.status=200){
        dispatch(DynamicReportReducerAction.updateLoading(false));
        let success = "Successfully";
        let status = response.data.status;
        dispatch(DynamicReportReducerAction.updateLoading(false));
        dispatch(
          DynamicReportReducerAction.updateSnackBarMessage(status)
        );
        dispatch(
          DynamicReportReducerAction.updateSnackBarAlertType(
            status.includes(success) ? "success" : "error"
          )
        );
        openAlertHandler();
        }else{
        dispatch(DynamicReportReducerAction.updateLoading(false));
        dispatch(
          DynamicReportReducerAction.updateSnackBarMessage("Fail to Fetch Data")
        );
        openAlertHandler();
      }
      
    }

  const onDownloadButtonClick = async () => {
    if (triggerScreen.templateName === "") {
      setErrorExists({
        value: true,
        msg: "Template Name Cannot be Empty",
      });
    } else {
      setErrorExists({
        value: false,
        msg: "",
      });
      dispatch(DynamicReportReducerAction.updateLoading(true));
      const response = await newAxiosBase
        .post(
          "/dynamicTemplate/getTemplateForView",
          {
            templateName: triggerScreen.templateName,
            applicationNumber: triggerScreen.applicationNumber,
            sanctionDate: triggerScreen.sanctionDate,
          },
          { method: "POST", responseType: "blob" }
        )
        .then((response) => {
          const url = window.URL.createObjectURL(new Blob([response.data]));
          const link = document.createElement("a");
          link.href = url;
          link.setAttribute("download", triggerScreen.templateName + `.pdf`);
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          dispatch(DynamicReportReducerAction.updateLoading(false));
        });
    }
  };

  const onGenerateButtonClick = async () => {
    let newAxiosBase = { ...axios };
  newAxiosBase.defaults.baseURL =
    process.env.REACT_APP_STLAP_LETTER_GENERATION_BACKEND;
    if (triggerScreen.templateName === "") {
      setErrorExists({
        value: true,
        msg: "Template Name Cannot be Empty",
      });
    } else if (
      (triggerScreen.sanctionDate === null ||
        triggerScreen.sanctionDate === "") &&
      (triggerScreen.applicationNumber === null ||
        triggerScreen.applicationNumber === "")
    ) {
      setErrorExists({
        value: true,
        msg: "Please Input Sanction Date or Application Number",
      });
    } else if (
      triggerScreen.sanctionDate !== null &&
      triggerScreen.sanctionDate !== "" &&
      triggerScreen.applicationNumber !== null &&
      triggerScreen.applicationNumber !== ""
    ) {
      setErrorExists({
        value: true,
        msg: "Please Input Sanction Date or Application Number(Any One)",
      });
    } else {
      setErrorExists({
        value: false,
        msg: "",
      });
      dispatch(DynamicReportReducerAction.updateLoading(true));
      const response = await newAxiosBase.post(
        "/dynamicTemplate/generateLetter",
        {
          productCode:triggerScreen.productCode,
          templateName: triggerScreen.templateName,
          applicationNumber: triggerScreen.applicationNumber,
          sanctionDate:
            triggerScreen.sanctionDate === null ||
            triggerScreen.sanctionDate === ""
              ? null
              : dayjs(triggerScreen.sanctionDate).format("DD/MM/YYYY"),
        }
      );

      if (response.status === 200) {
        let success = "Successfully";
        let status = response.data.Status;
        setPdfUrl(response.data.ApplicationList);
        setFilesList(response.data.FilesList);
       // setContactList(response.data.ContactList);
        dispatch(DynamicReportReducerAction.updateLoading(false));
        dispatch(
          DynamicReportReducerAction.updateSnackBarMessage(status)
        );
        dispatch(
          DynamicReportReducerAction.updateSnackBarAlertType(
            status.includes(success) ? "success" : "error"
          )
        );
        openAlertHandler();
        setTimeout(() => {
          dispatch(DynamicReportReducerAction.updateLoading(false));
          //window.location.reload();
        }, 1000);
        dispatch(DynamicReportReducerAction.updateLoading(false));
        dispatch(
          DynamicReportReducerAction.updateSnackBarMessage(response.data.Status)
        );
        dispatch(
          DynamicReportReducerAction.updateSnackBarAlertType(
            status.includes(success) ? "success" : "error"
          )
        );
        openAlertHandler();
        setTimeout(() => {
          dispatch(DynamicReportReducerAction.updateLoading(false));
          //window.location.reload();
        }, 1000);
        dispatch(DynamicReportReducerAction.updateLoading(false));
      }
    }
  };

  const onPdfButtonCLick = async (value) => {
    dispatch(DynamicReportReducerAction.updateLoading(true));
    let newAxiosBase = { ...axios };
    newAxiosBase.defaults.baseURL =
      process.env.REACT_APP_STLAP_LETTER_GENERATION_BACKEND;
    const response = await newAxiosBase.post(
      "/dynamicTemplate/getGeneratedFile",
      {
        filePath: value,
      },
      { method: "POST", responseType: "blob" }
    );
    if (response.status === 200) {
      var file = new Blob([response.data], { type: "application/pdf" });
      var fileURL = URL.createObjectURL(file);
      window.open(fileURL);
      dispatch(DynamicReportReducerAction.updateLoading(false));
    }
  };

  const onSendNotificationClick = async () => {
    console.log(contactList);
    dispatch(DynamicReportReducerAction.updateLoading(true));
    const response = await newAxiosBase.post(
      "/dynamicTemplate/sendNotification",
      {
        applicationList: pdfUrl,
        filesList: filesList,
        mode: triggerScreen.notificationType,
        mailContent: mailContent,
        subject: mailSubject,
        contactList: contactList,
      }
    );
    if (response.status === 200) {
      dispatch(DynamicReportReducerAction.updateLoading(false));
      dispatch(DynamicReportReducerAction.updateSnackBarMessage(response.data));
      dispatch(
        DynamicReportReducerAction.updateSnackBarAlertType(
          response.data.includes("Successfully") ? "success" : "error"
        )
      );
      openAlertHandler();
      setTimeout(() => {
        dispatch(DynamicReportReducerAction.updateLoading(false));
        //window.location.reload();
      }, 1000);
    }
  };

 
  return (
    <>
      <div style={{ minHeight: "calc(100vh - 40px)" }}>

   
    <MuiAppBar
      position="sticky"
      sx={{
        backgroundColor: "#004A92",
        height: "70px",
      }}>
      <Toolbar>
            {useMediaQuery("(min-width:1024px)") && desktopHeader}
            {useMediaQuery("(max-width:1023px)") && mobileHeader}
          </Toolbar>
    </MuiAppBar>

      {reportScreen.loading && (
        <>
          <Backdrop
            sx={{ color: "#fff",zIndex: (theme) => theme.zIndex.drawer + 1 }}
            open={true}
          >
            <CircularProgress color="inherit" />
          </Backdrop>
        </>
      )}
      <AccordianContainer
        id="accord"
        title="Letter Template View / Trigger"
        initialOpen={true}
        sx={{ margin: "8px !important" }}
      >
        <Box sx={{ marginTop: "-1%"}}>
          <Grid container rowSpacing={0} columnSpacing={2}>
          <Grid item xs={12} sm={6} md={4} lg={2} xl={3}>
              <CustomDropDown
                label="Product Type"
                required={true}
                dropDownValue={
                  String(window.location.pathname).includes(
                    "dashboard_redirect"
                  ) ? triggerScreen.productTypeList &&
                  triggerScreen.productTypeList.filter(product => product.text === "HOMEFIN") :
                    String(window.location.pathname).includes(
                      "stlap"
                    ) ? triggerScreen.productTypeList && 
                    triggerScreen.productTypeList.filter(product => product.text === "STLAP") 
                    : triggerScreen.productTypeList
                }
                variant="standard"
                defaultValue="1"
                value={triggerScreen.productType}
                onChange={(event) => {
                  let value = event.target.value;
                  dispatch(DynamicReportReducerAction.updateProductTypeForTrigger(value));
                  let productCode = triggerScreen.productTypeList.filter(a=>a.value===value)[0].text;
                  dispatch(DynamicReportReducerAction.updateProductCodeForTrigger(productCode));
                  DynamicReportReducerAction.updateSanctionDateForTrigger("");
                  getTemplateNameList(productCode);
                  getApplicationNumberList(productCode);
                  setPdfUrl([]);
                }}
              />
            </Grid>
           
            <Grid item xs={12} sm={6} md={4} lg={2} xl={3}>
              <CustomAutoComplete
                required={true}
                label="Template Name"
                id="templateName"
                variant="standard"
                value={triggerScreen.templateName}
                onChange={(event, newValue) =>{
                  setPdfUrl([]);
                  dispatch(
                    DynamicReportReducerAction.updateTemplateNameForTrigger(
                      newValue
                    )
                  )
                  dispatch(
                    DynamicReportReducerAction.updateApplicationNumberForTrigger(
                      ""
                    )
                  )
                  dispatch(
                    DynamicReportReducerAction.updateSanctionDateForTrigger(
                      ""
                    )
                  )
                
                }
                }
                type="text"
                placeholder="Template Name"
                autoCompleteValues={triggerScreen.templateNameList}
              />
            </Grid>

            <Grid item xs={12} sm={6} md={4} lg={2} xl={3}>
              <CustomAutoComplete
                required={false}
                label="Application Number"
                id="applicationNumber"
                variant="standard"
                value={triggerScreen.applicationNumber}
                disabled={apllicationNumberDisable}
                onChange={(event, newValue) =>{
                  setPdfUrl([]);
                 
                  dispatch(
                    DynamicReportReducerAction.updateApplicationNumberForTrigger(
                      newValue
                    )
                  );
                  if(newValue!==null){
                    setSanctionDateDisable(true);
                    dispatch(
                      DynamicReportReducerAction.updateSanctionDateForTrigger(
                        ""
                        )
                        );
                        fetchDataBasedOnDB(newValue,"applicationNumber");
                  }else{
                    setSanctionDateDisable(false);
                  }
                }
                }
                type="text"
                placeholder="Application Number"
                autoCompleteValues={triggerScreen.applicationNumberList}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4} lg={2} xl={3}>
              <CustomDateField
                label="Sanction Date"
                variant="standard"
                value={triggerScreen.sanctionDate}
                disabled={sanctionDateDisable}
                onChange={(value) => {
                  setPdfUrl([]);
                  dispatch(
                    DynamicReportReducerAction.updateSanctionDateForTrigger(
                      value
                      )
                      );
                      if(value!==null){
                        setApllicationNumberDisable(true);
                        dispatch(
                          DynamicReportReducerAction.updateApplicationNumberForTrigger(
                            ""
                            )
                            );
                            fetchDataBasedOnDB(value,"date");
                      }else{
                        setApllicationNumberDisable(false);
                      }
                }}
              />
               {sanctionDateError && (
              <p className="error">Please Enter Valid Date</p>
            )}
            </Grid>
          </Grid>
          {errorExists.value && (
            <Box
              sx={{
                marginTop: "8px",
                marginBottom: "0px",
                display: "flex",
                justifyContent: "center",
              }}
            >
              <p className="error">{errorExists.msg}</p>
            </Box>
          )}
          <Box
            sx={{
              marginTop: "8px",
              marginBottom: "0px",
              display: "flex",
              justifyContent: "center",
            }}
          >
            <Button
              variant="contained"
              type="submit"
              sx={{ height: "2rem", marginRight: "2%" }}
              disabled={false}
              onClick={() => {
                onDownloadButtonClick();
              }}
            >
              Download Template
            </Button>
            <Button
              variant="contained"
              type="submit"
              sx={{ height: "2rem", marginRight: "2%" }}
              disabled={false}
              onClick={() => {
                onGenerateButtonClick();
              }}
            >
              Generate Letter
            </Button>
          </Box>
        </Box>
      </AccordianContainer>
      {pdfUrl.length != 0 && (
        <AccordianContainer
          id="accord"
          title="Template View"
          initialOpen={true}
          sx={{ margin: "8px !important" }}
        >
          <Box sx={{ marginTop: "-1%" }}>
            List of Letters :
            {pdfUrl.map((rows) => (
              <Button
                onClick={() => {
                  onPdfButtonCLick(filesList[rows]);
                }}
              >
                {rows}
              </Button>
            ))}
            </Box>
                    </AccordianContainer>
      )}
</div>
<StlapFooter/>
      <CustomConfirmationDialog
        dialogOpen={showNotificationDialog}
        onDialogClose={() => {
          setShowNotificationDialog(false);
        }}
        dialogTitle={
          <Typography sx={{ fontSize: "1.25rem" }}>
            Notification Details
          </Typography>
        }
        dialogContent={
          <Box sx={{ minWidth: "200px" }}>
            <Typography sx={{ fontSize: "0.90rem", color: "red" }}>
              /~~/ will be replaced by Template Name
            </Typography>{" "}
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={6} lg={12} xl={3}>
                <InputLabel
                  sx={{
                    color: "#004A92",
                    marginTop: "8px",
                    fontWeight: 400,
                    fontSize: "0.875rem",
                  }}
                  required={true}
                >
                  Mail Subject
                </InputLabel>
                <TextareaAutosize
                  value={mailSubject}
                  maxRows={4}
                  required={true}
                  aria-label="maximum height"
                  onChange={(event) => {
                    setMailSubject(event.target.value);
                  }}
                  style={{
                    width: "100%",
                    height: "100px",
                    borderRadius: "4px",
                    resize: "none",
                    outline: "none",
                    fontFamily: "inherit",
                    fontSize: "inherit",
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={6} lg={12} xl={3}>
                <InputLabel
                  sx={{
                    color: "#004A92",
                    marginTop: "8px",
                    fontWeight: 400,
                    fontSize: "0.875rem",
                  }}
                  required={true}
                >
                  Mail Content
                </InputLabel>
                <TextareaAutosize
                  value={mailContent}
                  onChange={(event) => {
                    setMailContent(event.target.value);
                  }}
                  maxRows={4}
                  required={true}
                  aria-label="maximum height"
                  style={{
                    width: "100%",
                    height: "100px",
                    borderRadius: "4px",
                    resize: "none",
                    outline: "none",
                    fontFamily: "inherit",
                    fontSize: "inherit",
                  }}
                />
              </Grid>
            </Grid>
          </Box>
        }
        hideCancelButton={false}
        okButtonName={"Send Notification"}
        cancelButtonName={"Cancel"}
        onOkClick={() => {
          setShowNotificationDialog(false);
          onSendNotificationClick();
        }}
      />
      <Snackbar
        open={snackBarHandler.alert}
        autoHideDuration={6000}
        anchorOrigin={{ vertical, horizontal }}
        onClose={closeAlertHandler}
      >
        <Alert
          onClose={closeAlertHandler}
          severity={snackBarHandler.alertType}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {snackBarHandler.message}
        </Alert>
      </Snackbar>
      
    </>
  );
};

export default TriggerView;
