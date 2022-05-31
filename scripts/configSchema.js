const configSchema={
    login:{
        loginType: 3,
        compid: "",
        userid: "",
        pwd: "",
    },
    today:{
          loginType:3,
          hiddenDate:"",
          worktype:1,
          startTime:"",
          endTime:"",
          rstTime:"",
          nightRstTime:"",
          remark:"",
          carfareList:[{ //max 10
            contents1:"",
            contents2:"",
            total:"",
          }],
          otherList:[{ //max 5
            contents1:"",
            total:"",
          }],
          dailyChk:"on",
    }
}

export default configSchema